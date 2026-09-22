"use client";

import { useEffect, useRef } from "react";

// Muted loop that plays only while on screen; reduced-motion visitors get the still.
export function LifeClip({ src, poster, alt, className = "" }: { src: string; poster: string; alt: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // Every reel fades in from black, so start a third of the way in: the first
  // painted frame is the image, not the fade.
  const skipIntro = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (Number.isFinite(video.duration) && video.currentTime < 0.1) video.currentTime = video.duration * 0.35;
  };

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      onLoadedMetadata={skipIntro}
      aria-label={alt}
      className={className}
    />
  );
}
