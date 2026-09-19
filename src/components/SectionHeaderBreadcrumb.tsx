import React from 'react';
import { NavSection } from '../types';
import { ChevronRight, Home, Search, Compass, Activity, HeartHandshake, Sparkles, Gamepad2, Users, FlaskConical } from 'lucide-react';

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
  research: {
    title: 'Laboratory Research & Technical Papers',
    subtitle: 'Preprints, Kinematics Solver, Metrology Registry & BibTeX',
    icon: <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
  },
  robots: {
    title: 'Robots & CAD Subsystems',
    subtitle: 'Kraken V2, Scrapyard, & Daydream Onshape Archives',
    icon: <Compass className="w-3.5 h-3.5" />
  },
  simulator: {
    title: 'Autonomous Lab & Field Simulator',
    subtitle: '500Hz Optical Odometry & Quintic Spline Kinematics',
    icon: <Activity className="w-3.5 h-3.5 text-cyan-400" />
  },
  sponsors: {
    title: '501(c)(3) Corporate Sponsorship Command',
    subtitle: 'Tax-Deductible STEM ROI Engine & W-9 Packet',
    icon: <HeartHandshake className="w-3.5 h-3.5 text-purple-400" />
  },
  outreach: {
    title: 'Circuit 2026 & Youth Outreach',
    subtitle: 'Mentoring 450+ Middle Schoolers Across North Shore MA',
    icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
  },
  arcade: {
    title: 'Cyber Driver Arcade Arena',
    subtitle: 'Real-time FTC TeleOp Field Simulator & Sample Collector',
    icon: <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
  },
  team: {
    title: 'Team Roster & Skunkworks Leads',
    subtitle: 'Student Engineers & Mentors Across 5 Specialized Divisions',
    icon: <Users className="w-3.5 h-3.5" />
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
    <div className="w-full max-w-full overflow-hidden border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-md sticky top-16 z-20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-xs text-slate-400 gap-2">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 min-w-0 overflow-hidden">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition font-medium text-xs shrink-0"
          >
            <Home className="w-3.5 h-3.5 shrink-0" />
            <span>Home</span>
          </button>
          <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
          <div className="flex items-center gap-1.5 font-semibold text-cyan-300 min-w-0 truncate">
            <span className="shrink-0">{current.icon}</span>
            <span className="truncate">{current.title}</span>
          </div>
        </nav>

        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <span className="text-[11px] text-slate-500 font-mono hidden md:inline truncate max-w-xs">
            {current.subtitle}
          </span>
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] text-slate-400 hover:text-slate-200 border border-white/[0.06] text-[11px] font-mono transition shrink-0"
          >
            <Search className="w-3 h-3 text-cyan-400 shrink-0" />
            <span>⌘K Jump</span>
          </button>
        </div>
      </div>
    </div>
  );
};
