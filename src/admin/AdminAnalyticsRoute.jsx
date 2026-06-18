import { Suspense, lazy } from 'react';

const AdminAnalyticsPage = lazy(() => import('./AdminAnalyticsPage').then(module => ({ default: module.AdminAnalyticsPage })));

export const AdminAnalyticsRoute = () => (
  <Suspense
    fallback={(
      <section className="admin-page">
        <div className="admin-header">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Loading analytics</h1>
            <p>Preparing local telemetry dashboard.</p>
          </div>
        </div>
      </section>
    )}
  >
    <AdminAnalyticsPage />
  </Suspense>
);
