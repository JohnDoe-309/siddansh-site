import Link from "next/link";
import { CaseFiles } from "@/components/CaseFiles";
import { CommandPalette, PaletteButton } from "@/components/CommandPalette";
import { MetricsReel } from "@/components/MetricsReel";
import { Pipeline } from "@/components/Pipeline";
import { ReelVideo } from "@/components/ReelVideo";
import { FX, cases, experience, faq, links, offers, person, principles, projects, record, reels, testimonials } from "@/content/site";

function SectionHead({ id, label, title, aside }: { id: string; label: string; title: string; aside?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-3 sm:mb-10">
      <div>
        <p className="label">{label}</p>
        <h2 id={`${id}-title`} className="display mt-3 max-w-[22ch] text-[clamp(1.875rem,4.5vw,3rem)] text-bright">
          {title}
        </h2>
      </div>
      {aside && <p className="max-w-[40ch] text-muted">{aside}</p>}
    </div>
  );
}

function ExternalLink({ href, children, cta }: { href: string; children: React.ReactNode; cta?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" data-cta={cta} className="label inline-flex items-center gap-1.5 !text-text underline decoration-line-2 underline-offset-4 hover:decoration-bright">
      {children} ↗
    </a>
  );
}

export default function Home() {
  const [mcp, atlas, ...others] = projects;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/80 backdrop-blur-md">
        <div className="wrap flex h-14 items-center justify-between gap-4">
          <a href="#top" className="label !text-text">{person.name}</a>
          <nav className="flex items-center gap-5" aria-label="Sections">
            <a href="#work" className="label hidden hover:!text-bright sm:inline">Work</a>
            <a href="#proof" className="label hidden hover:!text-bright sm:inline">Proof</a>
            <a href="#offers" className="label hidden hover:!text-bright sm:inline">Offers</a>
            <Link href="/life" data-cta="nav_life" className="label hover:!text-bright">Life</Link>
            <PaletteButton />
            <a href="#contact" data-cta="nav_contact" className="label rounded-full border border-line-2 px-3 py-1.5 !text-bright hover:border-dim hover:bg-panel-2">Contact</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="relative" aria-labelledby="hero-title">
          <div className="grid-ground pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="wrap relative grid items-center gap-10 pb-12 pt-12 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-16 lg:pt-20">
            <div>
              <p className="label flex items-center gap-2">
                <span className="live-dot" aria-hidden="true" />
                Operator who builds · Fractional
              </p>
              <h1 id="hero-title" className="display mt-5 text-[clamp(2.375rem,6vw,4.5rem)] text-bright">
                {person.headline}
              </h1>
              <p className="mt-6 max-w-[52ch] text-[1.125rem] text-muted">{person.sub}</p>
              <p className="mt-5 max-w-[52ch] text-[1.0625rem] text-text">
                Send me the workflow that eats the most hours. I&apos;ll tell you whether it&apos;s worth an audit.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {links.booking ? (
                  <a href={links.booking} target="_blank" rel="noopener noreferrer" data-cta="hero_book" className="btn btn-primary">Book a call</a>
                ) : (
                  <a href={`mailto:${person.email}`} data-cta="hero_email" className="btn btn-primary">Email me</a>
                )}
                <a href="#work" data-cta="hero_cases" className="btn">Open the case files</a>
                <span className="label flex items-center gap-2 !text-muted">
                  <span className="live-dot" aria-hidden="true" />
                  {person.availability}
                </span>
              </div>
              <p className="label mt-10">Worked at</p>
              <ul className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-3">
                {experience.map((e) => (
                  <li key={e.org} className="flex items-center gap-2.5">
                    {e.mark && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={e.mark} alt="" width={22} height={22} className="size-[22px] rounded-[4px] object-contain opacity-80 grayscale transition duration-200 hover:opacity-100 hover:grayscale-0" />
                    )}
                    <span className="text-[1.0625rem] font-semibold text-text">{e.org}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Pipeline />
          </div>
        </section>

        <div className="wrap pb-16 sm:pb-24">
          <MetricsReel />
        </div>

        <section id="work" className="scroll-mt-16 border-t border-line py-16 sm:py-24" aria-labelledby="work-title">
          <div className="wrap">
            <SectionHead id="work" label="Case files" title={`${cases.length} systems, each measured.`} aside="Open any file for the problem, what I built, how it flows and how the number was measured." />
            <CaseFiles />

            <dl className="mt-10 grid gap-x-6 gap-y-4 border-t border-line pt-8 sm:grid-cols-[7rem_1fr]">
              {record.map((r) => (
                <div key={r.label} className="contents">
                  <dt className="label pt-1">{r.label}</dt>
                  <dd className="text-muted">{r.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="proof" className="scroll-mt-16 border-t border-line py-16 sm:py-24" aria-labelledby="proof-title">
          <div className="wrap">
            <SectionHead id="proof" label="Proof of work" title="Things I built on my own time." />

            <article className="panel overflow-hidden">
              <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_1.5fr] lg:gap-12">
                <div className="flex flex-col gap-4">
                  <h3 className="display text-[1.75rem] text-bright">{mcp.title}</h3>
                  <p className="flex items-baseline gap-2 text-bright">
                    <span className="num text-[3rem] leading-none">{mcp.metric.value}</span>
                    <span className="unit text-[.875rem] text-muted">{mcp.metric.unit}</span>
                  </p>
                  <p className="text-muted">{mcp.body}</p>
                  <p className="label mt-auto">{mcp.stack}</p>
                  {mcp.repo && <ExternalLink href={mcp.repo}>Source on GitHub</ExternalLink>}
                </div>
                <div>
                  <p className="label mb-3">Reels it edited · my footage, muted</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {reels.map((r) => (
                      <ReelVideo key={r.src} reel={r} />
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <div className="mt-4 grid gap-4 md:grid-cols-3 md:[&>*:last-child:nth-child(3n+1)]:col-span-3">
              {[atlas, ...others].map((p) => (
                <article key={p.id} className="panel flex flex-col gap-4 p-5 sm:p-6">
                  <h3 className="text-[1.25rem] font-bold text-bright" style={{ fontStretch: "112%" }}>{p.title}</h3>
                  <p className="flex flex-wrap items-baseline gap-2 text-bright">
                    <span className="num text-[2.5rem] leading-none">{p.metric.value}</span>
                    <span className="unit text-[.8125rem] text-muted">{p.metric.unit}</span>
                  </p>
                  <p className="text-muted">{p.body}</p>
                  <p className="label mt-auto">{p.stack}</p>
                  {(p.demo || p.repo) && (
                    <div className="flex flex-wrap gap-4">
                      {p.demo && <ExternalLink href={p.demo} cta={`demo_${p.id}`}>Live demo</ExternalLink>}
                      {p.repo && <ExternalLink href={p.repo} cta={`repo_${p.id}`}>Source</ExternalLink>}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>


        <section id="experience" className="scroll-mt-16 border-t border-line py-16 sm:py-24" aria-labelledby="experience-title">
          <div className="wrap">
            <SectionHead id="experience" label="Experience" title="Where the numbers come from." />
            <ol className="panel divide-y divide-line">
              {experience.map((e) => (
                <li key={e.org} className="grid gap-1 px-5 py-5 sm:grid-cols-[12rem_1fr_auto] sm:items-baseline sm:gap-6 sm:px-7">
                  <span className="text-[1.125rem] font-semibold text-bright">{e.org}</span>
                  <span>
                    <span className="block text-text">{e.role}</span>
                    <span className="label mt-1 block">{e.note}</span>
                  </span>
                  <span className="label tabular !text-muted">{e.period}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-[.875rem] text-dim">B.E. Electrical &amp; Electronics, BITS Pilani, 2019–2023.</p>
          </div>
        </section>

        <section id="method" className="scroll-mt-16 border-t border-line py-16 sm:py-24" aria-labelledby="method-title">
          <div className="wrap">
            <SectionHead id="method" label="How I work" title="Measure, automate, hand over." />
            <div className="grid gap-8 md:grid-cols-3">
              {principles.map((p) => (
                <div key={p.title} className="border-t border-line pt-5">
                  <h3 className="text-[1.375rem] font-bold leading-tight text-bright" style={{ fontStretch: "112%" }}>{p.title}</h3>
                  <p className="mt-3 max-w-[38ch] text-muted">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="offers" className="scroll-mt-16 border-t border-line py-16 sm:py-24" aria-labelledby="offers-title">
          <div className="wrap">
            <SectionHead id="offers" label="Offers" title="Start with a diagnosis." aside="Fixed scope first. Pricing on a call." />
            <ol className="grid gap-4 md:grid-cols-3">
              {offers.map((o, i) => (
                <li key={o.title} className="panel flex flex-col gap-3 p-5 sm:p-6">
                  <p className="label">
                    <span className="tabular text-text">0{i + 1}</span> · {o.step}
                  </p>
                  <h3 className="text-[1.375rem] font-bold text-bright" style={{ fontStretch: "112%" }}>{o.title}</h3>
                  <p className="unit text-[.8125rem] text-text">{o.meta}</p>
                  <p className="text-muted">{o.body}</p>
                  <ul className="mt-auto grid gap-2 border-t border-line pt-4">
                    {o.gets.map((g) => (
                      <li key={g} className="flex gap-3 text-[.9375rem]">
                        <span className="text-ok" aria-hidden="true">✓</span>
                        {g}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {testimonials.length > 0 && (
          <section className="border-t border-line py-16 sm:py-24" aria-labelledby="words-title">
            <div className="wrap">
              <SectionHead id="words" label="In their words" title="From people I worked with." />
              <div className="grid gap-4 md:grid-cols-3">
                {testimonials.map((t) => (
                  <figure key={t.name} className="panel flex flex-col gap-5 p-6">
                    <blockquote className="text-[1.0625rem] text-text">“{t.quote}”</blockquote>
                    <figcaption className="mt-auto">
                      <span className="block font-semibold text-bright">{t.name}</span>
                      <span className="label mt-1 block">{t.title} · {t.org}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        <section id="faq" className="scroll-mt-16 border-t border-line py-16 sm:py-24" aria-labelledby="faq-title">
          <div className="wrap">
            <SectionHead id="faq" label="Before you ask" title="The five questions I always get." />
            <dl className="grid gap-4 md:grid-cols-2">
              {faq.map((item) => (
                <div key={item.q} className="panel p-5 sm:p-6">
                  <dt className="text-[1.0625rem] font-semibold text-bright">{item.q}</dt>
                  <dd className="mt-3 text-muted">{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="contact" className="scroll-mt-16 border-t border-line py-20 sm:py-28" aria-labelledby="contact-title">
          <div className="wrap">
            <p className="label">Contact</p>
            <h2 id="contact-title" className="display mt-4 max-w-[18ch] text-[clamp(2.125rem,5.5vw,3.75rem)] text-bright">
              Send me the workflow that eats the most hours.
            </h2>
            <p className="mt-5 text-muted">I&apos;ll tell you whether it&apos;s worth an audit.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {links.booking && <a href={links.booking} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Book a call</a>}
              <a href={`mailto:${person.email}`} data-cta="contact_email" className={`btn ${links.booking ? "" : "btn-primary"}`}>{person.email}</a>
              {links.linkedin && <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="btn">LinkedIn</a>}
              {links.github && <a href={links.github} target="_blank" rel="noopener noreferrer" className="btn">GitHub</a>}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="wrap flex flex-wrap justify-between gap-x-6 gap-y-2 py-8">
          <span className="label">{person.name} · {person.location}</span>
          <span className="label">INR results shown in USD at ₹{FX.inrPerUsd} = $1 ({FX.date})</span>
        </div>
      </footer>

      <CommandPalette />
    </>
  );
}
