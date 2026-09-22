"use client";

import { useId, useState } from "react";
import type { AnalyticsMetric, AnalyticsSeriesPoint } from "@/types/analytics";
import { formatDate, formatPaise } from "@/lib/utils/format";

// Server Components can't pass functions as props to Client Components, so
// formatting is keyed off the serializable `metric` string instead of a
// valueFormatter callback.
const FORMATTERS: Record<AnalyticsMetric, (value: number) => string> = {
  utilization: (v) => `${Math.round(v)}%`,
  revenue: (v) => formatPaise(v * 100),
  turnaround: (v) => `${Math.round(v)}h`,
  overdue: (v) => `${Math.round(v)}`,
};

const WIDTH = 480;
const HEIGHT = 160;
const PAD_X = 12;
const PAD_TOP = 16;
const PAD_BOTTOM = 24;

const LINE_COLOR = "#8a5f16"; // brand-gold-deep — clears 4.5:1 on cream, same token used for active nav state
const FILL_COLOR = "rgba(138, 95, 22, 0.08)";

export function MetricChart({ series, metric }: { series: AnalyticsSeriesPoint[]; metric: AnalyticsMetric }) {
  const gridId = useId();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const valueFormatter = FORMATTERS[metric];

  if (series.length === 0) {
    return <p className="py-8 text-center text-sm text-ink-muted">No data yet.</p>;
  }

  const values = series.map((point) => point.value);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const range = max - min || 1;

  const plotWidth = WIDTH - PAD_X * 2;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const points = series.map((point, index) => {
    const x = PAD_X + (index / Math.max(1, series.length - 1)) * plotWidth;
    const y = PAD_TOP + plotHeight - ((point.value - min) / range) * plotHeight;
    return { x, y, point };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${PAD_TOP + plotHeight} L ${points[0].x.toFixed(1)} ${PAD_TOP + plotHeight} Z`;

  const hovered = hoverIndex !== null ? points[hoverIndex] : null;

  function onMove(event: React.MouseEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = ((event.clientX - rect.left) / rect.width) * WIDTH;
    const nearest = points.reduce((closest, p, index) => {
      const currentDist = Math.abs(p.x - relativeX);
      const closestDist = Math.abs(points[closest].x - relativeX);
      return currentDist < closestDist ? index : closest;
    }, 0);
    setHoverIndex(nearest);
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Line chart"
        onMouseMove={onMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <line x1={PAD_X} y1={PAD_TOP + plotHeight} x2={WIDTH - PAD_X} y2={PAD_TOP + plotHeight} stroke="var(--color-rule)" strokeWidth={1} />

        <defs>
          <clipPath id={gridId}>
            <rect x={PAD_X} y={PAD_TOP} width={plotWidth} height={plotHeight} />
          </clipPath>
        </defs>

        <path d={areaPath} fill={FILL_COLOR} clipPath={`url(#${gridId})`} />
        <path d={linePath} fill="none" stroke={LINE_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {points.length > 0 ? (
          <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={3} fill={LINE_COLOR} />
        ) : null}

        {hovered ? (
          <>
            <line x1={hovered.x} y1={PAD_TOP} x2={hovered.x} y2={PAD_TOP + plotHeight} stroke="var(--color-rule-strong)" strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={hovered.x} cy={hovered.y} r={4} fill={LINE_COLOR} stroke="var(--color-paper-raised)" strokeWidth={2} />
          </>
        ) : null}
      </svg>

      {hovered ? (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-[var(--radius-chip)] border border-rule bg-paper-raised px-2 py-1 text-xs shadow-md"
          style={{ left: `${(hovered.x / WIDTH) * 100}%` }}
        >
          <p className="font-medium text-ink">{valueFormatter(hovered.point.value)}</p>
          <p className="text-ink-muted">{formatDate(hovered.point.date)}</p>
        </div>
      ) : null}

      <table className="sr-only">
        <caption>Metric values by date</caption>
        <thead>
          <tr>
            <th>Date</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {series.map((point) => (
            <tr key={point.date}>
              <td>{point.date}</td>
              <td>{valueFormatter(point.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
