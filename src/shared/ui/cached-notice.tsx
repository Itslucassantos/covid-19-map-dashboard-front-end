import { useTranslation } from 'react-i18next';
import { useApiErrorMessage } from '@/shared/api/use-api-error-message';
import { formatTime } from '@/shared/lib/format';

interface CachedNoticeProps {
  error: unknown;
  updatedAt: number;
  onRetry: () => void;
}

export function CachedNotice({ error, updatedAt, onRetry }: CachedNoticeProps) {
  const { t, i18n } = useTranslation();
  const errorMessage = useApiErrorMessage();

  return (
    <div
      role="status"
      className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-bg px-3 py-1.5 text-xs text-muted"
    >
      <span>
        {errorMessage(error)} {t('common.cachedAt', { time: formatTime(updatedAt, i18n.language) })}
      </span>
      <button
        type="button"
        onClick={onRetry}
        className="cursor-pointer font-semibold text-accent-text hover:underline"
      >
        {t('common.retry')}
      </button>
    </div>
  );
}
