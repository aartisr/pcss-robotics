import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, CalendarDays, FileText, HeartHandshake, Mail, ShieldCheck, Users, Wrench } from 'lucide-react';
import { eventPhase, featuredEvent } from '../features/events/events';
import { Modal } from './ui/Modal';

const SCHOOL_CONTACT_URL = 'https://saugus.pioneercss.org/apps/contact/';

const supportAreas = [
  { title: 'Equip a student build', description: 'Parts, sensors, tools, and fabrication materials give a design room to become a working prototype.', prompt: 'Ask for the team’s current equipment wish list.', icon: Wrench },
  { title: 'Make participation possible', description: 'Registration, travel, workshop supplies, and event essentials can make hands-on learning more accessible.', prompt: 'Ask which upcoming costs still need support.', icon: CalendarDays },
  { title: 'Share what you know', description: 'Engineers, designers, makers, and communicators can help students test ideas and see where their skills might lead.', prompt: 'Offer a school-approved talk or mentorship session.', icon: Users }
] as const;

interface SponsorCommandCenterProps {
  externalOpenW9Modal?: boolean;
  onResetExternalW9Modal?: () => void;
}

export function SponsorCommandCenter({ externalOpenW9Modal, onResetExternalW9Modal }: SponsorCommandCenterProps) {
  const [showDocuments, setShowDocuments] = useState(false);
  const currentEvent = featuredEvent();
  const hasCurrentEvent = eventPhase(currentEvent) !== 'past';

  useEffect(() => {
    if (!externalOpenW9Modal) return;
    setShowDocuments(true);
    onResetExternalW9Modal?.();
  }, [externalOpenW9Modal, onResetExternalW9Modal]);

  return (
    <section className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="max-w-4xl">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-sky-300"><HeartHandshake className="h-4 w-4" aria-hidden="true" />Partner with students</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">Give an idea the chance to become real.</h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">At PCSS II Robotics, students learn by designing, building, testing, and improving together. A sponsor can put practical resources and experienced people within reach of that work.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href={SCHOOL_CONTACT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"><Mail className="h-4 w-4" aria-hidden="true" />Start a sponsorship conversation <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
          <button type="button" onClick={() => setShowDocuments(true)} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"><FileText className="h-4 w-4" aria-hidden="true" />Nonprofit documentation</button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-sky-400/20 bg-gradient-to-br from-sky-950/70 to-slate-900/70 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-sky-300">What a partnership makes possible</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">A place to try, fail, learn, and try again.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">Robotics is built from many small decisions: a part selected, a prototype revised, a test repeated. Support helps students get the materials, access, and guidance to make those decisions for themselves.</p>
          <p className="mt-5 text-sm font-semibold text-sky-200">We can discuss a focused need and a clear way to follow its progress.</p>
        </div>
        <aside className="rounded-3xl border border-emerald-400/20 bg-emerald-950/20 p-6 sm:p-8" aria-labelledby="nonprofit-title">
          <ShieldCheck className="h-7 w-7 text-emerald-300" aria-hidden="true" />
          <h2 id="nonprofit-title" className="mt-4 text-xl font-bold text-white">501(c)(3) nonprofit status</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">PCSS II Robotics has described its program as a 501(c)(3) nonprofit. For a contribution, the school can confirm the current legal receiving organization and provide the applicable tax documents.</p>
          <button type="button" onClick={() => setShowDocuments(true)} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-emerald-200 underline underline-offset-4 hover:text-white">How to verify and request documents <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
        </aside>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Choose the kind of help you can offer.</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">These are starting points. The team can confirm its current needs before any commitment.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {supportAreas.map(({ title, description, prompt, icon: Icon }) => (
            <article key={title} className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
              <Icon className="h-7 w-7 text-sky-300" aria-hidden="true" />
              <h3 className="mt-5 text-xl font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{description}</p>
              <p className="mt-5 border-t border-white/10 pt-4 text-sm font-medium text-sky-200">{prompt}</p>
            </article>
          ))}
        </div>
      </div>

      {hasCurrentEvent && (
        <div className="rounded-3xl border border-amber-400/20 bg-amber-950/20 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-amber-200">Current community opportunity</p>
          <h2 className="mt-3 text-2xl font-bold text-white">Help make {currentEvent.name} welcoming.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">{currentEvent.summary} Ask the organizers whether event supplies, participant essentials, or volunteer expertise would be useful.</p>
          <a href="/outreach/" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-amber-200 underline underline-offset-4 hover:text-white">Explore the event <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
        </div>
      )}

      <div className="grid gap-6 rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">A good first message is simple.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">Tell the school you’d like to support PCSS II Robotics, what kind of help you can offer, and how to reach you. Ask for the team’s current needs, the process for contributing, and any recognition or documentation your organization requires.</p>
          <p className="mt-3 text-xs text-slate-400">The school handles contribution terms, receipts, and tax documentation. This website does not accept payments or record pledges.</p>
        </div>
        <a href={SCHOOL_CONTACT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 hover:bg-sky-100">Contact Pioneer Charter School of Science II <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
      </div>

      <Modal isOpen={showDocuments} onClose={() => setShowDocuments(false)} title="Nonprofit and sponsorship documents" subtitle="Request current records from the school" icon={<FileText className="h-5 w-5" />} maxWidth="md">
        <p className="text-sm leading-relaxed text-slate-300">PCSS II Robotics has identified as a 501(c)(3) nonprofit. Before making a contribution, ask the school to confirm the legal recipient, EIN, current exemption documentation, W-9 if needed, and how a gift should be designated for robotics.</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">Deductibility depends on the recipient, the contribution, and your circumstances. The school can provide records for your review; your tax adviser can assess your situation.</p>
        <a href={SCHOOL_CONTACT_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-500">Request documents from the school <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
      </Modal>
    </section>
  );
}
