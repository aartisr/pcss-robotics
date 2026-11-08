import type { NavSection } from '../types';
import { communityEvents } from '../features/events/events';

export const SITE_URL = 'https://www.pcssiirobotics.org';
export const AUTHOR = {
  name: 'Aarti S Ravikumar',
  url: 'https://ai-aarti.com/'
};
export const SCHOOL = {
  name: 'Pioneer Charter School of Science II (PCSS II)',
  url: 'https://saugus.pioneercss.org/'
};
export const SHARE_IMAGE = `${SITE_URL}/images/robotics-lab-hero.webp`;

export interface SectionMetadata {
  path: string;
  title: string;
  description: string;
  heading: string;
  summary: string;
  highlights: string[];
  indexable?: boolean;
}

export const SECTION_METADATA: Record<NavSection, SectionMetadata> = {
  home: {
    path: '/',
    title: 'PCSS II Robotics | Student Engineering in Saugus, MA',
    description: 'Explore robotics projects, STEM events, and game programming resources from Pioneer Charter School of Science II in Saugus, Massachusetts.',
    heading: 'PCSS II Robotics: student engineering and STEM outreach',
    summary: 'Explore the robotics work of students at Pioneer Charter School of Science II (PCSS II) in Saugus, Massachusetts. The site brings together robot engineering, technical notes, interactive simulations, and team activities.',
    highlights: ['Robot design and engineering', 'Game programming with PAT', 'Team and community activities']
  },
  research: {
    path: '/research/',
    title: 'Robotics Learning Lab | PCSS II Robotics',
    description: 'Explore mecanum drive motion in a clearly labeled educational calculator from PCSS II Robotics.',
    heading: 'Robotics learning lab',
    summary: 'Adjust motion and wheel dimensions to explore how a mecanum drive converts robot movement into wheel speed. This is an educational model, not measured robot data.',
    highlights: ['Interactive mecanum drive model', 'Wheel speed estimates', 'Links to primary learning resources']
  },
  robots: {
    path: '/robots/',
    title: 'Robot Engineering | PCSS II Robotics',
    description: 'Explore the decisions behind competition robot design: movement, mechanisms, and sensing.',
    heading: 'Robot engineering',
    summary: 'Learn about the questions behind a competition robot: how it moves, handles objects, and senses the field. These are design concepts, not specifications for a particular team robot.',
    highlights: ['Drive systems', 'Mechanisms', 'Sensors and testing']
  },
  simulator: {
    path: '/simulator/',
    title: 'Autonomous Robotics Simulator | PCSS II Robotics',
    description: 'Try an interactive robotics simulator for path planning, control tuning, and odometry concepts from PCSS II Robotics.',
    heading: 'Autonomous robotics simulator',
    summary: 'Use the interactive simulator to explore motion planning, robot control, and odometry concepts. It is an educational tool for experimenting with parameters and observing outcomes.',
    highlights: ['Path planning', 'Control tuning', 'Odometry concepts']
  },
  sponsors: {
    path: '/sponsors/',
    title: 'Support PCSS II Robotics | Sponsorship Information',
    description: 'Sponsor PCSS II Robotics through equipment, student event support, or mentorship. Learn about the club’s nonprofit status and request current tax documents from the school.',
    heading: 'Support PCSS II Robotics',
    summary: 'Explore practical ways to sponsor student robotics at Pioneer Charter School of Science II. The club has identified as a 501(c)(3) nonprofit; request current legal and tax documentation from the school before contributing.',
    highlights: ['Student engineering equipment', 'Events and mentorship', '501(c)(3) nonprofit documentation']
  },
  outreach: {
    path: '/outreach/',
    title: 'Student Jams & Event History | PCSS II Robotics',
    description: 'Explore Hack Club Haven, Circuit 2026 history, and a game programming starting point with PAT.',
    heading: 'Student-led jams and event history',
    summary: 'Explore Hack Club Haven, November 14–15, 2026, and the history of Circuit 2026. PCSS II Robotics brings students together through hands-on making and collaboration.',
    highlights: ['Hack Club Haven game jam for teens', 'Learn game programming with PAT', 'Circuit 2026 event history']
  },
  arcade: {
    path: '/arcade/',
    title: 'Robotics Arcade | PCSS II Robotics',
    description: 'Explore the interactive robotics arcade and driving game created for the PCSS II Robotics site.',
    heading: 'Robotics arcade',
    summary: 'Try the interactive robotics game and explore robot driving and control in a playful setting.',
    highlights: ['Interactive driving', 'Robot control', 'Learning through play']
  },
  team: {
    path: '/team/',
    title: 'Team | PCSS II Robotics',
    description: 'Meet the PCSS II Robotics students and explore their projects and activities at Pioneer Charter School of Science II.',
    heading: 'Meet the PCSS II Robotics team',
    summary: 'Meet students involved with robotics at Pioneer Charter School of Science II in Saugus and explore their team projects and activities.',
    highlights: ['Student team and roles', 'Projects and activities', 'STEM collaboration']
  }
};

export const INDEXABLE_SECTIONS = (Object.keys(SECTION_METADATA) as NavSection[])
  .filter((section) => SECTION_METADATA[section].indexable !== false);

export function structuredDataFor(section: NavSection) {
  const page = SECTION_METADATA[section];
  const pageUrl = `${SITE_URL}${page.path}`;
  const personId = `${AUTHOR.url}#person`;
  const schoolId = `${SCHOOL.url}#school`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: AUTHOR.name,
        alternateName: 'Aarti Sri Ravikumar',
        url: AUTHOR.url,
        affiliation: { '@id': schoolId }
      },
      {
        '@type': 'EducationalOrganization',
        '@id': schoolId,
        name: SCHOOL.name,
        url: SCHOOL.url,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Saugus',
          addressRegion: 'MA',
          addressCountry: 'US'
        }
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: 'PCSS II Robotics',
        url: `${SITE_URL}/`,
        creator: { '@id': personId },
        about: { '@id': schoolId },
        inLanguage: 'en-US'
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: page.title,
        description: page.description,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        author: { '@id': personId },
        about: { '@id': schoolId },
        inLanguage: 'en-US'
      },
      ...(section === 'outreach' ? communityEvents.map(event => ({
        '@type': 'Event',
        '@id': `${SITE_URL}/outreach/#${event.id}`,
        name: event.name,
        description: event.summary,
        startDate: event.startsAt,
        endDate: event.endsAt,
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        ...('venue' in event ? { location: { '@type': 'Place', name: event.venue } } : {}),
        organizer: { '@type': 'Organization', name: event.host },
        url: `${SITE_URL}/outreach/#${event.id}`,
        ...('registrationUrl' in event ? { sameAs: event.registrationUrl } : {})
      })) : [])
    ]
  };
}
