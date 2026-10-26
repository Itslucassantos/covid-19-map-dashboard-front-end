import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { CountrySearch } from '@/features/search/country-search';
import { covidQueries } from '@/shared/api/queries';
import { formatDate } from '@/shared/lib/format';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  const { t, i18n } = useTranslation();
  const { data: global } = useQuery(covidQueries.global());

  return (
    <header className="flex flex-wrap items-center gap-x-6 gap-y-4">
      <div className="mr-auto flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-xl bg-accent">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">{t('app.title')}</h1>
          {global?.updatedAt && (
            <div className="text-xs text-muted">
              {t('header.updated', { date: formatDate(global.updatedAt, i18n.language) })}
            </div>
          )}
        </div>
      </div>
      <CountrySearch />
      <div className="flex gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
