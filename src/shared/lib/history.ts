import type { HistoryPoint } from '@/shared/api/types';

export interface PeriodTotals {
  newCases: number;
  newDeaths: number;
}

export interface PeriodComparison {
  current: PeriodTotals;
  previous: PeriodTotals | null;
}

function sum(points: HistoryPoint[]): PeriodTotals {
  return points.reduce(
    (total, point) => ({
      newCases: total.newCases + point.newCases,
      newDeaths: total.newDeaths + point.newDeaths,
    }),
    { newCases: 0, newDeaths: 0 },
  );
}

export function comparePeriods(history: HistoryPoint[], days: number): PeriodComparison {
  const current = history.slice(-days);
  const previous = history.slice(-days * 2, -days);
  return { current: sum(current), previous: previous.length > 0 ? sum(previous) : null };
}

export function percentChange(current: number, previous: number | undefined): number | null {
  if (!previous) return null;
  return (current - previous) / previous;
}

export function movingAverage(values: number[], window: number): number[] {
  return values.map((_, index) => {
    const slice = values.slice(Math.max(0, index - window + 1), index + 1);
    return slice.reduce((total, value) => total + value, 0) / slice.length;
  });
}

export interface GrowthPoint {
  date: string;
  country: number | null;
  global: number | null;
}

export function buildGrowthSeries(
  country: HistoryPoint[] | undefined,
  global: HistoryPoint[],
): GrowthPoint[] {
  const globalMax = global.at(-1)?.cases ?? 0;
  const scale = country && globalMax > 0 ? (country.at(-1)?.cases ?? 0) / globalMax : 1;
  const countryByDate = new Map(country?.map((point) => [point.date, point.cases]));

  return global.map((point) => ({
    date: point.date,
    country: country ? (countryByDate.get(point.date) ?? null) : null,
    global: point.cases * scale,
  }));
}

export interface DailyPoint {
  date: string;
  value: number;
  average: number;
}

export function buildDailySeries(history: HistoryPoint[], window = 7): DailyPoint[] {
  const averages = movingAverage(
    history.map((point) => point.newCases),
    window,
  );
  return history.map((point, index) => ({
    date: point.date,
    value: point.newCases,
    average: averages[index],
  }));
}
