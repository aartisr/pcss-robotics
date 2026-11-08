import React, { useState, useEffect, useRef } from 'react';
import { NavSection } from '../types';
import { SchoolSeal } from './SchoolSeal';
import {
  Bot,
  HeartHandshake,
  Sparkles,
  Users,
  Menu,
  X,
  Activity,
  GraduationCap,
  Search,
  FlaskConical,
  ChevronDown,
  CheckCircle2,
  Cpu,
  Gamepad2,
  SunMoon,
  Eye,
  BookOpen,
  Compass,
  ArrowLeft
} from 'lucide-react';

const SCHOOL_CLUBS_URL = 'https://saugus.pioneercss.org/apps/departments/clubs.jsp';

interface NavigationProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onOpenGuide: () => void;
  onOpenStudentModal: () => void;
  onOpenCommandPalette: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  onNavigate,
  onOpenGuide,
  onOpenStudentModal,
  onOpenCommandPalette,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const moreMenuRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click-outside listener for popovers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMoreMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Primary navigation links across desktop (spacious & guaranteed zero overlap)
  const primaryNavItems: { id: NavSection; label: string; shortLabel: string; badge?: string; highlight?: boolean }[] = [
    { id: 'home', label: 'Home', shortLabel: 'Home' },
    { id: 'team', label: 'Team', shortLabel: 'Team' },
    { id: 'outreach', label: 'Jams & Events', shortLabel: 'Events', highlight: true }
  ];

  // Secondary sections accessible via More dropdown
  const secondaryNavItems: {
    id: NavSection;
    label: string;
    desc: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: 'research',
      label: 'Robotics Learning Lab',
      desc: 'Explore mecanum drive with an interactive calculator',
      icon: <BookOpen className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'robots',
      label: 'Robot Engineering',
      desc: 'Explore drive systems, mechanisms, and sensors',
      icon: <Compass className="w-4 h-4 text-sky-400" />,
    },
    {
      id: 'simulator',
      label: 'Autonomous Simulator',
      desc: 'Try an interactive path planning simulation',
      icon: <Activity className="w-4 h-4 text-emerald-400" />
    },
    {
      id: 'sponsors',
      label: 'Sponsorship',
      desc: 'Sponsor student builds, events, and learning',
      icon: <HeartHandshake className="w-4 h-4 text-amber-400" />
    },
    {
      id: 'arcade',
      label: 'Autonomous Flight & Drive Arena',
      desc: 'Interactive robotics simulator & teleoperation mini-game',
      icon: <Gamepad2 className="w-4 h-4 text-purple-400" />
    }
  ];

  const isSecondaryActive = [
    'research',
    'robots',
    'simulator',
    'sponsors',
    'arcade'
  ].includes(activeSection);

  return (
    <>
      {/* Accessible Skip Link */}
      <a href="#main-content" className="skip-to-content-link">
        Skip to main content
      </a>

      <header
        role="banner"
        className={`w-full sticky top-0 z-[60] transition-all duration-300 ${
          isScrolled
            ? 'bg-[#071326]/95 backdrop-blur-xl border-b border-[#1d3e70] shadow-2xl shadow-black/60'
            : 'bg-[#071326]/85 backdrop-blur-md border-b border-[#1d3e70]/80'
        }`}
      >
        {/* 3-Column Zero-Overlap Container */}
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 min-w-0">

          {/* Column 1: Left Brand Mark */}
          <div className="flex flex-col shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-xl"
              aria-label="PCSS II Robotics Home"
            >
              <SchoolSeal />

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-sky-300 transition whitespace-nowrap">
                    PCSS II Robotics
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider bg-sky-950/90 text-sky-300 border border-sky-500/40 shrink-0">
                    #23548
                  </span>
                </div>
                <span className="text-[10px] leading-tight text-slate-300">Pioneer Charter School of Science II</span>
              </div>
            </button>
            <a
              href={SCHOOL_CLUBS_URL}
              className="hidden lg:inline-flex items-center gap-1 self-start pl-[3.05rem] pt-0.5 text-[11px] font-medium leading-none text-sky-300 hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:underline underline-offset-2 transition-colors"
              aria-label="Back to Pioneer Charter School of Science II clubs and activities"
            >
              <ArrowLeft className="w-3 h-3" aria-hidden="true" />
              <span>Back to School Clubs</span>
            </a>
          </div>

          {/* Column 2: Center Navigation (Desktop Only, guaranteed flex containment) */}
          <nav className="hidden lg:flex items-center justify-center gap-1 min-w-0 flex-1 px-2" aria-label="Main Navigation">
            {primaryNavItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'text-sky-300 bg-sky-950/70 border border-sky-500/40 shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {item.highlight && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse mr-1 align-middle" />
                  )}
                  <span className="hidden xl:inline">{item.label}</span>
                  <span className="xl:hidden">{item.shortLabel}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-600/40">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* More Menu Dropdown */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => {
                  setMoreMenuOpen(prev => !prev);
                          }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-medium transition-colors whitespace-nowrap ${
                  isSecondaryActive
                    ? 'text-sky-300 font-semibold bg-sky-950/70 border border-sky-500/40'
                    : 'text-slate-200 hover:text-white hover:bg-white/[0.06]'
                }`}
                aria-expanded={moreMenuOpen}
                aria-haspopup="true"
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${moreMenuOpen ? 'rotate-180 text-sky-300' : ''}`} aria-hidden="true" />
              </button>

              {moreMenuOpen && (
                <div
                  role="menu"
                  aria-label="Additional Navigation Links"
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 rounded-2xl bg-[#0b1e3b] border border-[#1d3e70] shadow-2xl shadow-black/90 backdrop-blur-2xl p-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="space-y-1">
                    {secondaryNavItems.map((sec) => (
                      <button
                        key={sec.id}
                        role="menuitem"
                        onClick={() => {
                          onNavigate(sec.id);
                          setMoreMenuOpen(false);
                        }}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition ${
                          activeSection === sec.id
                            ? 'bg-sky-950/90 text-sky-300 border border-sky-500/40'
                            : 'hover:bg-white/[0.06] text-slate-200 hover:text-white'
                        }`}
                      >
                        <div className="p-1.5 rounded-lg bg-[#071326] border border-white/10 shrink-0 mt-0.5">
                          {sec.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-xs text-white">{sec.label}</span>
                            {sec.badge && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-950/90 text-amber-300 border border-amber-600/40 shrink-0">
                                {sec.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-300 leading-snug">{sec.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 pt-2 border-t border-white/[0.08] px-1 pb-1">
                    <button
                      onClick={() => {
                        onOpenStudentModal();
                        setMoreMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-lg text-[11px] text-slate-200 hover:text-white hover:bg-white/[0.06] transition min-h-[44px]"
                    >
                      <span className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
                        <span>Join PCSS Robotics</span>
                      </span>
                      <span className="text-[10px] font-mono text-sky-300">Grades 6–12</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Column 3: Right Section (Utilities & Primary Action) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

            {/* Quick Jump (⌘K) Search Trigger */}
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center gap-1.5 sm:gap-2 p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#0b1e3b] hover:bg-[#102a52] text-slate-200 hover:text-white border border-[#1d3e70] text-xs font-mono transition shrink-0 min-h-[44px] min-w-[44px] justify-center"
              title="Open command palette (⌘K or /)"
              aria-label="Open Command Search"
            >
              <Search className="w-4 h-4 text-sky-400 shrink-0" aria-hidden="true" />
              <span className="hidden 2xl:inline text-slate-300">Search</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-[#071326] border border-[#1d3e70] text-[10px] text-slate-300 shrink-0">
                ⌘K
              </kbd>
            </button>

            {/* AI Strategy Copilot Trigger */}
            <button
              onClick={onOpenGuide}
              className="relative p-2 rounded-xl bg-[#0b1e3b] hover:bg-purple-950/50 text-slate-200 hover:text-purple-300 border border-[#1d3e70] hover:border-purple-500/40 transition shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Open site guide"
              aria-label="Open site guide"
            >
              <Bot className="w-4 h-4 text-purple-400" aria-hidden="true" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            </button>

            {/* Support action */}
            <button
              onClick={() => onNavigate('sponsors')}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white shadow-md shadow-sky-950/50 border border-sky-400/30 transition whitespace-nowrap shrink-0 min-h-[44px]"
            >
              <HeartHandshake className="w-4 h-4 shrink-0 text-amber-300" aria-hidden="true" />
              <span className="hidden sm:inline">Sponsorship</span>
              <span className="sm:hidden">Sponsor</span>
            </button>

            {/* Mobile Drawer Hamburger (Visible up to lg breakpoint) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-[#0b1e3b] border border-[#1d3e70] transition shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer with ARIA dialog roles and accessibility */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            className="lg:hidden border-b border-[#1d3e70] bg-[#071326] px-4 pt-3 pb-6 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar w-full max-w-full animate-in fade-in slide-in-from-top-2 duration-150 shadow-2xl"
          >
            <a
              href={SCHOOL_CLUBS_URL}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl border border-sky-500/30 bg-sky-950/40 text-sm font-semibold text-sky-200 hover:bg-sky-950/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 min-h-[48px]"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Back to PCSS II Clubs &amp; Activities</span>
            </a>
            {/* Quick Search in Mobile */}
            <button
              onClick={() => {
                onOpenCommandPalette();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-[#0b1e3b] border border-[#1d3e70] text-xs text-slate-300 min-h-[48px]"
              aria-label="Search site content"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-sky-400" aria-hidden="true" />
                <span>Search commands, CAD, papers, and more...</span>
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-[#071326] text-[10px] font-mono border border-slate-700 text-slate-300">⌘K</kbd>
            </button>

            {/* Navigation Links Grouped Cleanly with 48px Touch Targets */}
            <div className="space-y-1.5" role="navigation" aria-label="Mobile Primary Navigation">
              <div className="text-[10px] font-mono uppercase tracking-wider text-sky-400 px-3 py-1 font-bold">
                Platform Sections
              </div>

              {primaryNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition min-h-[48px] ${
                    activeSection === item.id
                      ? 'bg-sky-950 text-sky-200 border border-sky-500/50'
                      : 'text-slate-200 hover:bg-[#0b1e3b]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.highlight && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-600/40">
                        {item.badge}
                      </span>
                    )}
                    {activeSection === item.id && <CheckCircle2 className="w-4 h-4 text-sky-400" aria-hidden="true" />}
                  </div>
                </button>
              ))}

              <div className="text-[10px] font-mono uppercase tracking-wider text-sky-400 px-3 py-1 font-bold pt-2">
                Engineering & Lab Systems
              </div>

              {secondaryNavItems.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    onNavigate(sec.id);
                    setMobileMenuOpen(false);
                  }}
                  aria-current={activeSection === sec.id ? 'page' : undefined}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition min-h-[48px] ${
                    activeSection === sec.id
                      ? 'bg-sky-950 text-sky-200 border border-sky-500/50'
                      : 'text-slate-200 hover:bg-[#0b1e3b]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {sec.icon}
                    <span>{sec.label}</span>
                  </div>
                  {activeSection === sec.id && <CheckCircle2 className="w-4 h-4 text-sky-400" aria-hidden="true" />}
                </button>
              ))}
            </div>

            {/* Mobile CTAs */}
            <div className="pt-2 border-t border-[#1d3e70] flex flex-col gap-2.5">
              <button
                onClick={() => {
                  onOpenStudentModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0b1e3b] text-sky-200 border border-sky-500/40 text-xs font-bold hover:bg-[#102a52] transition min-h-[48px]"
              >
                <GraduationCap className="w-4 h-4 text-sky-400" aria-hidden="true" />
                <span>Join PCSS II Robotics (Grades 6–12)</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('sponsors');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white text-xs font-bold shadow-lg shadow-sky-950/50 transition min-h-[48px]"
              >
                <HeartHandshake className="w-4 h-4 text-amber-300" aria-hidden="true" />
                <span>Sponsorship</span>
              </button>

              <button
                onClick={() => {
                  onOpenGuide();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-slate-300 hover:text-purple-300 text-xs font-medium transition min-h-[44px]"
              >
                <Bot className="w-4 h-4 text-purple-400" aria-hidden="true" />
                <span>Open site guide</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
