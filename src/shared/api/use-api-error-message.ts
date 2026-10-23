import { useTranslation } from 'react-i18next';
import { ApiError } from './http-client';

export function useApiErrorMessage() {
  const { t } = useTranslation();
  return (error: unknown) =>
    t(`errors.${error instanceof ApiError ? error.code : 'INTERNAL_ERROR'}`);
}
