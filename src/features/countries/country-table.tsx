import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { covidQueries } from '@/shared/api/queries';
import { useApiErrorMessage } from '@/shared/api/use-api-error-message';
import type { CountrySummary } from '@/shared/api/types';
import { countryDisplayName } from '@/shared/lib/country-name';
import { formatNumber } from '@/shared/lib/format';
import { CachedNotice } from '@/shared/ui/cached-notice';
import { ErrorState } from '@/shared/ui/error-state';
import { Skeleton } from '@/shared/ui/skeleton';

type SortKey = 'name' | 'cases' | 'deaths' | 'casesPerMillion';
type SortDirection = 'asc' | 'desc';

const COLUMNS: SortKey[] = ['name', 'cases', 'deaths', 'casesPerMillion'];
const PAGE_SIZE = 10;

function compare(a: CountrySummary, b: CountrySummary, key: Exclude<SortKey, 'name'>) {
  return (a[key] ?? -1) - (b[key] ?? -1);
}

export function CountryTable() {
  const { t, i18n } = useTranslation();
  const errorMessage = useApiErrorMessage();
  const { iso2 } = useParams();
  const selectedIso2 = iso2?.toUpperCase();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'cases',
    direction: 'desc',
  });
  const { data, error, dataUpdatedAt, refetch } = useQuery({
    ...covidQueries.countries(),
    enabled: open,
  });

  const rows = useMemo(() => {
    if (!data) return [];
    const names = new Map(
      data.map((country) => [
        country.iso2,
        countryDisplayName(country.iso2, country.name, i18n.language),
      ]),
    );
    const factor = sort.direction === 'asc' ? 1 : -1;
    return data
      .map((country) => ({ country, name: names.get(country.iso2) ?? country.name }))
      .sort((a, b) =>
        sort.key === 'name'
          ? factor * a.name.localeCompare(b.name, i18n.language)
          : factor * compare(a.country, b.country, sort.key),
      );
  }, [data, sort, i18n.language]);

  const maxCases = useMemo(
    () => Math.max(0, ...(data ?? []).map((country) => country.cases)),
    [data],
  );

  const toggleSort = (key: SortKey) =>
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: key === 'name' ? 'asc' : 'desc' },
    );

  return (
    <details
      className="rounded-[20px] border border-border bg-surface px-[22px] py-4"
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary className="cursor-pointer text-[13px] font-semibold text-muted">
        {t('countries.title')}
      </summary>
      {open && error && !data && (
        <div className="mt-3">
          <ErrorState message={errorMessage(error)} onRetry={() => void refetch()} />
        </div>
      )}
      {open && !data && !error && <Skeleton className="mt-3 h-40" />}
      {open && data && (
        <div className="thin-scroll mx-auto mt-3 hidden max-h-[28rem] max-w-4xl overflow-auto rounded-xl border border-border md:block">
          <table className="w-full table-fixed text-left text-sm">
            <caption className="sr-only">{t('countries.caption')}</caption>
            <colgroup>
              <col className="w-14" />
              <col />
              <col className="w-40" />
              <col className="w-32" />
              <col className="w-40" />
            </colgroup>
            <thead className="sticky top-0 z-10 bg-surface shadow-[0_1px_0_var(--border)]">
              <tr>
                <th scope="col" className="py-3 pl-4 text-xs font-semibold text-muted">
                  <span aria-hidden>#</span>
                  <span className="sr-only">{t('countries.rank')}</span>
                </th>
                {COLUMNS.map((key) => {
                  const active = sort.key === key;
                  return (
                    <th
                      key={key}
                      scope="col"
                      aria-sort={
                        active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'
                      }
                      className={`py-3 text-xs font-semibold ${key === 'name' ? '' : 'pr-4 text-right'}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleSort(key)}
                        className={`cursor-pointer font-semibold hover:text-fg ${
                          active ? 'text-accent-text' : 'text-muted'
                        }`}
                      >
                        {t(key === 'name' ? 'countries.name' : `stats.${key}`)}
                        {active && <span aria-hidden> {sort.direction === 'asc' ? '▲' : '▼'}</span>}
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ country, name }, index) => (
                <tr
                  key={country.iso2}
                  className={`border-t border-border hover:bg-bg ${
                    country.iso2 === selectedIso2 ? 'bg-accent-soft hover:bg-accent-soft' : ''
                  }`}
                >
                  <td className="tabular py-2.5 pl-4 text-xs text-muted">{index + 1}</td>
                  <th scope="row" className="truncate py-2.5 pr-3 font-semibold">
                    <Link to={`/country/${country.iso2}`} className="hover:text-accent-text">
                      {name}
                    </Link>
                  </th>
                  <CasesCell value={country.cases} max={maxCases} />
                  <Cell value={country.deaths} />
                  <Cell value={country.casesPerMillion} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {open && data && (
        <div className="mt-3 md:hidden">
          <div role="group" aria-label={t('countries.sortBy')} className="flex flex-wrap gap-2">
            {COLUMNS.map((key) => {
              const active = sort.key === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleSort(key)}
                  className={`h-9 cursor-pointer rounded-[10px] px-3 text-xs font-bold ${
                    active ? 'bg-accent text-white' : 'border border-border text-muted'
                  }`}
                >
                  {t(key === 'name' ? 'countries.name' : `map.metricShort.${key}`)}
                  {active && <span aria-hidden> {sort.direction === 'asc' ? '▲' : '▼'}</span>}
                </button>
              );
            })}
          </div>
          <ul className="mt-3 flex flex-col gap-3">
            {rows.slice(0, visible).map(({ country, name }) => (
              <li key={country.iso2} className="rounded-2xl border border-border bg-bg p-4">
                <Link
                  to={`/country/${country.iso2}`}
                  className="font-extrabold hover:text-accent-text"
                >
                  {name}
                </Link>
                <dl className="mt-3 grid grid-cols-3 gap-3">
                  <CardStat label={t('stats.cases')} value={country.cases} />
                  <CardStat label={t('stats.deaths')} value={country.deaths} />
                  <CardStat label={t('stats.casesPerMillion')} value={country.casesPerMillion} />
                </dl>
              </li>
            ))}
          </ul>
          {visible < rows.length && (
            <button
              type="button"
              onClick={() => setVisible((count) => count + PAGE_SIZE * 2)}
              className="mt-3 h-10 w-full cursor-pointer rounded-xl border border-border text-sm font-semibold"
            >
              {t('countries.showMore')}
            </button>
          )}
        </div>
      )}
      {open && data && error && (
        <CachedNotice error={error} updatedAt={dataUpdatedAt} onRetry={() => void refetch()} />
      )}
    </details>
  );
}

function Cell({ value }: { value: number | null }) {
  const { i18n } = useTranslation();

  return (
    <td className="tabular py-2.5 pr-4 text-right">
      {value === null ? '—' : formatNumber(value, i18n.language)}
    </td>
  );
}

function CardStat({ label, value }: { label: string; value: number | null }) {
  const { i18n } = useTranslation();

  return (
    <div className="min-w-0">
      <dd className="tabular text-sm font-bold">
        {value === null ? '—' : formatNumber(value, i18n.language)}
      </dd>
      <dt className="text-xs text-muted">{label}</dt>
    </div>
  );
}

function CasesCell({ value, max }: { value: number; max: number }) {
  const { i18n } = useTranslation();

  return (
    <td className="py-2.5 pr-4 text-right">
      <div className="tabular">{formatNumber(value, i18n.language)}</div>
      <div
        aria-hidden
        className="ml-auto mt-1 h-[3px] w-full overflow-hidden rounded-full bg-track"
      >
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }}
        />
      </div>
    </td>
  );
}
