import { ArrowRight, ArrowUpRight, Bot, GraduationCap } from 'lucide-react';
import type { NavSection } from '../types';
import labHeroWebp from '../assets/robotics-lab-hero.webp';

interface HeroSectionProps {
  onNavigate: (section: NavSection) => void;
  onOpenGuide: () => void;
  onOpenStudentModal: () => void;
}

export function HeroSection({ onNavigate, onOpenGuide, onOpenStudentModal }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden py-10 sm:py-16 lg:py-20" aria-labelledby="home-title">
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-[70rem] -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-14 lg:px-8">
        <div>
          <a href="https://saugus.pioneercss.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-950/50 px-3 py-2 text-xs font-semibold text-sky-200 hover:bg-sky-900/60">
            <GraduationCap className="h-4 w-4" aria-hidden="true" /> Pioneer Charter School of Science II <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </a>
          <p className="mt-7 text-xs font-bold uppercase tracking-[.24em] text-amber-300">FTC Team #23548 · Saugus, Massachusetts</p>
          <h1 id="home-title" className="mt-4 max-w-3xl text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Build a robot.<br /><span className="bg-gradient-to-r from-sky-300 to-amber-200 bg-clip-text text-transparent">Find your team.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-200">PCSS II Robotics brings students together to design, code, test, and share what they make. Explore the team’s projects, try an interactive simulator, or join the next community jam.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => onNavigate('team')} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300">Meet the team <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
            <button type="button" onClick={() => onNavigate('outreach')} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-sky-400/40 bg-slate-900/70 px-5 py-3 text-sm font-bold text-sky-100 hover:bg-sky-950">Explore events</button>
            <button type="button" onClick={onOpenStudentModal} className="inline-flex min-h-12 items-center justify-center px-3 py-3 text-sm font-semibold text-slate-200 underline decoration-sky-400/60 underline-offset-4 hover:text-white">How to join</button>
          </div>
          <button type="button" onClick={onOpenGuide} className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-sky-200"><Bot className="h-4 w-4" aria-hidden="true" />Have a question? Ask the site guide</button>
        </div>
        <figure className="overflow-hidden rounded-[2rem] border border-sky-500/20 bg-[#0b1e3b] shadow-2xl shadow-black/30">
          <img src={labHeroWebp} alt="Illustration of students collaborating around a robot in a workshop" className="aspect-[4/3] w-full object-cover" loading="eager" fetchPriority="high" />
          <figcaption className="border-t border-sky-500/20 px-5 py-3 text-xs text-slate-400">Illustrative robotics workshop scene</figcaption>
        </figure>
      </div>
    </section>
  );
}
