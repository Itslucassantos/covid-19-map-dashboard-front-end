export interface CountrySummary {
  iso2: string;
  name: string;
  lat: number;
  lng: number;
  cases: number;
  deaths: number;
  recovered: number | null;
  active: number | null;
  todayCases: number;
  todayDeaths: number;
  casesPerMillion: number | null;
}

export interface Country extends CountrySummary {
  iso3: string;
  population: number | null;
  deathsPerMillion: number | null;
  updatedAt: string | null;
}

export interface GlobalStats {
  cases: number;
  deaths: number;
  recovered: number | null;
  active: number | null;
  todayCases: number;
  todayDeaths: number;
  affectedCountries: number;
  updatedAt: string | null;
}

export interface HistoryPoint {
  date: string;
  cases: number;
  deaths: number;
  newCases: number;
  newDeaths: number;
}

export interface CountryListResponse {
  countries: CountrySummary[];
}

export interface GlobalHistoryResponse {
  history: HistoryPoint[];
}

export interface CountryHistoryResponse extends GlobalHistoryResponse {
  iso2: string;
}

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'COUNTRY_NOT_FOUND'
  | 'RATE_LIMITED'
  | 'UPSTREAM_UNAVAILABLE'
  | 'INTERNAL_ERROR'
  | 'NETWORK_ERROR';
