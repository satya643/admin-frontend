export type AnalyticsMetric = "utilization" | "revenue" | "turnaround" | "overdue";

export interface AnalyticsSeriesPoint {
  date: string;
  value: number;
}

export interface AnalyticsSeries {
  metric: AnalyticsMetric;
  label: string;
  series: AnalyticsSeriesPoint[];
  narrative: string;
}
