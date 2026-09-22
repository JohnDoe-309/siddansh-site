"use client";

import { track } from "@vercel/analytics";
import { useEffect } from "react";

// Records how far people actually get and what they click, so the next iteration
// of this page is driven by behaviour instead of taste. Cookieless; no personal data.
const DEPTHS = [25, 50, 75, 100] as const;

export function Telemetry() {
  useEffect(() => {
    const firedDepths = new Set<number>();
    const seenSections = new Set<string>();
    const start = Date.now();

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - window.innerHeight;
        if (scrollable <= 0) return;
        const pct = Math.min(100, Math.round(((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100));
        for (const depth of DEPTHS) {
          if (pct >= depth && !firedDepths.has(depth)) {
            firedDepths.add(depth);
            track("scroll_depth", { depth, seconds: Math.round((Date.now() - start) / 1000) });
          }
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting && !seenSections.has(id)) {
            seenSections.add(id);
            track("section_seen", { id, seconds: Math.round((Date.now() - start) / 1000) });
          }
        }
      },
      { threshold: 0.4 },
    );
    sections.forEach((s) => observer.observe(s));

    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-cta], a[href^='mailto:']");
      if (!target) return;
      const name = target.dataset.cta ?? "email";
      track("cta_click", { name, seconds: Math.round((Date.now() - start) / 1000) });
    };
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
      observer.disconnect();
    };
  }, []);

  return null;
}
