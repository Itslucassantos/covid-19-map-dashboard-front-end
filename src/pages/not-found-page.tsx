import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <main className="grid min-h-screen place-items-center p-4 text-center">
      <div>
        <h1 className="text-2xl font-semibold">{t('notFound.title')}</h1>
        <Link to="/" className="mt-4 inline-block text-accent underline">
          {t('notFound.back')}
        </Link>
      </div>
    </main>
  );
}
