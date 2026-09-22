// Every figure on the site lives here, with where it was measured.
// Rule: no number ships without a source line. INR figures are shown in USD at FX_RATE.

export const FX = { inrPerUsd: 95.87, date: "22 Sep 2026" } as const;

export const person = {
  name: "Siddansh Bohra",
  email: "sidkbohra@gmail.com",
  location: "Bengaluru, India",
  headline: "I build the systems that kill operational backlogs.",
  sub: "Product manager at Meesho and FirstClub, running fulfilment and supply chain. At Soma I built the agent harness, the revenue reconciliation and the servicing tools hands-on, with AI coding agents.",
} as const;

// Filled in as they go live. Anything null is simply not rendered.
export const links: {
  booking: string | null;
  github: string | null;
  linkedin: string | null;
  mcpRepo: string | null;
  atlasRepo: string | null;
  atlasDemo: string | null;
} = {
  booking: null,
  github: null,
  linkedin: null,
  mcpRepo: null,
  atlasRepo: "https://github.com/JohnDoe-309/accelerator-atlas",
  atlasDemo: "https://siddansh-atlas.vercel.app",
};

export type Metric = {
  label: string;
  value: string;
  from?: string;
  approx?: boolean;
  unit?: string;
  caption: string;
  org: string;
};

export const metrics: Metric[] = [
  { label: "Operational losses cut", value: "$210K", approx: true, unit: "/month", caption: "Dump and in-transit losses, removed by rebuilding warehouse and store flows.", org: "FirstClub" },
  { label: "Revenue reconciliation", value: "99.6%", unit: "matched", caption: "of payment-platform deposit dollars traced to a specific sale, in a reconciliation that runs twice a day.", org: "Soma" },
  { label: "Zero to one", from: "0", value: "50K", unit: "orders/day", caption: "Warehousing-as-a-Service, built as sole PM across 3 warehouses and 400 suppliers.", org: "Meesho" },
  { label: "AI agent harness", value: "1,348", unit: "verified actions", caption: "in 11 days. Servicing work routed to an AI agent with the right skill, every write read back before it counts.", org: "Soma" },
  { label: "Delivery promise", value: "−50%", unit: "SLA breaches", caption: "Delivery-promise engine rebuilt as a self-refreshing rule engine, on 100K+ orders a week.", org: "FirstClub" },
  { label: "Caller context", value: "90%", unit: "identified", caption: "of inbound callers matched to their policies, billing and tickets the moment the conversation opens.", org: "Soma" },
  { label: "In-store WMS", value: "−55%", unit: "item-missing complaints", caption: "In-store warehouse management system, live across every store. Cycle time down 10%.", org: "FirstClub" },
  { label: "Manual work removed", value: "3", unit: "FTEs", caption: "A Python workflow that reconciles orders daily and files refund claims automatically.", org: "Meesho" },
  { label: "Analytics", value: "−95%", unit: "analyst SQL time", caption: "An MCP integration on the BI stack, rolled out company-wide.", org: "FirstClub" },
  { label: "Marketplace fulfilment", from: "40%", value: "<5%", unit: "order leakage", caption: "Fixed across pricing, discovery and inventory.", org: "Meesho" },
  { label: "Document spine", value: "13,656", unit: "documents", caption: "indexed by content into one source of truth; 32% of file paths were duplicates. Rebuilt every 10 minutes.", org: "Soma" },
  { label: "Client comms", value: "431", unit: "texts dispatched", caption: "to 258 clients across 25 dispatch days, each inside that client's own time-zone window.", org: "Soma" },
  { label: "Patent", value: "20x", unit: "faster", caption: "Neural architecture search optimizer, patented and presented at a top-tier computer vision conference.", org: "Samsung R&D" },
];

export type FlowNode = { id: string; label: string; detail?: string };
export type CaseFile = {
  id: string;
  org: string;
  orgNote: string;
  title: string;
  metric: { from?: string; value: string; approx?: boolean; unit: string };
  caption: string;
  problem: string;
  built: string;
  flow: FlowNode[][];
  facts: string[];
  measured: string;
  mode: "hands-on" | "led";
};

