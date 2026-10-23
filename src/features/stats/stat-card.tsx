import { useTranslation } from 'react-i18next';
import { formatNumber } from '@/shared/lib/format';

export function BigNumber({ value }: { value: number | null }) {
  const { i18n } = useTranslation();

  return (
    <div className="tabular mt-1.5 text-4xl font-extrabold tracking-tight">
      {value === null ? '—' : formatNumber(value, i18n.language)}
    </div>
  );
}

interface MiniStatProps {
  label: string;
  value: number | null;
  colorClass?: string;
}

export function MiniStat({ label, value, colorClass = 'text-fg' }: MiniStatProps) {
  const { i18n } = useTranslation();

  return (
    <div>
      <dd className={`tabular text-sm font-bold ${colorClass}`}>
        {value === null ? '—' : formatNumber(value, i18n.language)}
      </dd>
      <dt className="text-xs text-muted">{label}</dt>
    </div>
  );
}

export function MiniStats({ children }: { children: React.ReactNode }) {
  return <dl className="mt-auto flex flex-wrap gap-x-[18px] gap-y-2 pt-3">{children}</dl>;
}

interface ShareBarProps {
  label: string;
  ratio: number;
  colorClass?: string;
}

export function ShareBar({ label, ratio, colorClass = 'bg-accent' }: ShareBarProps) {
  const percent = Math.min(100, ratio * 100);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      className="mt-3 h-2 overflow-hidden rounded-full bg-track"
    >
      <div className={`h-full ${colorClass}`} style={{ width: `${percent}%` }} />
    </div>
  );
}
