import { lazy, Suspense, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CountryTable } from '@/features/countries/country-table';
import { ExpandButton } from '@/features/map/expand-button';
import type { MapMetric } from '@/features/map/map-metric';
import { MetricTabs } from '@/features/map/metric-tabs';
import { GlobalStats } from '@/features/stats/global-stats';
import { PeriodStats } from '@/features/stats/period-stats';
import { CountrySheet } from '@/features/stats/country-sheet';
import { StaleNotice } from '@/features/stats/stale-notice';
import { CountryStats } from '@/features/stats/country-stats';
import { Header } from '@/shared/ui/header';
import { Skeleton } from '@/shared/ui/skeleton';

const CovidMap = lazy(() =>
  import('@/features/map/covid-map').then((module) => ({ default: module.CovidMap })),
);
const ChartsSection = lazy(() =>
  import('@/features/charts/charts-section').then((module) => ({ default: module.ChartsSection })),
);

export function DashboardPage() {
  const { iso2 } = useParams();
  const [metric, setMetric] = useState<MapMetric>('cases');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpanded(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [expanded]);

  return (
    <div className="flex min-h-screen flex-col gap-5 px-4 pb-10 pt-6 sm:px-8">
      <Header />
      <main className="flex flex-col gap-5">
        <div className="h-[45vh] min-h-[340px] lg:h-[460px]">
          <section
            className={
              expanded
                ? 'fixed inset-0 z-[3000] bg-bg'
                : 'relative h-full overflow-hidden rounded-[20px] border border-border'
            }
          >
            <Suspense fallback={<Skeleton className="h-full rounded-none" />}>
              <CovidMap metric={metric} selectedIso2={iso2} />
            </Suspense>
            <MetricTabs value={metric} onChange={setMetric} />
            <ExpandButton expanded={expanded} onToggle={() => setExpanded((value) => !value)} />
          </section>
        </div>
        <StaleNotice />
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-8 sm:px-8 md:mx-0 md:grid md:snap-none md:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] md:overflow-visible md:p-0">
          <div className="flex min-w-[85%] shrink-0 snap-center md:min-w-0">
            <GlobalStats />
          </div>
          <div className="flex min-w-[85%] shrink-0 snap-center md:min-w-0">
            <CountryStats iso2={iso2} />
          </div>
          <div className="flex min-w-[85%] shrink-0 snap-center md:min-w-0">
            <PeriodStats iso2={iso2} />
          </div>
        </div>
        <Suspense fallback={<Skeleton className="h-72" />}>
          <ChartsSection iso2={iso2} />
        </Suspense>
        <CountryTable />
      </main>
      <CountrySheet iso2={iso2} />
    </div>
  );
}
