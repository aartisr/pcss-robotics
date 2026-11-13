import { useEffect, useState } from 'react';
import type { NavSection } from '../types';
import { posthogConfigured, startPostHog, stopPostHog, trackPage } from '../lib/posthogAnalytics';

const preferenceKey = 'pcss-robotics-analytics-choice';
type Choice = 'accepted' | 'declined' | null;
const globalPrivacyControl = (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;

function getChoice(): Choice {
  try {
    const choice = window.localStorage.getItem(preferenceKey);
    return choice === 'accepted' || choice === 'declined' ? choice : null;
  } catch {
    return null;
  }
}

function saveChoice(choice: Exclude<Choice, null>): void {
  try {
    window.localStorage.setItem(preferenceKey, choice);
  } catch {
    // The choice still applies for this page when storage is unavailable.
  }
}

export function AnalyticsPreferences({ activeSection }: { activeSection: NavSection }) {
  const [choice, setChoice] = useState<Choice>(getChoice);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (globalPrivacyControl || choice !== 'accepted') return;
    startPostHog();
    trackPage(activeSection);
  }, [choice, activeSection]);

  useEffect(() => {
    const openPreferences = () => setOpen(true);
    window.addEventListener('open-analytics-preferences', openPreferences);
    return () => window.removeEventListener('open-analytics-preferences', openPreferences);
  }, []);

  if (!posthogConfigured || globalPrivacyControl || (choice && !open)) return null;

  const choose = (next: Exclude<Choice, null>) => {
    saveChoice(next);
    setChoice(next);
    setOpen(false);
    if (next === 'declined' && choice === 'accepted') stopPostHog();
  };

  return (
    <aside aria-label="Analytics preferences" className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] md:bottom-5 left-4 right-4 z-[100] mx-auto max-w-lg max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-2xl border border-sky-500/40 bg-[#0b1e3b] p-5 text-sm text-slate-100 shadow-2xl shadow-black/60">
      <h2 className="font-semibold text-white">Help us improve this site?</h2>
      <p className="mt-2 text-slate-300">
        With your permission, we use PostHog to count page visits. Click tracking, session recordings, and personal profiles are off. You can change this choice in the footer.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={() => choose('accepted')} className="rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300">Allow analytics</button>
        <button type="button" onClick={() => choose('declined')} className="rounded-lg border border-slate-500 px-4 py-2 font-semibold text-slate-100 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300">No thanks</button>
      </div>
    </aside>
  );
}
