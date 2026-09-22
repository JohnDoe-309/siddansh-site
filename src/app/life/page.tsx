import type { Metadata } from "next";
import Link from "next/link";
import { LifeClip } from "@/components/LifeClip";
import { activities, chapters, lifeIntro, verbs } from "@/content/life";
import { person } from "@/content/site";

export const metadata: Metadata = {
  title: `${person.name} · Outside work`,
  description: lifeIntro.headline,
  openGraph: { title: `${person.name} · Outside work`, description: lifeIntro.headline },
};

const MARQUEE_TINTS = ["cyan", "magenta", "lime", "amber", "violet"] as const;

function MarqueeRow({ reverse = false, offset = 0 }: { reverse?: boolean; offset?: number }) {
  const words = [...verbs, ...verbs, ...verbs];
  return (
    <div className={`marquee-row ${reverse ? "reverse" : ""}`} aria-hidden="true">
      {words.map((w, i) => {
        const tint = MARQUEE_TINTS[(i + offset) % MARQUEE_TINTS.length];
        const filled = (i + offset) % 2 === 0;
        return (
          <span key={`${w}-${i}`} className={`marquee-word tint-${tint} ${filled ? "on" : ""}`}>
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

      <div className="relative z-10">
        <header className="border-b border-white/10">
          <div className="wrap flex h-14 items-center justify-between gap-4">
            <Link href="/" className="label !text-[var(--paper)]">← {person.name}</Link>
            <span className="label">Outside work</span>
          </div>
        </header>

        <main>
          <section className="relative isolate overflow-hidden">
            <LifeClip
              src="/life/bengaluru_roads.mp4"
              poster="/life/bengaluru_roads.jpg"
              alt="Riding through Bengaluru"
              className="absolute inset-0 -z-10 size-full object-cover opacity-45"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--ink)]/70 via-[var(--ink)]/55 to-[var(--ink)]" aria-hidden="true" />
            <div className="wrap py-20 sm:py-28 lg:py-36">
              <p className="label">{lifeIntro.eyebrow}</p>
              <h1 className="display tint-cyan glow-text mt-5 max-w-[16ch] text-[clamp(2.75rem,8vw,6rem)]">{lifeIntro.headline}</h1>
              <p className="mt-7 max-w-[58ch] text-[1.125rem] text-[var(--muted-2)]">{lifeIntro.sub}</p>
              <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
                {lifeIntro.stats.map((s) => (
                  <div key={s.label} className="flex flex-col-reverse">
                    <dt className="label mt-1 !text-[.625rem]">{s.label}</dt>
                    <dd className="num text-[clamp(1.75rem,4vw,2.5rem)] leading-none">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <div className="marquee border-y border-white/10 py-6">
            <MarqueeRow />
            <MarqueeRow />
          </div>

          <section className="wrap py-14 sm:py-20" aria-label="Outside work">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activities.map((a) => (
                <article key={a.id} className={`life-card tint-${a.tint} flex flex-col`}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {a.clip ? (
                      <LifeClip src={a.clip.src} poster={a.clip.poster} alt={a.verb} className="absolute inset-0 size-full object-cover opacity-90" />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center" style={{ background: "color-mix(in srgb, var(--tint) 22%, transparent)" }}>
                        <span className="num glow-text text-[clamp(3rem,10vw,5rem)] leading-none" style={{ color: "var(--tint)" }}>{a.big}</span>
                      </div>
                    )}
                    <span className="life-kicker absolute left-4 top-4">{a.verb}</span>
                  </div>
                  <p className="p-5">{a.line}</p>
                </article>
              ))}
            </div>
          </section>

          {chapters.map((c) => (
            <section key={c.id} id={c.id} className={`tint-${c.tint} border-t border-white/10`}>
              <div className="wrap grid gap-8 py-14 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-14">
                <div className="border-l-4 pl-5 sm:pl-6" style={{ borderColor: "var(--tint)" }}>
                  <span className="life-kicker">{c.kicker}</span>
                  <h2 className="display glow-text mt-5 max-w-[20ch] text-[clamp(1.875rem,4.5vw,3rem)]">{c.title}</h2>
                  <p className="mt-5 max-w-[56ch] text-[var(--muted-2)]">{c.body}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {c.facts.map((f) => (
                      <li key={f} className="life-chip">{f}</li>
                    ))}
                  </ul>
                </div>
                <div
                  className="grid aspect-[4/3] place-items-center rounded-2xl"
                  style={{ background: "linear-gradient(150deg, color-mix(in srgb, var(--tint) 30%, transparent), transparent 70%)", border: "1px solid color-mix(in srgb, var(--tint) 40%, transparent)" }}
                >
                  <span className="num glow-text text-[clamp(2.5rem,7vw,4rem)] leading-none" style={{ color: "var(--tint)" }}>{c.kicker}</span>
                </div>
              </div>
            </section>
          ))}

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
