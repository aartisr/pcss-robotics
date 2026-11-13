import React from 'react';
import { Render, type Config, type Slot } from '@puckeditor/core';
import { ArrowRight, ArrowUpRight, Compass, Lightbulb, ScanEye, Wrench } from 'lucide-react';
import { FeaturedEventTeaser } from '../features/events/FeaturedEventTeaser';
import type { NavSection } from '../types';
import type { TeamMember } from '../types';
import { INITIAL_TEAM_ROSTER } from '../data/teamRosterData';

const ResearchSection = React.lazy(() => import('../components/ResearchSection').then(module => ({ default: module.ResearchSection })));
const RobotEngineeringSection = React.lazy(() => import('../components/RobotEngineeringSection').then(module => ({ default: module.RobotEngineeringSection })));
const AutonomousSimulator = React.lazy(() => import('../components/AutonomousSimulator').then(module => ({ default: module.AutonomousSimulator })));
const TeamSection = React.lazy(() => import('../components/TeamSection').then(module => ({ default: module.TeamSection })));
const OutreachSection = React.lazy(() => import('../components/OutreachSection').then(module => ({ default: module.OutreachSection })));
const ArcadeMiniGame = React.lazy(() => import('../components/ArcadeMiniGame').then(module => ({ default: module.ArcadeMiniGame })));
const SponsorCommandCenter = React.lazy(() => import('../components/SponsorCommandCenter').then(module => ({ default: module.SponsorCommandCenter })));

type Card = { title: string; description: string; href: string; label: string };
type Props = {
  Hero: { eyebrow: string; title: string; accent: string; description: string; image: string; imageAlt: string; primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string };
  SectionIntro: { eyebrow: string; title: string; description: string; level: 'h1' | 'h2' };
  Paragraph: { text: string };
  InsetNote: { text: string };
  EngineeringTopic: { icon: 'drive' | 'mechanisms' | 'sensing' | 'idea'; eyebrow: string; title: string; question: string; summary: string; steps: { text: string }[] };
  CardGrid: { cards: Card[] };
  Callout: { eyebrow: string; title: string; text: string; buttonLabel: string; buttonHref: string; tone: 'blue' | 'gold' };
  Image: { src: string; alt: string; caption: string };
  Columns: { left: Slot; right: Slot };
  Feature: { feature: 'events' | 'robots' | 'research' | 'simulator' | 'team' | 'outreach' | 'arcade' | 'sponsors' };
  TeamRoster: { members: TeamMember[] };
};

function safeHref(value: string) {
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try {
    const url = new URL(value);
    return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? value : '#';
  } catch { return '#'; }
}

