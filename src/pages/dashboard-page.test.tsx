import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/shared/theme/theme-provider';
import '@/shared/i18n';
import { routes } from '@/app/router';

vi.mock('@/features/map/covid-map', () => ({ CovidMap: () => <div data-testid="map" /> }));

function renderAt(path: string) {
  window.matchMedia ??= ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;

  render(
    <ThemeProvider>
      <QueryClientProvider client={new QueryClient()}>
        <RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />
      </QueryClientProvider>
    </ThemeProvider>,
  );
}

describe('DashboardPage', () => {
  it('shows the empty country card when no country is selected', async () => {
    renderAt('/');
    expect(await screen.findByTestId('map')).toBeInTheDocument();
    expect(screen.getByText('Select a country on the map')).toBeInTheDocument();
  });

  it('expands and collapses the map with the button and Escape', async () => {
    renderAt('/');
    const button = screen.getByRole('button', { name: 'Expand map' });
    await userEvent.click(button);
    expect(screen.getByRole('button', { name: 'Collapse map' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Expand map' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('renders the not found page for unknown routes', () => {
    renderAt('/nope');
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });
});

describe('DashboardPage country sheet', () => {
  it('opens the bottom sheet for a selected country and closes it', async () => {
    renderAt('/country/BR');
    const sheet = screen.getByRole('dialog');
    expect(sheet).toBeInTheDocument();
    await userEvent.click(within(sheet).getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has no sheet without a selected country', () => {
    renderAt('/');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
