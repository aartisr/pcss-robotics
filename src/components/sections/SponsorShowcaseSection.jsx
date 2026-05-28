import { SectionIntro } from './SectionIntro';
import { asArray } from './utils';

export const SponsorShowcase = ({ section }) => (
  <section className="content-section sponsor-showcase-section">
    <div className="split-section">
      <div>
        <SectionIntro eyebrow={section.eyebrow || 'Sponsorship'} title={section.title || 'Sponsor the event'} body={section.body} />
        {section.email && (
          <p className="sponsor-contact-copy">Want to sponsor us? Reach out to <a className="email-link" href={`mailto:${section.email}`}>{section.email}</a> for details on sponsorship.</p>
        )}
      </div>

      <div className="sponsor-summary-panel">
        <p className="eyebrow">Community support</p>
        <h3>{section.summaryTitle || 'A race toward impact'}</h3>
        <p>{section.summary || 'Support mentorship, build space, prizes, and student-led innovation.'}</p>
      </div>
    </div>

    <div className="tier-grid">
      {asArray(section.tiers).map((tier, index) => (
        <article className="tier-card" key={`${tier.tier}-${index}`}>
          <div className="tier-heading">
            <p className="eyebrow">{tier.level || 'Tier'}</p>
            <h3>{tier.tier}</h3>
          </div>
          {tier.status && <span className="pill" aria-label="tier status">{tier.status}</span>}
          {tier.description && <p>{tier.description}</p>}
          {asArray(tier.benefits).length > 0 && (
            <ul>
              {tier.benefits.map(benefit => <li key={benefit}>{benefit}</li>)}
            </ul>
          )}
        </article>
      ))}
    </div>
  </section>
);
