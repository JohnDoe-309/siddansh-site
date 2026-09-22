// Outside-work page. Same rule as the work site: nothing here that isn't true.
// The palette is sampled from the footage in /public/life.

export const lifeIntro = {
  eyebrow: "Outside work",
  headline: "I film what I dive into, and build tools for an audience of one.",
  sub: "Bengaluru. 481 raw clips in the footage library, 36 finished reels, a dive-discovery platform under construction, and a pothole survey for my own city that I re-scoped after finding out three of its four layers were already solved.",
};

export const stills = [
  { src: "/life/dive_mine.jpg", label: "Reef, on a drift", tint: "teal" },
  { src: "/life/perahera.jpg", label: "Perahera, Kandy", tint: "saffron" },
  { src: "/life/art_himalayas.jpg", label: "The Himalayas", tint: "slate" },
  { src: "/life/langkawi.jpg", label: "Langkawi at dawn", tint: "teal" },
  { src: "/life/goa_real.jpg", label: "Goa", tint: "saffron" },
  { src: "/life/bangkok_neon.jpg", label: "Bangkok, after dark", tint: "violet" },
  { src: "/life/travel_vietnam.jpg", label: "Vietnam", tint: "slate" },
  { src: "/life/sl_ceylon.jpg", label: "Ceylon", tint: "teal" },
] as const;

export const chapters = [
  {
    id: "water",
    kicker: "Under water",
    title: "Most of what I film, I filmed underwater.",
    body: "Drift dives, reefs, the quiet at depth. Five of my finished reels are dives, and the footage library behind them runs to 481 raw clips. It turned into a build: a scuba discovery platform, SEA-first, with a map of dive sites from open data, natural-language search and structured reef summaries. Phase 1 is still under construction, and that's an honest status, not a soft launch.",
    facts: ["5 dive reels finished", "481 raw clips in the library", "Scuba platform: Next.js, FastAPI, PostGIS, MapLibre"],
    tint: "teal",
  },
  {
    id: "camera",
    kicker: "On the road",
    title: "The edit is automated. The eye isn't.",
    body: "Sri Lanka, the Himalayas, Langkawi, Goa, Bangkok, Vietnam, New York, Bengaluru. I shoot it, then my own pipeline cuts it: the footage gets understood clip by clip, a script gets written, an edit decision list gets compiled, and Blender renders the result. 36 reels have come out the other end.",
    facts: ["36 finished reels", "8 countries and cities on the reel list", "Footage understanding → script → edit list → render"],
    tint: "saffron",
  },
  {
    id: "roads",
    kicker: "Raste Gundi",
    title: "A pothole survey for Bengaluru, scoped down to the gap.",
    body: "I planned a bike-mounted road survey off a KTM 390 Duke, with a public accountability loop for BBMP. Then a market scan killed three quarters of it: phone-camera road survey is solved by several vendors, and citizen complaint intake is solved locally by a platform with 607,000 registered users in the city. What nobody publishes is a government performance scoreboard, so that's the layer left to build. Capex to start: nothing. It's a plan on the shelf, not a product.",
    facts: ["Plan revised 6 Sep 2026", "7 decisions recorded", "3 of 4 layers dropped after the scan"],
    tint: "rust",
  },
  {
    id: "tools",
    kicker: "Tools for one user",
    title: "I build software for an audience of me.",
    body: "A personal brain that takes a journal entry, a decision, a habit or a todo, answers a daily question and grades it A to E. It ran as a Telegram bot for two months and now lives on an iMessage rail. A Mac dashboard renders the whole thing on my desktop: 3,087 lines of Swift, 53 tests, running right now. And a quant research stack that mostly exists to tell me my strategies don't work.",
    facts: ["Personal brain: journal, decisions, habits, daily question", "Mac dashboard: 3,087 lines of Swift, 53 tests", "Quant stack: 1 survivor in 25,267 tests"],
    tint: "violet",
  },
] as const;
