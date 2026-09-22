import React from 'react';
import { NavSection } from '../types';
import { ChevronRight, Home, Search, Compass, Activity, HeartHandshake, Sparkles, Gamepad2, Users, FlaskConical, Award } from 'lucide-react';

interface SectionHeaderBreadcrumbProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onOpenCommandPalette: () => void;
}

const SECTION_METADATA: Record<NavSection, { title: string; subtitle: string; icon: React.ReactNode }> = {
  home: {
    title: 'Overview',
    subtitle: 'PCSS II Autonomous Systems Lab & Flagship Kraken V2',
    icon: <Home className="w-3.5 h-3.5" />
  },
  audit: {
    title: 'Usability & Accessibility Evaluation (1–10)',
    subtitle: 'Comprehensive 9.4/10 Scorecard, WCAG AA Contrast Matrix & Live Testing Tools',
    icon: <Award className="w-3.5 h-3.5 text-amber-400" />
  },
  research: {
    title: 'Laboratory Research & Technical Papers',
    subtitle: 'Preprints, Kinematics Solver, Metrology Registry & BibTeX',
    icon: <FlaskConical className="w-3.5 h-3.5 text-sky-400" />
  },
  robots: {
    title: 'Robots & CAD Subsystems',
    subtitle: 'Kraken V2, Scrapyard, & Daydream Onshape Archives',
    icon: <Compass className="w-3.5 h-3.5 text-sky-400" />
  },
  simulator: {
    title: 'Autonomous Lab & Field Simulator',
    subtitle: '500Hz Optical Odometry & Quintic Spline Kinematics',
    icon: <Activity className="w-3.5 h-3.5 text-emerald-400" />
  },
  sponsors: {
    title: '501(c)(3) Corporate Sponsorship Command',
    subtitle: 'Tax-Deductible STEM ROI Engine & W-9 Packet',
    icon: <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
  },
  outreach: {
    title: 'Circuit 2026 & Youth Outreach',
    subtitle: 'Mentoring 450+ Middle Schoolers Across North Shore MA',
    icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
  },
  arcade: {
    title: 'Cyber Driver Arcade Arena',
    subtitle: 'Real-time FTC TeleOp Field Simulator & Sample Collector',
    icon: <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
  },
  team: {
    title: 'Team Roster & Skunkworks Leads',
    subtitle: 'Student Engineers & Mentors Across 5 Specialized Divisions',
    icon: <Users className="w-3.5 h-3.5 text-sky-400" />
  }
};

export const SectionHeaderBreadcrumb: React.FC<SectionHeaderBreadcrumbProps> = ({
  activeSection,
  onNavigate,
  onOpenCommandPalette
}) => {
  if (activeSection === 'home') return null;

  const current = SECTION_METADATA[activeSection];

  return (
    <div className="w-full max-w-full overflow-hidden border-b border-[#1d3e70] bg-[#071326]/90 backdrop-blur-md sticky top-16 z-20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-xs text-slate-300 gap-2">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 min-w-0 overflow-hidden">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition font-medium text-xs shrink-0"
          >
            <Home className="w-3.5 h-3.5 shrink-0" />
            <span>Home</span>
          </button>
          <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" aria-hidden="true" />
          <div className="flex items-center gap-1.5 font-semibold text-sky-300 min-w-0 truncate">
            <span className="shrink-0">{current.icon}</span>
            <span className="truncate">{current.title}</span>
          </div>
        </nav>

        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <span className="text-[11px] text-slate-300 font-mono hidden md:inline truncate max-w-xs">
            {current.subtitle}
          </span>
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0b1e3b] hover:bg-[#102a52] text-slate-200 hover:text-white border border-[#1d3e70] text-[11px] font-mono transition shrink-0"
            aria-label="Open command palette search"
          >
            <Search className="w-3 h-3 text-sky-400 shrink-0" aria-hidden="true" />
            <span>⌘K Jump</span>
          </button>
        </div>
      </div>
    </div>
  );
};

