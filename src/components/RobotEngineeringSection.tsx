import { ArrowRight, Compass, Lightbulb, ScanEye, Wrench } from 'lucide-react';
import { ENGINEERING_TOPICS } from '../data/roboticsData';

const icons = { drive: Compass, mechanisms: Wrench, sensing: ScanEye };

export function RobotEngineeringSection() {
  return <section className="mx-auto max-w-6xl space-y-12 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
    <header className="max-w-3xl space-y-5">
      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-300"><Wrench className="h-4 w-4" aria-hidden="true" /> Robot engineering</p>
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">A robot is a series of decisions.</h1>
      <p className="text-lg leading-relaxed text-slate-300">Explore the questions behind a competition robot: how it moves, handles objects, and senses the field. These are design concepts, not specifications for a particular team robot.</p>
    </header>
    <div className="space-y-5">
      {ENGINEERING_TOPICS.map((topic, index) => {
        const Icon = icons[topic.id as keyof typeof icons] ?? Lightbulb;
        return <article key={topic.id} className="grid gap-6 rounded-3xl border border-white/10 bg-slate-900/75 p-6 sm:p-8 md:grid-cols-[.8fr_1.2fr]">
          <div><span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300"><Icon className="h-5 w-5" aria-hidden="true" /></span><p className="text-xs font-semibold uppercase tracking-widest text-sky-300">Question {index + 1}</p><h2 className="mt-2 text-2xl font-bold text-white">{topic.title}</h2><p className="mt-2 text-sm font-medium text-amber-200">{topic.question}</p></div>
          <div><p className="text-base leading-relaxed text-slate-300">{topic.summary}</p><ol className="mt-6 space-y-3">{topic.steps.map(step => <li key={step} className="flex items-start gap-3 text-sm text-slate-200"><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" aria-hidden="true" />{step}</li>)}</ol></div>
        </article>;
      })}
    </div>
    <p className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm leading-relaxed text-slate-300">Robot profiles can be added when photos, build notes, and specifications are ready to publish. The concepts above are a starting point for asking better engineering questions.</p>
  </section>;
}
