import React from 'react';
import type { NavSection } from '../types';
import { HomeSection } from './HomeSection';

const Research = React.lazy(() => import('./ResearchSection').then(({ ResearchSection }) => ({ default: ResearchSection })));
const Sponsors = React.lazy(() => import('./SponsorCommandCenter').then(({ SponsorCommandCenter }) => ({ default: SponsorCommandCenter })));
const sections = {
  robots: React.lazy(() => import('./RobotEngineeringSection').then(({ RobotEngineeringSection }) => ({ default: RobotEngineeringSection }))),
  simulator: React.lazy(() => import('./AutonomousSimulator').then(({ AutonomousSimulator }) => ({ default: AutonomousSimulator }))),
  outreach: React.lazy(() => import('./OutreachSection').then(({ OutreachSection }) => ({ default: OutreachSection }))),
  arcade: React.lazy(() => import('./ArcadeMiniGame').then(({ ArcadeMiniGame }) => ({ default: ArcadeMiniGame }))),
  team: React.lazy(() => import('./TeamSection').then(({ TeamSection }) => ({ default: TeamSection })))
} satisfies Record<Exclude<NavSection, 'home' | 'research' | 'sponsors'>, React.LazyExoticComponent<React.ComponentType>>;

interface SectionViewProps {
  section: NavSection;
  navigateTo: (section: NavSection) => void;
  openGuide: () => void;
  openStudentModal: () => void;
  openW9Directly: boolean;
  resetW9Modal: () => void;
  openW9: () => void;
}

export function SectionView({ section, navigateTo, openGuide, openStudentModal, openW9Directly, resetW9Modal, openW9 }: SectionViewProps) {
  if (section === 'home') {
    return <HomeSection onNavigate={navigateTo} onOpenGuide={openGuide} onOpenStudentModal={openStudentModal} onOpenW9={openW9} />;
  }

  if (section === 'research') return <React.Suspense fallback={<LoadingSection />}><Research /></React.Suspense>;
  if (section === 'sponsors') return <React.Suspense fallback={<LoadingSection />}><Sponsors externalOpenW9Modal={openW9Directly} onResetExternalW9Modal={resetW9Modal} /></React.Suspense>;

  const Component = sections[section];
  return <React.Suspense fallback={<LoadingSection />}><Component /></React.Suspense>;
}

function LoadingSection() {
  return <div className="max-w-7xl mx-auto px-4 py-20 text-slate-300" role="status">Loading section…</div>;
}
