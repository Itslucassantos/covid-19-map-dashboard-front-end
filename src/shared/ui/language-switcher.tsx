import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '@/shared/i18n';

const labels: Record<string, string> = { en: 'EN', 'pt-BR': 'PT' };

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t('header.language')}
      className="flex h-11 items-center gap-1 rounded-xl border border-border bg-surface px-1"
    >
      {supportedLanguages.map((language) => {
        const on = i18n.resolvedLanguage === language;
        return (
          <button
            key={language}
            type="button"
            aria-pressed={on}
            onClick={() => void i18n.changeLanguage(language)}
            className={`h-9 cursor-pointer rounded-lg px-3 text-[13px] font-bold ${
              on ? 'bg-accent text-white' : 'text-muted hover:text-fg'
            }`}
          >
            {labels[language]}
          </button>
        );
      })}
    </div>
  );
}
