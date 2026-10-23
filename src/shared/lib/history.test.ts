import type { HistoryPoint } from '@/shared/api/types';
import {
  buildDailySeries,
  buildGrowthSeries,
  comparePeriods,
  movingAverage,
  percentChange,
} from './history';

function point(newCases: number, newDeaths = 0): HistoryPoint {
  return { date: '2023-01-01', cases: 0, deaths: 0, newCases, newDeaths };
}

describe('comparePeriods', () => {
  const history = [point(1), point(2), point(3), point(4), point(5, 1), point(6, 2)];

  it('sums the last N days and the N days before', () => {
    expect(comparePeriods(history, 2)).toEqual({
      current: { newCases: 11, newDeaths: 3 },
      previous: { newCases: 7, newDeaths: 0 },
    });
  });

  it('returns a null previous period when there is no earlier data', () => {
    expect(comparePeriods(history, 6).previous).toBeNull();
  });
});

describe('percentChange', () => {
  it('computes the relative change', () => {
    expect(percentChange(110, 100)).toBeCloseTo(0.1);
  });

  it('returns null without a baseline', () => {
    expect(percentChange(10, 0)).toBeNull();
    expect(percentChange(10, undefined)).toBeNull();
  });
});

describe('movingAverage', () => {
  it('averages over the trailing window', () => {
    expect(movingAverage([2, 4, 6, 8], 2)).toEqual([2, 3, 5, 7]);
  });
});

describe('buildGrowthSeries', () => {
  const day = (date: string, cases: number): HistoryPoint => ({
    date,
    cases,
    deaths: 0,
    newCases: 0,
    newDeaths: 0,
  });

  it('scales the global curve to the latest country value', () => {
    const country = [day('2023-01-01', 10), day('2023-01-02', 20)];
    const global = [day('2023-01-01', 100), day('2023-01-02', 200)];
    expect(buildGrowthSeries(country, global)).toEqual([
      { date: '2023-01-01', country: 10, global: 10 },
      { date: '2023-01-02', country: 20, global: 20 },
    ]);
  });

  it('keeps the global curve unscaled without a country', () => {
    const global = [day('2023-01-01', 100)];
    expect(buildGrowthSeries(undefined, global)).toEqual([
      { date: '2023-01-01', country: null, global: 100 },
    ]);
  });
});

describe('buildDailySeries', () => {
  it('pairs each day with its trailing average', () => {
    const series = buildDailySeries([point(2), point(4), point(6)], 2);
    expect(series.map((entry) => entry.average)).toEqual([2, 3, 5]);
  });
});
