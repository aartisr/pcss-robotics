import type { LearningResourceId } from '../learning/resources';

/** One record per event. The page, homepage feature, and status labels read from this catalog. */
export interface CommunityEvent {
  id: string;
  name: string;
  series: string;
  format: string;
  host: string;
  partner?: string;
  startsAt: string;
  endsAt: string;
  timeZone: string;
  dailyHours: string;
  place: string;
  venue?: string;
  summary: string;
  details: string;
  invitationTitle: string;
  invitationBody: string;
  experienceTitle: string;
  experienceBody: string;
  highlights: string[];
  registrationUrl?: string;
  registrationLabel?: string;
  questions?: { question: string; answer: string }[];
  preparation?: {
    resourceId: LearningResourceId;
    title: string;
    description: string;
    ctaLabel: string;
    steps: readonly string[];
  };
  tone: 'citrus' | 'blue';
}

export const communityEvents = [
  {
    id: 'haven-2026',
    name: 'Hack Club Haven',
    series: 'Haven',
    format: 'Teen game jam',
    host: 'PCSS II Robotics',
    partner: 'Hack Club',
    startsAt: '2026-11-14T10:00:00-05:00',
    endsAt: '2026-11-15T16:00:00-05:00',
    timeZone: 'America/New_York',
    dailyHours: '10:00 AM–4:00 PM each day',
    place: 'Saugus, Massachusetts · venue details to be confirmed',
    summary: 'Make a video game with friends in a welcoming, two-day jam for teens.',
    details: 'Bring an idea or discover one with a team. Haven is designed for first-time creators as well as experienced coders: learn, build, playtest, and share something you made together.',
    invitationTitle: 'Make a game. Find your people.',
    invitationBody: 'Open to beginners and experienced creators alike.',
    experienceTitle: 'A place to start. A place to surprise yourself.',
    experienceBody: 'A jam is a short, collaborative build session. The goal is to leave with something playable and a story about how you made it.',
    highlights: ['No coding experience needed', 'Free food and a T-shirt', 'Surprise prizes for the top three projects'],
    registrationUrl: 'https://haven.hackclub.com/',
    registrationLabel: 'Find your Haven event',
    questions: [
      { question: 'What is a game jam?', answer: 'A social coding event where you make a video game with friends. You can start with an idea, a drawing, a sound, or a small prototype.' },
      { question: 'What if I have never coded?', answer: 'You are welcome. The event includes guidance for beginners, and you can learn alongside your teammates.' },
      { question: 'What does it cost?', answer: 'The event is free. The local flyer also lists food and a T-shirt for participants.' },
      { question: 'Are there prizes?', answer: 'The local flyer says the top three projects will receive surprise prizes. Specific prizes have not been announced.' }
    ],
    preparation: {
      resourceId: 'pat',
      title: 'One small game is enough to begin.',
      description: 'Haven welcomes first-time creators. A game makes code visible: a player acts, a rule responds, and the screen changes. Use PAT to begin learning that loop. Bring one small experiment to the jam, then build on it with friends until someone else can play it.',
      ctaLabel: 'Start learning game programming',
      steps: ['Learn one idea', 'Make one playable interaction', 'Share it and improve it']
    },
    tone: 'citrus'
  },
  {
    id: 'circuit-2026',
    name: 'Circuit 2026',
    series: 'Circuit',
    format: 'Hackathon',
    host: 'PCSS II Robotics',
    startsAt: '2026-06-06T08:00:00-04:00',
    endsAt: '2026-06-07T20:00:00-04:00',
    timeZone: 'America/New_York',
    dailyHours: 'June 6–7, 2026',
    place: 'Pioneer Charter School of Science II · Saugus, Massachusetts',
    venue: 'Pioneer Charter School of Science II',
    summary: 'A two-day, racing-themed build event for websites, games, and hardware projects.',
    details: 'Circuit brought student makers together for a focused build weekend. Its event page now lives here as part of the team’s program history.',
    invitationTitle: 'Build under pressure. Share the result.',
    invitationBody: 'A student-led weekend of making and learning.',
    experienceTitle: 'Where ideas met momentum.',
    experienceBody: 'Circuit gave students time and space to make projects together.',
    highlights: ['Racing theme', 'Web, game, and hardware builds', 'Student-led event'],
    tone: 'blue'
  }
] as const satisfies readonly CommunityEvent[];

export function eventPhase(event: CommunityEvent, now = new Date()): 'upcoming' | 'live' | 'past' {
  const timestamp = now.getTime();
  if (timestamp < Date.parse(event.startsAt)) return 'upcoming';
  if (timestamp <= Date.parse(event.endsAt)) return 'live';
  return 'past';
}

export function featuredEvent(now = new Date()): CommunityEvent {
  const upcoming = communityEvents
    .filter(event => eventPhase(event, now) !== 'past')
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  return upcoming[0] ?? [...communityEvents].sort((a, b) => Date.parse(b.startsAt) - Date.parse(a.startsAt))[0];
}

export function formatEventDates(event: CommunityEvent): string {
  const start = new Date(event.startsAt);
  const end = new Date(event.endsAt);
  const parts = (date: Date) => Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: event.timeZone })
      .formatToParts(date).map(({ type, value }) => [type, value])
  );
  const first = parts(start);
  const last = parts(end);
  if (first.year !== last.year) return `${first.month} ${first.day}, ${first.year}–${last.month} ${last.day}, ${last.year}`;
  if (first.month !== last.month) return `${first.month} ${first.day}–${last.month} ${last.day}, ${last.year}`;
  if (first.day === last.day) return `${first.month} ${first.day}, ${first.year}`;
  return `${first.month} ${first.day}–${last.day}, ${last.year}`;
}
