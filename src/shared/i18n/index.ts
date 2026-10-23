import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { readStorage, writeStorage } from '@/shared/lib/safe-storage';
import en from './en.json';
import ptBR from './pt-BR.json';

export const supportedLanguages = ['en', 'pt-BR'] as const;
export type Language = (typeof supportedLanguages)[number];

const STORAGE_KEY = 'language';

function detectLanguage(): Language {
  const stored = readStorage(STORAGE_KEY);
  if (stored === 'en' || stored === 'pt-BR') return stored;
  return navigator.language.toLowerCase().startsWith('pt') ? 'pt-BR' : 'en';
}

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, 'pt-BR': { translation: ptBR } },
  lng: detectLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language;
  writeStorage(STORAGE_KEY, language);
});
document.documentElement.lang = i18n.language;

export default i18n;
