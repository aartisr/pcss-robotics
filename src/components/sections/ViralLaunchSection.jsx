import { Icon } from '../Icon';
import { trackAnalyticsEvent } from '../../data/analytics';
import { SectionIntro } from './SectionIntro';
import { asArray } from './utils';

export const ViralLaunch = ({ section }) => {
  const loop = asArray(section.loopSteps);
  const channels = asArray(section.channels);
  const hashtags = asArray(section.hashtags);
  const ugc = asArray(section.ugc);

  return (
    <section className="content-section viral-launch-section">
      <SectionIntro eyebrow={section.eyebrow || 'Growth Loop'} title={section.title || 'Turn every event into 1,000 new impressions'} body={section.body} />

      <div className="viral-loop-grid">
        <article className="viral-highlight-card">
          <p className="eyebrow">Challenge</p>
          <h3>{section.challengeTitle || 'Build. Film. Share. Repeat.'}</h3>
          {section.challengeBody && <p>{section.challengeBody}</p>}
          {section.deadline && <p className="viral-deadline">Campaign window: {section.deadline}</p>}
          {section.challengeCtaLabel && section.challengeCtaHref && (
            <a
              className="button primary"
              href={section.challengeCtaHref}
              target={section.challengeCtaHref.startsWith('http') ? '_blank' : undefined}
              rel={section.challengeCtaHref.startsWith('http') ? 'noreferrer' : undefined}
              onClick={() => trackAnalyticsEvent('cta_click', { location: 'viral_launch', cta: 'challenge', href: section.challengeCtaHref })}
            >
              {section.challengeCtaLabel}
            </a>
          )}
        </article>

        {loop.length > 0 && (
          <div className="viral-step-list">
            {loop.map((step, index) => (
              <article className="viral-step-card" key={`${step.title}-${index}`}>
                <span className="viral-step-index">0{index + 1}</span>
                <h3>{step.title}</h3>
                {step.body && <p>{step.body}</p>}
              </article>
            ))}
          </div>
        )}
      </div>

      {channels.length > 0 && (
        <div className="viral-channel-grid" aria-label="Share channels">
          {channels.map((channel, index) => (
            <a
              className="viral-channel-card"
              href={channel.href || '#'}
              key={`${channel.name}-${index}`}
              target={channel.href?.startsWith('http') ? '_blank' : undefined}
              rel={channel.href?.startsWith('http') ? 'noreferrer' : undefined}
              onClick={() => trackAnalyticsEvent('cta_click', { location: 'viral_launch_channel', channel: channel.name, href: channel.href || '#' })}
            >
              <span className="card-icon"><Icon name={channel.icon || 'sparkles'} /></span>
              <div>
                <h3>{channel.name}</h3>
                {channel.body && <p>{channel.body}</p>}
              </div>
            </a>
          ))}
        </div>
      )}

      {hashtags.length > 0 && (
        <div className="viral-hashtag-row" aria-label="Campaign hashtags">
          {hashtags.map((tag, index) => (
            <span className="viral-hashtag" key={`${tag}-${index}`}>#{String(tag).replace(/^#/, '')}</span>
          ))}
        </div>
      )}

      {ugc.length > 0 && (
        <div className="viral-ugc-grid" aria-label="Community posts">
          {ugc.map((item, index) => (
            <article className="viral-ugc-card" key={`${item.title}-${index}`}>
              <h3>{item.title}</h3>
              {item.body && <p>{item.body}</p>}
              {item.meta && <span>{item.meta}</span>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
