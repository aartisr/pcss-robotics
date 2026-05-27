import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Icon } from './Icon';

const iconNames = ['wrench', 'cpu', 'code', 'users', 'shield', 'rocket'];

export const SectionIntro = ({ eyebrow, title, body }) => (
  <div className="section-intro">
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    {title && <h2>{title}</h2>}
    {body && <p>{body}</p>}
  </div>
);

export const Hero = ({ hero, brand }) => (
  <section className="hero">
    <div className="hero-media" />
    <div className="hero-overlay" />
    <div className="hero-content">
      <p className="eyebrow">{hero.eyebrow}</p>
      <h1>{hero.title}</h1>
      <p className="hero-copy">{hero.body}</p>
      <div className="hero-actions">
        <a className="button primary" href={hero.primaryCta.href}>{hero.primaryCta.label}<Icon name="chevron" size={18} /></a>
        <a className="button ghost" href={hero.secondaryCta.href}>{hero.secondaryCta.label}</a>
      </div>
      <div className="hero-stats" aria-label={`${brand.shortName} quick facts`}>
        {hero.stats.map(stat => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const FeatureGrid = ({ section }) => (
  <section className="content-section">
    <SectionIntro eyebrow={section.eyebrow} title={section.title} body={section.body} />
    <div className="feature-grid">
      {section.items.map((item, index) => (
        <article className="feature-card" key={item.title}>
          <span className="card-icon"><Icon name={iconNames[index % iconNames.length]} /></span>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  </section>
);

export const Timeline = ({ section }) => (
  <section className="content-section split-section">
    <SectionIntro eyebrow={section.eyebrow} title={section.title} body={section.body} />
    <div className="timeline">
      {section.items.map(item => (
        <article key={item.title} className="timeline-item">
          <time>{item.date}</time>
          <div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export const Story = ({ section }) => (
  <section className="story-band">
    <div className="story-panel">
      <SectionIntro eyebrow={section.eyebrow} title={section.title} body={section.body} />
    </div>
    <div className="principle-stack">
      <span>Prototype</span>
      <span>Test</span>
      <span>Compete</span>
      <span>Reflect</span>
    </div>
  </section>
);

export const Values = ({ section }) => <FeatureGrid section={section} />;

const ProgramTable = ({ items }) => {
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor('name', { header: 'Pathway' }),
    columnHelper.accessor('level', { header: 'Level' }),
    columnHelper.accessor('focus', { header: 'Focus' })
  ];
  const table = useReactTable({ data: items, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          {table.getHeaderGroups().map(group => (
            <tr key={group.id}>
              {group.headers.map(header => <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>)}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const Programs = ({ section }) => (
  <section className="content-section">
    <SectionIntro eyebrow="Training pathways" title="Clear lanes without locking students in" body="Students can start anywhere, then rotate as their interests grow." />
    <ProgramTable items={section.items} />
  </section>
);

export const Robots = ({ section }) => (
  <section className="content-section">
    <SectionIntro eyebrow="Robot archive" title="Every robot should teach the next one" />
    <div className="robot-grid">
      {section.items.map(robot => (
        <article className="robot-card" key={`${robot.season}-${robot.name}`}>
          <div className="robot-season">{robot.season}</div>
          <div>
            <span className="pill">{robot.status}</span>
            <h3>{robot.name}</h3>
            <p>{robot.summary}</p>
            <ul>
              {robot.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}
            </ul>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export const SponsorTiers = ({ section }) => (
  <section className="content-section">
    <SectionIntro eyebrow="Fuel the season" title="Give students the parts, tools, and access to do real engineering" />
    <div className="tier-grid">
      {section.items.map(tier => (
        <article className="tier-card" key={tier.tier}>
          <span>{tier.amount}</span>
          <h3>{tier.tier}</h3>
          <ul>{tier.benefits.map(benefit => <li key={benefit}>{benefit}</li>)}</ul>
        </article>
      ))}
    </div>
  </section>
);

export const Events = ({ section }) => (
  <section className="content-section">
    <SectionIntro eyebrow="Calendar" title="The next moments that matter" />
    <div className="event-list">
      {section.items.map(event => (
        <article className="event-row" key={`${event.date}-${event.name}`}>
          <time dateTime={event.date}>{new Date(`${event.date}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</time>
          <div>
            <span>{event.category}</span>
            <h3>{event.name}</h3>
            <p>{event.location}</p>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export const Gallery = ({ section }) => (
  <section className="content-section">
    <SectionIntro eyebrow="Media" title="Make the work visible" />
    <div className="gallery-grid">
      {section.items.map((item, index) => (
        <article className={`gallery-card gallery-card-${index + 1}`} key={item.title}>
          <Icon name={index === 0 ? 'camera' : index === 1 ? 'trophy' : 'handshake'} />
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  </section>
);

export const Contact = ({ section }) => (
  <section className="content-section contact-band">
    <SectionIntro eyebrow="Contact" title="Bring your question, idea, or support" />
    <div className="contact-grid">
      <a href={`mailto:${section.email}`}><Icon name="mail" />{section.email}</a>
      <span><Icon name="map" />{section.address}</span>
      {section.items.map(item => (
        <article key={item.label}>
          <h3>{item.label}</h3>
          <p>{item.value}</p>
        </article>
      ))}
    </div>
  </section>
);

export const Join = ({ section }) => <FeatureGrid section={{ ...section, eyebrow: 'Start here', title: 'There is a first useful job for everyone' }} />;

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
