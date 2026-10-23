import { useTranslation } from 'react-i18next';
import { markerRadius } from '@/shared/lib/marker-radius';
import { metricBreakpoints, type MapMetric } from './map-metric';

export function MapLegend({ metric, max }: { metric: MapMetric; max: number }) {
  const { t, i18n } = useTranslation();
  const [low, high] = metricBreakpoints[metric];
  const compact = new Intl.NumberFormat(i18n.language, { notation: 'compact' });

  const rows = [
    { label: `< ${compact.format(low)}`, value: low / 2 },
    { label: `${compact.format(low)} – ${compact.format(high)}`, value: Math.sqrt(low * high) },
    { label: `> ${compact.format(high)}`, value: high * 2 },
  ];

  return (
    <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-1.5 rounded-2xl border border-border bg-surface px-3.5 py-3 text-xs text-muted">
      <div className="font-bold text-fg">{t(`stats.${metric}`)}</div>
      {rows.map((row) => {
        const size = markerRadius(row.value, Math.max(max, row.value)) * 2;
        return (
          <div key={row.label} className="flex items-center gap-2">
            <span
              aria-hidden
              className="shrink-0 rounded-full opacity-50"
              style={{ width: size, height: size, background: 'var(--m)' }}
            />
            {row.label}
          </div>
        );
      })}
    </div>
  );
}
