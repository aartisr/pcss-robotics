import { Icon } from '../Icon';
import { trackAnalyticsEvent } from '../../data/analytics';
import { SectionIntro } from './SectionIntro';
import { asArray } from './utils';

const statIcons = ['rocket', 'users', 'trophy', 'handshake', 'code', 'shield'];

export const ImpactPulse = ({ section }) => {
  const metrics = asArray(section.metrics);
  const proof = asArray(section.proof);
  const partners = asArray(section.partners);

  return (
    <section className="content-section impact-pulse-section">
      <SectionIntro eyebrow={section.eyebrow || 'Impact'} title={section.title || 'Outcomes sponsors can measure'} body={section.body} />

      {metrics.length > 0 && (
        <div className="impact-metric-grid" aria-label="Impact metrics">
          {metrics.map((metric, index) => (
            <article className="impact-metric-card" key={`${metric.label}-${index}`}>
              <span className="impact-metric-icon">
                <Icon name={statIcons[index % statIcons.length]} size={18} />
              </span>
              <strong>{metric.value}</strong>
              <p>{metric.label}</p>
              {metric.detail && <small>{metric.detail}</small>}
            </article>
          ))}
        </div>
      )}

      {proof.length > 0 && (
        <div className="impact-proof-strip" aria-label="Proof points">
          {proof.map((item, index) => (
            <article className="impact-proof-chip" key={`${item.label}-${index}`}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      )}

      <div className="impact-sponsor-row">
        {section.ctaLabel && section.ctaHref && (
          <a
            className="button primary"
            href={section.ctaHref}
            target={section.ctaHref.startsWith('http') ? '_blank' : undefined}
            rel={section.ctaHref.startsWith('http') ? 'noreferrer' : undefined}
            onClick={() => trackAnalyticsEvent('cta_click', { location: 'impact_pulse', cta: 'primary', href: section.ctaHref })}
          >
            {section.ctaLabel}
          </a>
        )}
        {section.secondaryLabel && section.secondaryHref && (
          <a
            className="button dark"
            href={section.secondaryHref}
            target={section.secondaryHref.startsWith('http') ? '_blank' : undefined}
            rel={section.secondaryHref.startsWith('http') ? 'noreferrer' : undefined}
            onClick={() => trackAnalyticsEvent('cta_click', { location: 'impact_pulse', cta: 'secondary', href: section.secondaryHref })}
          >
            {section.secondaryLabel}
          </a>
        )}
      </div>

      {partners.length > 0 && (
        <div className="impact-partner-marquee" aria-label="Partner mentions">
          {partners.map((name, index) => (
            <span className="impact-partner-pill" key={`${name}-${index}`}>{name}</span>
          ))}
        </div>
      )}
    </section>
  );
};
