"use client";

import { useEffect, useRef, useState } from "react";

// Opening sequence: a counter that tracks real poster loading, then the curtain
// splits upward and the page is revealed. Once per session; skipped entirely for
// reduced motion, and it can never trap the page — it always leaves after 4s.
export function Intro({ posters, name }: { posters: string[]; name: string }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(true);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("life-intro") === "seen";
    } catch {
      seen = false;
    }
    if (reduce || seen) return;

    // Deliberate: the server renders nothing, and the client decides on mount
    // whether this visitor gets the sequence at all.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDone(false);
    document.documentElement.style.overflow = "hidden";
    const openedAt = Date.now();
    let loaded = 0;

    const finish = () => {
      const wait = Math.max(0, 900 - (Date.now() - openedAt));
      window.setTimeout(() => {
        setLeaving(true);
        window.setTimeout(() => {
          setDone(true);
          document.documentElement.style.overflow = "";
          try {
            sessionStorage.setItem("life-intro", "seen");
          } catch {
            /* private mode: the intro simply plays again */
          }
        }, 900);
      }, wait);
    };

    const tick = () => {
      loaded += 1;
      setProgress(Math.round((loaded / posters.length) * 100));
      if (loaded >= posters.length) finish();
    };
    for (const src of posters) {
      const img = new Image();
      img.onload = tick;
      img.onerror = tick;
      img.src = src;
    }
    const escape = window.setTimeout(finish, 4000);
    return () => window.clearTimeout(escape);
  }, [posters]);

  if (done) return null;

  return (
    <div className={`intro ${leaving ? "is-leaving" : ""}`} aria-hidden="true">
      <div className="intro-inner">
        <span className="label">{name}</span>
        <span className="num intro-count tabular">{String(progress).padStart(3, "0")}</span>
      </div>
      <span className="intro-bar" style={{ transform: `scaleX(${progress / 100})` }} />
    </div>
  );
}
