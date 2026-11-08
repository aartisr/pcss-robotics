import { useEffect, useState } from 'react';
import { Navigation } from './components/Navigation';
import { SectionView } from './components/SectionView';
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
import { 
  Bot, 
  ArrowUp
} from 'lucide-react';

export default function App() {
  const { activeSection, navigateTo } = useUrlNavigation('home');
  const { toasts, showToast, dismissToast } = useToastNotifications();
  const { showScrollTop, scrollToTop } = useScrollPosition(400);

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [openW9Directly, setOpenW9Directly] = useState(false);
  const [aura, setAura] = useState<CelestialAura>('cyan');
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.getElementById('site-footer');
    if (!footer || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

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
    <div className="min-h-screen bg-[#071326] text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200 relative pb-16 md:pb-0 w-full max-w-full overflow-x-hidden">
      {/* Dynamic SEO, Meta & Structured Data Synchronizer */}
      <SeoHead activeSection={activeSection} />
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
      <SectionHeaderBreadcrumb
        activeSection={activeSection}
        onNavigate={navigateTo}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Dynamic View Content */}
      <main id="main-content" className="flex-1 w-full relative z-10">
        <SectionErrorBoundary key={activeSection}>
          <SectionView
            section={activeSection}
            navigateTo={navigateTo}
            openGuide={() => setIsGuideOpen(true)}
            openStudentModal={() => setIsStudentModalOpen(true)}
            openW9Directly={openW9Directly}
            resetW9Modal={() => setOpenW9Directly(false)}
            openW9={() => { navigateTo('sponsors'); setOpenW9Directly(true); }}
          />
        </SectionErrorBoundary>
      </main>

      {/* Floating Action Controls */}
      {!footerVisible && <div className="fixed bottom-6 right-6 z-40 hidden items-center gap-2 md:flex">
        {/* Scroll To Top Pill */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="p-3 rounded-2xl bg-[#0b1e3b]/95 hover:bg-[#102a52] text-slate-200 hover:text-white border border-[#1d3e70] shadow-xl backdrop-blur-md transition animate-in fade-in min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Scroll to Top"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" aria-hidden="true" />
          </button>
        )}

        {/* Site guide trigger */}
        <button
          onClick={() => setIsGuideOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-bold text-xs shadow-xl shadow-sky-950/60 transition group border border-sky-400/30 backdrop-blur-md min-h-[44px]"
          aria-label="Open site guide"
        >
          <Bot className="w-4 h-4 text-white group-hover:rotate-12 transition" aria-hidden="true" />
          <span className="hidden sm:inline">Site guide</span>
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

