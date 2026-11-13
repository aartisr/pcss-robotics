import React, { useState, useEffect, useRef } from 'react';
import { NavSection } from '../types';
import { 
  Search, 
  X, 
  ArrowRight, 
  Bot, 
  Compass, 
  Activity, 
  HeartHandshake, 
  Sparkles, 
  Gamepad2, 
  Users, 
  GraduationCap, 
  Download, 
  Cpu, 
  Check, 
  Command,
  BookOpen,
} from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: NavSection) => void;
  onOpenGuide: () => void;
  onOpenStudentModal: () => void;
  onOpenW9Modal: () => void;
  onToggleAura: () => void;
}

interface PaletteItem {
  id: string;
  category: 'Navigation' | 'Actions' | 'Support';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  keywords: string[];
  action: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenGuide,
  onOpenStudentModal,
  onOpenW9Modal,
  onToggleAura
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const items: PaletteItem[] = [
    // Navigation
    {
      id: 'nav-home',
      category: 'Navigation',
      title: 'Home overview',
      subtitle: 'Meet the team and explore what we build',
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      keywords: ['home', 'overview', 'kraken', 'stats', 'mission', 'about'],
      action: () => onNavigate('home')
    },
    {
      id: 'nav-research',
      category: 'Navigation',
      title: 'Robotics learning lab',
      subtitle: 'Explore mecanum drive motion',
      icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
      keywords: ['research', 'learning', 'kinematics', 'mecanum', 'calculator', 'wheel speed'],
      action: () => onNavigate('research')
    },
    {
      id: 'nav-robots',
      category: 'Navigation',
      title: 'Robot engineering',
      subtitle: 'Explore the decisions behind a robot design',
      icon: <Compass className="w-4 h-4 text-cyan-400" />,
      keywords: ['robots', 'cad', 'onshape', 'hardware', 'subsystems', 'slides'],
      action: () => onNavigate('robots')
    },
    {
      id: 'nav-simulator',
      category: 'Navigation',
      title: 'Autonomous simulator',
      subtitle: 'See how waypoints shape a path',
      icon: <Activity className="w-4 h-4 text-cyan-400" />,
      keywords: ['simulator', 'autonomous', 'telemetry', 'field', 'roadrunner', 'otos'],
      action: () => onNavigate('simulator')
    },
    {
      id: 'nav-sponsors',
      category: 'Navigation',
      title: 'Support student robotics',
      subtitle: 'Explore ways to help and contact the school',
      icon: <HeartHandshake className="w-4 h-4 text-purple-400" />,
      keywords: ['sponsor', 'support', 'donate', 'mentor', 'corporate'],
      action: () => onNavigate('sponsors')
    },
    {
      id: 'nav-outreach',
      category: 'Navigation',
      title: 'Hack Club Haven, jams & event history',
      subtitle: 'Upcoming game jam and the Circuit 2026 archive',
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      keywords: ['outreach', 'haven', 'hack club', 'game jam', 'circuit', 'events', 'history'],
      action: () => onNavigate('outreach')
    },
    {
      id: 'nav-arcade',
      category: 'Navigation',
      title: 'Robotics arcade',
      subtitle: 'Try a playful robot driving simulation',
      icon: <Gamepad2 className="w-4 h-4 text-amber-400" />,
      keywords: ['arcade', 'game', 'play', 'drive', 'teleop', 'sample'],
      action: () => onNavigate('arcade')
    },
    {
      id: 'nav-team',
      category: 'Navigation',
      title: 'Team and ways to participate',
      subtitle: 'Explore club activities and how to get involved',
      icon: <Users className="w-4 h-4 text-slate-300" />,
      keywords: ['team', 'members', 'roster', 'students', 'mentors', 'leads'],
      action: () => onNavigate('team')
    },

    // Actions
    {
      id: 'action-student',
      category: 'Actions',
      title: 'Join PCSS II Robotics (Grades 6–12)',
      subtitle: 'Find out how to ask the school about joining',
      icon: <GraduationCap className="w-4 h-4 text-cyan-400" />,
      keywords: ['join', 'apply', 'student', 'freshman', 'middle school', 'signup'],
      action: onOpenStudentModal
    },
    {
      id: 'action-w9',
      category: 'Support',
      title: 'Ask about sponsorship documentation',
      subtitle: 'Contact the school for current forms and terms',
      icon: <Download className="w-4 h-4 text-emerald-400" />,
      keywords: ['w9', 'tax', 'irs', 'packet', 'deduction', 'form'],
      action: onOpenW9Modal
    },
    {
      id: 'action-ai',
      category: 'Actions',
      title: 'Open site guide',
      subtitle: 'Find a page or section of the website',
      icon: <Bot className="w-4 h-4 text-purple-400" />,
      keywords: ['guide', 'help', 'pages', 'navigate', 'find'],
      action: onOpenGuide
    },
    {
      id: 'action-aura',
      category: 'Actions',
      title: 'Switch Celestial Atmosphere Theme',
      subtitle: 'Toggle between Celestial Cyan, Astral Violet, and Starlight Gold',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      keywords: ['aura', 'theme', 'color', 'celestial', 'starlight', 'mode'],
      action: onToggleAura
    }
  ];

  // Filter items based on query
  const filtered = items.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.includes(q))
    );
  });

  useEffect(() => {
    if (isOpen) {
      const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setQuery('');
      setSelectedIndex(0);
      const focusFrame = requestAnimationFrame(() => inputRef.current?.focus());
      return () => { cancelAnimationFrame(focusFrame); previouslyFocused?.focus(); };
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && dialogRef.current) {
      const controls = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('input, button:not([disabled])'));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center sm:items-start justify-center p-4 sm:pt-24 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search pages and actions"
        className="w-full max-w-xl rounded-3xl border border-white/15 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-7rem)]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            aria-label="Search pages and actions"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages and actions (e.g. events, team, robots)..."
            className="min-w-0 w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            className="min-h-11 min-w-11 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition flex items-center justify-center"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Command className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs">No matching actions or pages found for &quot;{query}&quot;.</p>
              <button
                onClick={() => {
                  onOpenGuide();
                  onClose();
                }}
                className="inline-flex items-center gap-1 text-xs text-cyan-400 font-bold hover:underline"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Open the site guide &rarr;</span>
              </button>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition ${
                    isSelected
                      ? 'bg-cyan-950/80 border border-cyan-500/40 text-white shadow-sm'
                      : 'border border-transparent text-slate-300 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-cyan-900/60 text-white' : 'bg-slate-900 text-slate-400'}`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm truncate text-white">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 shrink-0 transition ${isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600 opacity-0'}`} />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="hidden sm:flex p-3 border-t border-white/10 bg-slate-950/90 text-[11px] font-mono text-slate-400 items-center justify-between">
          <div className="flex items-center gap-3">
            <span>&uarr;&darr; Navigate</span>
            <span>&crarr; Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-cyan-400">PCSS II Command Engine</span>
        </div>
      </div>
    </div>
  );
};
