import { useState, useEffect, useCallback } from 'react';
import { NavSection } from '../types';

const VALID_SECTIONS: NavSection[] = [
  'home',
  'research',
  'robots',
  'simulator',
  'sponsors',
  'outreach',
  'arcade',
  'team'
];

export function useUrlNavigation(initialFallback: NavSection = 'home') {
  const [activeSection, setActiveSection] = useState<NavSection>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const sectionParam = searchParams.get('section') as NavSection;
      if (sectionParam && VALID_SECTIONS.includes(sectionParam)) {
        return sectionParam;
      }
    }
    return initialFallback;
  });

  const navigateTo = useCallback((section: NavSection) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen to browser popstate (back/forward button)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const searchParams = new URLSearchParams(window.location.search);
      const sectionParam = searchParams.get('section') as NavSection;
      if (sectionParam && VALID_SECTIONS.includes(sectionParam)) {
        setActiveSection(sectionParam);
      } else if (!sectionParam) {
        setActiveSection('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return { activeSection, navigateTo };
}
