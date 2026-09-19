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
  Layers, 
  Cpu, 
  Check, 
  Command,
  FileText,
  FlaskConical,
  BookOpen,
  Calculator,
  Microscope
} from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: NavSection) => void;
  onOpenAi: () => void;
  onOpenStudentModal: () => void;
  onOpenW9Modal: () => void;
  onToggleAura: () => void;
}

interface PaletteItem {
  id: string;
  category: 'Navigation' | 'Actions' | 'Robots' | 'Sponsors & Charity';
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
  onOpenAi,
  onOpenStudentModal,
  onOpenW9Modal,
  onToggleAura
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const items: PaletteItem[] = [
    // Navigation
    {
      id: 'nav-home',
      category: 'Navigation',
      title: 'Lab Overview & Flagship Robot',
      subtitle: 'Kraken V2 specifications, laboratory mission & metrics',
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      keywords: ['home', 'overview', 'kraken', 'stats', 'mission', 'about'],
      action: () => onNavigate('home')
    },
    {
      id: 'nav-research',
      category: 'Navigation',
      title: 'Laboratory Research Papers & Preprints',
      subtitle: '4 peer-reviewed technical reports, LaTeX theorems & BibTeX',
      icon: <FlaskConical className="w-4 h-4 text-cyan-400" />,
      keywords: ['research', 'papers', 'latex', 'bibtex', 'equations', 'theorems', 'kinematics', 'preprints', 'doi', 'scholar', 'ieee'],
      action: () => onNavigate('research')
    },
    {
      id: 'nav-workbench',
      category: 'Actions',
      title: 'Kinematics & PIDF Lab Workbench',
      subtitle: 'Solve holonomic Mecanum Jacobian matrix and live motor RPM',
      icon: <Calculator className="w-4 h-4 text-cyan-400" />,
      keywords: ['jacobian', 'matrix', 'kinematics', 'pid', 'pidf', 'solver', 'calculator', 'workbench', 'controls'],
      action: () => onNavigate('research')
    },
    {
      id: 'nav-metrology',
      category: 'Actions',
      title: 'Laboratory Metrology & Instrumentation Registry',
      subtitle: 'Haas CNC, Formlabs SLA 25µm, Markforged Carbon Fiber, Tektronix',
      icon: <Microscope className="w-4 h-4 text-purple-400" />,
      keywords: ['instrumentation', 'metrology', 'haas', 'cnc', 'formlabs', 'sla', 'oscilloscope', 'equipment'],
      action: () => onNavigate('research')
    },
    {
      id: 'nav-robots',
      category: 'Navigation',
      title: 'Robots & CAD Subsystems',
      subtitle: 'Kraken V2, Scrapyard, Daydream Onshape designs',
      icon: <Compass className="w-4 h-4 text-cyan-400" />,
      keywords: ['robots', 'cad', 'onshape', 'hardware', 'subsystems', 'slides'],
      action: () => onNavigate('robots')
    },
    {
      id: 'nav-simulator',
      category: 'Navigation',
      title: 'Autonomous Field Simulator (144")',
      subtitle: '500Hz optical odometry, RoadRunner splines, into the deep',
      icon: <Activity className="w-4 h-4 text-cyan-400" />,
      keywords: ['simulator', 'autonomous', 'telemetry', 'field', 'roadrunner', 'otos'],
      action: () => onNavigate('simulator')
    },
    {
      id: 'nav-sponsors',
      category: 'Navigation',
      title: '501(c)(3) Corporate Sponsorship Command',
      subtitle: 'Tax write-off ROI calculator, tiers, brand impressions',
      icon: <HeartHandshake className="w-4 h-4 text-purple-400" />,
      keywords: ['sponsor', 'tax', '501c3', 'donate', 'w9', 'corporate', 'roi'],
      action: () => onNavigate('sponsors')
    },
    {
      id: 'nav-outreach',
      category: 'Navigation',
      title: 'Circuit 2026 & Youth Outreach',
      subtitle: 'Mentoring 450+ middle schoolers, community workshops',
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      keywords: ['outreach', 'circuit', 'middle school', 'stem', 'workshops', 'mentorship'],
      action: () => onNavigate('outreach')
    },
    {
      id: 'nav-arcade',
      category: 'Navigation',
      title: 'Cyber Driver Arcade (TeleOp Arena)',
      subtitle: 'Drive Kraken V2 and collect game samples in real-time',
      icon: <Gamepad2 className="w-4 h-4 text-amber-400" />,
      keywords: ['arcade', 'game', 'play', 'drive', 'teleop', 'sample'],
      action: () => onNavigate('arcade')
    },
    {
      id: 'nav-team',
      category: 'Navigation',
      title: 'Team Roster & Skunkworks Leads',
      subtitle: 'Hardware, software, electrical, and business divisions',
      icon: <Users className="w-4 h-4 text-slate-300" />,
      keywords: ['team', 'members', 'roster', 'students', 'mentors', 'leads'],
      action: () => onNavigate('team')
    },

    // Actions
    {
      id: 'action-student',
      category: 'Actions',
      title: 'Join PCSS II Robotics (Grades 6–12)',
      subtitle: 'Submit quick application — zero prior experience required',
      icon: <GraduationCap className="w-4 h-4 text-cyan-400" />,
      keywords: ['join', 'apply', 'student', 'freshman', 'middle school', 'signup'],
      action: onOpenStudentModal
    },
    {
      id: 'action-w9',
      category: 'Sponsors & Charity',
      title: 'Request IRS 501(c)(3) Tax Exemption Packet & W-9',
      subtitle: 'Download official entity determination letter & W-9 for tax deductions',
      icon: <Download className="w-4 h-4 text-emerald-400" />,
      keywords: ['w9', 'tax', 'irs', 'packet', 'deduction', 'form'],
      action: onOpenW9Modal
    },
    {
      id: 'action-ai',
      category: 'Actions',
      title: 'Ask RoboBot AI Strategy Engine',
      subtitle: 'Query robot rules, match strategy, and autonomous algorithms',
      icon: <Bot className="w-4 h-4 text-purple-400" />,
      keywords: ['ai', 'robobot', 'chat', 'ask', 'strategy', 'gemini', 'rules'],
      action: onOpenAi
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
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
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
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-3xl border border-white/15 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, robot, or search (e.g., 'W-9', 'Simulator', 'Join', 'CAD')..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 hover:text-white transition"
          >
            ESC
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
                  onOpenAi();
                  onClose();
                }}
                className="inline-flex items-center gap-1 text-xs text-cyan-400 font-bold hover:underline"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask RoboBot AI instead &rarr;</span>
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
        <div className="p-3 border-t border-white/10 bg-slate-950/90 text-[11px] font-mono text-slate-400 flex items-center justify-between">
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
