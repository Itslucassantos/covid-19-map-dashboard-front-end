import type { Country, CountrySummary, GlobalStats, HistoryPoint } from '@/shared/api/types';

type Handler = unknown | ((url: URL) => unknown);
export type ApiRoutes = Record<string, Handler>;

export class MockApiError {
  constructor(
    readonly code: string,
    readonly status: number,
  ) {}
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function mockApi(routes: ApiRoutes) {
  const fetchMock = vi.fn((input: string) => {
    const url = new URL(input);
    const key = url.pathname.replace(/^\/api/, '');
    if (!(key in routes)) return Promise.resolve(json({ error: { code: 'INTERNAL_ERROR' } }, 500));
    const handler = routes[key];
    const result = typeof handler === 'function' ? handler(url) : handler;
    if (result instanceof MockApiError) {
      return Promise.resolve(json({ error: { code: result.code } }, result.status));
    }
    return Promise.resolve(json(result));
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

export function networkDown() {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
}

export const globalStats: GlobalStats = {
  cases: 1000,
  deaths: 50,
  recovered: null,
  active: null,
  todayCases: 7,
  todayDeaths: 1,
  affectedCountries: 42,
  updatedAt: '2023-03-09T00:00:00.000Z',
};

export const brazilSummary: CountrySummary = {
  iso2: 'BR',
  name: 'Brazil',
  lat: -10,
  lng: -55,
  cases: 250,
  deaths: 10,
  recovered: null,
  active: null,
  todayCases: 3,
  todayDeaths: 0,
  casesPerMillion: 1170,
};

export const brazil: Country = {
  ...brazilSummary,
  iso3: 'BRA',
  population: 214_000_000,
  deathsPerMillion: 46,
  updatedAt: '2023-03-09T00:00:00.000Z',
};

export function history(days: number, newCases = 10): HistoryPoint[] {
  return Array.from({ length: days }, (_, index) => ({
    date: new Date(Date.UTC(2023, 0, 1 + index)).toISOString().slice(0, 10),
    cases: (index + 1) * newCases,
    deaths: index + 1,
    newCases,
    newDeaths: 1,
  }));
}

export function daysOf(url: URL): number {
  return Number(url.searchParams.get('days'));
}
