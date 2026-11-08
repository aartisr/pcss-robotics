import { ArrowUpRight, GraduationCap, Mail, Wrench, Users } from 'lucide-react';
import { Modal } from './ui/Modal';

const SCHOOL_CONTACT_URL = 'https://saugus.pioneercss.org/apps/contact/';
const SCHOOL_CLUBS_URL = 'https://saugus.pioneercss.org/apps/departments/clubs.jsp';

interface StudentJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StudentJoinModal({ isOpen, onClose }: StudentJoinModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Join PCSS II Robotics" subtitle="Find the right first step" icon={<GraduationCap className="h-5 w-5" />} maxWidth="lg">
      <div className="space-y-6 text-sm text-slate-200">
        <p className="leading-relaxed">Interested in designing, coding, building, or sharing robotics projects? Ask the school about joining PCSS II Robotics. Beginners are welcome.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <Wrench className="h-5 w-5 text-sky-300" aria-hidden="true" />
            <h4 className="mt-3 font-bold text-white">Learn by making</h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">Explore design, software, electronics, outreach, or team operations with other students.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <Users className="h-5 w-5 text-sky-300" aria-hidden="true" />
            <h4 className="mt-3 font-bold text-white">Start with a conversation</h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">Ask a teacher or the school contact office for current meeting and participation details.</p>
          </div>
        </div>
        <div className="rounded-2xl border border-sky-500/30 bg-sky-950/30 p-4">
          <p className="font-semibold text-white">Ready to ask about joining?</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">The school handles inquiries through its official contact page. This website does not collect student applications.</p>
          <a href={SCHOOL_CONTACT_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2 font-bold text-white hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300">
            <Mail className="h-4 w-4" aria-hidden="true" /> Contact the school <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        <a href={SCHOOL_CLUBS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sky-300 underline underline-offset-4 hover:text-sky-200">Browse school clubs and activities <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
      </div>
    </Modal>
  );
}
