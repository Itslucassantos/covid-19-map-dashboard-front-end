import { DailyCasesChart } from './daily-cases-chart';
import { GrowthChart } from './growth-chart';

export function ChartsSection({ iso2 }: { iso2?: string }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <GrowthChart iso2={iso2} />
      <DailyCasesChart iso2={iso2} />
    </div>
  );
}
