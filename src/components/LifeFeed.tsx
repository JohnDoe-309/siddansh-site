"use client";

import { useMemo, useState } from "react";
import { LifeClip } from "@/components/LifeClip";
import { activities, feed, type FeedItem } from "@/content/life";

// A mosaic of my own footage, filterable by what I was doing. Clips play only
// while on screen; notes are part of the same feed so the rhythm never repeats.
export function LifeFeed() {
  const [active, setActive] = useState<string>("All");
  const items = useMemo(() => (active === "All" ? feed : feed.filter((f) => f.activity === active)), [active]);
  // Chips count clips, since that's what the heading counts; notes ride along with their activity.
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const f of feed) if (f.kind === "clip") map.set(f.activity, (map.get(f.activity) ?? 0) + 1);
    return map;
  }, []);

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter the feed">
        {["All", ...activities].map((name) => {
          const on = name === active;
          return (
            <button
              key={name}
              type="button"
              onClick={() => setActive(name)}
              aria-pressed={on}
              className={`rounded-full border px-4 py-2 text-[.875rem] transition-colors ${
                on ? "border-white/70 bg-white/10 text-[var(--paper)]" : "border-white/15 text-[var(--muted-2)] hover:border-white/40 hover:text-[var(--paper)]"
              }`}
            >
              {name}
              {name !== "All" && <span className="ml-2 text-[.75rem] text-[var(--muted-2)]">{counts.get(name)}</span>}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid auto-rows-[13rem] grid-cols-2 gap-3 sm:auto-rows-[15rem] lg:grid-cols-4">
        {items.map((item) => (
          <Tile key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}

function Tile({ item }: { item: FeedItem }) {
  const span =
    item.span === "wide"
      ? "col-span-2 row-span-1 lg:col-span-2"
      : item.span === "tall"
        ? "col-span-1 row-span-2"
        : "col-span-1 row-span-1";

  if (item.kind === "note") {
    return (
      <article className={`life-card tint-${item.tint} ${item.span === "wide" ? "col-span-2 row-span-2 lg:col-span-2" : "col-span-2 row-span-2 lg:col-span-1"} flex flex-col gap-3 overflow-auto p-5`}>
        <span className="life-kicker self-start">{item.activity}</span>
        <h3 className="display text-[1.25rem] leading-tight">{item.title}</h3>
        <p className="text-[.9375rem] text-[var(--muted-2)]">{item.body}</p>
        <ul className="mt-auto flex flex-wrap gap-2 pt-1">
          {item.facts.map((f) => (
            <li key={f} className="life-chip !text-[.75rem]">{f}</li>
          ))}
        </ul>
      </article>
    );
  }

  return (
    <figure className={`life-card tint-${item.tint} ${span} group relative overflow-hidden`}>
      <LifeClip
        src={`/life/${item.id}.mp4`}
        poster={`/life/${item.id}.jpg`}
        alt={item.title}
        className="absolute inset-0 size-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-10">
        <span>
          <span className="block text-[.9375rem] font-semibold text-[var(--paper)]">{item.title}</span>
          {item.place && <span className="label !text-[.625rem]">{item.place}</span>}
        </span>
        <span className="life-kicker !px-2 !py-1 !text-[.5625rem]">{item.activity}</span>
      </figcaption>
    </figure>
  );
}
