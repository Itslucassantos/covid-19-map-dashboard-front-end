import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CovidMap } from '@/features/map/covid-map';
import { ExpandButton } from '@/features/map/expand-button';
import type { MapMetric } from '@/features/map/map-metric';
import { MetricTabs } from '@/features/map/metric-tabs';
import { CountryStats } from '@/features/stats/country-stats';
import { Header } from '@/shared/ui/header';

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
            <CovidMap metric={metric} selectedIso2={iso2} />
            <MetricTabs value={metric} onChange={setMetric} />
            <ExpandButton expanded={expanded} onToggle={() => setExpanded((value) => !value)} />
          </section>
        </div>
        <div className="grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
          <CountryStats iso2={iso2} />
        </div>
      </main>
    </div>
  );
}
