"use client";

import { useEffect, useRef, useState } from "react";
import { metrics, type Metric } from "@/content/site";

// Auto-advances every --reel-ms (5s) on the progress bar's own animation.
// No buttons by design; it still pauses under a mouse and never moves for reduced-motion users.
export function MetricsReel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const fromScroll = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      query.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (fromScroll.current) {
      fromScroll.current = false;
      return;
    }
    track.scrollTo({ left: track.clientWidth * index, behavior: reduceMotion ? "auto" : "smooth" });
  }, [index, reduceMotion]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let settle: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(settle);
      settle = setTimeout(() => {
        const settled = Math.round(track.scrollLeft / track.clientWidth);
        if (settled === index) return;
        fromScroll.current = true;
        setIndex(settled);
      }, 120);
    };
    const onResize = () => track.scrollTo({ left: track.clientWidth * index });
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(settle);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [index]);

  const playing = !reduceMotion && !hovering && !hidden;
  const current = metrics[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Results"
      className={`panel ${playing ? "is-playing" : ""} ${reduceMotion ? "no-motion" : ""}`}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovering(false)}
    >
      <div className="panel-head">
        <span className="label text-muted">Results</span>
        <span className="label flex items-center gap-3">
          <span className="text-muted">{current.org}</span>
          <span className="tabular text-text">
            {String(index + 1).padStart(2, "0")} / {metrics.length}
          </span>
        </span>
      </div>

      <div ref={trackRef} className="reel-track" aria-live="off">
        {metrics.map((m, i) => (
          <Slide key={m.label} metric={m} position={i + 1} />
        ))}
      </div>

      <div className="flex gap-1.5 px-5 pb-5 sm:px-7 sm:pb-6" aria-hidden="true">
        {metrics.map((m, i) => (
          <span
            key={m.label}
            className={`flex h-2 flex-1 items-center ${i < index ? "is-past" : ""} ${i === index ? "is-current" : ""}`}
            onAnimationEnd={() => i === index && setIndex((index + 1) % metrics.length)}
          >
            <span className="reel-rail">
              <span className="reel-fill" />
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}

function Slide({ metric: m, position }: { metric: Metric; position: number }) {
  return (
    <div role="group" aria-roledescription="slide" aria-label={`${position} of ${metrics.length}`} className="px-5 pb-6 pt-5 sm:px-7 sm:pt-6">
      <p className="label">{m.label}</p>
      <p className="mt-3 flex flex-wrap items-baseline gap-x-[.3em] text-[clamp(3.25rem,12vw,7.5rem)] leading-none text-bright">
        {m.from && (
          <>
            <span className="num text-dim">{m.from}</span>
            <span className="unit text-[.4em] text-dim">→</span>
          </>
        )}
        <span className="num whitespace-nowrap">
          {m.approx && <span className="text-dim">~</span>}
          {m.value}
        </span>
        {m.unit && <span className="unit text-[max(.8125rem,.16em)] text-muted">{m.unit}</span>}
      </p>
      <p className="mt-4 max-w-[48ch] text-text">{m.caption}</p>
    </div>
  );
}
