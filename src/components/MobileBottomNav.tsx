import React from 'react';
import { NavSection } from '../types';
import { 
  Home, 
  Compass, 
  Activity, 
  HeartHandshake, 
  GraduationCap, 
  Search,
  Sparkles,
  FlaskConical
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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-2 py-1.5 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 shadow-2xl shadow-cyan-950/50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
            activeSection === 'home'
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Home Overview"
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => onNavigate('research')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
            activeSection === 'research'
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Research & Papers"
        >
          <FlaskConical className="w-4 h-4" />
          <span className="text-[10px]">Research</span>
        </button>

        <button
          onClick={() => onNavigate('robots')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
            activeSection === 'robots'
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Robots & CAD"
        >
          <Compass className="w-4 h-4" />
          <span className="text-[10px]">Robots</span>
        </button>

        <button
          onClick={() => onNavigate('simulator')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
            activeSection === 'simulator'
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Field Simulator"
        >
          <Activity className="w-4 h-4" />
          <span className="text-[10px]">Sim</span>
        </button>

        <button
          onClick={() => onNavigate('sponsors')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
            activeSection === 'sponsors'
              ? 'text-purple-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Sponsors"
        >
          <HeartHandshake className="w-4 h-4" />
          <span className="text-[10px]">Sponsors</span>
        </button>

        {/* Quick Search */}
        <button
          onClick={onOpenCommandPalette}
          className="flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-slate-400 hover:text-white"
          aria-label="Search and Commands"
        >
          <Search className="w-4 h-4" />
          <span className="text-[10px]">Search</span>
        </button>
      </div>
    </div>
  );
};
