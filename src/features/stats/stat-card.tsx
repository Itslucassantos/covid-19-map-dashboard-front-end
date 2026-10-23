import { useTranslation } from 'react-i18next';
import { formatNumber } from '@/shared/lib/format';

interface StatProps {
  label: string;
  value: number | null;
  colorClass?: string;
}

export function Stat({ label, value, colorClass = 'text-fg' }: StatProps) {
  const { i18n } = useTranslation();

  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={`tabular text-[28px] font-extrabold tracking-tight ${colorClass}`}>
        {value === null ? '—' : formatNumber(value, i18n.language)}
      </dd>
    </div>
  );
}
