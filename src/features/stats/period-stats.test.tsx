import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/shared/i18n';
import { PeriodStats } from './period-stats';

function historyOf(days: number) {
  return Array.from({ length: days }, (_, index) => ({
    date: `2023-01-${String((index % 28) + 1).padStart(2, '0')}`,
    cases: 0,
    deaths: 0,
    newCases: index < days / 2 ? 10 : 20,
    newDeaths: 1,
  }));
}

describe('PeriodStats', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('sums the period and compares it with the previous one', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        const days = Number(new URL(url).searchParams.get('days'));
        return Promise.resolve(
          new Response(JSON.stringify({ history: historyOf(days) }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }),
        );
      }),
    );

    render(
      <QueryClientProvider client={new QueryClient()}>
        <PeriodStats />
      </QueryClientProvider>,
    );

    expect(await screen.findByText('140')).toBeInTheDocument();
    expect(screen.getByText(/▲ 100%/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '30d' }));
    expect(await screen.findByText('600')).toBeInTheDocument();
  });
});
