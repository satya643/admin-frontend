import type { AnalyticsMetric, AnalyticsSeries } from "@/types/analytics";
import { apiFetch } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";

export const ANALYTICS_METRICS: AnalyticsMetric[] = ["utilization", "revenue", "turnaround", "overdue"];

// Mirrors GET /console/analytics/:metric. Depends entirely on the backend's
// external `npm run jobs:daily-metrics` cron having populated DailyMetric —
// if it hasn't, the real endpoint returns an empty series (not an error).
export async function getAnalyticsSeries(metric: AnalyticsMetric): Promise<AnalyticsSeries> {
  const token = await getToken();
  return apiFetch<AnalyticsSeries>(`/console/analytics/${metric}`, { token: token ?? undefined });
}
