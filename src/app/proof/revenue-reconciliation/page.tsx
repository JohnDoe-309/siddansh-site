import type { Metadata } from "next";
import Link from "next/link";
import { person } from "@/content/site";

export const metadata: Metadata = {
  title: "Reconciling revenue across four rails",
  description:
    "How a brokerage's revenue got tied out by hand across a bank, a payment platform and six wholesaler portals — and what replaced it. Method, numbers, and what still doesn't work.",
  robots: { index: false, follow: false },
};

const NUMBERS = [
  { v: "99.6%", k: "of deposit dollars traced to a sale" },
  { v: "3,514", k: "exceptions raised, in 128 categories" },
  { v: "2×", k: "runs a day, 06:30 and 18:30" },
  { v: "94", k: "runs logged so far" },
];

export default function Retrospective() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/80 backdrop-blur-md">
        <div className="wrap flex h-14 items-center justify-between gap-4">
          <Link href="/" className="label !text-text">← {person.name}</Link>
          <span className="label">Retrospective</span>
        </div>
      </header>

      <main className="wrap py-14 sm:py-20">
        <article className="mx-auto max-w-[68ch]">
          <p className="label">Case file · AI-native US commercial insurance brokerage</p>
          <h1 className="display mt-4 text-[clamp(2.125rem,5.5vw,3.5rem)] text-bright">
            Reconciling revenue across four rails
          </h1>
          <p className="mt-5 text-[1.125rem] text-muted">
            Written 22 Sep 2026 · about 5 minutes · every number here comes from the pipeline&apos;s own run logs
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-line py-6 sm:grid-cols-4">
            {NUMBERS.map((n) => (
              <div key={n.k} className="flex flex-col-reverse">
                <dt className="label mt-1.5 !text-[.625rem]">{n.k}</dt>
                <dd className="num text-[clamp(1.5rem,4vw,2.25rem)] leading-none text-bright">{n.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-col gap-6 text-[1.0625rem] leading-[1.75]">
            <h2 className="display mt-4 text-[1.5rem] text-bright">The shape of the problem</h2>
            <p>
              A brokerage earns commission, but the money doesn&apos;t arrive the way it was earned. Some lands in the bank
              from a carrier. Some comes through the payment platform the client checked out on. Some sits inside a
              wholesaler&apos;s portal until someone logs in and reads it. And the record of what was <em>sold</em> lives
              somewhere else again: a sales log, a tracker, a Slack message announcing a win.
            </p>
            <p>
              Four rails, none of which agrees with the others, and a servicing team with other work to do. Tying them out was a person
              opening tabs and comparing numbers. It happened when someone had time, which meant it happened rarely, and
              the gaps it would have caught aged quietly.
            </p>

            <h2 className="display mt-4 text-[1.5rem] text-bright">The number that had to exist first</h2>
            <p>
              The number worth having first isn&apos;t a match rate, it&apos;s a census: how many sales exist, how many
              deposits exist, and how many of those deposits can be attached to a specific sale with evidence rather than
              inference. That baseline is the whole project. Without it there is no way to tell whether a build worked, and every later
              claim is an opinion.
            </p>
            <p>
              The census also decided the architecture. Matching on amounts alone fails the moment two clients pay the
              same premium in the same week. Matching on names fails on the first &quot;LLC&quot; versus &quot;L.L.C.&quot;
              A deposit had to carry an identifier back to a program, and where it didn&apos;t, the pipeline had to say so
              out loud rather than guess and look tidy.
            </p>

            <h2 className="display mt-4 text-[1.5rem] text-bright">What got built</h2>
            <p>
              Thirty-two steps, run twice a day at 06:30 and 18:30. It pulls the bank, the payment platform, the sales
              log and a census of each wholesaler portal; prices every sale; matches each deposit to the sale that
              produced it; and publishes two things. The first is a workbook anyone can open. The second matters more: an
              exceptions register, where every row that couldn&apos;t be tied out gets a category and a reason.
            </p>
            <p>
              On the most recent full run, 215 deposits went through it and 99.6% of their dollar value attached to a
              specific sale. The register carried 3,514 rows across 128 categories — not failures of the pipeline, but
              the backlog it exists to surface. Among them: 51 cases where a policy had been cancelled and the money
              collected anyway.
            </p>
            <p>
              A second pass went at receivables. The &quot;bill today&quot; bucket had been counting abandoned checkout
              drafts as unbilled fees, so the number people were working from was mostly ghosts. Removing them shrank the
              bucket by more than 95% and made what remained real. On the payables side, the same evidence let 117 of 151
              queued payouts be cleared to approve with to-the-cent backing, 30 held, and 4 fenced for refund — plus 419
              supporting documents attached to billing entries and 49 policy numbers corrected at the source.
            </p>

            <h2 className="display mt-4 text-[1.5rem] text-bright">What still doesn&apos;t work</h2>
            <p>
              The most recent run failed its cash tie by a small margin and its payouts pull errored. An earlier run left
              11.4% of bank commission unattached to any sale. Both are in the logs, because a reconciliation that hides
              its own misses is worse than no reconciliation: it converts an unknown into a false comfort.
            </p>
            <p>
              The deeper limitation is organisational, not technical. An exceptions register is only worth the attention
              someone pays it. Three thousand rows nobody owns is a very precise way of being ignored, which is why the
              register carries categories and reasons rather than a single number, and why the next thing to build is
              routing, not more matching.
            </p>

            <h2 className="display mt-4 text-[1.5rem] text-bright">What I&apos;d do differently</h2>
            <p>
              I&apos;d build the exceptions register first and the matching second. The register is what changes
              behaviour; the match rate is what makes the register trustworthy. Building in that order would have put
              something useful in front of the team in days instead of weeks, and the match rate would have improved
              against real complaints instead of my assumptions about which edge cases mattered.
            </p>
            <p>
              I&apos;d also fix the identifier problem at the source sooner. Every hour spent making a fuzzy match cleverer
              was an hour not spent getting the identifier written down correctly once.
            </p>

            <h2 className="display mt-4 text-[1.5rem] text-bright">If this sounds familiar</h2>
            <p>
              The pattern isn&apos;t specific to insurance. Any business whose money arrives through more than two rails
              eventually has someone comparing tabs, and eventually stops doing it often enough to matter. If that&apos;s
              yours, send me the two systems that disagree the most and I&apos;ll tell you whether it&apos;s worth an
              audit.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-line pt-8">
            <a href={`mailto:${person.email}?subject=${encodeURIComponent("Reconciliation")}`} data-cta="retro_email" className="btn btn-primary">
              Email me
            </a>
            <Link href="/#work" data-cta="retro_cases" className="btn">All case files</Link>
          </div>
        </article>
      </main>

      <footer className="border-t border-line">
        <div className="wrap flex flex-wrap justify-between gap-x-6 gap-y-2 py-8">
          <span className="label">{person.name} · {person.location}</span>
          <span className="label">{person.availability}</span>
        </div>
      </footer>
    </>
  );
}
