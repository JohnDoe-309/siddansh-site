// The outside-work feed. Same rule as the work site: nothing here that isn't true.
// Every clip is my own footage. Drums and surf have no clips yet, so they aren't in the grid.

export const lifeIntro = {
  eyebrow: "Outside work",
  headline: "Dive, ride, trek, swim, surf, drum — and film all of it.",
  sub: "Bengaluru. Open Water certified. 481 raw clips in the library and 36 finished reels, all cut by a pipeline I wrote. Below is the footage, not the description of it.",
  stats: [
    { value: "36", label: "reels finished" },
    { value: "481", label: "raw clips shot" },
    { value: "8", label: "places on the reel list" },
    { value: "Open Water", label: "dive certification" },
  ],
};

export const verbs = ["Dive", "Ride", "Trek", "Swim", "Surf", "Drums", "Film"] as const;

export type Tint = "cyan" | "magenta" | "lime" | "amber" | "violet";

export type FeedItem =
  | { kind: "clip"; id: string; activity: string; title: string; place?: string; tint: Tint; span?: "wide" | "tall" }
  | { kind: "note"; id: string; activity: string; title: string; body: string; facts: string[]; tint: Tint; span?: "wide" };

// Order is the feed order. Clips and notes interleave so the page never repeats a rhythm.
export const feed: FeedItem[] = [
  { kind: "clip", id: "dive_mine", activity: "Dive", title: "Reef, on a drift", tint: "cyan", span: "wide" },
  { kind: "clip", id: "bengaluru_roads", activity: "Ride", title: "Bengaluru, after the rain", tint: "amber", span: "tall" },
  {
    kind: "note",
    id: "under-water",
    activity: "Dive",
    title: "Most of what I film, I filmed underwater.",
    body: "Open Water certified, and most of the library came back up with me. It turned into a build: a dive-discovery platform, South-East Asia first, with a map of sites from open data and structured reef summaries. Phase 1 is under construction, which is the honest status rather than a soft launch.",
    facts: ["Open Water certified", "5 dive reels finished", "Next.js · FastAPI · PostGIS"],
    tint: "cyan",
  },
  { kind: "clip", id: "dive_drift", activity: "Dive", title: "Drift", tint: "cyan" },
  { kind: "clip", id: "art_himalayas", activity: "Trek", title: "The Himalayas", tint: "lime", span: "tall" },
  { kind: "clip", id: "perahera_text", activity: "Film", title: "Perahera", place: "Kandy", tint: "violet" },
  { kind: "clip", id: "dive_descent", activity: "Dive", title: "Descent", tint: "cyan" },
  {
    kind: "note",
    id: "roads",
    activity: "Ride",
    title: "A pothole survey for Bengaluru, cut down to the gap.",
    body: "I planned a bike-mounted road survey off the Duke, with a public accountability loop for the city. A market scan killed three quarters of it: phone-camera road survey is solved by several vendors, and citizen complaint intake is solved here by a platform with 607,000 registered users. Nobody publishes a government performance scoreboard, so that's the layer worth building.",
    facts: ["KTM 390 Duke", "Plan revised 6 Sep 2026", "3 of 4 layers dropped after the scan"],
    tint: "amber",
    span: "wide",
  },
  { kind: "clip", id: "langkawi", activity: "Film", title: "Langkawi at dawn", tint: "cyan" },
  { kind: "clip", id: "vivid_water", activity: "Swim", title: "Water, close up", tint: "violet" },
  { kind: "clip", id: "bangkok_neon", activity: "Film", title: "Bangkok after dark", tint: "magenta", span: "tall" },
  { kind: "clip", id: "dive_pulse", activity: "Dive", title: "Pulse", tint: "cyan" },
  { kind: "clip", id: "goa_real", activity: "Film", title: "Goa", tint: "amber" },
  {
    kind: "note",
    id: "pipeline",
    activity: "Film",
    title: "The edit is automated. The eye isn't.",
    body: "I shoot it, then my own pipeline cuts it: each clip gets understood, a script gets written, an edit decision list gets compiled, and Blender renders the result. 36 reels have come out the other end, from 481 raw clips.",
    facts: ["43 MCP tools driving Blender", "Footage understanding → script → edit list → render"],
    tint: "violet",
  },
  { kind: "clip", id: "sl_ceylon", activity: "Film", title: "Ceylon", tint: "lime" },
  { kind: "clip", id: "travel_vietnam", activity: "Film", title: "Vietnam", tint: "lime" },
  { kind: "clip", id: "deep_silence", activity: "Dive", title: "No signal, no thoughts", tint: "cyan", span: "wide" },
  { kind: "clip", id: "nyc_nights", activity: "Film", title: "New York nights", tint: "magenta" },
  {
    kind: "note",
    id: "tools",
    activity: "Film",
    title: "I write software for an audience of me.",
    body: "A personal brain that takes a journal entry, a decision, a habit or a todo, asks a question every day and grades the answer A to E. It ran as a Telegram bot for two months and now lives on an iMessage rail. A Mac dashboard renders the lot on my desktop.",
    facts: ["3,087 lines of Swift, 53 tests", "Telegram → iMessage, Jun–Aug 2026"],
    tint: "violet",
  },
];

// Filters are generated from what actually has content, so nothing empty is ever offered.
export const activities = Array.from(new Set(feed.map((f) => f.activity)));
