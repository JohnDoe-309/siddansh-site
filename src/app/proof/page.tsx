import type { Metadata } from "next";
import Link from "next/link";
import { cases, experience, metrics, person, projects } from "@/content/site";

export const metadata: Metadata = {
  title: "Proof of work",
  description: "Every measured result, by company and in order, with what it was measured against.",
};

export default function Proof() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/80 backdrop-blur-md">
        <div className="wrap flex h-14 items-center justify-between gap-4">
          <Link href="/" className="label !text-text">← {person.name}</Link>
          <a href={`mailto:${person.email}`} data-cta="ledger_email" className="label rounded-full border border-line-2 px-3 py-1.5 !text-bright hover:border-dim">
            Email me
          </a>
        </div>
      </header>

      <main className="wrap py-14 sm:py-20">
        <p className="label">Proof of work</p>
        <h1 className="display mt-4 max-w-[20ch] text-[clamp(2.125rem,5.5vw,3.5rem)] text-bright">
          Every result, by company, in order.
        </h1>
        <p className="mt-5 max-w-[60ch] text-muted">
          {metrics.length} measured results across {experience.length} companies. Each row says what moved and what it was
          measured against. Where a case file exists, the row opens it.
        </p>

        <div className="mt-12 flex flex-col gap-12">
          {experience.map((org) => {
            const rows = metrics.filter((m) => m.org === org.org);
            if (rows.length === 0) return null;
            return (
              <section key={org.org} aria-labelledby={`org-${org.org}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line pb-4">
                  <h2 id={`org-${org.org}`} className="flex items-center gap-3 text-[1.375rem] font-bold text-bright" style={{ fontStretch: "112%" }}>
                    {org.mark && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={org.mark} alt="" width={22} height={22} className="size-[22px] rounded-[4px] object-contain opacity-80 grayscale" />
                    )}
                    {org.org}
                  </h2>
                  <p className="label">{org.role} · {org.period}</p>
                </div>

                <ol className="divide-y divide-line">
                  {rows.map((m) => {
                    const file = cases.find((c) => c.id === m.caseId);
                    return (
                      <li key={m.label} className="grid gap-2 py-5 sm:grid-cols-[14rem_1fr] sm:gap-8">
                        <p className="flex flex-wrap items-baseline gap-x-2 text-bright">
                          {m.from && (
                            <>
                              <span className="num text-[1.75rem] leading-none text-dim">{m.from}</span>
                              <span className="unit text-[.75rem] text-dim">→</span>
                            </>
                          )}
                          <span className="num text-[clamp(1.75rem,4vw,2.25rem)] leading-none">
                            {m.approx && <span className="text-dim">~</span>}
                            {m.value}
                          </span>
                          {m.unit && <span className="unit text-[.75rem] text-muted">{m.unit}</span>}
                        </p>
                        <div>
                          <p className="label">{m.label}</p>
                          <p className="mt-1.5 text-muted">{m.caption}</p>
                          {file && (
                            <Link href={`/#case-${file.id}`} data-cta={`ledger_case_${file.id}`} className="label mt-2 inline-block !text-text underline decoration-line-2 underline-offset-4 hover:decoration-bright">
                              Open the case file →
                            </Link>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </section>
            );
          })}

          <section aria-labelledby="own-time">
            <div className="border-b border-line pb-4">
              <h2 id="own-time" className="text-[1.375rem] font-bold text-bright" style={{ fontStretch: "112%" }}>On my own time</h2>
            </div>
            <ol className="divide-y divide-line">
              {projects.map((p) => (
                <li key={p.id} className="grid gap-2 py-5 sm:grid-cols-[14rem_1fr] sm:gap-8">
                  <p className="flex flex-wrap items-baseline gap-x-2 text-bright">
                    <span className="num text-[clamp(1.75rem,4vw,2.25rem)] leading-none">{p.metric.value}</span>
                    <span className="unit text-[.75rem] text-muted">{p.metric.unit}</span>
                  </p>
                  <div>
                    <p className="label">{p.title} · {p.status}</p>
                    <p className="mt-1.5 text-muted">{p.body}</p>
                    {(p.repo || p.demo) && (
                      <p className="mt-2 flex flex-wrap gap-4">
                        {p.demo && <a href={p.demo} target="_blank" rel="noopener noreferrer" data-cta={`ledger_demo_${p.id}`} className="label !text-text underline decoration-line-2 underline-offset-4 hover:decoration-bright">Live demo ↗</a>}
                        {p.repo && <a href={p.repo} target="_blank" rel="noopener noreferrer" data-cta={`ledger_repo_${p.id}`} className="label !text-text underline decoration-line-2 underline-offset-4 hover:decoration-bright">Source ↗</a>}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-3 border-t border-line pt-8">
          <a href={`mailto:${person.email}`} data-cta="ledger_email_footer" className="btn btn-primary">Email me</a>
          <Link href="/#work" data-cta="ledger_back" className="btn">Back to the case files</Link>
          <span className="label ml-1 flex items-center gap-2 !text-muted">
            <span className="live-dot" aria-hidden="true" />
            {person.availability}
          </span>
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="wrap flex flex-wrap justify-between gap-x-6 gap-y-2 py-8">
          <span className="label">{person.name} · {person.location}</span>
          <span className="label">INR results shown in USD</span>
        </div>
      </footer>
    </>
  );
}
