// Spider chart for 6 audio traits (0–100)
const AXES = [
  { key: "danceability", label: "Danceability" },
  { key: "energy", label: "Energy" },
  { key: "speechiness", label: "Speechiness" },
  { key: "acousticness", label: "Acousticness" },
  { key: "liveness", label: "Liveness" },
  { key: "valence", label: "Valence" },
];

const GRID_LEVELS = [20, 40, 60, 80, 100];

function SongRadarChart({ values }) {
  const cx = 160;
  const cy = 160;
  const R = 100;
  const labelR = R + 36;

  function point(axisIndex, percent) {
    const angle = -Math.PI / 2 + (axisIndex * 2 * Math.PI) / AXES.length;
    const r = (Math.min(100, Math.max(0, percent)) / 100) * R;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  const dataPoints = AXES.map((a, i) =>
    point(i, values?.[a.key] ?? 0)
  );
  const dataStr = dataPoints.map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <div className="w-full max-w-[20rem] mx-auto">
      <svg viewBox="0 0 320 320" className="w-full h-auto" aria-hidden>
        {GRID_LEVELS.map((pct) => {
          const pts = AXES.map((_, i) => {
            const [x, y] = point(i, pct);
            return `${x},${y}`;
          }).join(" ");
          return (
            <polygon
              key={pct}
              points={pts}
              fill="none"
              stroke="var(--dark)"
              strokeOpacity={0.12}
              strokeWidth={1}
            />
          );
        })}
        {AXES.map((_, i) => {
          const [x, y] = point(i, 100);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="var(--dark)"
              strokeOpacity={0.15}
              strokeWidth={1}
            />
          );
        })}
        <polygon
          points={dataStr}
          fill="var(--accent)"
          fillOpacity={0.35}
          stroke="var(--accent)"
          strokeWidth={2}
        />
        {AXES.map((a, i) => {
          const angle = -Math.PI / 2 + (i * 2 * Math.PI) / AXES.length;
          const lx = cx + labelR * Math.cos(angle);
          const ly = cy + labelR * Math.sin(angle);
          const anchor =
            Math.abs(Math.cos(angle)) < 0.2
              ? "middle"
              : Math.cos(angle) > 0
                ? "start"
                : "end";
          const baseline = Math.sin(angle) > 0.35 ? "hanging" : "auto";
          return (
            <text
              key={a.key}
              x={lx}
              y={ly}
              textAnchor={anchor}
              dominantBaseline={baseline}
              fill="var(--dark)"
              fontSize="10"
              fontWeight="600"
            >
              {a.label}
            </text>
          );
        })}
      </svg>
      <p className="text-center text-xs text-[var(--muted)] mt-2 opacity-80">
        Rings from center: 20%, 40%, 60%, 80%, outer edge 100%
      </p>
    </div>
  );
}

export default SongRadarChart;
