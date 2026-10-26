import { createBrowserRouter } from 'react-router-dom';
import { DashboardPage } from '@/pages/dashboard-page';
import { NotFoundPage } from '@/pages/not-found-page';

export const routes = [
  { path: '/', element: <DashboardPage /> },
  { path: '/country/:iso2', element: <DashboardPage /> },
  { path: '*', element: <NotFoundPage /> },
];

export const router = createBrowserRouter(routes);
