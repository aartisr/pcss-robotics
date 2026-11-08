import type { NavSection } from '../types';
import { AUTHOR, SCHOOL, SECTION_METADATA } from '../seo/siteMetadata';
import { learningResources } from '../features/learning/resources';
import { SchoolSeal } from './SchoolSeal';

const exploreLinks: { section: NavSection; label: string }[] = [
  { section: 'home', label: 'Home' },
  { section: 'robots', label: 'Robot engineering' },
  { section: 'research', label: 'Learning lab' },
  { section: 'arcade', label: 'Arcade' }
];

const communityLinks: { section: NavSection; label: string }[] = [
  { section: 'team', label: 'Our team' },
  { section: 'outreach', label: 'Jams & events' },
  { section: 'simulator', label: 'Simulator' },
  { section: 'sponsors', label: 'Sponsorship' }
];

interface SiteFooterProps {
  onNavigate: (section: NavSection) => void;
  onOpenStudentModal: () => void;
}

function FooterLink({ section, label, onNavigate }: { section: NavSection; label: string; onNavigate: (section: NavSection) => void }) {
  return <a href={SECTION_METADATA[section].path} onClick={event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onNavigate(section);
  }} className="text-sm text-slate-300 transition hover:text-white focus-visible:text-white">{label}</a>;
}

export function SiteFooter({ onNavigate, onOpenStudentModal }: SiteFooterProps) {
  return <footer id="site-footer" className="relative z-10 border-t border-[#1d3e70] bg-[#071326] py-12 text-slate-300" role="contentinfo">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,.6fr)_minmax(0,.7fr)] lg:gap-14">
        <div className="flex items-start gap-4">
          <a href={SCHOOL.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${SCHOOL.name}`}><SchoolSeal size="footer" /></a>
          <div className="max-w-sm">
            <p className="text-lg font-bold tracking-tight text-white">PCSS II Robotics</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[.16em] text-sky-300">FTC Team #23548</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">A student robotics community at <a href={SCHOOL.url} target="_blank" rel="noopener noreferrer" className="text-sky-300 underline underline-offset-4 hover:text-sky-200">{SCHOOL.name} ({SCHOOL.shortName})</a> in Saugus, Massachusetts.</p>
          </div>
        </div>

        <nav aria-label="Explore the site" className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[.18em] text-white">Explore</h2>
          <div className="flex flex-col items-start gap-3">{exploreLinks.map(link => <FooterLink key={link.section} {...link} onNavigate={onNavigate} />)}</div>
        </nav>

        <nav aria-label="Club and community" className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[.18em] text-white">Community</h2>
          <div className="flex flex-col items-start gap-3">{communityLinks.map(link => <FooterLink key={link.section} {...link} onNavigate={onNavigate} />)}<button type="button" onClick={onOpenStudentModal} className="text-sm text-sky-300 hover:text-sky-200">How to join</button></div>
        </nav>
      </div>

      <div className="mt-10 flex flex-col gap-4 border-t border-[#1d3e70] pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} PCSS II Robotics</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <span>Site by <a href={AUTHOR.url} rel="author" className="text-slate-200 underline underline-offset-4 hover:text-white">{AUTHOR.name}</a></span>
          <a href={learningResources.pat.url} target="_blank" rel="noopener noreferrer" className="text-sky-300 hover:text-sky-200">Learn game programming with PAT</a>
          <button type="button" onClick={() => window.dispatchEvent(new Event('open-analytics-preferences'))} className="hover:text-white">Analytics choices</button>
        </div>
      </div>
    </div>
  </footer>;
}
