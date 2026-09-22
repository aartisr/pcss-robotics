import React from 'react';
import { NavSection } from '../types';
import { 
  Home, 
  Compass, 
  Activity, 
  HeartHandshake, 
  Search,
  Users,
  Sparkles
} from 'lucide-react';

interface MobileBottomNavProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onOpenStudentModal: () => void;
  onOpenCommandPalette: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeSection,
  onNavigate,
  onOpenStudentModal,
  onOpenCommandPalette
}) => {
  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-2 py-2 bg-[#071326]/95 backdrop-blur-xl border-t border-[#1d3e70] shadow-2xl shadow-black/80"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        <button
          onClick={() => onNavigate('home')}
          aria-current={activeSection === 'home' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition min-h-[48px] min-w-[48px] ${
            activeSection === 'home'
              ? 'text-sky-300 font-bold bg-sky-950/60 border border-sky-500/30'
              : 'text-slate-300 hover:text-white'
          }`}
          aria-label="Home Overview"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          <span className="text-[11px] font-medium leading-none">Home</span>
        </button>

        <button
          onClick={() => onNavigate('team')}
          aria-current={activeSection === 'team' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition min-h-[48px] min-w-[48px] ${
            activeSection === 'team'
              ? 'text-sky-300 font-bold bg-sky-950/60 border border-sky-500/30'
              : 'text-slate-300 hover:text-white'
          }`}
          aria-label="Team Roster & Hub"
        >
          <Users className="w-4 h-4" aria-hidden="true" />
          <span className="text-[11px] font-medium leading-none">Team</span>
        </button>

        <button
          onClick={() => onNavigate('outreach')}
          aria-current={activeSection === 'outreach' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition min-h-[48px] min-w-[48px] relative ${
            activeSection === 'outreach'
              ? 'text-amber-300 font-bold bg-amber-950/60 border border-amber-500/30'
              : 'text-slate-300 hover:text-amber-300'
          }`}
          aria-label="Circuit 2026 Outreach"
        >
          <Sparkles className="w-4 h-4 text-amber-400" aria-hidden="true" />
          <span className="text-[11px] font-medium leading-none">Outreach</span>
        </button>

        <button
          onClick={() => onNavigate('robots')}
          aria-current={activeSection === 'robots' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition min-h-[48px] min-w-[48px] ${
            activeSection === 'robots'
              ? 'text-sky-300 font-bold bg-sky-950/60 border border-sky-500/30'
              : 'text-slate-300 hover:text-white'
          }`}
          aria-label="Robots & CAD"
        >
          <Compass className="w-4 h-4" aria-hidden="true" />
          <span className="text-[11px] font-medium leading-none">CAD</span>
        </button>

        <button
          onClick={() => onNavigate('simulator')}
          aria-current={activeSection === 'simulator' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition min-h-[48px] min-w-[48px] ${
            activeSection === 'simulator'
              ? 'text-sky-300 font-bold bg-sky-950/60 border border-sky-500/30'
              : 'text-slate-300 hover:text-white'
          }`}
          aria-label="Field Simulator"
        >
          <Activity className="w-4 h-4" aria-hidden="true" />
          <span className="text-[11px] font-medium leading-none">Sim</span>
        </button>

        {/* Quick Search */}
        <button
          onClick={onOpenCommandPalette}
          className="flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl text-slate-300 hover:text-white min-h-[48px] min-w-[48px]"
          aria-label="Search and Commands"
        >
          <Search className="w-4 h-4 text-sky-400" aria-hidden="true" />
          <span className="text-[11px] font-medium leading-none">Search</span>
        </button>
      </div>
    </nav>
  );
};

