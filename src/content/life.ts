// Outside-work page. Same rule as the work site: nothing here that isn't true.
// Clips and stills are all my own footage.

export const lifeIntro = {
  eyebrow: "Outside work",
  headline: "I bike, trek, dive, swim, run — and film all of it.",
  sub: "Bengaluru. 481 raw clips in the library, 36 finished reels, a scuba-discovery platform mid-build, and a pothole survey for my own city that I re-scoped the moment I found three of its four layers already solved.",
  stats: [
    { value: "36", label: "reels finished" },
    { value: "481", label: "raw clips shot" },
    { value: "8", label: "places on the reel list" },
    { value: "5", label: "of the reels are dives" },
  ],
};

export const verbs = ["Bike", "Trek", "Dive", "Swim", "Run", "Film"] as const;

export type Activity = {
  id: string;
  verb: string;
  line: string;
  tint: "cyan" | "magenta" | "lime" | "amber" | "violet";
  clip?: { src: string; poster: string };
  big?: string;
};

export const activities: Activity[] = [
  {
    id: "bike",
    verb: "Bike",
    line: "A KTM 390 Duke and Bengaluru's roads. Those roads are also why Raste Gundi exists.",
    tint: "amber",
    clip: { src: "/life/bengaluru_roads.mp4", poster: "/life/bengaluru_roads.jpg" },
  },
  {
    id: "trek",
    verb: "Trek",
    line: "The Himalayas, on foot, with the camera along for it.",
    tint: "lime",
    clip: { src: "/life/art_himalayas.mp4", poster: "/life/art_himalayas.jpg" },
  },
  {
    id: "dive",
    verb: "Dive",
    line: "Drift dives and reefs. Five of my finished reels came back up with me.",
    tint: "cyan",
    clip: { src: "/life/dive_mine.mp4", poster: "/life/dive_mine.jpg" },
  },
  {
    id: "swim",
    verb: "Swim",
    line: "Water turns up in my footage more than anything else. That isn't a coincidence.",
    tint: "violet",
    clip: { src: "/life/vivid_water.mp4", poster: "/life/vivid_water.jpg" },
  },
  {
    id: "run",
    verb: "Run",
    line: "Roads again, slower, no engine.",
    tint: "magenta",
    big: "RUN",
  },
  {
    id: "film",
    verb: "Film",
    line: "36 reels cut from 481 clips by a pipeline I wrote: the footage gets understood, a script gets written, an edit list gets compiled, Blender renders it.",
    tint: "cyan",
    clip: { src: "/reels/perahera_text.mp4", poster: "/reels/perahera_text.jpg" },
  },
];

export const chapters = [
  {
    id: "roads",
    kicker: "Raste Gundi",
    title: "A pothole survey for Bengaluru, cut down to the gap.",
    body: "I planned a bike-mounted road survey off the Duke, with a public accountability loop for BBMP. A market scan then killed three quarters of it: phone-camera road survey is solved by several vendors, and citizen complaint intake is solved here by a platform with 607,000 registered users. Nobody publishes a government performance scoreboard, so that's the layer worth building. Capex to start: nothing. It's a plan on the shelf, not a product.",
    facts: ["Plan revised 6 Sep 2026", "7 decisions recorded", "3 of 4 layers dropped after the scan"],
    tint: "amber" as const,
  },
  {
    id: "scuba",
    kicker: "Scuba platform",
    title: "The diving turned into a build.",
    body: "A dive-discovery platform, South-East Asia first: a map of sites from open data, natural-language search, structured reef summaries and a conservation volunteer board. Phase 1 is under construction, and that's the honest status rather than a soft launch.",
    facts: ["Next.js · FastAPI · Postgres + PostGIS", "MapLibre, no API key", "Phase 1 MVP in progress"],
    tint: "cyan" as const,
  },
  {
    id: "tools",
    kicker: "Tools for one user",
    title: "I write software for an audience of me.",
    body: "A personal brain that takes a journal entry, a decision, a habit or a todo, asks a question every day and grades the answer A to E. It ran as a Telegram bot for two months and now lives on an iMessage rail. A Mac dashboard renders the lot on my desktop. And a quant research stack whose main output is telling me my strategies don't work.",
    facts: ["Mac dashboard: 3,087 lines of Swift, 53 tests", "Quant stack: 1 survivor in 25,267 tests", "Telegram → iMessage, Jun–Aug 2026"],
    tint: "violet" as const,
  },
];
