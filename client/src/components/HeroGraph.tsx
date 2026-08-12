// Illustrative, not data-driven: a small three-column graph (person → skills →
// jobs) that makes the app's core idea legible before a single API call
// returns anything. Real, data-driven graphs render further down the page.
const PERSON = { x: 40, y: 100 };
const SKILLS = [
  { x: 190, y: 30, label: "React" },
  { x: 190, y: 100, label: "TypeScript" },
  { x: 190, y: 170, label: "Node.js" },
];
const JOBS = [
  { x: 340, y: 15, label: "Frontend Engineer" },
  { x: 340, y: 65, label: "Full Stack Dev" },
  { x: 340, y: 135, label: "Backend Engineer" },
  { x: 340, y: 185, label: "DevOps Engineer" },
];
const JOB_LINKS = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
  [1, 2],
  [2, 1],
  [2, 2],
  [2, 3],
];

export function HeroGraph() {
  return (
    <svg
      viewBox="0 0 380 210"
      className="h-auto w-full max-w-md"
      role="img"
      aria-label="Diagram: a person's skills connecting through the graph to matching jobs"
    >
      {SKILLS.map((s, i) => (
        <line
          key={`ps-${i}`}
          x1={PERSON.x}
          y1={PERSON.y}
          x2={s.x}
          y2={s.y}
          stroke="#F2A65A"
          strokeWidth={1.5}
          className="thread"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
      {JOB_LINKS.map(([si, ji], i) => (
        <line
          key={`sj-${i}`}
          x1={SKILLS[si].x}
          y1={SKILLS[si].y}
          x2={JOBS[ji].x}
          y2={JOBS[ji].y}
          stroke="#5FD4C0"
          strokeWidth={1}
          className="thread"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}

      <circle cx={PERSON.x} cy={PERSON.y} r={9} fill="#F2A65A" />
      <text x={PERSON.x} y={PERSON.y + 24} textAnchor="middle" className="fill-graphite-100" fontSize="10" fontFamily="Inter">
        You
      </text>

      {SKILLS.map((s, i) => (
        <g key={`skill-${i}`}>
          <circle cx={s.x} cy={s.y} r={6} fill="#171C26" stroke="#F2A65A" strokeWidth={1.5} />
          <text x={s.x} y={s.y - 12} textAnchor="middle" className="fill-graphite-400" fontSize="8.5" fontFamily="JetBrains Mono">
            {s.label}
          </text>
        </g>
      ))}

      {JOBS.map((j, i) => (
        <g key={`job-${i}`}>
          <circle cx={j.x} cy={j.y} r={5} fill="#5FD4C0" />
          <text x={j.x + 10} y={j.y + 3} textAnchor="start" className="fill-graphite-100" fontSize="9" fontFamily="Inter">
            {j.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
