import { useState, useEffect, useCallback } from 'react';
import type { NavSection } from '../types';
import { SECTION_METADATA } from '../seo/siteMetadata';
import { canonicalSectionUrl } from '../lib/sectionUrl';

const SECTIONS = Object.keys(SECTION_METADATA) as NavSection[];

function sectionFromLocation(): NavSection {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const legacy = new URLSearchParams(window.location.search).get('section') as NavSection;
  if (path === '/' && SECTIONS.includes(legacy)) return legacy;
  const route = SECTIONS.find((section) => SECTION_METADATA[section].path.replace(/\/+$/, '') === path);
  if (route) return route;

  // Keep older links working and replace them with the new canonical path.
  return SECTIONS.includes(legacy) ? legacy : 'home';
}

export function useUrlNavigation(initialFallback: NavSection = 'home') {
  const [activeSection, setActiveSection] = useState<NavSection>(() =>
    typeof window === 'undefined' ? initialFallback : sectionFromLocation()
  );

  const navigateTo = useCallback((section: NavSection) => {
    window.history.pushState({ section }, '', SECTION_METADATA[section].path);
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
