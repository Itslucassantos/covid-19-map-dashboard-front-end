import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CountryStats } from './country-stats';

export function CountrySheet({ iso2 }: { iso2?: string }) {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState<string>();
  const open = Boolean(iso2) && dismissed !== iso2;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDismissed(iso2);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, iso2]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label={t('stats.country.title')}
      className="fixed inset-x-0 bottom-0 z-[2000] max-h-[60vh] overflow-y-auto rounded-t-[20px] border-t border-border bg-bg p-4 shadow-[0_-8px_24px_rgb(0_0_0/0.25)] md:hidden"
    >
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          onClick={() => setDismissed(iso2)}
          className="cursor-pointer rounded-lg border border-border px-3 py-1 text-xs font-semibold text-muted hover:text-fg"
        >
          {t('common.close')}
        </button>
      </div>
      <CountryStats iso2={iso2} />
    </div>
  );
}
