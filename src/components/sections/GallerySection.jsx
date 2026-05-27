import { Icon } from '../Icon';
import { SectionIntro } from './SectionIntro';
import { asArray } from './utils';

export const Gallery = ({ section }) => (
  <section className="content-section">
    <SectionIntro eyebrow="Media" title="Make the work visible" />
    <div className="gallery-grid">
      {asArray(section.items).map((item, index) => (
        <article className={`gallery-card gallery-card-${index + 1}`} key={item.title}>
          <Icon name={index === 0 ? 'camera' : index === 1 ? 'trophy' : 'handshake'} />
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  </section>
);
