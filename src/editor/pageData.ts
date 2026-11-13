import type { Data } from '@puckeditor/core';
import type { NavSection } from '../types';

const files = import.meta.glob('../../templates/*.json', { eager: true, import: 'default' }) as Record<string, Data>;

export const PAGE_IDS: NavSection[] = ['home', 'robots', 'research', 'simulator', 'team', 'outreach', 'arcade', 'sponsors'];

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
