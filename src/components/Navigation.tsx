import React, { useState, useEffect, useRef } from 'react';
import { NavSection } from '../types';
import { CelestialAura } from './CelestialStarfield';
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
  Gamepad2
} from 'lucide-react';

interface NavigationProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onOpenAi: () => void;
  onOpenStudentModal: () => void;
  onOpenCommandPalette: () => void;
  aura: CelestialAura;
  onToggleAura: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  onNavigate,
  onOpenAi,
  onOpenStudentModal,
  onOpenCommandPalette,
  aura,
  onToggleAura
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [telemetryOpen, setTelemetryOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [voltage, setVoltage] = useState(13.8);

  const telemetryRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Battery voltage jitter simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setVoltage(+(13.7 + Math.random() * 0.2).toFixed(2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Click-outside listener for popovers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (telemetryRef.current && !telemetryRef.current.contains(event.target as Node)) {
        setTelemetryOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setTelemetryOpen(false);
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
  const primaryNavItems: { id: NavSection; label: string; shortLabel: string; highlight?: boolean }[] = [
    { id: 'home', label: 'Overview', shortLabel: 'Overview' },
    { id: 'team', label: 'Team Roster & Hub', shortLabel: 'Team & Hub' },
    { id: 'outreach', label: 'Circuit 2026 Outreach', shortLabel: 'Circuit 2026', highlight: true }
  ];

  // Secondary sections accessible via More dropdown
  const secondaryNavItems: { 
    id: NavSection; 
    label: string; 
    desc: string; 
    icon: React.ReactNode 
  }[] = [
    { 
      id: 'robots', 
      label: 'Robots & CAD', 
      desc: 'Onshape 3D assemblies, kinematics & chassis specs',
      icon: <Cpu className="w-4 h-4 text-cyan-400" />
    },
    { 
      id: 'simulator', 
      label: 'Autonomous Lab', 
      desc: 'Interactive 500Hz EKF path simulator & spline visualizer',
      icon: <Activity className="w-4 h-4 text-emerald-400" />
    },
    { 
      id: 'research', 
      label: 'Research & Papers', 
      desc: 'Peer-reviewed working papers, quintic splines, FEA & edge AI',
      icon: <FlaskConical className="w-4 h-4 text-cyan-400" />
    },
    { 
      id: 'arcade', 
      label: 'Cyber Arcade', 
      desc: 'Multiplayer cyber arena & autonomous test drive mini-game',
      icon: <Gamepad2 className="w-4 h-4 text-purple-400" />
    },
    { 
      id: 'sponsors', 
      label: '501(c)(3) Sponsorship', 
      desc: 'Tax-deductible corporate tiers & partner benefits',
      icon: <HeartHandshake className="w-4 h-4 text-purple-400" />
    }
  ];

  const auraLabels: Record<CelestialAura, { name: string; colorClass: string; dotClass: string }> = {
    cyan: { 
      name: 'Celestial Cyan', 
      colorClass: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/60',
      dotClass: 'bg-cyan-400'
    },
    violet: { 
      name: 'Astral Violet', 
      colorClass: 'text-purple-300 border-purple-500/40 bg-purple-950/60',
      dotClass: 'bg-purple-400'
    },
    gold: { 
      name: 'Starlight Gold', 
      colorClass: 'text-amber-300 border-amber-500/40 bg-amber-950/60',
      dotClass: 'bg-amber-400'
    }
  };

  const isSecondaryActive = [
    'robots',
    'simulator',
    'research',
    'arcade',
    'sponsors'
  ].includes(activeSection);

  return (
    <header className={`w-full sticky top-0 z-[60] transition-all duration-300 ${
      isScrolled 
        ? 'bg-slate-950/95 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl shadow-black/50' 
        : 'bg-slate-950/80 backdrop-blur-md border-b border-white/[0.06]'
    }`}>
      {/* 3-Column Zero-Overlap Container */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 min-w-0">
        
        {/* Column 1: Left Brand Mark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            aria-label="PCSS II Robotics Home"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-400 group-hover:shadow-lg group-hover:shadow-cyan-950/50 transition duration-200 shrink-0">
              <FlaskConical className="w-4 h-4 text-cyan-400 group-hover:text-cyan-200 transition" />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-cyan-300 transition whitespace-nowrap">
                  PCSS II Robotics
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 shrink-0">
                  #23548
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono hidden 2xl:block leading-none pt-0.5">
                Applied Cybernetics & Robotics Lab
              </span>
            </div>
          </button>
        </div>

        {/* Column 2: Center Navigation (Desktop Only, guaranteed flex containment) */}
        <nav className="hidden lg:flex items-center justify-center gap-1 min-w-0 flex-1 px-2" aria-label="Main Navigation">
          {primaryNavItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-cyan-300 font-semibold bg-white/[0.08] border border-white/[0.1] shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {item.highlight && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse mr-1.5 align-middle" />
                )}
                <span className="hidden xl:inline">{item.label}</span>
                <span className="xl:hidden">{item.shortLabel}</span>
              </button>
            );
          })}

          {/* More Menu Dropdown */}
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => {
                setMoreMenuOpen(prev => !prev);
                setTelemetryOpen(false);
              }}
              className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-medium transition-colors whitespace-nowrap ${
                isSecondaryActive
                  ? 'text-cyan-300 font-semibold bg-white/[0.08] border border-white/[0.1]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
              aria-expanded={moreMenuOpen}
            >
              <span>More</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${moreMenuOpen ? 'rotate-180 text-cyan-300' : ''}`} />
            </button>

            {moreMenuOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 rounded-2xl bg-slate-950/98 border border-white/10 shadow-2xl shadow-black/90 backdrop-blur-2xl p-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="space-y-1">
                  {secondaryNavItems.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => {
                        onNavigate(sec.id);
                        setMoreMenuOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition ${
                        activeSection === sec.id
                          ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'
                          : 'hover:bg-white/[0.05] text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-slate-900 border border-white/5 shrink-0 mt-0.5">
                        {sec.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-white">{sec.label}</div>
                        <div className="text-[11px] text-slate-400 leading-snug">{sec.desc}</div>
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
                    className="w-full flex items-center justify-between p-2 rounded-lg text-[11px] text-slate-300 hover:text-white hover:bg-white/[0.04] transition"
                  >
                    <span className="flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Join PCSS Robotics</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">Grades 6–12</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Column 3: Right Section (Utilities & Primary Action) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Live Diagnostics Telemetry (visible on xl+ desktop screens) */}
          <div className="relative hidden xl:block" ref={telemetryRef}>
            <button
              onClick={() => {
                setTelemetryOpen(prev => !prev);
                setMoreMenuOpen(false);
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-mono transition border ${
                telemetryOpen 
                  ? 'bg-slate-900 text-white border-cyan-500/50 shadow-sm shadow-cyan-950/40' 
                  : 'bg-white/[0.03] hover:bg-white/[0.07] text-slate-300 hover:text-white border-white/[0.08]'
              }`}
              title="View live lab diagnostics & telemetry"
              aria-expanded={telemetryOpen}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-medium">500Hz EKF</span>
              <span className="text-slate-600 font-sans">•</span>
              <span className="text-emerald-400 font-semibold">{voltage}V</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${telemetryOpen ? 'rotate-180 text-cyan-300' : ''}`} />
            </button>

            {/* Telemetry & Diagnostics Flyout Card */}
            {telemetryOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-950/98 border border-white/10 shadow-2xl shadow-black/90 backdrop-blur-2xl p-4 text-xs z-[100] animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-white uppercase tracking-wider text-[11px]">Lab Diagnostics</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                    SYSTEM NOMINAL
                  </span>
                </div>

                <div className="py-3 space-y-2.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Sensor Fusion Loop:</span>
                    <span className="text-cyan-300 font-semibold">500Hz Optical EKF</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Closed-Loop Drift:</span>
                    <span className="text-white font-semibold">2.1 mm / 144&quot;</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Battery Bus Voltage:</span>
                    <span className="text-emerald-400 font-semibold">{voltage} V</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Working Papers:</span>
                    <span className="text-white font-semibold">4 Registered</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Active Grant Support:</span>
                    <span className="text-emerald-400 font-semibold">$38,500</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.08] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Atmosphere Aura:</span>
                    <button
                      onClick={onToggleAura}
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono transition ${auraLabels[aura].colorClass}`}
                      title="Cycle theme atmosphere"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${auraLabels[aura].dotClass}`} />
                      <span>{auraLabels[aura].name}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        onNavigate('robots');
                        setTelemetryOpen(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/[0.08] transition text-[11px]"
                    >
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Robots & CAD</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('research');
                        setTelemetryOpen(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 transition text-[11px]"
                    >
                      <FlaskConical className="w-3.5 h-3.5" />
                      <span>Papers</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Jump (⌘K) Search Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-1.5 sm:gap-2 p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 border border-white/[0.08] text-xs font-mono transition shrink-0"
            title="Open command palette (⌘K or /)"
            aria-label="Open Command Search"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="hidden 2xl:inline text-slate-400">Search</span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700/60 text-[10px] text-slate-400 shrink-0">
              ⌘K
            </kbd>
          </button>

          {/* AI Strategy Copilot Trigger */}
          <button
            onClick={onOpenAi}
            className="relative p-2 rounded-xl bg-white/[0.04] hover:bg-purple-950/40 text-slate-300 hover:text-purple-300 border border-white/[0.08] hover:border-purple-500/30 transition shrink-0"
            title="Launch RoboBot AI Strategy Engine"
            aria-label="Launch RoboBot AI"
          >
            <Bot className="w-4 h-4 text-purple-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          </button>

          {/* Sponsor Us 501(c)(3) Primary Action */}
          <button
            onClick={() => onNavigate('sponsors')}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-md shadow-purple-950/50 border border-white/10 transition whitespace-nowrap shrink-0"
          >
            <HeartHandshake className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Sponsor Lab</span>
            <span className="sm:hidden">Sponsor</span>
          </button>

          {/* Mobile Drawer Hamburger (Visible up to lg breakpoint) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] transition shrink-0"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* World-Class Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-slate-950/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar w-full max-w-full">
          {/* Quick Search in Mobile */}
          <button
            onClick={() => {
              onOpenCommandPalette();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-400"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Search commands, CAD, papers...</span>
            </span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-950 text-[10px] font-mono border border-slate-800">⌘K</kbd>
          </button>

          {/* Navigation Links Grouped Cleanly */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 py-1">
              Platform Sections
            </div>
            {primaryNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  activeSection === item.id
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-slate-300 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.highlight && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                  <span>{item.label}</span>
                </div>
                {activeSection === item.id && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
              </button>
            ))}

            {secondaryNavItems.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  onNavigate(sec.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  activeSection === sec.id
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-slate-300 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {sec.icon}
                  <span>{sec.label}</span>
                </div>
                {activeSection === sec.id && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
              </button>
            ))}
          </div>

          {/* Telemetry Summary in Mobile Drawer */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/[0.08] space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ASRRL Telemetry</span>
              </span>
              <span className="text-emerald-400 font-bold">{voltage}V</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Sensor Fusion: 500Hz EKF</span>
              <button
                onClick={onToggleAura}
                className="text-cyan-400 underline"
              >
                Aura: {auraLabels[aura].name}
              </button>
            </div>
          </div>

          {/* Mobile CTAs */}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenStudentModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-cyan-300 border border-cyan-500/30 text-xs font-bold hover:bg-slate-800 transition"
            >
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span>Join PCSS II Robotics (Grades 6–12)</span>
            </button>
            <button
              onClick={() => {
                onNavigate('sponsors');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs font-bold shadow-lg shadow-purple-950/40 transition"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>501(c)(3) Corporate Sponsorship</span>
            </button>
            <button
              onClick={() => {
                onOpenAi();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-slate-400 hover:text-purple-300 text-xs font-medium transition"
            >
              <Bot className="w-4 h-4 text-purple-400" />
              <span>Launch RoboBot AI Strategy Engine</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
