import { useMemo } from 'react';
import {
  Area,
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
import { countryDisplayName } from '@/shared/lib/country-name';
import { formatCompact, formatNumber, formatShortDate } from '@/shared/lib/format';
import { buildGrowthSeries } from '@/shared/lib/history';
import { ChartCard, LegendItem } from './chart-card';
import { axisTick, CHART_DAYS, tooltipStyle } from './chart-theme';

export function GrowthChart({ iso2 }: { iso2?: string }) {
  const { t, i18n } = useTranslation();
  const errorMessage = useApiErrorMessage();
  const country = useHistory(iso2, CHART_DAYS);
  const global = useHistory(undefined, CHART_DAYS);

  const globalHistory = global.data?.history;
  const countryHistory = iso2 ? country.data?.history : undefined;
  const series = useMemo(
    () => (globalHistory ? buildGrowthSeries(countryHistory, globalHistory) : []),
    [countryHistory, globalHistory],
  );

  const error = (iso2 ? country.error : null) ?? global.error;
  const countryName = iso2 ? countryDisplayName(iso2, iso2, i18n.language) : null;
  const language = i18n.language;

  return (
    <ChartCard
      title={t('charts.growth.title')}
      hasData={!!global.data && (!iso2 || !!country.data)}
      error={error}
      errorMessage={errorMessage(error)}
      updatedAt={
        iso2 ? Math.min(country.dataUpdatedAt, global.dataUpdatedAt) : global.dataUpdatedAt
      }
      isEmpty={series.length === 0 || (!!iso2 && countryHistory?.length === 0)}
      onRetry={() => void Promise.all([country.refetch(), global.refetch()])}
      legend={
        <span className="flex gap-3.5">
          {countryName && (
            <LegendItem swatch={<span className="h-[3px] w-3.5 rounded-sm bg-accent" />}>
              {countryName}
            </LegendItem>
          )}
          <LegendItem swatch={<span className="w-3.5 border-t-[3px] border-dashed border-muted" />}>
            {countryName ? t('charts.growth.globalScaled') : t('charts.growth.global')}
          </LegendItem>
        </span>
      }
    >
      <div role="img" aria-label={t('charts.growth.label')} className="h-[220px]">
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
              labelFormatter={(value) => formatShortDate(String(value), language)}
              formatter={(value) => formatNumber(Math.round(Number(value)), language)}
            />
            {iso2 && (
              <Area
                type="monotone"
                dataKey="country"
                name={countryName ?? ''}
                stroke="var(--accent)"
                strokeWidth={3}
                fill="var(--accent)"
                fillOpacity={0.18}
                dot={false}
                isAnimationActive={false}
              />
            )}
            <Line
              type="monotone"
              dataKey="global"
              name={countryName ? t('charts.growth.globalScaled') : t('charts.growth.global')}
              stroke="var(--muted)"
              strokeWidth={2.5}
              strokeDasharray="6 5"
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
