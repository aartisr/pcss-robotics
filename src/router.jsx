import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { Layout } from './components/Layout';
import { GenericPage, HomePage, NotFoundPage } from './components/Pages';
import { AdminPage } from './admin/AdminPage';

export const makeRouter = content => {
  const rootRoute = createRootRoute({
    component: () => <Layout content={content} />,
    notFoundComponent: () => <NotFoundPage content={content} />
  });

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <HomePage content={content} />
  });

  const adminRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin',
    component: AdminPage
  });

  const contentRoutes = content.pages.map(page => createRoute({
    getParentRoute: () => rootRoute,
    path: `/${page.slug}`,
    component: () => <GenericPage page={page} />
  }));

  return createRouter({
    routeTree: rootRoute.addChildren([indexRoute, adminRoute, ...contentRoutes]),
    defaultPreload: 'intent'
  });
};
