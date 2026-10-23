import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import '@/shared/i18n';
import { CountryTable } from './country-table';

const countries = [
  {
    iso2: 'BR',
    name: 'Brazil',
    lat: 0,
    lng: 0,
    cases: 500,
    deaths: 5,
    recovered: null,
    active: null,
    todayCases: 0,
    todayDeaths: 0,
    casesPerMillion: null,
  },
  {
    iso2: 'US',
    name: 'United States',
    lat: 0,
    lng: 0,
    cases: 900,
    deaths: 9,
    recovered: null,
    active: null,
    todayCases: 0,
    todayDeaths: 0,
    casesPerMillion: 100,
  },
  {
    iso2: 'AR',
    name: 'Argentina',
    lat: 0,
    lng: 0,
    cases: 100,
    deaths: 1,
    recovered: null,
    active: null,
    todayCases: 0,
    todayDeaths: 0,
    casesPerMillion: 50,
  },
];

function rowNames() {
  return screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('rowheader')[0].textContent);
}

describe('CountryTable', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('lists countries sorted by cases and re-sorts by column', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ countries }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <CountryTable />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await userEvent.click(screen.getByText('All countries'));
    await screen.findByRole('table');
    expect(rowNames()).toEqual(['United States', 'Brazil', 'Argentina']);

    await userEvent.click(
      within(screen.getByRole('table')).getByRole('button', { name: /Country/ }),
    );
    expect(rowNames()).toEqual(['Argentina', 'Brazil', 'United States']);

    await userEvent.click(
      within(screen.getByRole('table')).getByRole('button', { name: /Cases per million/ }),
    );
    expect(rowNames()).toEqual(['United States', 'Argentina', 'Brazil']);
  });
});
