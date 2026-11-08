import { ArrowUpRight, BookOpen, CalendarDays, Check, Clock3, Code2, Gamepad2, History, MapPin, Sparkles, Trophy, Users } from 'lucide-react';
import { communityEvents, eventPhase, featuredEvent, formatEventDates, type CommunityEvent } from '../features/events/events';
import { learningResources } from '../features/learning/resources';

const featureIcons = [Code2, Users, Trophy];

function EventLink({ event, prominent = false }: { event: CommunityEvent; prominent?: boolean }) {
  if (!event.registrationUrl || eventPhase(event) === 'past') return null;
  const accent = event.tone === 'citrus';
  return (
    <a
      href={event.registrationUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={prominent
        ? `inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-black shadow-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${accent ? 'bg-[#c7db35] text-[#142414] shadow-lime-950/30 hover:bg-[#d9ec52] focus-visible:outline-[#d9ec52]' : 'bg-sky-300 text-slate-950 shadow-sky-950/30 hover:bg-sky-200 focus-visible:outline-sky-200'}`
        : `inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${accent ? 'border-lime-400/40 text-lime-200 hover:bg-lime-400/10' : 'border-sky-400/40 text-sky-200 hover:bg-sky-400/10'}`}
    >
      {event.registrationLabel ?? `Explore ${event.name}`} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

function EventFacts({ event }: { event: CommunityEvent }) {
  const facts = [
    { icon: CalendarDays, label: 'When', value: formatEventDates(event) },
    { icon: Clock3, label: 'Hours', value: event.dailyHours },
    { icon: MapPin, label: 'Where', value: event.place }
  ];
  return (
    <dl className="grid gap-3 sm:grid-cols-3">
      {facts.map(({ icon: Icon, label, value }) => (
        <div key={label} className="rounded-2xl border border-white/15 bg-[#0b1e30]/70 p-4 backdrop-blur-sm">
          <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-lime-300"><Icon className="h-4 w-4" aria-hidden="true" />{label}</dt>
          <dd className="mt-2 text-sm font-semibold leading-snug text-white">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function FeaturedEvent({ event }: { event: CommunityEvent }) {
  const phase = eventPhase(event);
  const accent = event.tone === 'citrus';
  return (
    <article id={event.id} className={`relative isolate overflow-hidden rounded-[2rem] border shadow-2xl shadow-black/30 scroll-mt-32 ${accent ? 'border-lime-500/30 bg-[#152b25]' : 'border-sky-500/30 bg-[#102545]'}`}>
      <div className={`pointer-events-none absolute -right-24 -top-36 h-96 w-96 rounded-full border-[64px] opacity-90 ${accent ? 'border-[#ff8b22]/80' : 'border-sky-500/60'}`} aria-hidden="true" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full border-[55px] border-[#e09c55]/60" aria-hidden="true" />
      <div className={`pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-bl via-transparent to-transparent ${accent ? 'from-[#9cb51e]/50' : 'from-sky-600/30'}`} aria-hidden="true" />
      <div className="relative z-10 grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.15fr_.85fr] lg:p-14">
        <div className="flex flex-col justify-center">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[.18em] ${accent ? 'border-lime-200/30 bg-lime-200/15 text-lime-100' : 'border-sky-200/30 bg-sky-200/15 text-sky-100'}`}>{phase === 'past' ? 'From the archive' : phase === 'live' ? 'Happening now' : 'Coming next'}</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white">{event.format}</span>
          </div>
          <p className={`mb-3 text-sm font-bold uppercase tracking-[.22em] ${accent ? 'text-[#d5ea68]' : 'text-sky-300'}`}>{event.partner ? `${event.partner} × ${event.host}` : event.host}</p>
          <h2 className="max-w-2xl text-5xl font-black leading-[.98] tracking-tight text-white sm:text-6xl lg:text-7xl">{event.name}<span className={accent ? 'text-[#c7db35]' : 'text-sky-300'}>.</span></h2>
          <p className="mt-6 max-w-xl text-xl font-semibold leading-snug text-white sm:text-2xl">{event.summary}</p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-200 sm:text-base">{event.details}</p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <EventLink event={event} prominent />
            {event.registrationUrl && phase !== 'past' && <span className="text-xs text-slate-300">Event site opens in a new tab</span>}
          </div>
        </div>
        <div className="flex flex-col justify-end gap-5">
          <div className={`relative overflow-hidden rounded-[1.75rem] border p-6 shadow-xl sm:p-8 ${accent ? 'border-[#e6f381]/40 bg-[#b5c52a] text-[#203015]' : 'border-sky-200/40 bg-sky-300 text-slate-950'}`}>
            <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border-[24px] ${accent ? 'border-[#ff8128]' : 'border-blue-600'}`} aria-hidden="true" />
            <Sparkles className="relative h-8 w-8" aria-hidden="true" />
            <p className="relative mt-9 text-xs font-black uppercase tracking-[.22em]">The invitation</p>
            <p className="relative mt-2 text-3xl font-black leading-tight sm:text-4xl">{event.invitationTitle}</p>
            <p className="relative mt-5 max-w-sm text-sm font-semibold leading-relaxed">{event.invitationBody}</p>
          </div>
          <EventFacts event={event} />
        </div>
      </div>
    </article>
  );
}

function EventHistory({ events }: { events: readonly CommunityEvent[] }) {
  if (!events.length) return null;
  return (
    <section aria-labelledby="event-history-title" className="space-y-5">
      <div className="flex items-end justify-between gap-4 border-b border-slate-700/70 pb-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-sky-300"><History className="h-4 w-4" aria-hidden="true" />Our history</p>
          <h2 id="event-history-title" className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">Events we’ve built together</h2>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {events.map(event => (
          <article key={event.id} id={event.id} className="rounded-3xl border border-sky-500/20 bg-gradient-to-br from-[#102442] to-[#08182d] p-6 shadow-lg scroll-mt-32 sm:p-8">
            <span className="text-xs font-bold uppercase tracking-[.18em] text-sky-300">{event.format} · {formatEventDates(event)}</span>
            <h3 className="mt-4 text-3xl font-black text-white">{event.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-200">{event.details}</p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${event.name} themes`}>
              {event.highlights.map(highlight => <li key={highlight} className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-100">{highlight}</li>)}
            </ul>
            {event.preparation && <a href={learningResources[event.preparation.resourceId].url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-300 underline underline-offset-4 hover:text-sky-200">Keep learning with {learningResources[event.preparation.resourceId].name} <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>}
            <p className="mt-6 flex items-center gap-2 text-xs text-slate-400"><MapPin className="h-4 w-4" aria-hidden="true" />{event.place}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function EventPreparation({ event }: { event: CommunityEvent }) {
  const preparation = event.preparation;
  if (!preparation) return null;
  const resource = learningResources[preparation.resourceId];
  const isPast = eventPhase(event) === 'past';
  const accent = event.tone === 'citrus';
  return <section aria-labelledby="event-preparation-title" className={`grid gap-8 rounded-3xl border p-6 sm:p-9 lg:grid-cols-[1.2fr_.8fr] lg:items-center ${accent ? 'border-lime-400/25 bg-[#172a27]' : 'border-sky-400/25 bg-[#102545]'}`}>
    <div>
      <p className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] ${accent ? 'text-lime-300' : 'text-sky-300'}`}><BookOpen className="h-4 w-4" aria-hidden="true" />{isPast ? 'Keep learning' : 'Before the jam'}</p>
      <h2 id="event-preparation-title" className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{isPast ? resource.title : preparation.title}</h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200">{isPast ? resource.description : preparation.description}</p>
      <a href={resource.url} target="_blank" rel="noopener noreferrer" className={`mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${accent ? 'bg-[#c7db35] text-[#142414] hover:bg-[#d9ec52] focus-visible:outline-lime-300' : 'bg-sky-300 text-slate-950 hover:bg-sky-200 focus-visible:outline-sky-300'}`}>{preparation.ctaLabel} <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
      <p className="mt-2 text-xs text-slate-300">Opens {resource.name} in a new tab</p>
    </div>
    <ol className="space-y-3" aria-label="A simple way to prepare">
      {preparation.steps.map((step, index) => <li key={step} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.04] p-4 text-sm font-medium text-white"><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-[#142414] ${accent ? 'bg-lime-300' : 'bg-sky-300'}`}>{index + 1}</span>{step}</li>)}
    </ol>
  </section>;
}

export function OutreachSection() {
  const featured = featuredEvent();
  const pastEvents = communityEvents.filter(event => event.id !== featured.id && eventPhase(event) === 'past');
  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <header className="max-w-3xl">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[.24em] text-lime-300"><Gamepad2 className="h-4 w-4" aria-hidden="true" />Jams & community events</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">Ideas become real when we build together.</h1>
        <p className="mt-5 text-base leading-relaxed text-slate-300">From game jams to student-led hackathons, PCSS II Robotics creates space to learn by making. Explore what’s next and the events that brought us here.</p>
      </header>

      <FeaturedEvent event={featured} />

      <EventPreparation event={featured} />

      <section aria-labelledby="haven-experience-title" className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-12">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-lime-300">{eventPhase(featured) === 'past' ? 'Event highlights' : 'What to expect'}</p>
          <h2 id="haven-experience-title" className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">{featured.experienceTitle}</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">{featured.experienceBody}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {featured.highlights.map((highlight, index) => {
            const Icon = featureIcons[index % featureIcons.length];
            return <div key={highlight} className="rounded-2xl border border-white/10 bg-white/[.04] p-5"><Icon className={`h-6 w-6 ${featured.tone === 'citrus' ? 'text-lime-300' : 'text-sky-300'}`} aria-hidden="true" /><p className="mt-5 text-base font-bold text-white">{highlight}</p></div>;
          })}
        </div>
      </section>

      {featured.questions?.length ? (
        <section aria-labelledby="event-questions-title" className="rounded-3xl border border-white/10 bg-[#0b1b30] p-6 sm:p-9">
          <div className="flex items-center gap-3"><Check className="h-5 w-5 text-lime-300" aria-hidden="true" /><h2 id="event-questions-title" className="text-2xl font-black text-white">Good to know</h2></div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {featured.questions.map(item => <div key={item.question} className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><h3 className="font-bold text-white">{item.question}</h3><p className="mt-2 text-sm leading-relaxed text-slate-300">{item.answer}</p></div>)}
          </div>
        </section>
      ) : null}

      <EventHistory events={pastEvents} />

      <div className="flex flex-col gap-4 rounded-3xl border border-sky-500/20 bg-[#0b1e3b] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div><p className="text-xs font-bold uppercase tracking-[.2em] text-sky-300">Join the community</p><h2 className="mt-2 text-xl font-bold text-white">The next project starts with showing up.</h2></div>
        <EventLink event={featured} />
        {eventPhase(featured) === 'past' && <span className="text-sm text-slate-300">Watch this space for the next event.</span>}
      </div>
    </div>
  );
}
