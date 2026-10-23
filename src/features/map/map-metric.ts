import type { CountrySummary } from '@/shared/api/types';

export const mapMetrics = ['cases', 'deaths', 'casesPerMillion'] as const;
export type MapMetric = (typeof mapMetrics)[number];

export const metricColors: Record<MapMetric, { fill: string; stroke: string }> = {
  cases: { fill: 'var(--accent)', stroke: 'var(--accent-text)' },
  deaths: { fill: 'var(--deaths)', stroke: 'var(--deaths)' },
  casesPerMillion: { fill: 'var(--active)', stroke: 'var(--active)' },
};

export const metricBreakpoints: Record<MapMetric, [number, number]> = {
  cases: [100_000, 1_000_000],
  deaths: [1_000, 10_000],
  casesPerMillion: [10_000, 100_000],
};

export function metricValue(country: CountrySummary, metric: MapMetric): number {
  return country[metric] ?? 0;
}
