import { Contact } from './sections/ContactSection';
import { Events } from './sections/EventsSection';
import { FeatureGrid } from './sections/FeatureGridSection';
import { Gallery } from './sections/GallerySection';
import { Hero } from './sections/HeroSection';
import { Join } from './sections/JoinSection';
import { Programs } from './sections/ProgramsSection';
import { Robots } from './sections/RobotsSection';
import { SponsorTiers } from './sections/SponsorTiersSection';
import { Story } from './sections/StorySection';
import { Timeline } from './sections/TimelineSection';

export { Hero };

export const Values = ({ section }) => <FeatureGrid section={section} />;

export const SectionRenderer = ({ section }) => {
  const components = {
    featureGrid: FeatureGrid,
    timeline: Timeline,
    story: Story,
    values: Values,
    programs: Programs,
    robots: Robots,
    sponsorTiers: SponsorTiers,
    events: Events,
    gallery: Gallery,
    contact: Contact,
    join: Join
  };
  const Component = components[section.type] || FeatureGrid;
  return <Component section={section} />;
};
