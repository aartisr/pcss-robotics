import type { NavSection } from '../types';
import { SECTION_METADATA } from '../seo/siteMetadata';

/** Preserve feature parameters while removing the legacy section query parameter. */
export function canonicalSectionUrl(section: NavSection, search: string, hash = '') {
  const params = new URLSearchParams(search);
  params.delete('section');
  const query = params.toString();
  return `${SECTION_METADATA[section].path}${query ? `?${query}` : ''}${hash}`;
}
