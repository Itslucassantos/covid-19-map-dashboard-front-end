import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/shared/theme/theme-provider';
import '@/shared/i18n';
import { routes } from '@/app/router';
import {
  brazil,
  brazilSummary,
  daysOf,
  globalStats,
  history,
  mockApi,
  MockApiError,
} from '@/test/mock-api';

vi.mock('@/features/map/covid-map', () => ({ CovidMap: () => <div data-testid="map" /> }));

const api = {
  '/global': globalStats,
  '/countries': { countries: [brazilSummary] },
  '/countries/BR': brazil,
  '/countries/BR/history': (url: URL) => ({ iso2: 'BR', history: history(daysOf(url)) }),
  '/global/history': (url: URL) => ({ history: history(daysOf(url), 100) }),
};

function renderAt(path: string) {
  window.matchMedia ??= ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;

  render(
    <ThemeProvider>
      <QueryClientProvider
        client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
      >
        <RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />
      </QueryClientProvider>
    </ThemeProvider>,
  );
}

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

describe('Dashboard with a selected country', () => {
  it('shows the country, its share of the global total, the period and the charts', async () => {
    mockApi(api);
    renderAt('/country/BR');

    const countryCard = (await screen.findAllByText(/Brazil · Total cases/))[0].closest('section')!;
    expect(within(countryCard).getByText('250')).toBeInTheDocument();
    expect(within(countryCard).getByText('25% of global')).toBeInTheDocument();
    expect(within(countryCard).getByRole('progressbar')).toHaveAttribute('aria-valuenow', '25');

    const periodCard = screen.getByText('Period · new cases').closest('section')!;
    expect(await within(periodCard).findByText('70')).toBeInTheDocument();

    expect(await screen.findByText('Cumulative cases')).toBeInTheDocument();
    expect(screen.getByText('New cases per day')).toBeInTheDocument();
  });

  it('switches the period range', async () => {
    mockApi(api);
    renderAt('/country/BR');

    const periodCard = (await screen.findByText('Period · new cases')).closest('section')!;
    await userEvent.click(within(periodCard).getByRole('button', { name: '30d' }));
    expect(await within(periodCard).findByText('300')).toBeInTheDocument();
  });

  it('shows the translated error for an unknown country and keeps the rest working', async () => {
    mockApi({
      ...api,
      '/countries/ZZ': new MockApiError('COUNTRY_NOT_FOUND', 404),
      '/countries/ZZ/history': new MockApiError('COUNTRY_NOT_FOUND', 404),
    });
    renderAt('/country/ZZ');

    expect((await screen.findAllByText('Country not found.')).length).toBeGreaterThan(0);
    expect(await screen.findByText('1,000')).toBeInTheDocument();
  });
});
