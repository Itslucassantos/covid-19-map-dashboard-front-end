import { useMemo } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { useHistory } from '@/shared/api/use-history';
import { useApiErrorMessage } from '@/shared/api/use-api-error-message';
import { formatCompact, formatNumber, formatShortDate } from '@/shared/lib/format';
import { buildDailySeries } from '@/shared/lib/history';
import { ChartCard, LegendItem } from './chart-card';
import { axisTick, CHART_DAYS, tooltipStyle } from './chart-theme';

export function DailyCasesChart({ iso2 }: { iso2?: string }) {
  const { t, i18n } = useTranslation();
  const errorMessage = useApiErrorMessage();
  const { data, error, dataUpdatedAt, refetch } = useHistory(iso2, CHART_DAYS);

  const history = data?.history;
  const series = useMemo(() => (history ? buildDailySeries(history) : []), [history]);
  const language = i18n.language;

  return (
    <ChartCard
      title={t('charts.daily.title')}
      hasData={!!data}
      error={error}
      errorMessage={errorMessage(error)}
      updatedAt={dataUpdatedAt}
      isEmpty={series.length === 0}
      onRetry={() => void refetch()}
      legend={
        <span className="flex gap-3.5">
          <LegendItem swatch={<span className="size-2.5 rounded-sm bg-accent opacity-45" />}>
            {t('charts.daily.daily')}
          </LegendItem>
          <LegendItem swatch={<span className="h-[3px] w-3.5 rounded-sm bg-active" />}>
            {t('charts.daily.average')}
          </LegendItem>
        </span>
      }
    >
      <div role="img" aria-label={t('charts.daily.label')} className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--grid)" />
            <XAxis
              dataKey="date"
              tick={axisTick}
              tickLine={false}
              axisLine={false}
              minTickGap={32}
              tickFormatter={(value: string) => formatShortDate(value, language)}
            />
            <YAxis
              tick={axisTick}
              tickLine={false}
              axisLine={false}
              width={44}
              tickFormatter={(value: number) => formatCompact(value, language)}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: 'var(--track)', opacity: 0.5 }}
              labelFormatter={(value) => formatShortDate(String(value), language)}
              formatter={(value) => formatNumber(Math.round(Number(value)), language)}
            />
            <Bar
              dataKey="value"
              name={t('charts.daily.daily')}
              fill="var(--accent)"
              fillOpacity={0.45}
              radius={[2, 2, 0, 0]}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="average"
              name={t('charts.daily.average')}
              stroke="var(--active)"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