export const cases: CaseFile[] = [
  {
    id: "revcon",
    org: "Soma",
    orgNote: "AI-native US commercial insurance brokerage",
    title: "Revenue reconciliation",
    metric: { value: "99.6%", unit: "matched" },
    caption: "Payment-platform deposit dollars traced to a specific sale.",
    problem: "Revenue was tied out by hand across the bank, the payment platform, six wholesaler portals and the sales tracker.",
    built: "A 32-step reconciliation that prices every sale, matches each deposit to it, and publishes a workbook plus an exceptions register.",
    flow: [
      [{ id: "bank", label: "Bank" }, { id: "pay", label: "Payment platform" }, { id: "portals", label: "Wholesaler portals", detail: "×6" }, { id: "sales", label: "Sales log" }],
      [{ id: "price", label: "Price each sale" }, { id: "match", label: "Match deposits" }],
      [{ id: "book", label: "Workbook" }, { id: "exc", label: "Exceptions register", detail: "3,514 rows · 128 categories" }],
    ],
    facts: [
      "Runs twice a day, at 06:30 and 18:30; 94 runs logged",
      "3,514 exception rows across 128 categories",
      "51 cancelled-but-collected cases flagged",
    ],
    measured: "21 Sep 2026 run: 215 payment-platform deposits, 99.6% of their dollar value attributed to a sale.",
    mode: "hands-on",
  },
  {
    id: "harness",
    org: "Soma",
    orgNote: "AI-native US commercial insurance brokerage",
    title: "Servicing agent harness",
    metric: { value: "1,348", unit: "verified actions" },
    caption: "Taken by an AI agent in 11 days, each confirmed by reading it back.",
    problem: "Every servicing request needed a person to pick it up, remember the procedure and chase it to done.",
    built: "A harness that reads servicing intake, routes each request to an AI agent with the skill for that task type, and reads back every write before counting it done.",
    flow: [
      [{ id: "intake", label: "Slack intake" }],
      [{ id: "coi", label: "Certificate (COI)" }, { id: "cxl", label: "Cancellation letter" }, { id: "sl", label: "Surplus-lines form" }, { id: "binder", label: "Binder packet" }, { id: "paystat", label: "Payment status" }],
      [{ id: "agent", label: "AI agent + skill" }],
      [{ id: "verify", label: "Read-back verify", detail: "every write" }],
    ],
    facts: [
      "350 harness passes between 11 and 22 Sep 2026",
      "353 requests tracked, 321 of them certificates",
      "Pending binds re-checked every 30 minutes",
      "COI autopilot, every 10 minutes: 1,058 certificate requests tracked since 18 Aug",
    ],
    measured: "Harness state and heartbeat logs, 11–22 Sep 2026.",
    mode: "hands-on",
  },
  {
    id: "sidepanel",
    org: "Soma",
    orgNote: "AI-native US commercial insurance brokerage",
    title: "Servicing side panel",
    metric: { value: "90%", unit: "identified" },
    caption: "Inbound callers matched to their records the moment the conversation opens.",
    problem: "Reps rebuilt each caller's context by hand across policy, billing, financing and ticket systems.",
    built: "A Chrome side panel on a local CRM service that joins 11 sources and resolves a phone number to the caller's policies, financing, tickets, documents and past messages.",
    flow: [
      [{ id: "call", label: "Call or conversation opens" }],
      [{ id: "ctx", label: "Local context service", detail: "11 sources joined" }],
      [{ id: "panel", label: "Chrome side panel" }],
    ],
    facts: [
      "7,819+ lookups from 401 phone numbers, 18 Aug – 19 Sep",
      "86% of bound customers findable by phone",
      "Piloted with 2 servicing reps",
      "59 commits, sole author",
    ],
    measured: "Customer-line coverage measured over 1,066 phone numbers across 3 weeks.",
    mode: "hands-on",
  },
  {
    id: "comms",
    org: "Soma",
    orgNote: "AI-native US commercial insurance brokerage",
    title: "Client comms dispatcher",
    metric: { value: "431", unit: "texts dispatched" },
    caption: "To 258 clients over 25 dispatch days, with nobody picking the list.",
    problem: "Overdue payments were chased client by client, and every message had to land inside that client's own business hours.",
    built: "A dispatcher that decides who to contact each day, sends inside the time-zone window derived from the client's ZIP, and drops anyone whose reply shows they have paid or set up autopay.",
    flow: [
      [{ id: "due", label: "Overdue accounts" }],
      [{ id: "pick", label: "Pick today's list", detail: "36–124/day" }],
      [{ id: "window", label: "Time-zone window", detail: "by ZIP" }],
      [{ id: "send", label: "Text + email" }],
      [{ id: "reply", label: "Read replies", detail: "suppress on payment" }],
    ],
    facts: [
      "431 texts with a provider message id, to 258 accounts, 12 Aug – 11 Sep 2026",
      "25 dispatch days; the daily list ran 36–124 accounts",
      "Reply detection calibrated against 66 inbound texts",
      "A dispatcher, not a conversational agent: it decides who and when, never what to say back",
    ],
    measured: "Dispatch-window state files, 12 Aug – 11 Sep 2026.",
    mode: "hands-on",
  },
  {
    id: "losses",
    org: "FirstClub",
    orgNote: "Series B India quick-commerce",
    title: "Warehouse and store flows",
    metric: { value: "$210K", approx: true, unit: "/month" },
    caption: "Dump and in-transit losses cut.",
    problem: "Inventory was being lost to dumps and in transit between warehouses and stores.",
    built: "End-to-end inbound and outbound flows for warehouses and stores.",
    flow: [
      [{ id: "wh-in", label: "Warehouse inbound" }],
      [{ id: "wh-out", label: "Outbound" }, { id: "transit", label: "In transit" }],
      [{ id: "store", label: "Store inbound" }],
    ],
    facts: [
      "Dock-to-stock time down 30%",
      "Delivery-promise engine rebuilt: SLA breaches −50%, late tickets −10%",
      "In-store WMS live across all stores: item-missing complaints −55%",
      "MCP on the BI stack: analyst SQL time −95%",
    ],
    measured: `~₹2 Cr/month, shown at ₹${FX.inrPerUsd}/$ (${FX.date}).`,
    mode: "led",
  },
  {
    id: "waas",
    org: "Meesho",
    orgNote: "India e-commerce marketplace",
    title: "Warehousing-as-a-Service",
    metric: { from: "0", value: "50K", unit: "orders/day" },
    caption: "Taken 0 to 1 as sole PM.",
    problem: "No warehousing product existed for the marketplace's suppliers.",
    built: "Fulfilment across 3 warehouses and 400 suppliers; managed the WMS and shipping-manifest partners through every build and fix.",
    flow: [
      [{ id: "sup", label: "400 suppliers" }],
      [{ id: "wh", label: "3 warehouses", detail: "WMS partner" }],
      [{ id: "ship", label: "Manifest + shipping" }],
    ],
    facts: [
      "Order leakage cut from 40% to under 5%",
      "Speed pilot: average shipment time down 40% to 3.1 days",
      "Warehouse tab on the marketplace: 15K+ visits/day",
      "Distributed-warehousing pilot: seller cost −50%, NMV +30%",
    ],
    measured: "Resume, Apr 2024 – Dec 2025.",
    mode: "led",
  },
  {
    id: "claims",
    org: "Meesho",
    orgNote: "India e-commerce marketplace",
    title: "Refund-claims automation",
    metric: { value: "3", unit: "FTEs" },
    caption: "Manual claims work automated.",
    problem: "Orders were reconciled and refund claims filed by hand, every day.",
    built: "A Python workflow that reconciles orders daily and files refund claims automatically.",
    flow: [
      [{ id: "orders", label: "Daily orders" }],
      [{ id: "recon", label: "Reconcile" }],
      [{ id: "claim", label: "Auto-file claims" }],
    ],
    facts: ["Freed 3 FTEs of manual work", "Reconciles orders daily and files refund claims automatically"],
    measured: "Resume, Apr 2024 – Dec 2025.",
    mode: "hands-on",
  },
];

