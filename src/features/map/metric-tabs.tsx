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
      className="absolute left-4 right-[4.5rem] top-4 z-[1000] flex gap-1 rounded-2xl border border-border bg-surface p-1 sm:right-auto sm:gap-1.5"
    >
      {mapMetrics.map((metric) => {
        const on = metric === value;
        return (
          <button
            key={metric}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(metric)}
            className={`h-9 min-w-0 flex-1 cursor-pointer truncate rounded-[10px] px-1.5 text-xs font-bold sm:flex-none sm:px-3.5 sm:text-[13px] ${
              on ? 'bg-accent text-white' : 'text-muted hover:text-fg'
            }`}
          >
            <span className="sm:hidden" aria-hidden>
              {t(`map.metricShort.${metric}`)}
            </span>
            <span className="max-sm:sr-only">{t(`stats.${metric}`)}</span>
          </button>
        );
      })}
    </div>
  );
}
