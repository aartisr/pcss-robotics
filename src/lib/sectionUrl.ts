import type { NavSection } from '../types';
import { SECTION_METADATA } from '../seo/siteMetadata';
import { PUBLIC_TEAM_PAGE_ENABLED } from './teamPageAccess';

/** Preserve feature parameters while removing the legacy section query parameter. */
export function canonicalSectionUrl(section: NavSection, search: string, hash = '') {
  const safeSection = section === 'team' && !PUBLIC_TEAM_PAGE_ENABLED ? 'home' : section;
  const params = new URLSearchParams(search);
  params.delete('section');
  const query = params.toString();
  return `${SECTION_METADATA[safeSection].path}${query ? `?${query}` : ''}${hash}`;
}
