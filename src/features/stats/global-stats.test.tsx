import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/shared/i18n';
import { GlobalStats } from './global-stats';

describe('GlobalStats', () => {
  it('renders the global numbers from the API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            cases: 1000,
            deaths: 50,
            recovered: null,
            active: null,
            todayCases: 7,
            todayDeaths: 1,
            affectedCountries: 42,
            updatedAt: null,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    );

    render(
      <QueryClientProvider client={new QueryClient()}>
        <GlobalStats />
      </QueryClientProvider>,
    );

    expect(await screen.findByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    vi.unstubAllGlobals();
  });
});
