import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { CachedNotice } from '@/shared/ui/cached-notice';
import { Card } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { ErrorState } from '@/shared/ui/error-state';
import { Skeleton } from '@/shared/ui/skeleton';

interface ChartCardProps {
  title: string;
  legend?: ReactNode;
  hasData: boolean;
  error: Error | null;
  errorMessage: string;
  updatedAt: number;
  isEmpty: boolean;
  onRetry: () => void;
  children: ReactNode;
}

export function ChartCard({
  title,
  legend,
  hasData,
  error,
  errorMessage,
  updatedAt,
  isEmpty,
  onRetry,
  children,
}: ChartCardProps) {
  const { t } = useTranslation();

  let body = children;
  if (!hasData) {
    body = error ? (
      <ErrorState message={errorMessage} onRetry={onRetry} />
    ) : (
      <Skeleton className="h-[220px]" />
    );
  } else if (isEmpty) {
    body = <EmptyState message={t('charts.empty')} />;
  }

  return (
    <Card
      title={
        <span className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-base font-extrabold text-fg">{title}</span>
          {legend}
        </span>
      }
    >
      <div className="mt-3">{body}</div>
      {hasData && error && <CachedNotice error={error} updatedAt={updatedAt} onRetry={onRetry} />}
    </Card>
  );
}

export function LegendItem({ children, swatch }: { children: ReactNode; swatch: ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 text-xs font-normal text-muted">
      {swatch}
      {children}
    </span>
  );
}
