import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/shared/i18n';
import { GlobalStats } from '@/features/stats/global-stats';
import { globalStats, mockApi, MockApiError, networkDown } from '@/test/mock-api';

function renderGlobal() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <GlobalStats />
    </QueryClientProvider>,
  );
  return client;
}

describe('cached data and API failures', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('keeps the loaded numbers and shows a notice when a refetch fails', async () => {
    mockApi({ '/global': globalStats });
    const client = renderGlobal();
    expect(await screen.findByText('1,000')).toBeInTheDocument();

    mockApi({ '/global': new MockApiError('RATE_LIMITED', 429) });
    await client.invalidateQueries();

    expect(await screen.findByRole('status')).toHaveTextContent('Too many requests');
    expect(screen.getByRole('status')).toHaveTextContent('Showing saved data from');
    expect(screen.getByText('1,000')).toBeInTheDocument();
  });

  it('uses the message of the upstream error code', async () => {
    mockApi({ '/global': new MockApiError('UPSTREAM_UNAVAILABLE', 503) });
    renderGlobal();
    expect(await screen.findByRole('alert')).toHaveTextContent('Data source unavailable.');
  });

  it('shows an error with retry when there is no cached data, then recovers', async () => {
    networkDown();
    renderGlobal();
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not reach the server.');

    mockApi({ '/global': globalStats });
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText('1,000')).toBeInTheDocument();
  });
});
