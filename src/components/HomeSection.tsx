import { ArrowRight, ArrowUpRight, BookOpen, Gamepad2, HeartHandshake, Wrench } from 'lucide-react';
import type { NavSection } from '../types';
import { HeroSection } from './HeroSection';
import { FeaturedEventTeaser } from '../features/events/FeaturedEventTeaser';
import { learningResources } from '../features/learning/resources';

interface HomeSectionProps {
  onNavigate: (section: NavSection) => void;
  onOpenGuide: () => void;
  onOpenStudentModal: () => void;
  onOpenW9: () => void;
}

const explorations = [
  { section: 'robots', title: 'Explore robot design', description: 'See how movement, mechanisms, and sensors shape a robot.', icon: Wrench },
  { section: 'research', title: 'Try the learning lab', description: 'Change motion inputs and see how mecanum wheel speeds respond.', icon: BookOpen },
  { href: learningResources.pat.url, title: 'Learn game programming', description: 'Use PAT to start a small playable idea for Haven or your next project.', icon: Gamepad2 }
] as const;

export function HomeSection({ onNavigate, onOpenGuide, onOpenStudentModal, onOpenW9 }: HomeSectionProps) {
  return (
    <div className="space-y-16 pb-16 sm:space-y-20">
      <HeroSection onNavigate={onNavigate} onOpenGuide={onOpenGuide} onOpenStudentModal={onOpenStudentModal} />
      <FeaturedEventTeaser onNavigate={onNavigate} />
      <section aria-labelledby="explore-title" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-sky-300">Explore the work</p>
        <h2 id="explore-title" className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">More ways to get curious.</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {explorations.map(item => {
            const Icon = item.icon;
            const content = <><Icon className="h-7 w-7 text-sky-300" aria-hidden="true" /><h3 className="mt-6 text-xl font-bold text-white">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-300">{item.description}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-300">{('href' in item) ? 'Start learning' : 'Explore'} {('href' in item) ? <ArrowUpRight className="h-4 w-4" aria-hidden="true" /> : <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />}</span></>;
            const className = 'group rounded-3xl border border-white/10 bg-[#0b1e3b]/70 p-6 text-left transition hover:border-sky-400/50 hover:bg-[#102a52] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300';
            return 'href' in item ? <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={className}>{content}</a> : <button key={item.section} type="button" onClick={() => onNavigate(item.section)} className={className}>{content}</button>;
          })}
        </div>
      </section>
      <section aria-labelledby="participate-title" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-sky-500/25 bg-gradient-to-br from-[#123058] to-[#0b1e3b] p-7 sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-sky-300">For students</p>
            <h2 id="participate-title" className="mt-3 text-2xl font-black text-white">There’s room to learn.</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-200">You can start with curiosity. Ask the school how to join the team and what opportunities are available this season.</p>
            <button type="button" onClick={onOpenStudentModal} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-500">Learn how to join <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
          </div>
          <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-[#2a2633] to-[#0b1e3b] p-7 sm:p-9">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-amber-300"><HeartHandshake className="h-4 w-4" aria-hidden="true" />Sponsorship</p>
            <h2 className="mt-3 text-2xl font-black text-white">Sponsor student robotics.</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-200">Help students build with materials, mentorship, or event support. PCSS II Robotics has identified as a 501(c)(3) nonprofit; the school can provide current tax documents and confirm the legal recipient.</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <button type="button" onClick={() => onNavigate('sponsors')} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-amber-400">View sponsorship page <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
              <button type="button" onClick={onOpenW9} className="text-sm font-semibold text-amber-200 underline underline-offset-4 hover:text-white">Ask about documentation</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
