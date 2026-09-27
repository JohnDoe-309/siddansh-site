import type { Metadata } from "next";
import Link from "next/link";
import { Carousel } from "@/components/Carousel";
import { Intro } from "@/components/Intro";
import { LifeFeed } from "@/components/LifeFeed";
import { ShowcasePane, type PaneItem } from "@/components/ShowcasePane";
import { feed, lifeIntro, verbs } from "@/content/life";
import { person } from "@/content/site";

export const metadata: Metadata = {
  title: `${person.name} · Outside work`,
  description: lifeIntro.headline,
  openGraph: { title: `${person.name} · Outside work`, description: lifeIntro.headline },
};

const MARQUEE_TINTS = ["cyan", "magenta", "lime", "amber", "violet"] as const;

// The pane runs the strongest clips, one per thing I actually do.
const PANE: PaneItem[] = [
  { id: "dive_mine", title: "Reef, on a drift", activity: "Dive" },
  { id: "bengaluru_roads", title: "Bengaluru, after the rain", activity: "Ride" },
  { id: "art_himalayas", title: "The Himalayas", activity: "Trek" },
  { id: "deep_silence", title: "No signal, no thoughts", activity: "Dive", place: "At depth" },
  { id: "perahera_text", title: "Perahera", activity: "Film", place: "Kandy" },
  { id: "bangkok_neon", title: "Bangkok after dark", activity: "Film" },
];

function MarqueeRow({ reverse = false, offset = 0 }: { reverse?: boolean; offset?: number }) {
  const words = [...verbs, ...verbs, ...verbs];
  return (
    <div className={`marquee-row ${reverse ? "reverse" : ""}`} aria-hidden="true">
      {words.map((w, i) => {
        const tint = MARQUEE_TINTS[(i + offset) % MARQUEE_TINTS.length];
        return (
          <span key={`${w}-${i}`} className={`marquee-word tint-${tint} ${(i + offset) % 2 === 0 ? "on" : ""}`}>
            {w.toUpperCase()}
          </span>
        );
      })}
    </div>
  );
}

export default function Life() {
  return (
    <div className="life relative">
      <div className="blobs" aria-hidden="true">
        <span className="blob blob-1" />
        <span className="blob blob-2" />
        <span className="blob blob-3" />
      </div>

      <Intro name={person.name} posters={PANE.map((p) => `/life/${p.id}.jpg`)} />

      <div className="relative z-10">
        <header className="border-b border-white/10">
          <div className="wrap flex h-14 items-center justify-between gap-4">
            <Link href="/" className="label !text-[var(--paper)]">← {person.name}</Link>
            <span className="label">Outside work</span>
          </div>
        </header>

        <main>
          <section className="wrap pb-10 pt-14 sm:pt-20">
            <p className="label">{lifeIntro.eyebrow}</p>
            <h1 className="display tint-cyan glow-text mt-5 max-w-[17ch] text-[clamp(2.5rem,7vw,5rem)]">
              <span className="rise"><span style={{ ["--d" as string]: "0s" }}>Dive, ride, trek, swim,</span></span>
              <span className="rise"><span style={{ ["--d" as string]: ".09s" }}>surf, drum — and film</span></span>
              <span className="rise"><span style={{ ["--d" as string]: ".18s" }}>all of it.</span></span>
            </h1>
            <p className="mt-7 max-w-[58ch] text-[1.125rem] text-[var(--muted-2)]">{lifeIntro.sub}</p>
            <dl className="mt-9 flex flex-wrap gap-x-10 gap-y-5">
              {lifeIntro.stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="label mt-1 !text-[.625rem]">{s.label}</dt>
                  <dd className="num text-[clamp(1.5rem,3.5vw,2.25rem)] leading-none">{s.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="pb-16 sm:pb-20" aria-label="Showreel">
            <div className="wrap">
              <Carousel items={PANE} />
            </div>
          </section>

          <section className="wrap pb-16 sm:pb-20" aria-label="One at a time">
            <p className="label mb-5">Or one at a time</p>
            <ShowcasePane items={PANE} />
          </section>

          <div className="marquee border-y border-white/10 py-6">
            <MarqueeRow />
            <MarqueeRow />
          </div>

          <section className="wrap py-14 sm:py-20" aria-label="The feed">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
              <div>
                <p className="label">The feed</p>
                <h2 className="display mt-3 text-[clamp(1.75rem,4vw,2.5rem)]">{feed.filter((f) => f.kind === "clip").length} clips, all mine.</h2>
              </div>
              <p className="max-w-[38ch] text-[var(--muted-2)]">
                Shot on the trip, cut by my own pipeline. Filter by what I was doing.
              </p>
            </div>
            <LifeFeed />
          </section>

          <section className="wrap py-16 sm:py-24">
            <h2 className="display tint-magenta glow-text max-w-[16ch] text-[clamp(1.875rem,5vw,3.25rem)]">
              The work side has the numbers and the case files.
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/" className="btn !border-[var(--cyan)] !bg-[var(--cyan)] !text-[var(--ink)]">See the work</Link>
              <a href={`mailto:${person.email}`} className="btn !border-white/25">{person.email}</a>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10">
          <div className="wrap flex flex-wrap justify-between gap-2 py-8">
            <span className="label">{person.name} · {person.location}</span>
            <span className="label">Every frame here is mine</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
