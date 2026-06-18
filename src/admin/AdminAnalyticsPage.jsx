import { useEffect, useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Icon } from '../components/Icon';
import { clearAnalyticsEvents, getAnalyticsEvents } from '../data/analytics';

const toDisplayDate = value => {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString();
};

const summarizeBy = (events, selector) => {
  const counts = new Map();

  events.forEach(event => {
    const key = selector(event) || 'unknown';
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 8);
};

export const AdminAnalyticsPage = () => {
  const [events, setEvents] = useState(() => getAnalyticsEvents());

  useEffect(() => {
    const refresh = () => setEvents(getAnalyticsEvents());

    window.addEventListener('pcss:analytics', refresh);
    window.addEventListener('pcss:analytics:cleared', refresh);

    return () => {
      window.removeEventListener('pcss:analytics', refresh);
      window.removeEventListener('pcss:analytics:cleared', refresh);
    };
  }, []);

  const recentEvents = useMemo(() => [...events].reverse().slice(0, 40), [events]);
  const eventTypeSummary = useMemo(() => summarizeBy(events, event => event.name), [events]);
  const ctaLocationSummary = useMemo(() => summarizeBy(events, event => event.payload?.location), [events]);

  return (
    <section className="admin-page admin-analytics-page">
      <div className="admin-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Analytics</h1>
          <p>Lightweight local telemetry for CTA engagement and sponsor conversion interactions.</p>
        </div>
        <div className="admin-actions">
          <Link className="button ghost dark" to="/admin">Back To Admin</Link>
          <button className="button ghost dark" type="button" onClick={() => clearAnalyticsEvents()}>
            <Icon name="x" /> Clear Events
          </button>
        </div>
      </div>

      <div className="admin-analytics-overview">
        <article className="admin-panel admin-stat-card">
          <p className="eyebrow">Total Events</p>
          <strong>{events.length}</strong>
        </article>
        <article className="admin-panel admin-stat-card">
          <p className="eyebrow">Unique Event Types</p>
          <strong>{eventTypeSummary.length}</strong>
        </article>
        <article className="admin-panel admin-stat-card">
          <p className="eyebrow">Tracked Locations</p>
          <strong>{ctaLocationSummary.length}</strong>
        </article>
      </div>

      <div className="admin-analytics-grid">
        <div className="admin-panel">
          <h2>Top Event Types</h2>
          <div className="admin-analytics-list">
            {eventTypeSummary.length === 0 && <p className="page-admin-summary">No events yet.</p>}
            {eventTypeSummary.map(entry => (
              <div className="admin-analytics-row" key={entry.key}>
                <span>{entry.key}</span>
                <strong>{entry.count}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-panel">
          <h2>Top CTA Locations</h2>
          <div className="admin-analytics-list">
            {ctaLocationSummary.length === 0 && <p className="page-admin-summary">No CTA location data yet.</p>}
            {ctaLocationSummary.map(entry => (
              <div className="admin-analytics-row" key={entry.key}>
                <span>{entry.key}</span>
                <strong>{entry.count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-panel admin-analytics-events">
        <h2>Recent Events</h2>
        <div className="table-wrap">
          <table className="data-table admin-analytics-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Event</th>
                <th>Location</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.length === 0 && (
                <tr>
                  <td colSpan={4}>No events captured yet.</td>
                </tr>
              )}
              {recentEvents.map((event, index) => (
                <tr key={`${event.ts}-${event.name}-${index}`}>
                  <td>{toDisplayDate(event.ts)}</td>
                  <td>{event.name}</td>
                  <td>{event.payload?.location || '-'}</td>
                  <td>
                    {Object.entries(event.payload || {})
                      .map(([key, value]) => `${key}: ${String(value)}`)
                      .join(' | ') || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
