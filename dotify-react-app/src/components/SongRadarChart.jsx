/**
 * SongRadarChart component to display audio features as a radar chart using Recharts + shadcn-style ChartContainer
 * (pattern from https://ui.shadcn.com/docs/components/chart , inlined to avoid extra modules)
 *
 * @param {Object} values — feature scores 0-100
 * @param {number} [values.danceability]
 * @param {number} [values.energy]
 * @param {number} [values.speechiness]
 * @param {number} [values.acousticness]
 * @param {number} [values.liveness]
 * @param {number} [values.valence]
 */

import * as React from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const INITIAL_DIMENSION = { width: 320, height: 280 }; // default chart dimensions

// radar chart axes configuration
const AXES = [
  { key: "danceability", label: "Danceability" },
  { key: "energy", label: "Energy" },
  { key: "speechiness", label: "Speechiness" },
  { key: "acousticness", label: "Acousticness" },
  { key: "liveness", label: "Liveness" },
  { key: "valence", label: "Valence" },
];

/**
 * utility function to merge class names
 * 
 * @param {string} id - unique chart identifier
 * @param {Object} config - chart color configuration

 */
function cn(...inputs) {
  return inputs.flat().filter((x) => typeof x === "string" && x).join(" ");
}

/**
 * injects dynamic CSS variables for chart theming
 * 
 * @param {*} param0 
 * @returns 
 */
function ChartStyle({ id, config }) {
  const css = Object.entries(config)
    .map(([key, itemConfig]) => {
      return itemConfig.color ? `--color-${key}: ${itemConfig.color};` : "";
    })
    .join("\n");

  return (
    <style dangerouslySetInnerHTML={{ __html: `[data-chart=${id}] { ${css} }`, }}/>
  );
}

/**
 * ChartContainer Component to wrap recharts with responsive layout and consistent styling
 * 
 * @param {string} id - optional chart ID
 * @param {string} className - additional styling classes
 * @param {React.ReactNode} children - chart content
 * @param {Object} config - theme configuration
 * @param {Object} initialDimension - default width/height
 */
function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;

  return (
    <div
      data-slot="chart"
      data-chart={chartId}
      className={cn(
        "flex aspect-square justify-center text-xs outline-hidden",
        "[&_.recharts-polar-grid]:stroke-[color-mix(in_srgb,var(--dark)_14%,transparent)]",
        "[&_.recharts-polar-angle-axis-tick-value]:fill-[var(--dark)] [&_.recharts-polar-angle-axis-tick-value]:text-[11px] [&_.recharts-polar-angle-axis-tick-value]:font-semibold",
        "[&_.recharts-polar-radius-axis-tick-value]:fill-[var(--muted)] [&_.recharts-polar-radius-axis-tick-value]:text-[10px]",
        className
      )}
      {...props}
    >
      <ChartStyle id={chartId} config={config} />

      <ResponsiveContainer initialDimension={initialDimension}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

/**
 * custom tooltip for radar chart to display metric name and formatted percentage score
 */
function RadarTooltipContent({ active, payload }) {
  if (!active || !payload?.length) return null;

  const row = payload[0]?.payload;
  const score = payload[0]?.value;

  if (!row) return null;

  return (
    <div className="grid min-w-[8rem] gap-1 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl bg-white text-[var(--text)]">
      <div className="font-medium">{row.metric}</div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-gray-500">Intensity</span>
        <span className="font-mono font-medium tabular-nums">
          {typeof score === "number" ? `${Math.round(score)}%` : score}
        </span>
      </div>
    </div>
  );
}

/**
 * chart configuration
 */
const chartConfig = {
  score: {
    label: "Intensity",
    color: "var(--accent)",
  },
};

/**
 * main SongRadarChart component
 */
function SongRadarChart({ values }) {
  const chartData = React.useMemo(
    () =>
      AXES.map((a) => ({
        metric: a.label,
        score: Math.min(100, Math.max(0, Number(values?.[a.key]) || 0)),
      })),
    [values]
  );

  return (
    <div className="w-full max-w-[20rem] mx-auto">
      <ChartContainer
        config={chartConfig}
        className="mx-auto min-h-[280px] w-full max-w-[20rem]"
      >
        <RadarChart cx="50%" cy="50%" outerRadius="78%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            ticks={[20, 40, 60, 80, 100]}
          />

          <Tooltip cursor={false} content={<RadarTooltipContent />} />

          <Radar
            dataKey="score"
            fill="var(--color-score)"
            fillOpacity={0.35}
            stroke="var(--color-score)"
            strokeWidth={2}
          />
        </RadarChart>
      </ChartContainer>

      <p className="text-center text-xs text-[var(--muted)] mt-2 opacity-80">
        Rings from center: 20%, 40%, 60%, 80%, outer edge 100%
      </p>
    </div>
  );
}

export default SongRadarChart;
