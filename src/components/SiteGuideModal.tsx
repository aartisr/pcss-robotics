import { ArrowRight, BookOpen, Gamepad2, HeartHandshake, Map, Sparkles, Users, Wrench } from 'lucide-react';
import type { NavSection } from '../types';
import { Modal } from './ui/Modal';

const destinations = [
  { section: 'outreach', title: 'Jams & events', detail: 'Hack Club Haven and the Circuit archive', icon: Sparkles },
  { section: 'team', title: 'Meet the team', detail: 'People and student projects', icon: Users },
  { section: 'robots', title: 'Explore robots', detail: 'Designs and mechanisms', icon: Wrench },
  { section: 'research', title: 'Try the learning lab', detail: 'Interactive mecanum drive model', icon: BookOpen },
  { section: 'simulator', title: 'Try the simulator', detail: 'Explore path planning and controls', icon: Map },
  { section: 'arcade', title: 'Play the arcade', detail: 'An interactive driving game', icon: Gamepad2 },
  { section: 'sponsors', title: 'Support the team', detail: 'Current ways to help', icon: HeartHandshake }
] as const satisfies ReadonlyArray<{ section: NavSection; title: string; detail: string; icon: typeof Sparkles }>;

interface SiteGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: NavSection) => void;
}

export function SiteGuideModal({ isOpen, onClose, onNavigate }: SiteGuideModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Explore PCSS II Robotics" subtitle="Choose where you want to go" icon={<Map className="h-5 w-5" />} maxWidth="xl">
      <div className="grid gap-3 sm:grid-cols-2">
        {destinations.map(({ section, title, detail, icon: Icon }) => (
          <button key={section} type="button" onClick={() => { onNavigate(section); onClose(); }} className="group flex min-h-20 items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-left transition hover:border-sky-500/50 hover:bg-sky-950/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300">
            <Icon className="h-5 w-5 shrink-0 text-sky-300" aria-hidden="true" />
            <span className="min-w-0 flex-1"><span className="block font-bold text-white">{title}</span><span className="mt-1 block text-xs text-slate-300">{detail}</span></span>
            <ArrowRight className="h-4 w-4 shrink-0 text-sky-300 transition group-hover:translate-x-1" aria-hidden="true" />
          </button>
        ))}
      </div>
      <p className="mt-6 text-xs leading-relaxed text-slate-400">For current school membership, venue, or sponsorship details, please contact Pioneer Charter School of Science II directly.</p>
    </Modal>
  );
}
