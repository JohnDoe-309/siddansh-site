"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cases, links, person } from "@/content/site";
import { OPEN_CASE_EVENT } from "./CaseFiles";

export const OPEN_PALETTE_EVENT = "open-palette";

type Command = { id: string; group: string; label: string; hint?: string; run: () => void };

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ block: "start" });
}

export function CommandPalette() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [copied, setCopied] = useState(false);

  const commands = useMemo<Command[]>(() => {
    const list: Command[] = [
      { id: "go-work", group: "Go to", label: "Case files", run: () => scrollToId("work") },
      { id: "go-proof", group: "Go to", label: "Proof of work", run: () => scrollToId("proof") },
      { id: "go-exp", group: "Go to", label: "Experience", run: () => scrollToId("experience") },
      { id: "go-offers", group: "Go to", label: "Offers", run: () => scrollToId("offers") },
      { id: "go-contact", group: "Go to", label: "Contact", run: () => scrollToId("contact") },
      ...cases.map((c) => ({
        id: `case-${c.id}`,
        group: "Open case file",
        label: c.title,
        hint: c.org,
        run: () => window.dispatchEvent(new CustomEvent(OPEN_CASE_EVENT, { detail: c.id })),
      })),
      { id: "email", group: "Contact", label: `Email ${person.email}`, run: () => (window.location.href = `mailto:${person.email}`) },
      {
        id: "copy",
        group: "Contact",
        label: "Copy email address",
        run: () => {
          navigator.clipboard?.writeText(person.email).then(() => setCopied(true), () => undefined);
        },
      },
    ];
    if (links.booking) list.push({ id: "book", group: "Contact", label: "Book a call", run: () => window.open(links.booking!, "_blank", "noopener") });
    for (const [id, label, url] of [
      ["mcp", "Blender MCP on GitHub", links.mcpRepo],
      ["atlas", "Accelerator atlas on GitHub", links.atlasRepo],
      ["atlas-demo", "Accelerator atlas live demo", links.atlasDemo],
      ["github", "GitHub profile", links.github],
      ["linkedin", "LinkedIn", links.linkedin],
    ] as const) {
      if (url) list.push({ id, group: "Links", label, run: () => window.open(url, "_blank", "noopener") });
    }
    return list;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.group} ${c.label} ${c.hint ?? ""}`.toLowerCase().includes(q));
  }, [commands, query]);

  const open = useCallback(() => {
    setQuery("");
    setCursor(0);
    setCopied(false);
    dialogRef.current?.showModal();
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialogRef.current?.open) dialogRef.current.close();
        else open();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, open);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, open);
    };
  }, [open]);

  const run = (command: Command | undefined) => {
    if (!command) return;
    if (command.id !== "copy") dialogRef.current?.close();
    command.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(filtered[cursor]);
    }
  };

  let lastGroup = "";
  return (
    <dialog ref={dialogRef} className="palette" aria-label="Command menu" onClick={(e) => e.target === dialogRef.current && dialogRef.current.close()}>
      <div className="flex items-center gap-3 border-b border-line px-4">
        <span className="label" aria-hidden="true">⌘K</span>
        <input
          ref={inputRef}
          id="palette-query"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCursor(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Jump to a case file, section or contact…"
          className="h-12 flex-1 bg-transparent text-text outline-none placeholder:text-dim"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={filtered[cursor] ? `cmd-${filtered[cursor].id}` : undefined}
          autoComplete="off"
        />
        <span className="kbd">Esc</span>
      </div>
      <ul id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
        {filtered.length === 0 && <li className="px-3 py-6 text-center text-dim">No matches.</li>}
        {filtered.map((c, i) => {
          const header = c.group !== lastGroup ? c.group : null;
          lastGroup = c.group;
          return (
            <li key={c.id} role="presentation">
              {header && <p className="label px-3 pb-1 pt-3 !text-[.625rem]">{header}</p>}
              <div
                id={`cmd-${c.id}`}
                role="option"
                aria-selected={i === cursor}
                onMouseMove={() => setCursor(i)}
                onClick={() => run(c)}
                className={`flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 ${i === cursor ? "bg-panel-2 text-bright" : "text-text"}`}
              >
                <span>{c.id === "copy" && copied ? "Copied" : c.label}</span>
                {c.hint && <span className="label !text-[.625rem]">{c.hint}</span>}
              </div>
            </li>
          );
        })}
      </ul>
    </dialog>
  );
}

export function PaletteButton() {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))} className="flex items-center gap-2 text-muted hover:text-bright" aria-label="Open command menu">
      <span className="kbd">⌘K</span>
    </button>
  );
}
