"use client";

import { useEffect, useRef, useState } from "react";
import type { PaneItem } from "@/components/ShowcasePane";

// Horizontal carousel: wheel, drag or arrow keys. Position is lerped every frame
// and the leftover velocity skews and squashes each panel, with the media inside
// parallaxing against its frame. Snaps to the nearest panel when you let go.

export function Carousel({ items }: { items: PaneItem[] }) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const motion = useRef({ x: 0, target: 0, velocity: 0, min: 0, dragging: false, lastPointer: 0, raf: 0, reduce: false });

  useEffect(() => {
    const view = viewport.current;
    const rail = track.current;
    if (!view || !rail) return;
    const m = motion.current;
    m.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const panels = () => Array.from(rail.children) as HTMLElement[];
    const measure = () => {
      m.min = Math.min(0, view.clientWidth - rail.scrollWidth);
      m.target = Math.max(m.min, Math.min(0, m.target));
    };
    measure();

    const snap = () => {
      const list = panels();
      if (!list.length) return;
      const step = list[0].offsetWidth + 16;
      const nearest = Math.round(-m.target / step);
      m.target = Math.max(m.min, Math.min(0, -nearest * step));
      setIndex(Math.max(0, Math.min(list.length - 1, nearest)));
    };

    const frame = () => {
      const previous = m.x;
      m.x += (m.target - m.x) * (m.reduce ? 1 : 0.085);
      m.velocity = m.x - previous;
      rail.style.transform = `translate3d(${m.x.toFixed(2)}px,0,0)`;
      const centre = view.clientWidth / 2;
      for (const panel of panels()) {
        const rect = panel.getBoundingClientRect();
        const offset = rect.left + rect.width / 2 - centre;
        const media = panel.querySelector<HTMLElement>(".carousel-media video");
        panel.style.transform = m.reduce
          ? ""
          : `skewY(${(m.velocity * 0.035).toFixed(3)}deg) scaleY(${(1 - Math.min(Math.abs(m.velocity) * 0.0016, 0.08)).toFixed(3)})`;
        if (media) media.style.transform = m.reduce ? "" : `translate3d(${(offset * -0.07).toFixed(2)}px,0,0) scale(1.14)`;
      }
      m.raf = requestAnimationFrame(frame);
    };
    frame();

    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 1) return;
      e.preventDefault();
      m.target = Math.max(m.min, Math.min(0, m.target - delta));
      clearTimeout(settle);
      settle = setTimeout(snap, 140);
    };
    let settle: ReturnType<typeof setTimeout>;

    const onPointerDown = (e: PointerEvent) => {
      m.dragging = true;
      m.lastPointer = e.clientX;
      view.setPointerCapture(e.pointerId);
      view.classList.add("is-dragging");
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!m.dragging) return;
      const dx = e.clientX - m.lastPointer;
      m.lastPointer = e.clientX;
      m.target = Math.max(m.min - 80, Math.min(80, m.target + dx));
    };
    const onPointerUp = () => {
      if (!m.dragging) return;
      m.dragging = false;
      view.classList.remove("is-dragging");
      m.target += m.velocity * 6;
      snap();
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const list = panels();
      const step = list[0].offsetWidth + 16;
      m.target = Math.max(m.min, Math.min(0, m.target + (e.key === "ArrowRight" ? -step : step)));
      snap();
    };

    view.addEventListener("wheel", onWheel, { passive: false });
    view.addEventListener("pointerdown", onPointerDown);
    view.addEventListener("pointermove", onPointerMove);
    view.addEventListener("pointerup", onPointerUp);
    view.addEventListener("pointercancel", onPointerUp);
    view.addEventListener("keydown", onKey);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(m.raf);
      clearTimeout(settle);
      view.removeEventListener("wheel", onWheel);
      view.removeEventListener("pointerdown", onPointerDown);
      view.removeEventListener("pointermove", onPointerMove);
      view.removeEventListener("pointerup", onPointerUp);
      view.removeEventListener("pointercancel", onPointerUp);
      view.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const current = items[Math.min(index, items.length - 1)];

  return (
    <div className="carousel">
      <div
        ref={viewport}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Showreel: drag, scroll or use the arrow keys"
        className="carousel-view"
      >
        <div ref={track} className="carousel-track">
          {items.map((item, i) => (
            <article key={item.id} className="carousel-panel" aria-label={`${i + 1} of ${items.length}: ${item.title}`}>
              <div className="carousel-media">
                <video
                  src={`/life/${item.id}.mp4`}
                  poster={`/life/${item.id}.jpg`}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onLoadedMetadata={(e) => {
                    const v = e.currentTarget;
                    if (v.currentTime < 0.1 && Number.isFinite(v.duration)) v.currentTime = v.duration * 0.35;
                    void v.play().catch(() => undefined);
                  }}
                />
              </div>
              <div className="carousel-caption">
                <span className="label !text-[.625rem]">{item.activity}</span>
                <span className="display text-[1.125rem]">{item.title}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="display text-[clamp(1.25rem,3vw,2rem)]">{current.title}</p>
        <p className="label tabular">
          {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </p>
      </div>
      <p className="label mt-2">Drag, scroll or use ← →</p>
    </div>
  );
}
