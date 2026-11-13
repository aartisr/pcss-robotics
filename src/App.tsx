import { useEffect, useState } from 'react';
import { Navigation } from './components/Navigation';
import { SectionErrorBoundary } from './components/SectionErrorBoundary';
import { SiteFooter } from './components/SiteFooter';
import { SiteGuideModal } from './components/SiteGuideModal';
import { StudentJoinModal } from './components/StudentJoinModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SectionHeaderBreadcrumb } from './components/SectionHeaderBreadcrumb';
import { ToastContainer } from './components/ToastContainer';
import { CelestialStarfield, CelestialAura } from './components/CelestialStarfield';
import { SeoHead } from './components/seo/SeoHead';
import { AnalyticsPreferences } from './components/AnalyticsPreferences';
import { useUrlNavigation } from './hooks/useUrlNavigation';
import { useScrollPosition } from './hooks/useScrollPosition';
import { useToastNotifications } from './hooks/useToastNotifications';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ArrowUp } from 'lucide-react';
import { PageRenderer } from './editor/config';
import { defaultPage, loadPage } from './editor/pageData';
import type { Data } from '@puckeditor/core';

export default function App() {
  const { activeSection, navigateTo } = useUrlNavigation('home');
  const [pageData, setPageData] = useState<Data>(() => defaultPage(activeSection));
  const pageMeta = pageData.root?.props as { title?: string; description?: string } | undefined;
  useEffect(() => {
    let current = true;
    setPageData(defaultPage(activeSection));
    loadPage(activeSection).then(data => { if (current) setPageData(data); });
    return () => { current = false; };
  }, [activeSection]);
  const { toasts, showToast, dismissToast } = useToastNotifications();
  const { showScrollTop, scrollToTop } = useScrollPosition(400);

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [openW9Directly, setOpenW9Directly] = useState(false);
  const [aura, setAura] = useState<CelestialAura>('cyan');

  // Global Keyboard Shortcuts (⌘K, '/', Escape)
  useKeyboardShortcuts({
    onOpenCommandPalette: () => setIsCommandPaletteOpen(prev => !prev),
    onEscape: () => {
      setIsGuideOpen(false);
      setIsStudentModalOpen(false);
      setIsCommandPaletteOpen(false);
    }
  });

  const toggleAura = () => {
    setAura(prev => {
      let nextAura: CelestialAura = 'cyan';
      if (prev === 'cyan') nextAura = 'violet';
      else if (prev === 'violet') nextAura = 'gold';

      const names = {
        cyan: 'Columbia Blue & Navy',
        violet: 'Astral Violet',
        gold: 'Panther Gold'
      };

      showToast(
        'School Palette Atmosphere Shifted',
        `Switched atmosphere to ${names[nextAura]}`,
        nextAura === 'violet' ? 'purple' : nextAura === 'gold' ? 'info' : 'cyan'
      );
      return nextAura;
    });
  };

  return (
    <div className="min-h-screen bg-[#071326] text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200 relative pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0 w-full max-w-full overflow-x-hidden">
      {/* Dynamic SEO, Meta & Structured Data Synchronizer */}
      <SeoHead activeSection={activeSection} title={pageMeta?.title} description={pageMeta?.description} />
      <AnalyticsPreferences activeSection={activeSection} />

      {/* Heavenly Celestial Starfield Background */}
      <CelestialStarfield aura={aura} />

      {/* Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Top Telemetry & Main Navigation */}
      <Navigation
        activeSection={activeSection}
        onNavigate={navigateTo}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenStudentModal={() => setIsStudentModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Contextual Breadcrumb Bar for Zero-Disorientation Navigation */}
      <SectionHeaderBreadcrumb activeSection={activeSection} onNavigate={navigateTo} />

      {/* Main Dynamic View Content */}
      <main id="main-content" className="flex-1 w-full relative z-10">
        <SectionErrorBoundary key={activeSection}>
          <PageRenderer data={pageData} onNavigate={navigateTo} sponsor={{ openW9: openW9Directly, resetW9: () => setOpenW9Directly(false) }} />
        </SectionErrorBoundary>
      </main>

      {/* Floating Action Controls */}
      {showScrollTop && <div className="fixed bottom-6 right-6 z-40 hidden items-center gap-2 md:flex">
        {/* Scroll To Top Pill */}
          <button
            onClick={scrollToTop}
            className="p-3 rounded-2xl bg-[#0b1e3b]/95 hover:bg-[#102a52] text-slate-200 hover:text-white border border-[#1d3e70] shadow-xl backdrop-blur-md transition animate-in fade-in min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Scroll to Top"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" aria-hidden="true" />
          </button>
      </div>}

      {/* Floating Mobile Bottom Navigation Bar (Thumb Dock) */}
      <MobileBottomNav
        activeSection={activeSection}
        onNavigate={navigateTo}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Modals & Command Engine */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={navigateTo}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenStudentModal={() => setIsStudentModalOpen(true)}
        onOpenW9Modal={() => {
          navigateTo('sponsors');
          setOpenW9Directly(true);
        }}
        onToggleAura={toggleAura}
      />
      <SiteGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} onNavigate={navigateTo} />
      <StudentJoinModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
      />

      <SiteFooter onNavigate={navigateTo} onOpenStudentModal={() => setIsStudentModalOpen(true)} />
    </div>
  );
}

