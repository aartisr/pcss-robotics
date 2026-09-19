import React, { useState } from 'react';
import { NavSection } from './types';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { RobotEngineeringSection } from './components/RobotEngineeringSection';
import { AutonomousSimulator } from './components/AutonomousSimulator';
import { ResearchSection } from './components/ResearchSection';
import { SponsorCommandCenter } from './components/SponsorCommandCenter';
import { OutreachSection } from './components/OutreachSection';
import { ArcadeMiniGame } from './components/ArcadeMiniGame';
import { TeamSection } from './components/TeamSection';
import { AiAssistantModal } from './components/AiAssistantModal';
import { StudentJoinModal } from './components/StudentJoinModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SectionHeaderBreadcrumb } from './components/SectionHeaderBreadcrumb';
import { ToastContainer } from './components/ToastContainer';
import { CelestialStarfield, CelestialAura } from './components/CelestialStarfield';
import { SeoHead } from './components/seo/SeoHead';
import { useUrlNavigation } from './hooks/useUrlNavigation';
import { useScrollPosition } from './hooks/useScrollPosition';
import { useToastNotifications } from './hooks/useToastNotifications';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { 
  Bot, 
  ShieldCheck, 
  Github, 
  Globe, 
  ArrowRight,
  GraduationCap,
  HeartHandshake,
  Gamepad2,
  Activity,
  ArrowUp
} from 'lucide-react';

