import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from '@/shared/api/use-history';
import { useApiErrorMessage } from '@/shared/api/use-api-error-message';
import { formatPercent } from '@/shared/lib/format';
import { comparePeriods, percentChange } from '@/shared/lib/history';
import { CachedNotice } from '@/shared/ui/cached-notice';
import { Card } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { ErrorState } from '@/shared/ui/error-state';
import { Skeleton } from '@/shared/ui/skeleton';
import { BigNumber, MiniStat, MiniStats } from './stat-card';

const PERIODS = [7, 30, 90] as const;
type Period = (typeof PERIODS)[number];

export function PeriodStats({ iso2 }: { iso2?: string }) {
  const { t, i18n } = useTranslation();
  const errorMessage = useApiErrorMessage();
  const [days, setDays] = useState<Period>(7);

  const { data, error, dataUpdatedAt, refetch } = useHistory(iso2, days * 2);

  const title = (
    <span className="flex items-center justify-between gap-2">
      <span>{t('stats.period.title')}</span>
      <span
        role="group"
        aria-label={t('stats.period.range')}
        className="flex gap-1 rounded-[10px] bg-track p-[3px]"
      >
        {PERIODS.map((period) => (
          <button
            key={period}
            type="button"
            aria-pressed={period === days}
            onClick={() => setDays(period)}
            className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-bold ${
              period === days ? 'bg-accent text-white' : 'text-muted hover:text-fg'
            }`}
          >
            {t('stats.period.days', { count: period })}
          </button>
        ))}
      </span>
    </span>
  );

  if (!data) {
    return (
      <Card title={title}>
        {error ? (
          <ErrorState message={errorMessage(error)} onRetry={() => void refetch()} />
        ) : (
          <Skeleton className="h-24" />
        )}
      </Card>
    );
  }
  if (data.history.length === 0) {
    return (
      <Card title={title}>
        <EmptyState message={t('stats.period.empty')} />
      </Card>
    );
  }

  const { current, previous } = comparePeriods(data.history, days);
  const change = percentChange(current.newCases, previous?.newCases);

  return (
    <Card title={title}>
      <BigNumber value={current.newCases} />
      <div className="mt-3 text-xs text-muted">
        {change === null ? (
          '—'
        ) : (
          <span className={`font-bold ${change > 0 ? 'text-deaths' : 'text-recovered'}`}>
            {change > 0 ? '▲' : '▼'} {formatPercent(Math.abs(change), i18n.language)}
          </span>
        )}{' '}
        {t('stats.period.vsPrevious', { count: days })}
      </div>
      <MiniStats>
        <MiniStat
          label={t('stats.period.newDeaths')}
          value={current.newDeaths}
          colorClass="text-deaths"
        />
      </MiniStats>
      {error && (
        <CachedNotice error={error} updatedAt={dataUpdatedAt} onRetry={() => void refetch()} />
      )}
    </Card>
  );
}
