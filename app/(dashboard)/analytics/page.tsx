import { PageHeader } from "@/components/ui/PageHeader";
import { MetricChart } from "@/components/analytics/MetricChart";
import { getAnalyticsSeries, ANALYTICS_METRICS } from "@/lib/data/analytics";

export default async function AnalyticsPage() {
  const series = await Promise.all(ANALYTICS_METRICS.map((metric) => getAnalyticsSeries(metric)));

  return (
    <>
      <PageHeader title="Analytics" description="Operational trends over the last 12 data points" />

      <div className="rounded-[var(--radius-ticket)] border border-signal-info/25 bg-signal-info/5 px-4 py-3 text-sm text-ink-muted">
        These series come from the backend&apos;s <code className="font-mono text-xs">DailyMetric</code> table, which is
        only populated by an external <code className="font-mono text-xs">npm run jobs:daily-metrics</code> cron script —
        if that job hasn&apos;t run, the real endpoint returns an empty series.
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {series.map((item) => (
          <div key={item.metric} className="rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="font-display text-base text-ink">{item.label}</h2>
            </div>
            <p className="mb-3 text-xs text-ink-muted">{item.narrative}</p>
            <MetricChart series={item.series} metric={item.metric} />
          </div>
        ))}
      </div>
    </>
  );
}
