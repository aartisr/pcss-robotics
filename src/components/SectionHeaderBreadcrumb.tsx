import React from 'react';
import { NavSection } from '../types';
import { ChevronRight, Home, Compass, Activity, HeartHandshake, Sparkles, Gamepad2, Users, FlaskConical } from 'lucide-react';

interface SectionHeaderBreadcrumbProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
}

const SECTION_METADATA: Record<NavSection, { title: string; subtitle: string; icon: React.ReactNode }> = {
  home: {
    title: 'Overview',
    subtitle: 'Student robotics and community events',
    icon: <Home className="w-3.5 h-3.5" />
  },
  research: {
    title: 'Robotics Learning Lab',
    subtitle: 'Explore mecanum drive motion',
    icon: <FlaskConical className="w-3.5 h-3.5 text-sky-400" />
  },
  robots: {
    title: 'Robot engineering',
    subtitle: 'Robot designs and mechanisms',
    icon: <Compass className="w-3.5 h-3.5 text-sky-400" />
  },
  simulator: {
    title: 'Autonomous simulator',
    subtitle: 'Explore motion planning and control',
    icon: <Activity className="w-3.5 h-3.5 text-emerald-400" />
  },
  sponsors: {
    title: 'Support Student Robotics',
    subtitle: 'Ways to help and school contact information',
    icon: <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
  },
  outreach: {
    title: 'Jams & Community Events',
    subtitle: 'Hack Club Haven and our event history',
    icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
  },
  arcade: {
    title: 'Robotics Arcade',
    subtitle: 'A playful driving simulation',
    icon: <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
  },
  team: {
    title: 'Team',
    subtitle: 'People and projects',
    icon: <Users className="w-3.5 h-3.5 text-sky-400" />
  }
};

export const SectionHeaderBreadcrumb: React.FC<SectionHeaderBreadcrumbProps> = ({
  activeSection,
  onNavigate
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

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <span className="text-[11px] text-slate-300 font-mono hidden md:inline truncate max-w-xs">
            {current.subtitle}
          </span>
        </div>
      </div>
    </div>
  );
};

