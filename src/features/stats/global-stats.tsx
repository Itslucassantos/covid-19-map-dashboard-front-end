import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { covidQueries } from '@/shared/api/queries';
import { useApiErrorMessage } from '@/shared/api/use-api-error-message';
import { CachedNotice } from '@/shared/ui/cached-notice';
import { Card } from '@/shared/ui/card';
import { ErrorState } from '@/shared/ui/error-state';
import { Skeleton } from '@/shared/ui/skeleton';
import { BigNumber, MiniStat, MiniStats } from './stat-card';

export function GlobalStats() {
  const { t } = useTranslation();
  const errorMessage = useApiErrorMessage();
  const { data, error, dataUpdatedAt, refetch } = useQuery(covidQueries.global());

  const title = t('stats.global.title');

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

  return (
    <Card title={`${title} · ${t('stats.cases')}`}>
      <BigNumber value={data.cases} />
      <MiniStats>
        <MiniStat label={t('stats.deaths')} value={data.deaths} colorClass="text-deaths" />
        <MiniStat label={t('stats.todayCases')} value={data.todayCases} />
        <MiniStat label={t('stats.global.affectedCountries')} value={data.affectedCountries} />
      </MiniStats>
      {error && (
        <CachedNotice error={error} updatedAt={dataUpdatedAt} onRetry={() => void refetch()} />
      )}
    </Card>
  );
}
