import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { covidQueries } from '@/shared/api/queries';
import { useApiErrorMessage } from '@/shared/api/use-api-error-message';
import { Card } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { ErrorState } from '@/shared/ui/error-state';
import { Skeleton } from '@/shared/ui/skeleton';
import { countryDisplayName } from '@/shared/lib/country-name';
import { Stat } from './stat-card';

export function CountryStats({ iso2 }: { iso2?: string }) {
  const { t, i18n } = useTranslation();
  const errorMessage = useApiErrorMessage();
  const { data, error, isPending, refetch } = useQuery({
    ...covidQueries.country(iso2 ?? ''),
    enabled: Boolean(iso2),
  });

  const title = t('stats.country.title');

  if (!iso2) {
    return (
      <Card title={title}>
        <EmptyState message={t('stats.country.empty')} />
      </Card>
    );
  }
  if (isPending) {
    return (
      <Card title={title}>
        <Skeleton className="h-24" />
      </Card>
    );
  }
  if (error) {
    return (
      <Card title={title}>
        <ErrorState message={errorMessage(error)} onRetry={() => void refetch()} />
      </Card>
    );
  }

  return (
    <Card
      highlighted
      title={`${countryDisplayName(data.iso2, data.name, i18n.language)} · ${title}`}
    >
      <dl className="grid grid-cols-2 gap-4">
        <Stat label={t('stats.cases')} value={data.cases} colorClass="text-cases" />
        <Stat label={t('stats.deaths')} value={data.deaths} colorClass="text-deaths" />
        <Stat label={t('stats.todayCases')} value={data.todayCases} />
        <Stat label={t('stats.casesPerMillion')} value={data.casesPerMillion} />
      </dl>
    </Card>
  );
}
