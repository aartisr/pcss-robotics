import { Home, Search, Sparkles, Users } from 'lucide-react';
import type { NavSection } from '../types';

interface MobileBottomNavProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onOpenCommandPalette: () => void;
}

const destinations = [
  { section: 'home', label: 'Home', icon: Home },
  { section: 'team', label: 'Team', icon: Users },
  { section: 'outreach', label: 'Events', icon: Sparkles }
] as const;

export function MobileBottomNav({ activeSection, onNavigate, onOpenCommandPalette }: MobileBottomNavProps) {
  return <nav aria-label="Quick navigation" className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#1d3e70] bg-[#071326]/95 px-2 py-2 shadow-2xl shadow-black/80 backdrop-blur-xl md:hidden">
    <div className="mx-auto flex max-w-lg items-center justify-around">
      {destinations.map(({ section, label, icon: Icon }) => <button key={section} type="button" onClick={() => onNavigate(section)} aria-current={activeSection === section ? 'page' : undefined} className={`flex min-h-12 min-w-14 flex-col items-center justify-center gap-1 rounded-xl px-3 text-xs font-medium ${activeSection === section ? 'bg-sky-950 text-sky-200' : 'text-slate-300 hover:text-white'}`}><Icon className="h-5 w-5" aria-hidden="true" /><span>{label}</span></button>)}
      <button type="button" onClick={onOpenCommandPalette} className="flex min-h-12 min-w-14 flex-col items-center justify-center gap-1 rounded-xl px-3 text-xs font-medium text-slate-300 hover:text-white" aria-label="Search all pages"><Search className="h-5 w-5" aria-hidden="true" /><span>Search</span></button>
    </div>
  </nav>;
}
