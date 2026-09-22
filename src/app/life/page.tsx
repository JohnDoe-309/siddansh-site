import type { Metadata } from "next";
import Link from "next/link";
import { chapters, lifeIntro, stills } from "@/content/life";
import { person } from "@/content/site";

export const metadata: Metadata = {
  title: `${person.name} · Outside work`,
  description: lifeIntro.headline,
  openGraph: { title: `${person.name} · Outside work`, description: lifeIntro.headline },
};

export default function Life() {
  return (
    <div className="life">
      <header className="border-b" style={{ borderColor: "var(--edge)" }}>
        <div className="wrap flex h-14 items-center justify-between gap-4">
          <Link href="/" className="label !text-[var(--ink)]">← {person.name}</Link>
          <span className="label">Outside work</span>
        </div>
      </header>

      <main>
        <section className="wrap pb-10 pt-14 sm:pt-20">
          <div className="life-rule w-24" aria-hidden="true" />
          <p className="label mt-6">{lifeIntro.eyebrow}</p>
          <h1 className="display mt-4 max-w-[19ch] text-[clamp(2.375rem,6.5vw,4.75rem)]">{lifeIntro.headline}</h1>
          <p className="mt-6 max-w-[58ch] text-[1.125rem]" style={{ color: "var(--ink-2)" }}>{lifeIntro.sub}</p>
        </section>

        <section className="wrap pb-16" aria-label="Frames from my own footage">
          <div className="life-strip">
            {stills.map((s) => (
              <figure key={s.src} className={`life-shot tint-${s.tint}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.label} width={640} height={1138} loading="lazy" />
                <figcaption>{s.label}</figcaption>
              </figure>
            ))}
          </div>
          <p className="label mt-3">Stills from reels I shot and cut · drag to scroll</p>
        </section>

        {chapters.map((c, i) => (
          <section key={c.id} id={c.id} className={`tint-${c.tint} border-t`} style={{ borderColor: "var(--edge)", background: `color-mix(in srgb, var(--${c.tint}) ${i % 2 ? 9 : 5}%, var(--paper))` }}>
            <div className="wrap grid gap-8 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16">
              <div className="border-l-4 pl-5 sm:pl-6" style={{ borderColor: "var(--tint)" }}>
                <span className="life-kicker">{c.kicker}</span>
                <h2 className="display mt-5 max-w-[20ch] text-[clamp(1.75rem,4vw,2.75rem)]">{c.title}</h2>
                <p className="mt-5 max-w-[56ch]" style={{ color: "var(--ink-2)" }}>{c.body}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {c.facts.map((f) => (
                    <li key={f} className="life-chip">{f}</li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {stills
                  .filter((s) => s.tint === c.tint)
                  .slice(0, 2)
                  .map((s) => (
                    <figure key={s.src} className={`life-shot tint-${s.tint}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.src} alt={s.label} width={640} height={1138} loading="lazy" />
                      <figcaption>{s.label}</figcaption>
                    </figure>
                  ))}
                {stills.filter((s) => s.tint === c.tint).length === 0 && (
                  <div className="col-span-2 rounded-[10px] p-8" style={{ background: "color-mix(in srgb, var(--tint) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--tint) 30%, transparent)" }}>
                    <p className="display text-[clamp(1.5rem,3vw,2rem)]" style={{ color: "var(--tint)" }}>{c.kicker}</p>
                    <p className="mt-2 text-[.9375rem]" style={{ color: "var(--ink-2)" }}>{c.facts[0]}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        ))}

        <section className="wrap py-16 sm:py-24">
          <div className="life-rule w-full" aria-hidden="true" />
          <p className="mt-8 max-w-[46ch] text-[1.125rem]" style={{ color: "var(--ink-2)" }}>
            The work side of this, with the numbers and the case files, is one click away.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className="btn !border-[var(--ink)] !bg-[var(--ink)] !text-[var(--paper)]">See the work</Link>
            <a href={`mailto:${person.email}`} className="btn !border-[var(--edge)] !text-[var(--ink)]">{person.email}</a>
          </div>
        </section>
      </main>

      <footer className="border-t" style={{ borderColor: "var(--edge)" }}>
        <div className="wrap flex flex-wrap justify-between gap-2 py-8">
          <span className="label">{person.name} · {person.location}</span>
          <span className="label">Every frame here is mine</span>
        </div>
      </footer>
    </div>
  );
}
