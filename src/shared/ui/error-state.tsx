import { useTranslation } from 'react-i18next';

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const { t } = useTranslation();

  return (
    <div role="alert" className="text-sm">
      <p className="text-deaths">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-lg border border-border px-3 py-1 hover:bg-bg"
        >
          {t('common.retry')}
        </button>
      )}
    </div>
  );
}
