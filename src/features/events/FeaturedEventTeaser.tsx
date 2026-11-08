import { ArrowRight, CalendarDays, Gamepad2 } from 'lucide-react';
import type { NavSection } from '../../types';
import { SECTION_METADATA } from '../../seo/siteMetadata';
import { eventPhase, featuredEvent, formatEventDates } from './events';

export function FeaturedEventTeaser({ onNavigate }: { onNavigate: (section: NavSection) => void }) {
  const event = featuredEvent();
  const phase = eventPhase(event);
  const accent = event.tone === 'citrus';
  return (
    <section aria-labelledby="featured-event-title" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className={`relative isolate overflow-hidden rounded-[1.75rem] border p-6 shadow-2xl shadow-black/25 sm:p-9 ${accent ? 'border-lime-400/30 bg-[#132b2a]' : 'border-sky-400/30 bg-[#12294b]'}`}>
        <div className={`pointer-events-none absolute -right-20 -top-36 h-80 w-80 rounded-full border-[54px] opacity-85 ${accent ? 'border-[#f88125]' : 'border-sky-500'}`} aria-hidden="true" />
        <div className={`pointer-events-none absolute bottom-0 right-1/4 h-40 w-40 rounded-full blur-3xl ${accent ? 'bg-lime-500/15' : 'bg-sky-500/15'}`} aria-hidden="true" />
        <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className={`flex items-center gap-2 text-xs font-black uppercase tracking-[.18em] ${accent ? 'text-lime-300' : 'text-sky-300'}`}><Gamepad2 className="h-4 w-4" aria-hidden="true" />{phase === 'past' ? 'From our event archive' : phase === 'live' ? 'Happening now' : `Coming up · ${event.format}`}</p>
            <h2 id="featured-event-title" className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">{event.name}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">{event.summary}</p>
            <p className={`mt-4 flex items-center gap-2 text-sm font-semibold ${accent ? 'text-lime-200' : 'text-sky-200'}`}><CalendarDays className="h-4 w-4" aria-hidden="true" />{formatEventDates(event)} · {event.dailyHours}</p>
          </div>
          <a href={SECTION_METADATA.outreach.path} onClick={event => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            onNavigate('outreach');
          }} className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${accent ? 'bg-[#c7db35] text-[#152712] hover:bg-[#dded5e] focus-visible:outline-lime-300' : 'bg-sky-300 text-slate-950 hover:bg-sky-200 focus-visible:outline-sky-200'}`}>
            Explore the event <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