export default function App() {
  const { activeSection, navigateTo } = useUrlNavigation('home');
  const { toasts, showToast, dismissToast } = useToastNotifications();
  const { showScrollTop, scrollToTop } = useScrollPosition(400);

  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [openW9Directly, setOpenW9Directly] = useState(false);
  const [aura, setAura] = useState<CelestialAura>('cyan');

  // Global Keyboard Shortcuts (⌘K, '/', Escape)
  useKeyboardShortcuts({
    onOpenCommandPalette: () => setIsCommandPaletteOpen(prev => !prev),
    onEscape: () => {
      setIsAiOpen(false);
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
        cyan: 'Celestial Cyan',
        violet: 'Astral Violet',
        gold: 'Starlight Gold'
      };

      showToast(
        'Celestial Aura Shifted',
        `Switched atmosphere to ${names[nextAura]}`,
        nextAura === 'violet' ? 'purple' : nextAura === 'gold' ? 'info' : 'cyan'
      );
      return nextAura;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative pb-16 md:pb-0 w-full max-w-full overflow-x-hidden">
      {/* Dynamic SEO, Meta & Structured Data Synchronizer */}
      <SeoHead activeSection={activeSection} />

      {/* Heavenly Celestial Starfield Background */}
      <CelestialStarfield aura={aura} />

      {/* Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Top Telemetry & Main Navigation */}
      <Navigation
        activeSection={activeSection}
        onNavigate={navigateTo}
        onOpenAi={() => setIsAiOpen(true)}
        onOpenStudentModal={() => setIsStudentModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        aura={aura}
        onToggleAura={toggleAura}
      />

      {/* Contextual Breadcrumb Bar for Zero-Disorientation Navigation */}
      <SectionHeaderBreadcrumb
        activeSection={activeSection}
        onNavigate={navigateTo}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-1 w-full relative z-10">
        {activeSection === 'home' && (
          <div className="space-y-12">
            <HeroSection
              onNavigate={navigateTo}
              onOpenAi={() => setIsAiOpen(true)}
              onOpenStudentModal={() => setIsStudentModalOpen(true)}
            />

            {/* Quick Preview Highlight of Kraken V2 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="p-8 sm:p-10 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-950/90 to-slate-900/80 backdrop-blur-2xl relative overflow-hidden shadow-2xl shadow-cyan-950/30">
                <div className="absolute -right-16 -top-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                  <div className="lg:col-span-8 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                      FLAGSHIP ROBOT // 2025–2026 INTO THE DEEP
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      Kraken V2 Kinematic Architecture
                    </h2>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                      Custom CNC aluminum cascading lift achieving a 42-inch full extension in 0.65 seconds. Closed-loop PIDF roadrunner splines, dual REV smart servos, and 500Hz optical odometry enable sub-millimeter positioning during autonomous scoring.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={() => navigateTo('robots')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shadow-md shadow-cyan-900/40"
                      >
                        <span>Examine Full Subsystem CAD</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => navigateTo('simulator')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 font-semibold text-xs transition"
                      >
                        <Activity className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Run 144&quot; Field Simulator</span>
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-950/90 border border-white/10 space-y-3 font-mono text-xs backdrop-blur-md">
                    <div className="text-slate-400 uppercase text-[10px] tracking-wider flex items-center justify-between">
                      <span>Kinematic Telemetry</span>
                      <span className="text-cyan-400">ONLINE</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between py-1 border-b border-slate-900">
                        <span className="text-slate-400">Total Mass:</span>
                        <span className="text-white font-bold">36.8 lbs (Max 42)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-900">
                        <span className="text-slate-400">Slide Extension:</span>
                        <span className="text-cyan-300 font-bold">42&quot; in 0.65s</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-900">
                        <span className="text-slate-400">Drivetrain:</span>
                        <span className="text-white font-bold">4x Mecanum HD Hex</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-900">
                        <span className="text-slate-400">Autonomous Score:</span>
                        <span className="text-emerald-400 font-bold">112 Pts Average</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DUAL ENGAGEMENT PANELS (STUDENTS & SPONSORS) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* For Sponsors */}
                <div className="p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-purple-950/30 via-slate-900/60 to-slate-950/90 backdrop-blur-xl flex flex-col justify-between space-y-6 hover:border-purple-500/40 transition">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 text-xs font-mono text-purple-300 font-bold uppercase tracking-wider">
                      <HeartHandshake className="w-4 h-4 text-purple-400" />
                      <span>Corporate & Community Sponsors</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      Partner with Aerospace & STEM Innovators
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      All donations are 100% tax-deductible under our registered 501(c)(3) public charity status. Your brand gains high-visibility robot hull placement, pit banners at regional tournaments, and direct recruitment access to top student engineering talent.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => navigateTo('sponsors')}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-lg shadow-purple-950/50"
                    >
                      <span>Calculate Sponsor Tax Credit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        navigateTo('sponsors');
                        setOpenW9Directly(true);
                      }}
                      className="text-xs font-mono text-slate-400 hover:text-white transition"
                    >
                      Instant W-9 & IRS Packet &rarr;
                    </button>
                  </div>
                </div>

                {/* For Students */}
                <div className="p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-950/30 via-slate-900/60 to-slate-950/90 backdrop-blur-xl flex flex-col justify-between space-y-6 hover:border-cyan-500/40 transition">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">
                      <GraduationCap className="w-4 h-4 text-cyan-400" />
                      <span>Students in Grades 6–12</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      Build Real Autonomous Robots With Us
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Whether you dream of designing CNC aluminum mechanisms in CAD, writing autonomous Java splines, or creating viral team media, we welcome all students with zero prerequisite experience. Join our skunkworks squads in Saugus!
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => setIsStudentModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shadow-lg shadow-cyan-950/50"
                    >
                      <span>Submit Student Application</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => navigateTo('arcade')}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-800/40 font-semibold text-xs transition"
                    >
                      <Gamepad2 className="w-3.5 h-3.5" />
                      <span>Test Drive in Cyber Arcade</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'research' && <ResearchSection onShowToast={showToast} />}
        {activeSection === 'robots' && <RobotEngineeringSection />}
        {activeSection === 'simulator' && <AutonomousSimulator />}
        {activeSection === 'sponsors' && (
          <SponsorCommandCenter
            onShowToast={showToast}
            externalOpenW9Modal={openW9Directly}
            onResetExternalW9Modal={() => setOpenW9Directly(false)}
          />
        )}
        {activeSection === 'outreach' && <OutreachSection />}
        {activeSection === 'arcade' && <ArcadeMiniGame />}
        {activeSection === 'team' && <TeamSection />}
      </main>

      {/* Floating Action Controls */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        {/* Scroll To Top Pill */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 shadow-xl backdrop-blur-md transition animate-in fade-in"
            title="Scroll to Top"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        {/* RoboBot AI CTA Trigger */}
        <button
          onClick={() => setIsAiOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-xs shadow-xl shadow-cyan-950/60 transition group border border-white/20 backdrop-blur-md"
          aria-label="Open RoboBot AI Assistant"
        >
          <Bot className="w-4 h-4 text-white group-hover:rotate-12 transition" />
          <span className="hidden sm:inline">Ask RoboBot AI</span>
        </button>
      </div>

      {/* Floating Mobile Bottom Navigation Bar (Thumb Dock) */}
      <MobileBottomNav
        activeSection={activeSection}
        onNavigate={navigateTo}
        onOpenStudentModal={() => setIsStudentModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Modals & Command Engine */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={navigateTo}
        onOpenAi={() => setIsAiOpen(true)}
        onOpenStudentModal={() => setIsStudentModalOpen(true)}
        onOpenW9Modal={() => {
          navigateTo('sponsors');
          setOpenW9Directly(true);
        }}
        onToggleAura={toggleAura}
      />
      <AiAssistantModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
      <StudentJoinModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/90 backdrop-blur-md py-12 text-xs text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base">PCSS II Robotics</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                  FTC #23548
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                  501(c)(3)
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-md">
                Pioneer Charter School of Science II &bull; Saugus, Massachusetts &bull; Empowering high school and middle school STEM leaders through competitive robotics.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
              <button onClick={() => navigateTo('home')} className="hover:text-white transition">Home</button>
              <button onClick={() => navigateTo('research')} className="text-cyan-400 hover:text-cyan-300 transition font-semibold">Research & Papers</button>
              <button onClick={() => navigateTo('robots')} className="hover:text-white transition">Robots & CAD</button>
              <button onClick={() => navigateTo('simulator')} className="hover:text-white transition">Autonomous Lab</button>
              <button onClick={() => navigateTo('sponsors')} className="hover:text-white transition">501(c)(3) Sponsors</button>
              <button onClick={() => navigateTo('outreach')} className="hover:text-white transition">Circuit 2026</button>
              <button onClick={() => navigateTo('arcade')} className="hover:text-white transition">Cyber Arcade</button>
              <button onClick={() => navigateTo('team')} className="hover:text-white transition">Team</button>
              <button onClick={() => setIsStudentModalOpen(true)} className="text-cyan-400 hover:text-cyan-300 transition font-bold">Join Team</button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>&copy; {new Date().getFullYear()} PCSS II Robotics. All contributions tax-deductible under 501(c)(3) public charity status.</span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/aartisr/pcss-robotics"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-300 transition flex items-center gap-1"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.pcssiirobotics.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-300 transition flex items-center gap-1"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>pcssiirobotics.org</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
