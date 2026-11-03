import type { NavSection } from '../types';

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
    description: 'Explore robotics projects, technical notes, simulations, and STEM outreach from Pioneer Charter School of Science II in Saugus, Massachusetts. Site author: Aarti S Ravikumar.',
    heading: 'PCSS II Robotics: student engineering and STEM outreach',
    summary: 'Explore the robotics work of students at Pioneer Charter School of Science II (PCSS II) in Saugus, Massachusetts. The site brings together robot engineering, technical notes, interactive simulations, and team activities.',
    highlights: ['Robot design and engineering', 'Technical notes and interactive simulations', 'Team and community activities']
  },
  research: {
    path: '/research/',
    title: 'Robotics Research and Technical Notes | PCSS II Robotics',
    description: 'Read PCSS II Robotics technical notes on motion planning, control, mechanical design, and computer vision, with interactive explanations and citations.',
    heading: 'Robotics research and technical notes',
    summary: 'Browse the team’s technical writing about robotics controls, mechanical design, and computer vision. The interactive research section includes explanations, citations, and a kinematics workbench.',
    highlights: ['Motion planning and mecanum drive kinematics', 'Mechanical design and engineering analysis', 'Computer vision and embedded systems']
  },
  robots: {
    path: '/robots/',
    title: 'Robot Engineering and CAD | PCSS II Robotics',
    description: 'Explore robot designs, mechanisms, and engineering decisions from PCSS II Robotics at Pioneer Charter School of Science II.',
    heading: 'Robot engineering and CAD',
    summary: 'See the robots, mechanisms, and design choices presented by the PCSS II Robotics team. The interactive view includes robot histories and engineering details.',
    highlights: ['Robot mechanisms and subsystems', 'Design iteration and CAD', 'Competition engineering']
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
    description: 'Learn how to support robotics education at Pioneer Charter School of Science II and contact the team about sponsorship opportunities.',
    heading: 'Support PCSS II Robotics',
    summary: 'Learn about sponsorship opportunities for student robotics at Pioneer Charter School of Science II. Contact the school or team to confirm current contribution details and documentation.',
    highlights: ['Student engineering equipment', 'Team activities and events', 'Sponsorship inquiries']
  },
  outreach: {
    path: '/outreach/',
    title: 'STEM Outreach and Events | PCSS II Robotics',
    description: 'Discover robotics workshops, student events, and community STEM activities connected to Pioneer Charter School of Science II.',
    heading: 'STEM outreach and events',
    summary: 'Discover the team’s robotics workshops, student events, and community STEM activities. Open the interactive section for the latest details presented by the team.',
    highlights: ['Student workshops', 'Robotics events', 'Community STEM learning']
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
    title: 'Team and Site Author | PCSS II Robotics',
    description: 'Meet PCSS II Robotics at Pioneer Charter School of Science II. This website is authored by Aarti S Ravikumar, whose portfolio is at ai-aarti.com.',
    heading: 'The PCSS II Robotics team and site author',
    summary: 'Meet students involved with robotics at Pioneer Charter School of Science II in Saugus. This website is authored by Aarti S Ravikumar, with a portfolio and project record at ai-aarti.com.',
    highlights: ['Student team and roles', 'Projects and activities', 'Author portfolio']
  },
  audit: {
    path: '/audit/',
    title: 'Site Evaluation | PCSS II Robotics',
    description: 'Explore the PCSS II Robotics site evaluation and accessibility review.',
    heading: 'Site evaluation',
    summary: 'Explore the site’s own evaluation view and accessibility review.',
    highlights: ['Site evaluation', 'Accessibility review'],
    indexable: false
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
      }
    ]
  };
}
