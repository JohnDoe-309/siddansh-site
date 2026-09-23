"use client";

import { useEffect, useRef } from "react";

// A hairline that fills as the page is read. Costs one transform per frame and
// gives the reader a reason to keep going.
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${scrollable <= 0 ? 0 : Math.min(1, window.scrollY / scrollable)})`;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-px" aria-hidden="true">
      <div ref={ref} className="h-full origin-left scale-x-0 bg-bright/70" />
    </div>
  );
}
