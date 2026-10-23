import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/shared/i18n';
import { daysOf, history, mockApi, MockApiError, networkDown } from '@/test/mock-api';
import { DailyCasesChart } from './daily-cases-chart';
import { GrowthChart } from './growth-chart';

function renderWithClient(ui: React.ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
  return client;
}

const routes = {
  '/global/history': (url: URL) => ({ history: history(daysOf(url), 100) }),
  '/countries/BR/history': (url: URL) => ({ iso2: 'BR', history: history(daysOf(url)) }),
};

beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

afterEach(() => vi.unstubAllGlobals());

describe('GrowthChart', () => {
  it('compares the country with the scaled global curve', async () => {
    mockApi(routes);
    renderWithClient(<GrowthChart iso2="BR" />);

    expect(await screen.findByRole('img', { name: /cumulative cases/i })).toBeInTheDocument();
    expect(screen.getByText('Brazil')).toBeInTheDocument();
    expect(screen.getByText('Global (scaled)')).toBeInTheDocument();
  });

  it('shows only the global curve without a country', async () => {
    mockApi(routes);
    renderWithClient(<GrowthChart />);

    expect(await screen.findByRole('img', { name: /cumulative cases/i })).toBeInTheDocument();
    expect(screen.getByText('Global')).toBeInTheDocument();
    expect(screen.queryByText('Global (scaled)')).not.toBeInTheDocument();
  });

  it('shows the empty state for a country without history', async () => {
    mockApi({ ...routes, '/countries/BR/history': { iso2: 'BR', history: [] } });
    renderWithClient(<GrowthChart iso2="BR" />);

    expect(await screen.findByText('No history for this country')).toBeInTheDocument();
  });
});

describe('DailyCasesChart', () => {
  it('renders the chart with its legend', async () => {
    mockApi(routes);
    renderWithClient(<DailyCasesChart iso2="BR" />);

    expect(await screen.findByRole('img', { name: /new cases per day/i })).toBeInTheDocument();
    expect(screen.getByText('7-day average')).toBeInTheDocument();
  });

  it('shows a translated error and retries', async () => {
    mockApi({ ...routes, '/countries/BR/history': new MockApiError('COUNTRY_NOT_FOUND', 404) });
    renderWithClient(<DailyCasesChart iso2="BR" />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Country not found.');

    mockApi(routes);
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('img', { name: /new cases per day/i })).toBeInTheDocument();
  });

  it('keeps the chart and warns when a refetch fails', async () => {
    mockApi(routes);
    const client = renderWithClient(<DailyCasesChart iso2="BR" />);
    await screen.findByRole('img', { name: /new cases per day/i });

    networkDown();
    await client.invalidateQueries();

    expect(await screen.findByRole('status')).toHaveTextContent('Could not reach the server.');
    expect(screen.getByRole('img', { name: /new cases per day/i })).toBeInTheDocument();
  });
});
