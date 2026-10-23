import { useQuery } from '@tanstack/react-query';
import { covidQueries } from './queries';

export function useHistory(iso2: string | undefined, days: number) {
  const country = useQuery({ ...covidQueries.countryHistory(iso2 ?? '', days), enabled: !!iso2 });
  const global = useQuery({ ...covidQueries.globalHistory(days), enabled: !iso2 });
  return iso2 ? country : global;
}
