"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cases, type CaseFile } from "@/content/site";

export const OPEN_CASE_EVENT = "open-case";

export function CaseFiles() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<CaseFile | null>(null);

  const open = useCallback((id: string) => {
    const found = cases.find((c) => c.id === id);
    if (!found) return;
    setActive(found);
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => open((e as CustomEvent<string>).detail);
    window.addEventListener(OPEN_CASE_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CASE_EVENT, onOpen);
  }, [open]);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:[&>*:last-child:nth-child(odd)]:col-span-2 xl:grid-cols-3 xl:[&>*:last-child:nth-child(3n+1)]:col-span-3">
        {cases.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => open(c.id)}
            className="panel group flex flex-col gap-5 p-5 text-left transition-colors hover:border-line-2 hover:bg-panel-2 sm:p-6"
          >
            <span className="flex items-start justify-between gap-3">
              <span>
                <span className="block text-[1.0625rem] font-semibold text-bright">{c.org}</span>
                <span className="label mt-0.5 block">{c.orgNote}</span>
              </span>
              <ModeBadge mode={c.mode} />
            </span>
            <span>
              <MetricLine metric={c.metric} size="text-[clamp(2.5rem,7vw,3.25rem)]" />
              <span className="mt-2 block text-muted">{c.caption}</span>
            </span>
            <span className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-line pt-4">
              <span className="font-semibold text-text">{c.title}</span>
              <span className="label text-muted transition-transform group-hover:translate-x-0.5">Open file →</span>
            </span>
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="drawer"
        aria-labelledby="case-title"
        onClick={(e) => e.target === dialogRef.current && dialogRef.current.close()}
        onClose={() => setActive(null)}
      >
        {active && <CaseDetail file={active} onClose={() => dialogRef.current?.close()} />}
      </dialog>
    </>
  );
}

function CaseDetail({ file: c, onClose }: { file: CaseFile; onClose: () => void }) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="panel-head sticky top-0 z-10 bg-panel">
        <span className="label text-muted">Case file · {c.org}</span>
        <button type="button" onClick={onClose} className="kbd hover:text-bright" aria-label="Close case file">
          Esc
        </button>
      </div>

      <div className="flex flex-col gap-8 p-5 sm:p-8">
        <header>
          <div className="flex flex-wrap items-center gap-3">
            <span className="label">{c.orgNote}</span>
            <ModeBadge mode={c.mode} />
          </div>
          <h3 id="case-title" className="display mt-3 text-[clamp(1.75rem,4vw,2.5rem)] text-bright">
            {c.title}
          </h3>
          <MetricLine metric={c.metric} size="mt-5 text-[clamp(3rem,9vw,4.5rem)]" />
          <p className="mt-2 text-muted">{c.caption}</p>
        </header>

        <dl className="grid gap-5 sm:grid-cols-[7rem_1fr]">
          <dt className="label pt-1">Problem</dt>
          <dd>{c.problem}</dd>
          <dt className="label pt-1">Built</dt>
          <dd>{c.built}</dd>
        </dl>

        <section aria-label="How it flows">
          <p className="label mb-3">How it flows</p>
          <FlowDiagram rows={c.flow} />
        </section>

        <section aria-label="On the record">
          <p className="label mb-3">On the record</p>
          <ul className="grid gap-2">
            {c.facts.map((f) => (
              <li key={f} className="flex gap-3">
                <span className="mt-[.55em] size-1.5 shrink-0 rounded-full bg-ok" aria-hidden="true" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </section>

        <p className="border-t border-line pt-4 text-[.875rem] text-dim">
          <span className="label mr-2">Measured</span>
          {c.measured}
        </p>
      </div>
    </div>
  );
}

function FlowDiagram({ rows }: { rows: CaseFile["flow"] }) {
  return (
    <ol className="grid gap-0">
      {rows.map((row, r) => (
        <li key={r} className="grid justify-items-center">
          {r > 0 && (
            <span className="flex h-7 flex-col items-center" aria-hidden="true">
              <span className="w-px flex-1 bg-line-2" />
              <span className="-mt-1 text-[.625rem] leading-none text-dim">▼</span>
            </span>
          )}
          <span className="flex flex-wrap justify-center gap-2">
            {row.map((n) => (
              <span key={n.id} className="rounded-md border border-line-2 bg-panel-2 px-3 py-2 text-center text-[.875rem] text-text">
                {n.label}
                {n.detail && <span className="unit ml-2 text-[.75rem] text-dim">{n.detail}</span>}
              </span>
            ))}
          </span>
        </li>
      ))}
    </ol>
  );
}

function MetricLine({ metric: m, size }: { metric: CaseFile["metric"]; size: string }) {
  return (
    <span className={`flex flex-wrap items-baseline gap-x-[.3em] leading-none text-bright ${size}`}>
      {m.from && (
        <>
          <span className="num text-dim">{m.from}</span>
          <span className="unit text-[.4em] text-dim">→</span>
        </>
      )}
      <span className="num whitespace-nowrap">
        {m.approx && <span className="text-dim">~</span>}
        {m.value}
      </span>
      <span className="unit text-[max(.75rem,.28em)] text-muted">{m.unit}</span>
    </span>
  );
}

function ModeBadge({ mode }: { mode: CaseFile["mode"] }) {
  const handsOn = mode === "hands-on";
  return (
    <span className={`label shrink-0 rounded-full border px-2 py-1 !text-[.625rem] ${handsOn ? "border-ok/40 !text-ok" : "border-line-2 !text-muted"}`}>
      {handsOn ? "Built hands-on" : "Led as PM"}
    </span>
  );
}
