const STORAGE_KEY = 'pcss-robotics-analytics-events-v1';

const canUseBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readEvents = () => {
  if (!canUseBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeEvents = events => {
  if (!canUseBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // Ignore quota/storage errors for lightweight telemetry.
  }
};

export const trackAnalyticsEvent = (name, payload = {}) => {
  const event = {
    name,
    payload,
    ts: new Date().toISOString()
  };

  if (canUseBrowser()) {
    const history = readEvents();
    const capped = [...history.slice(-199), event];
    writeEvents(capped);

    window.dispatchEvent(new CustomEvent('pcss:analytics', { detail: event }));
  }

  return event;
};

export const getAnalyticsEvents = () => readEvents();

export const clearAnalyticsEvents = () => {
  if (!canUseBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('pcss:analytics:cleared'));
  } catch {
    // Ignore storage errors for lightweight telemetry.
  }
};
