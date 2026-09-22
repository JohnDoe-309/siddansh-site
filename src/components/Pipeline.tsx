// Hero illustration of the servicing harness: intake → task-type lane → agent + skill → read-back.
// The motion is illustrative; the totals under it are measured.

const LANES = [
  { label: "Certificate (COI)", y: 34 },
  { label: "Cancellation letter", y: 80 },
  { label: "Surplus-lines form", y: 126 },
  { label: "Binder packet", y: 172 },
  { label: "Payment status", y: 218 },
];

const IN = { x: 96, y: 126 };
const LANE_X0 = 150;
const LANE_X1 = 290;
const OUT = { x: 340, y: 126 };

function lanePath(y: number) {
  return `M${IN.x},${IN.y} C${IN.x + 30},${IN.y} ${LANE_X0 - 30},${y} ${LANE_X0},${y} H${LANE_X1} C${LANE_X1 + 26},${y} ${OUT.x - 26},${OUT.y} ${OUT.x},${OUT.y}`;
}

export function Pipeline() {
  return (
    <div className="panel overflow-hidden">
      <div className="panel-head">
        <span className="label flex items-center gap-2 text-muted">
          <span className="live-dot" aria-hidden="true" />
          Servicing harness
        </span>
        <span className="label">Soma · 11–22 Sep 2026</span>
      </div>

      <svg viewBox="0 0 440 252" className="block w-full" role="img" aria-label="Diagram: servicing requests arrive from Slack intake, are routed to one of five task types, handled by an AI agent with the matching skill, and every write is read back before it counts as done.">
        <defs>
          <linearGradient id="lane" x1="0" x2="1">
            <stop offset="0" stopColor="#30353d" />
            <stop offset="1" stopColor="#22262d" />
          </linearGradient>
        </defs>

        {LANES.map((lane) => (
          <path key={lane.label} d={lanePath(lane.y)} fill="none" stroke="url(#lane)" strokeWidth="1.25" />
        ))}

        <g>
          <rect x="12" y={IN.y - 24} width={IN.x - 12} height="48" rx="6" fill="#151820" stroke="#30353d" />
          <text x={(12 + IN.x) / 2} y={IN.y - 3} textAnchor="middle" className="fill-bright" style={{ font: "600 12px var(--font-sans)" }}>Intake</text>
          <text x={(12 + IN.x) / 2} y={IN.y + 13} textAnchor="middle" className="fill-dim" style={{ font: "500 9.5px var(--font-mono)", letterSpacing: ".08em" }}>SLACK</text>
        </g>

        {LANES.map((lane) => (
          <g key={lane.label}>
            <rect x={LANE_X0} y={lane.y - 15} width={LANE_X1 - LANE_X0} height="30" rx="15" fill="#0f1115" stroke="#30353d" />
            <text x={(LANE_X0 + LANE_X1) / 2} y={lane.y + 4} textAnchor="middle" className="fill-text" style={{ font: "500 11.5px var(--font-sans)" }}>{lane.label}</text>
          </g>
        ))}

        <g>
          <rect x={OUT.x} y={OUT.y - 38} width="88" height="76" rx="6" fill="#151820" stroke="#30353d" />
          <text x={OUT.x + 44} y={OUT.y - 12} textAnchor="middle" className="fill-bright" style={{ font: "600 12px var(--font-sans)" }}>AI agent</text>
          <text x={OUT.x + 44} y={OUT.y + 3} textAnchor="middle" className="fill-dim" style={{ font: "500 9.5px var(--font-mono)", letterSpacing: ".08em" }}>+ SKILL</text>
          <g className="stage-tick">
            <circle cx={OUT.x + 22} cy={OUT.y + 22} r="7" fill="none" stroke="#7ce0b0" strokeWidth="1.25" />
            <path d={`M${OUT.x + 18.5},${OUT.y + 22} l2.5,2.5 l4.5,-5`} fill="none" stroke="#7ce0b0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <text x={OUT.x + 34} y={OUT.y + 25.5} className="fill-ok" style={{ font: "500 9px var(--font-mono)", letterSpacing: ".06em" }}>READ</text>
          </g>
        </g>

        <g className="packets" aria-hidden="true">
          {LANES.flatMap((lane, i) =>
            [0, 1].map((k) => {
              const dur = 3.4 + (i % 3) * 0.35;
              const begin = `${(i * 0.62 + k * (dur / 2)).toFixed(2)}s`;
              return (
                <circle key={`${lane.label}-${k}`} r="3.25" fill="#f5c26b" opacity="0">
                  <animateMotion dur={`${dur}s`} begin={begin} repeatCount="indefinite" path={lanePath(lane.y)} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".45 0 .55 1" />
                  <animate attributeName="opacity" dur={`${dur}s`} begin={begin} repeatCount="indefinite" values="0;1;1;0" keyTimes="0;.08;.9;1" />
                  <animate attributeName="fill" dur={`${dur}s`} begin={begin} repeatCount="indefinite" values="#f5c26b;#f5c26b;#7ce0b0" keyTimes="0;.82;1" />
                </circle>
              );
            }),
          )}
        </g>
      </svg>

      <dl className="grid grid-cols-3 border-t border-line">
        {[
          { v: "1,348", k: "verified writes" },
          { v: "353", k: "requests routed" },
          { v: "350", k: "harness passes" },
        ].map((s, i) => (
          <div key={s.k} className={`flex flex-col-reverse px-4 py-3 ${i ? "border-l border-line" : ""}`}>
            <dt className="label mt-1.5 !text-[.625rem]">{s.k}</dt>
            <dd className="num text-bright text-[clamp(1.25rem,4vw,1.625rem)] leading-none tabular">{s.v}</dd>
          </div>
        ))}
      </dl>
      <p className="px-4 pb-3 text-[.8125rem] text-dim">Motion is illustrative. The three totals are measured from the harness logs.</p>
    </div>
  );
}
