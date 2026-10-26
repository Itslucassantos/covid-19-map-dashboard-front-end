import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { covidQueries } from '@/shared/api/queries';
import { useApiErrorMessage } from '@/shared/api/use-api-error-message';
import { CachedNotice } from '@/shared/ui/cached-notice';
import { Card } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { ErrorState } from '@/shared/ui/error-state';
import { Skeleton } from '@/shared/ui/skeleton';
import { countryDisplayName } from '@/shared/lib/country-name';
import { formatPercent } from '@/shared/lib/format';
import { BigNumber, MiniStat, MiniStats, ShareBar } from './stat-card';

export function CountryStats({ iso2 }: { iso2?: string }) {
  const { t, i18n } = useTranslation();
  const errorMessage = useApiErrorMessage();
  const { data, error, dataUpdatedAt, refetch } = useQuery({
    ...covidQueries.country(iso2 ?? ''),
    enabled: Boolean(iso2),
  });

  const { data: global } = useQuery(covidQueries.global());

  const title = t('stats.country.title');

  if (!iso2) {
    return (
      <Card title={title}>
        <EmptyState message={t('stats.country.empty')} />
      </Card>
    );
  }
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

  const ratio = global && global.cases > 0 ? data.cases / global.cases : null;

  return (
    <Card
      highlighted
      title={
        <span className="flex items-center justify-between gap-2">
          <span>{`${countryDisplayName(data.iso2, data.name, i18n.language)} · ${t('stats.cases')}`}</span>
          {ratio !== null && (
            <span className="font-bold text-accent-text">
              {t('stats.country.ofGlobal', { value: formatPercent(ratio, i18n.language) })}
            </span>
          )}
        </span>
      }
    >
      <BigNumber value={data.cases} />
      {ratio !== null && <ShareBar label={t('stats.country.shareOfGlobalCases')} ratio={ratio} />}
      <MiniStats>
        <MiniStat label={t('stats.deaths')} value={data.deaths} colorClass="text-deaths" />
        <MiniStat label={t('stats.todayCases')} value={data.todayCases} />
        <MiniStat label={t('stats.casesPerMillion')} value={data.casesPerMillion} />
      </MiniStats>
      {error && (
        <CachedNotice error={error} updatedAt={dataUpdatedAt} onRetry={() => void refetch()} />
      )}
    </Card>
  );
}
