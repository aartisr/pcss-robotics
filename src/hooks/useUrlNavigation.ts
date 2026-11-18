import { useState, useEffect, useCallback } from 'react';
import type { NavSection } from '../types';
import { SECTION_METADATA } from '../seo/siteMetadata';
import { canonicalSectionUrl } from '../lib/sectionUrl';
import { PUBLIC_TEAM_PAGE_ENABLED } from '../lib/teamPageAccess';

const SECTIONS = Object.keys(SECTION_METADATA) as NavSection[];

function isPublicSection(section: NavSection) {
  return section !== 'team' || PUBLIC_TEAM_PAGE_ENABLED;
}

function sectionFromLocation(): NavSection {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const legacy = new URLSearchParams(window.location.search).get('section') as NavSection;
  if (path === '/' && SECTIONS.includes(legacy) && isPublicSection(legacy)) return legacy;
  const route = SECTIONS.find((section) => isPublicSection(section) && SECTION_METADATA[section].path.replace(/\/+$/, '') === path);
  if (route) return route;

  // Keep older links working and replace them with the new canonical path.
  return SECTIONS.includes(legacy) && isPublicSection(legacy) ? legacy : 'home';
}

export function useUrlNavigation(initialFallback: NavSection = 'home') {
  const [activeSection, setActiveSection] = useState<NavSection>(() =>
    typeof window === 'undefined' ? initialFallback : sectionFromLocation()
  );

  const navigateTo = useCallback((section: NavSection) => {
    if (!isPublicSection(section)) return;
    window.history.pushState({ section }, '', SECTION_METADATA[section].path);
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const section = sectionFromLocation();
    const canonicalUrl = canonicalSectionUrl(section, window.location.search, window.location.hash);
    if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== canonicalUrl) {
      window.history.replaceState({ section }, '', canonicalUrl);
    }
    const handlePopState = () => setActiveSection(sectionFromLocation());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return { activeSection, navigateTo };
}
