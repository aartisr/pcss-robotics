import type { NavSection } from '../types';

type PostHogStub = unknown[] & {
  __SV?: number;
  _i?: unknown[];
  init: (key: string, config: Record<string, unknown>) => void;
  capture: (event: string, properties?: Record<string, string>) => void;
  opt_out_capturing: () => void;
};

declare global {
  interface Window {
    posthog?: PostHogStub;
  }
}

const projectKey = import.meta.env.VITE_POSTHOG_KEY?.trim();
const host = import.meta.env.VITE_POSTHOG_HOST?.trim() || 'https://us.i.posthog.com';
let initialized = false;
let lastPage = '';

export const posthogConfigured = Boolean(projectKey && /^https:\/\//.test(host));

// Adapted from PostHog's async snippet; installed only after analytics consent.
function installPostHogSnippet(apiHost: string): PostHogStub {
  if (window.posthog?.__SV) return window.posthog;

  const stub = [] as unknown as PostHogStub;
  stub._i = [];
  stub.__SV = 1;
  for (const method of ['capture', 'opt_out_capturing']) {
    (stub as unknown as Record<string, unknown>)[method] = (...args: unknown[]) => {
      stub.push([method, ...args]);
    };
  }
  stub.init = (key, config) => {
    stub._i?.push([key, config, 'posthog']);
  };
  window.posthog = stub;

  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `${apiHost.replace(/\.i\.posthog\.com$/, '-assets.i.posthog.com')}/static/array.js`;
  document.head.appendChild(script);
  return stub;
}

export function startPostHog(): void {
  if (!posthogConfigured || initialized || !projectKey) return;
  initialized = true;
  const posthog = installPostHogSnippet(host);
  posthog.init(projectKey, {
    api_host: host,
    defaults: '2026-08-30',
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
    disable_session_recording: true,
    disable_surveys: true,
    advanced_disable_feature_flags: true,
    person_profiles: 'never',
    persistence: 'memory',
    save_campaign_params: false,
  });
}

export function trackPage(section: NavSection): void {
  if (!initialized || !window.posthog) return;
  const path = window.location.pathname;
  if (lastPage === path) return;
  lastPage = path;
  window.posthog.capture('$pageview', {
    $current_url: `${window.location.origin}${path}`,
    page_section: section,
  });
}

export function stopPostHog(): void {
  window.posthog?.opt_out_capturing();
  lastPage = '';
  // Removing the script completely requires a page reload after consent withdrawal.
  window.location.reload();
}
