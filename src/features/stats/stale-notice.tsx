import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { covidQueries } from '@/shared/api/queries';
import { formatDate } from '@/shared/lib/format';

export function StaleNotice() {
  const { t, i18n } = useTranslation();
  const { data } = useQuery(covidQueries.global());

  if (!data?.updatedAt) return null;

  return (
    <p className="rounded-xl border border-border bg-surface px-4 py-2 text-xs text-muted">
      {t('notice.stale', { date: formatDate(data.updatedAt, i18n.language) })}
    </p>
  );
}
