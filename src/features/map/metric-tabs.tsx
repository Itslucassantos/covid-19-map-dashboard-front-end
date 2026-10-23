import { useTranslation } from 'react-i18next';
import { mapMetrics, type MapMetric } from './map-metric';

interface MetricTabsProps {
  value: MapMetric;
  onChange: (metric: MapMetric) => void;
}

export function MetricTabs({ value, onChange }: MetricTabsProps) {
  const { t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t('map.metric')}
      className="absolute left-4 top-4 z-[1000] flex max-w-[calc(100%-2rem)] gap-1.5 overflow-x-auto rounded-2xl border border-border bg-surface p-1"
    >
      {mapMetrics.map((metric) => {
        const on = metric === value;
        return (
          <button
            key={metric}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(metric)}
            className={`h-9 shrink-0 cursor-pointer rounded-[10px] px-3.5 text-[13px] font-bold ${
              on ? 'bg-accent text-white' : 'text-muted hover:text-fg'
            }`}
          >
            {t(`stats.${metric}`)}
          </button>
        );
      })}
    </div>
  );
}
