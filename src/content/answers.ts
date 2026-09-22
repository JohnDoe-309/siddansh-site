// The voice agent answers ONLY from these entries, each of which restates something
// already on the page, with the same source note. No model, no server, no API key:
// retrieval is keyword scoring, speech is the browser's own recognition and synthesis.

import { cases, experience, metrics, projects } from "./site";

export type Answer = { id: string; keys: string[]; say: string; source: string };

const fromCases: Answer[] = cases.map((c) => ({
  id: `case-${c.id}`,
  keys: [c.org, c.title, c.orgNote, c.problem, c.built].join(" ").toLowerCase().split(/\W+/),
  say: `${c.title}, at ${c.org}. ${c.problem} I built ${lowerFirst(c.built)} The result: ${c.metric.from ? `${c.metric.from} to ` : ""}${c.metric.value} ${c.metric.unit}.`,
  source: `Case file · ${c.org} · measured: ${c.measured}`,
}));

const fromProjects: Answer[] = projects.map((p) => ({
  id: `project-${p.id}`,
  keys: `${p.title} ${p.body} ${p.stack}`.toLowerCase().split(/\W+/),
  say: `${p.title}. ${p.metric.value} ${p.metric.unit}. ${p.body}`,
  source: `Project · ${p.stack}`,
}));

const fromMetrics: Answer[] = metrics.map((m) => ({
  id: `metric-${m.label}`,
  keys: `${m.label} ${m.org} ${m.caption} ${m.unit ?? ""}`.toLowerCase().split(/\W+/),
  say: `${m.label} at ${m.org}: ${m.from ? `${m.from} to ` : ""}${m.value} ${m.unit ?? ""}. ${m.caption}`,
  source: `Results · ${m.org}`,
}));

const written: Answer[] = [
  {
    id: "who",
    keys: "who are you what do you do about yourself introduce hire why background".split(" "),
    say: "I'm the voice agent on Siddansh Bohra's site, and I only answer from what's published here. Siddansh is an operator who builds: product manager at Meesho and FirstClub, and hands-on at Soma, where he built the agent harness, the revenue reconciliation and the servicing tools.",
    source: "Site introduction",
  },
  {
    id: "offers",
    keys: "offer offers hire engagement retainer audit sprint price pricing cost work together".split(" "),
    say: "Three ways in. An operations audit, two weeks fixed, which maps the manual work and ranks what to automate. An automation sprint, fixed scope, which builds one workflow and hands it over. And a monthly fractional retainer. Pricing is discussed on a call.",
    source: "Offers",
  },
  {
    id: "how",
    keys: "how do you work principles method approach process baseline handover".split(" "),
    say: "Three rules. No baseline, no build: hours and volume get measured first. Automate the rule, route the exception, so anything off-pattern reaches a named person. And hand it over running, with logging, a runbook and an owner on your side.",
    source: "How I work",
  },
  {
    id: "experience",
    keys: "experience worked where employer career history companies resume".split(" "),
    say: experience.map((e) => `${e.org}, ${e.role}, ${e.period}`).join(". ") + ".",
    source: "Experience",
  },
  {
    id: "contact",
    keys: "contact email reach book call talk hire touch".split(" "),
    say: "Email sidkbohra at gmail dot com, and say which workflow eats the most hours. He'll tell you whether it's worth an audit.",
    source: "Contact",
  },
  {
    id: "agent-itself",
    keys: "voice agent demo how does this work you built api model speech real".split(" "),
    say: "I run entirely in your browser. Your speech is recognised by the browser, the answer is retrieved from this page's published content, and the browser speaks it. There's no server, no model and no API key, so I can't invent anything. If a question isn't covered here, I say so.",
    source: "About this demo",
  },
];

export const answers: Answer[] = [...written, ...fromCases, ...fromMetrics, ...fromProjects];

export const suggestions = [
  "What did he build at Soma?",
  "What happened at Meesho?",
  "How does he work?",
  "How does this demo work?",
];

const STOP = new Set("a an the and or of to in on at for with is are was were did does do he his him you your i me my what which how why when tell about that this it".split(" "));

export function findAnswer(question: string): Answer | null {
  const words = question.toLowerCase().split(/\W+/).filter((w) => w.length > 2 && !STOP.has(w));
  if (words.length === 0) return null;
  let best: { answer: Answer; score: number } | null = null;
  for (const answer of answers) {
    const keys = new Set(answer.keys);
    let score = 0;
    for (const word of words) {
      if (keys.has(word)) score += 1;
      else if ([...keys].some((k) => k.length > 3 && (k.startsWith(word) || word.startsWith(k)))) score += 0.5;
    }
    const normalised = score / Math.sqrt(words.length);
    if (!best || normalised > best.score) best = { answer, score: normalised };
  }
  return best && best.score >= 0.8 ? best.answer : null;
}

export const REFUSAL =
  "I can only answer from what's published on this page. Try asking about the reconciliation at Soma, the warehousing work at Meesho, the losses cut at FirstClub, the patent, or how he works.";

function lowerFirst(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