// mark: an official logo file in /public/logos. Drop a PNG or SVG in and add it here;
// an entry with no mark shows its name as a wordmark instead.
export const experience = [
  { org: "Soma", mark: "/logos/soma.png", note: "AI-native US commercial insurance brokerage", role: "Operations & automation", period: "Jul – Oct 2026" },
  { org: "FirstClub", mark: null, note: "Series B quick-commerce, India", role: "Product Manager · fulfilment, supply chain, delivery promise", period: "Dec 2025 – Jul 2026" },
  { org: "Meesho", mark: null, note: "E-commerce marketplace, India", role: "Product Manager · Warehousing-as-a-Service, sole PM", period: "Apr 2024 – Dec 2025" },
  { org: "Samsung R&D", mark: "/logos/samsung.png", note: "Bangalore", role: "APM, first-ever cohort · ML intern (patent)", period: "Jul 2022 – Apr 2024" },
] as const;

export type Reel = { src: string; poster: string; title: string };
export const reels: Reel[] = [
  { src: "/reels/perahera_text.mp4", poster: "/reels/perahera_text.jpg", title: "Perahera, Kandy" },
  { src: "/reels/dive_drift.mp4", poster: "/reels/dive_drift.jpg", title: "Drift dive" },
  { src: "/reels/art_himalayas.mp4", poster: "/reels/art_himalayas.jpg", title: "The Himalayas" },
  { src: "/reels/langkawi.mp4", poster: "/reels/langkawi.jpg", title: "Langkawi" },
];

