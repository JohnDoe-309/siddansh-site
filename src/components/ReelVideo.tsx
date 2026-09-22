"use client";

import { useEffect, useRef, useState } from "react";
import type { Reel } from "@/content/site";

// Muted loop that only plays while on screen. Reduced-motion users get the poster and tap to play.
export function ReelVideo({ reel }: { reel: Reel }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(true);
  const manual = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (manual.current) return;
        if (entry.isIntersecting) video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    manual.current = true;
    if (video.paused) video.play().catch(() => undefined);
    else video.pause();
  };

  return (
    <figure className="group relative overflow-hidden rounded-md border border-line bg-panel-2">
      <video
        ref={ref}
        src={reel.src}
        poster={reel.poster}
        muted
        loop
        playsInline
        preload="none"
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onClick={toggle}
        className="block aspect-[9/16] w-full cursor-pointer object-cover"
        aria-label={`${reel.title}, muted reel`}
      />
      {paused && (
        <span className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true">
          <span className="grid size-11 place-items-center rounded-full bg-black/55 backdrop-blur">
            <svg viewBox="0 0 16 16" className="size-4 fill-bright"><path d="M5 3 13 8 5 13Z" /></svg>
          </span>
        </span>
      )}
      <figcaption className="label absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2.5 pt-8 !text-[.625rem] !text-text">
        {reel.title}
      </figcaption>
    </figure>
  );
}
