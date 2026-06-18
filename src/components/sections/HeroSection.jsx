import { Icon } from '../Icon';
import { trackAnalyticsEvent } from '../../data/analytics';
import { asArray, resolveVariant } from './utils';

export const Hero = ({ hero, brand }) => {
  const resolvedHero = resolveVariant(hero);

  return (
    <section className="hero">
      <div className="hero-media" />
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="eyebrow">{resolvedHero?.eyebrow}</p>
        <h1>{resolvedHero?.title}</h1>
        <p className="hero-copy">{resolvedHero?.body}</p>
        <div className="hero-actions">
          <a
            className="button primary"
            href={resolvedHero?.primaryCta?.href || '/join'}
            onClick={() => trackAnalyticsEvent('cta_click', { location: 'hero', cta: 'primary', href: resolvedHero?.primaryCta?.href || '/join' })}
          >
            {resolvedHero?.primaryCta?.label || 'Join'}<Icon name="chevron" size={18} />
          </a>
          <a
            className="button ghost"
            href={resolvedHero?.secondaryCta?.href || '/contact'}
            onClick={() => trackAnalyticsEvent('cta_click', { location: 'hero', cta: 'secondary', href: resolvedHero?.secondaryCta?.href || '/contact' })}
          >
            {resolvedHero?.secondaryCta?.label || 'Contact'}
          </a>
        </div>
        <div className="hero-stats" aria-label={`${brand?.shortName || 'Team'} quick facts`}>
          {asArray(resolvedHero?.stats).map(stat => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
