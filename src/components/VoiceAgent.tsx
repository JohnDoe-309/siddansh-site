"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { REFUSAL, findAnswer, suggestions } from "@/content/answers";

// Capability checks read the browser directly, so the server render stays "unsupported"
// and hydration matches until the client takes over.
const subscribeNothing = () => () => {};
const hasRecognition = () => {
  const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
};
const hasSynthesis = () => typeof window.speechSynthesis !== "undefined";

type Turn = { role: "you" | "agent"; text: string; source?: string };

type RecognitionEvent = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((e: RecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};
type RecognitionCtor = new () => Recognition;

const DEMO: string[] = ["What did he build at Soma?", "What happened at Meesho?", "How does this demo work?"];

export function VoiceAgent() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [state, setState] = useState<"idle" | "listening" | "speaking">("idle");
  const canListen = useSyncExternalStore(subscribeNothing, hasRecognition, () => false);
  const canSpeak = useSyncExternalStore(subscribeNothing, hasSynthesis, () => false);
  const [demoRunning, setDemoRunning] = useState(false);
  const recognitionRef = useRef<Recognition | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const cancelled = useRef(false);

  useEffect(() => {
    return () => {
      cancelled.current = true;
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [turns]);

  const speak = useCallback(
    (text: string) =>
      new Promise<void>((resolve) => {
        if (!window.speechSynthesis) return resolve();
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-GB";
        utterance.rate = 1.02;
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        setState("speaking");
        window.speechSynthesis.speak(utterance);
      }).then(() => {
        if (!cancelled.current) setState("idle");
      }),
    [],
  );

  const ask = useCallback(
    async (question: string) => {
      const answer = findAnswer(question);
      setTurns((t) => [...t, { role: "you", text: question }, { role: "agent", text: answer?.say ?? REFUSAL, source: answer?.source ?? "Nothing on the page covers that" }]);
      await speak(answer?.say ?? REFUSAL);
    },
    [speak],
  );

  const listen = () => {
    const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return;
    window.speechSynthesis?.cancel();
    const recognition = new Ctor();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const said = event.results[0]?.[0]?.transcript?.trim();
      if (said) void ask(said);
    };
    recognition.onend = () => setState((s) => (s === "listening" ? "idle" : s));
    recognition.onerror = () => setState("idle");
    setState("listening");
    recognition.start();
  };

  const stop = () => {
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
    setState("idle");
  };

  const runDemo = async () => {
    setDemoRunning(true);
    setTurns([]);
    for (const question of DEMO) {
      if (cancelled.current) break;
      await ask(question);
      await new Promise((r) => setTimeout(r, 400));
    }
    setDemoRunning(false);
  };

  const busy = state !== "idle" || demoRunning;

  return (
    <div className="panel overflow-hidden">
      <div className="panel-head">
        <span className="label flex items-center gap-2 text-muted">
          <span className={state === "idle" ? "size-2 rounded-full bg-line-2" : "live-dot"} aria-hidden="true" />
          Voice agent · live in your browser
        </span>
        <span className="label">{state === "listening" ? "Listening" : state === "speaking" ? "Speaking" : "Ready"}</span>
      </div>

      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-8">
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={state === "idle" ? listen : stop}
            disabled={!canListen || demoRunning}
            className="group grid size-24 place-items-center rounded-full border border-line-2 bg-panel-2 text-bright transition-colors hover:border-dim disabled:opacity-40"
            aria-label={state === "listening" ? "Stop listening" : "Ask by voice"}
          >
            {state === "listening" ? (
              <svg viewBox="0 0 24 24" className="size-7 fill-live" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="size-8 fill-bright" aria-hidden="true">
                <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z" />
                <path d="M18 11a6 6 0 0 1-12 0H4a8 8 0 0 0 7 7.93V22h2v-3.07A8 8 0 0 0 20 11Z" />
              </svg>
            )}
          </button>
          <span className="label text-center">{canListen ? "Hold a question" : "Mic not supported here"}</span>
          <button type="button" onClick={runDemo} disabled={busy} className="btn !min-h-10 !px-3 text-[.875rem] disabled:opacity-40">
            {demoRunning ? "Playing…" : "Play the demo"}
          </button>
        </div>

        <div className="min-w-0">
          <div ref={logRef} className="flex max-h-72 min-h-40 flex-col gap-4 overflow-y-auto pr-1">
            {turns.length === 0 && (
              <p className="text-muted">
                Ask about the work and I&apos;ll answer out loud, from what&apos;s published on this page. I refuse anything I can&apos;t source.
              </p>
            )}
            {turns.map((t, i) => (
              <div key={i} className={t.role === "you" ? "" : "border-l-2 border-ok/50 pl-4"}>
                <p className="label !text-[.625rem]">{t.role === "you" ? "You" : "Agent"}</p>
                <p className={`mt-1 ${t.role === "you" ? "text-text" : "text-bright"}`}>{t.text}</p>
                {t.source && <p className="label mt-1.5 !text-[.625rem] !normal-case !tracking-normal">Source: {t.source}</p>}
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button key={s} type="button" onClick={() => void ask(s)} disabled={busy} className="rounded-full border border-line-2 px-3 py-1.5 text-[.8125rem] text-muted transition-colors hover:border-dim hover:text-bright disabled:opacity-40">
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="border-t border-line px-5 py-3 text-[.8125rem] text-dim sm:px-7">
        Speech recognition and speech are your browser&apos;s own{canSpeak ? "" : " (this browser has no speech output)"}. Answers are retrieved from this page&apos;s published content: no server, no model, no API key, so it cannot invent anything.
      </p>
    </div>
  );
}