export function createPageConfig(onNavigate: (section: NavSection) => void, sponsor?: { openW9: boolean; resetW9: () => void }): Config<Props, { title: string; description: string }> {
  return {
    root: {
      fields: { title: { type: 'text', label: 'Browser title' }, description: { type: 'textarea', label: 'Search description' } },
      defaultProps: { title: 'PCSS II Robotics', description: 'Student robotics at PCSS II.' },
      render: ({ children }) => <div className="puck-page min-w-0 max-w-full">{children}</div>,
    },
    categories: {
      content: { title: 'Content', components: ['Hero', 'SectionIntro', 'Paragraph', 'InsetNote', 'Image'] },
      layout: { title: 'Layout', components: ['CardGrid', 'Callout', 'Columns'] },
      features: { title: 'Interactive features', components: ['Feature'] },
      people: { title: 'People', components: ['TeamRoster'] },
      engineering: { title: 'Engineering', components: ['EngineeringTopic'] },
    },
    components: {
      Hero: {
        label: 'Hero',
        fields: {
          eyebrow: { type: 'text' }, title: { type: 'text' }, accent: { type: 'text' }, description: { type: 'textarea' },
          image: { type: 'text' }, imageAlt: { type: 'text' }, primaryLabel: { type: 'text' }, primaryHref: { type: 'text' }, secondaryLabel: { type: 'text' }, secondaryHref: { type: 'text' },
        },
        defaultProps: { eyebrow: 'PCSS II Robotics', title: 'Build something.', accent: 'Together.', description: 'Add a short introduction.', image: '/images/robotics-lab-hero.webp', imageAlt: 'Students working on robotics', primaryLabel: 'Meet the team', primaryHref: '/team/', secondaryLabel: 'Explore', secondaryHref: '/robots/' },
        render: ({ eyebrow, title, accent, description, image, imageAlt, primaryLabel, primaryHref, secondaryLabel, secondaryHref }) => <section className="relative mx-auto grid min-w-0 max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-10 lg:px-8 lg:py-20">
          <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[.22em] text-amber-300">{eyebrow}</p><h1 className="mt-4 text-[clamp(2.25rem,8vw,4rem)] font-black leading-tight text-white">{title} <span className="text-sky-300">{accent}</span></h1><p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">{description}</p><div className="mt-8 flex flex-wrap gap-3"><a className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white hover:bg-sky-500" href={safeHref(primaryHref)}>{primaryLabel}<ArrowRight className="h-4 w-4 shrink-0" /></a><a className="inline-flex min-h-12 items-center rounded-xl border border-sky-400/40 px-5 py-3 text-sm font-bold text-sky-100 hover:bg-sky-950" href={safeHref(secondaryHref)}>{secondaryLabel}</a></div></div>
          {image && <img src={safeHref(image)} alt={imageAlt} className="aspect-[4/3] w-full rounded-[2rem] border border-sky-500/20 object-cover shadow-2xl" />}
        </section>,
      },
      SectionIntro: {
        label: 'Section heading',
        fields: { eyebrow: { type: 'text' }, title: { type: 'text' }, description: { type: 'textarea' }, level: { type: 'select', label: 'Heading level', options: [{ label: 'Page heading', value: 'h1' }, { label: 'Section heading', value: 'h2' }] } },
        defaultProps: { eyebrow: 'Explore', title: 'A new section', description: '', level: 'h2' },
        render: ({ eyebrow, title, description, level }) => {
          const Heading = level === 'h1' ? 'h1' : 'h2';
          return <section className="mx-auto max-w-7xl px-4 pt-12 pb-4 sm:px-6 lg:px-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-sky-300">{eyebrow}</p><Heading className={`mt-3 font-black text-white ${level === 'h1' ? 'text-4xl sm:text-6xl' : 'text-3xl sm:text-4xl'}`}>{title}</Heading>{description && <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300">{description}</p>}</section>;
        },
      },
      Paragraph: { label: 'Text', fields: { text: { type: 'textarea' } }, defaultProps: { text: 'Write here.' }, render: ({ text }) => <p className="mx-auto max-w-7xl whitespace-pre-line px-4 py-4 text-base leading-relaxed text-slate-200 sm:px-6 lg:px-8">{text}</p> },
      InsetNote: { label: 'Inset note', fields: { text: { type: 'textarea' } }, defaultProps: { text: 'Add a helpful note.' }, render: ({ text }) => <aside className="mx-auto my-6 max-w-6xl px-4 sm:px-6 lg:px-8"><p className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm leading-relaxed text-slate-300">{text}</p></aside> },
      EngineeringTopic: {
        label: 'Engineering question',
        fields: {
          icon: { type: 'select', options: [{ label: 'Drive', value: 'drive' }, { label: 'Mechanisms', value: 'mechanisms' }, { label: 'Sensing', value: 'sensing' }, { label: 'Idea', value: 'idea' }] },
          eyebrow: { type: 'text', label: 'Short label' },
          title: { type: 'text' },
          question: { type: 'text' },
          summary: { type: 'textarea' },
          steps: { type: 'array', label: 'Steps', arrayFields: { text: { type: 'text', label: 'Step' } }, getItemSummary: step => step.text || 'New step', defaultItemProps: { text: '' } },
        },
        defaultProps: { icon: 'idea', eyebrow: 'Design question', title: 'A new engineering question', question: '', summary: '', steps: [] },
        render: ({ icon, eyebrow, title, question, summary, steps }) => {
          const Icon = { drive: Compass, mechanisms: Wrench, sensing: ScanEye, idea: Lightbulb }[icon] ?? Lightbulb;
          return <article className="mx-4 my-5 grid max-w-6xl gap-6 rounded-3xl border border-white/10 bg-slate-900/75 p-6 sm:mx-6 sm:p-8 md:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:mx-auto"><div className="min-w-0"><span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300"><Icon className="h-5 w-5" aria-hidden="true" /></span><p className="text-xs font-semibold uppercase tracking-widest text-sky-300">{eyebrow}</p><h2 className="mt-2 text-2xl font-bold text-white">{title}</h2><p className="mt-2 text-sm font-medium text-amber-200">{question}</p></div><div className="min-w-0"><p className="text-base leading-relaxed text-slate-300">{summary}</p>{steps.length > 0 && <ol className="mt-6 space-y-3">{steps.map((step, index) => <li key={index} className="flex items-start gap-3 text-sm text-slate-200"><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" aria-hidden="true" />{step.text}</li>)}</ol>}</div></article>;
        },
      },
      CardGrid: {
        label: 'Card grid',
        fields: { cards: { type: 'array', arrayFields: { title: { type: 'text' }, description: { type: 'textarea' }, href: { type: 'text' }, label: { type: 'text' } }, defaultItemProps: { title: 'New card', description: '', href: '/', label: 'Explore' } } },
        defaultProps: { cards: [{ title: 'Explore robotics', description: 'See what we build.', href: '/robots/', label: 'Explore' }] },
        render: ({ cards }) => <section className="puck-card-grid mx-auto grid min-w-0 max-w-7xl gap-4 px-4 py-6 sm:px-6 lg:px-8">{cards.map((card, index) => <a key={index} href={safeHref(card.href)} className="group min-w-0 rounded-3xl border border-white/10 bg-[#0b1e3b]/80 p-6 transition hover:border-sky-400/50 hover:bg-[#102a52]"><h3 className="text-xl font-bold text-white">{card.title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-300">{card.description}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-300">{card.label}<ArrowUpRight className="h-4 w-4 shrink-0" /></span></a>)}</section>,
      },
      Callout: {
        label: 'Callout',
        fields: { eyebrow: { type: 'text' }, title: { type: 'text' }, text: { type: 'textarea' }, buttonLabel: { type: 'text' }, buttonHref: { type: 'text' }, tone: { type: 'select', options: [{ label: 'Blue', value: 'blue' }, { label: 'Gold', value: 'gold' }] } },
        defaultProps: { eyebrow: 'Get involved', title: 'Join us', text: 'Find your next step.', buttonLabel: 'Learn more', buttonHref: '/team/', tone: 'blue' },
        render: ({ eyebrow, title, text, buttonLabel, buttonHref, tone }) => <section className={`mx-auto my-6 max-w-7xl rounded-3xl border p-7 sm:p-9 ${tone === 'gold' ? 'border-amber-500/25 bg-[#2a2633]' : 'border-sky-500/25 bg-[#123058]'}`}><p className={`text-xs font-bold uppercase tracking-[.2em] ${tone === 'gold' ? 'text-amber-300' : 'text-sky-300'}`}>{eyebrow}</p><h2 className="mt-3 text-2xl font-black text-white">{title}</h2><p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-200">{text}</p><a href={safeHref(buttonHref)} className={`mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${tone === 'gold' ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-sky-600 text-white hover:bg-sky-500'}`}>{buttonLabel}<ArrowRight className="h-4 w-4" /></a></section>,
      },
      Image: { label: 'Image', fields: { src: { type: 'text' }, alt: { type: 'text' }, caption: { type: 'text' } }, defaultProps: { src: '/images/robotics-lab-hero.webp', alt: 'Robotics workshop', caption: '' }, render: ({ src, alt, caption }) => <figure className="mx-auto max-w-5xl px-4 py-6"><img src={safeHref(src)} alt={alt} className="w-full rounded-3xl object-cover" />{caption && <figcaption className="mt-3 text-center text-sm text-slate-400">{caption}</figcaption>}</figure> },
      Columns: { label: 'Two columns', fields: { left: { type: 'slot', allow: ['SectionIntro', 'Paragraph', 'Image', 'CardGrid', 'Callout'] }, right: { type: 'slot', allow: ['SectionIntro', 'Paragraph', 'Image', 'CardGrid', 'Callout'] } }, defaultProps: { left: [], right: [] }, render: ({ left: Left, right: Right }) => <div className="mx-auto grid min-w-0 max-w-7xl gap-5 px-4 py-6 md:grid-cols-2"><div className="min-w-0"><Left /></div><div className="min-w-0"><Right /></div></div> },
      Feature: {
        label: 'Site feature',
        fields: { feature: { type: 'select', options: ['events', 'research', 'simulator', 'outreach', 'arcade', 'sponsors'].map(value => ({ label: value[0].toUpperCase() + value.slice(1), value })) } },
        defaultProps: { feature: 'events' },
        render: ({ feature }) => <React.Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12 text-slate-300">Loading…</div>}>{feature === 'events' ? <FeaturedEventTeaser onNavigate={onNavigate} /> : feature === 'robots' ? <RobotEngineeringSection /> : feature === 'research' ? <ResearchSection /> : feature === 'simulator' ? <AutonomousSimulator /> : feature === 'team' ? <TeamSection /> : feature === 'outreach' ? <OutreachSection /> : feature === 'arcade' ? <ArcadeMiniGame /> : <SponsorCommandCenter externalOpenW9Modal={sponsor?.openW9} onResetExternalW9Modal={sponsor?.resetW9} />}</React.Suspense>,
      },
      TeamRoster: {
        label: 'Team roster',
        fields: {
          members: {
            type: 'array', label: 'Team members',
            getItemSummary: member => member.name || 'New member',
            defaultItemProps: () => ({ id: `student-${crypto.randomUUID()}`, name: '', role: 'Robotics Member', grade: 'Grade 9', division: 'Software & Autonomous', specialty: '' }),
            arrayFields: {
              id: { type: 'text', visible: false },
              name: { type: 'text', label: 'Name' },
              role: { type: 'text', label: 'Role' },
              grade: { type: 'select', label: 'Grade', options: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Faculty Advisor'].map(value => ({ label: value, value })) },
              division: { type: 'select', label: 'Division', options: ['Hardware & CAD', 'Software & Autonomous', 'Electrical & Systems', 'Business & Outreach', 'Mentorship'].map(value => ({ label: value, value })) },
              specialty: { type: 'textarea', label: 'Focus or specialty' },
              profileUrl: { type: 'text', label: 'Profile link' },
              specialtyUrl: { type: 'text', label: 'Work link' },
              competition: { type: 'text', label: 'Competition' },
              competitionDeadline: { type: 'text', label: 'Competition deadline' },
              tshirtSize: { type: 'select', label: 'Shirt size', options: ['', 'XS', 'S', 'M', 'L', 'XL', 'XXL'].map(value => ({ label: value || 'Not set', value })) },
              tshirtColor: { type: 'text', label: 'Shirt color' },
              notes: { type: 'textarea', label: 'Notes' },
            },
          },
        },
        defaultProps: { members: INITIAL_TEAM_ROSTER },
        render: ({ members }) => <React.Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12 text-slate-300">Loading team…</div>}><TeamSection roster={members} /></React.Suspense>,
      },
    },
  };
}

export function PageRenderer({ data, onNavigate, sponsor }: { data: Parameters<typeof Render>[0]['data']; onNavigate: (section: NavSection) => void; sponsor?: { openW9: boolean; resetW9: () => void } }) {
  return <Render config={createPageConfig(onNavigate, sponsor)} data={data} />;
}
