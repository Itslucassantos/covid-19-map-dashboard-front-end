import { queryOptions } from '@tanstack/react-query';
import { http } from './http-client';
import type {
  Country,
  CountryHistoryResponse,
  CountryListResponse,
  GlobalHistoryResponse,
  GlobalStats,
} from './types';

export const covidQueries = {
  global: () =>
    queryOptions({
      queryKey: ['global'],
      queryFn: ({ signal }) => http<GlobalStats>('/global', signal),
    }),
  globalHistory: (days = 30) =>
    queryOptions({
      queryKey: ['global', 'history', days],
      queryFn: ({ signal }) => http<GlobalHistoryResponse>(`/global/history?days=${days}`, signal),
    }),
  countries: () =>
    queryOptions({
      queryKey: ['countries'],
      queryFn: ({ signal }) => http<CountryListResponse>('/countries', signal),
      select: (data) => data.countries,
    }),
  country: (iso2: string) =>
    queryOptions({
      queryKey: ['countries', iso2],
      queryFn: ({ signal }) => http<Country>(`/countries/${iso2}`, signal),
    }),
  countryHistory: (iso2: string, days = 30) =>
    queryOptions({
      queryKey: ['countries', iso2, 'history', days],
      queryFn: ({ signal }) =>
        http<CountryHistoryResponse>(`/countries/${iso2}/history?days=${days}`, signal),
    }),
};