export type Project = {
  id: string;
  title: string;
  metric: { value: string; unit: string };
  body: string;
  stack: string;
  repo: string | null;
  demo: string | null;
};

export const projects: Project[] = [
  {
    id: "mcp",
    title: "Video editing over MCP",
    metric: { value: "43", unit: "MCP tools" },
    body: "An MCP server and Blender add-on that edit the video timeline from natural language: cut, trim, slip, ripple-delete. My reels pipeline drives it end to end — footage understanding, script, edit decision list, headless render.",
    stack: "Python · MCP · Blender API",
    repo: links.mcpRepo,
    demo: null,
  },
  {
    id: "atlas",
    title: "Accelerator atlas",
    metric: { value: "7,439", unit: "companies" },
    body: "YC, EF, SPC and Speedrun scraped into one store: 1,818 founders across 81 batches, with a searchable explorer. The public demo is a sample; the full dataset is on request.",
    stack: "Python · SQLite · Next.js",
    repo: links.atlasRepo,
    demo: links.atlasDemo,
  },
  {
    id: "gbrain",
    title: "Personal ops brain",
    metric: { value: "133", unit: "bot pushes" },
    body: "A two-way Telegram bot I ran for myself from June to August 2026: journal, decisions, habits, todos and a daily question graded A to E. Retired when I moved the same brain onto an iMessage rail.",
    stack: "Python · Telegram Bot API",
    repo: null,
    demo: null,
  },
  {
    id: "quant",
    title: "Quant research stack",
    metric: { value: "1", unit: "of 25,267" },
    body: "out-of-sample strategy tests survived a 10% false-discovery-rate cut, and none cleared a Deflated Sharpe of 0.95. Backtester, tournaments and broker execution across 62 strategies.",
    stack: "Python · SQLite · Broker API",
    repo: null,
    demo: null,
  },
  {
    id: "scout",
    title: "Founder scout",
    metric: { value: "$0.90", unit: "for 862 LLM calls" },
    body: "A multi-agent pipeline that ranks startup founders from public data, with a budget cap and a human approval gate before scoring weights change.",
    stack: "Python · LLM agents · SQLite",
    repo: null,
    demo: null,
  },
];

// Things that are real but have no headline number of their own.
export const record = [
  { label: "Voice agent", body: "A carrier-call voice agent with personas, playbooks and hold-and-transfer, benchmarked against a call simulator across 8 scenarios with 51 passing tests. A prototype: it has never placed a live call." },
  { label: "Data spine", body: "One source of truth for policies and documents: 13,656 documents indexed by content, 32% duplicates removed, rebuilt every 10 minutes." },
  { label: "Patent", body: "Neural architecture search: an optimizer 20x faster than existing algorithms, patented and presented at a top-tier computer vision conference." },
] as const;

export const principles = [
  { title: "No baseline, no build.", body: "Hours, volume and error rate get measured before anything is built. The result is a before and an after, not an estimate." },
  { title: "Automate the rule. Route the exception.", body: "The repeatable path runs untouched. Anything off-pattern goes to a named person on your team, with the context attached." },
  { title: "Hand it over running.", body: "Every build ships with logging, a runbook and an owner on your side. It keeps running after I leave." },
] as const;

export const offers = [
  { step: "Diagnose", title: "Operations Audit", meta: "2 weeks · fixed diagnostic", body: "I map the manual work in one function, measure hours and volume per workflow, and rank what to automate by hours returned.", gets: ["Workflow map with baseline numbers", "Ranked automation backlog", "Scope for the first sprint"] },
  { step: "Build", title: "Automation Sprint", meta: "Fixed scope", body: "One workflow from the ranked backlog: built, measured against its baseline, and handed to your team.", gets: ["The system, running in production", "Before-and-after numbers", "Runbook and a named owner"] },
  { step: "Run", title: "Fractional Retainer", meta: "Monthly", body: "I own your ops-automation backlog: ship the next build, keep live systems running, and report against baseline each month.", gets: ["Builds shipped off the ranked backlog", "Live systems monitored and maintained", "Monthly report against baseline"] },
] as const;

// Only rendered once real quotes exist. Never add a placeholder here.
export const testimonials: { quote: string; name: string; title: string; org: string }[] = [];
