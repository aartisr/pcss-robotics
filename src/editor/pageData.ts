import type { Data } from '@puckeditor/core';
import type { NavSection } from '../types';
import { PUBLIC_TEAM_PAGE_ENABLED } from '../lib/teamPageAccess';

const files = import.meta.glob('../../templates/*.json', { eager: true, import: 'default' }) as Record<string, Data>;

const allPageIds: NavSection[] = ['home', 'robots', 'research', 'simulator', 'team', 'outreach', 'arcade', 'sponsors'];
export const PAGE_IDS = allPageIds.filter(id => id !== 'team' || PUBLIC_TEAM_PAGE_ENABLED);

export function defaultPage(id: NavSection): Data {
  return files[`../../templates/${id}.json`] ?? { root: {}, content: [] };
}

export async function loadPage(id: NavSection): Promise<Data> {
  try {
    const response = await fetch(`/api/editor?page=${id}`, { cache: 'no-store' });
    if (response.ok) return await response.json() as Data;
  } catch { /* Bundled template remains available if the API is offline. */ }
  return defaultPage(id);
}
