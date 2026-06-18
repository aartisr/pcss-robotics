import { useState } from 'react';
import { trackAnalyticsEvent } from '../../data/analytics';
import { SectionIntro } from './SectionIntro';
import { asArray, resolveVariant } from './utils';

export const SponsorConversion = ({ section }) => {
  const resolved = resolveVariant(section);
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    budget: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const submitLabel = resolved.submitLabel || 'Request Sponsor Packet';
  const packetHref = resolved.packetHref || '/sponsors';

  const onSubmit = event => {
    event.preventDefault();

    trackAnalyticsEvent('sponsor_lead_submit', {
      name: form.name,
      company: form.company,
      email: form.email,
      budget: form.budget
    });

    setSubmitted(true);

    const subject = encodeURIComponent(resolved.emailSubject || 'Sponsorship Interest');
    const body = encodeURIComponent([
      `Name: ${form.name}`,
      `Company: ${form.company}`,
      `Email: ${form.email}`,
      `Budget: ${form.budget}`,
      '',
      'Please send sponsorship packet and next steps.'
    ].join('\n'));
    const to = resolved.email || 'pcssiirobotics@gmail.com';
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  return (
    <section className="content-section sponsor-conversion-section" id="sponsor-conversion">
      <SectionIntro
        eyebrow={resolved.eyebrow || 'Sponsor conversion'}
        title={resolved.title || 'Back a student engineering team that ships outcomes'}
        body={resolved.body || 'Partnerships fund tools, events, mentorship, and measurable STEM impact.'}
      />

      <div className="sponsor-conversion-grid">
        <div>
          <div className="sponsor-conversion-proof-grid">
            {asArray(resolved.highlights).map((item, index) => (
              <article className="sponsor-conversion-proof-card" key={`${item.title}-${index}`}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>

          <div className="sponsor-faq-list" aria-label="Sponsor FAQ">
            {asArray(resolved.faq).map((item, index) => (
              <details key={`${item.q}-${index}`}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        <aside className="sponsor-sticky-panel">
          <p className="eyebrow">Quick intake</p>
          <h3>{resolved.formTitle || 'Get the sponsor packet in 24 hours'}</h3>
          {resolved.formBody && <p className="sponsor-sticky-copy">{resolved.formBody}</p>}

          <form className="sponsor-lead-form" onSubmit={onSubmit}>
            <label>
              Name
              <input
                type="text"
                required
                value={form.name}
                onChange={event => setForm(previous => ({ ...previous, name: event.target.value }))}
              />
            </label>
            <label>
              Organization
              <input
                type="text"
                required
                value={form.company}
                onChange={event => setForm(previous => ({ ...previous, company: event.target.value }))}
              />
            </label>
            <label>
              Work email
              <input
                type="email"
                required
                value={form.email}
                onChange={event => setForm(previous => ({ ...previous, email: event.target.value }))}
              />
            </label>
            <label>
              Estimated budget
              <input
                type="text"
                placeholder="$1,000 - $5,000"
                value={form.budget}
                onChange={event => setForm(previous => ({ ...previous, budget: event.target.value }))}
              />
            </label>
            <button className="button primary" type="submit">{submitLabel}</button>
          </form>

          <a
            className="button dark sponsor-packet-link"
            href={packetHref}
            onClick={() => trackAnalyticsEvent('cta_click', { location: 'sponsor_conversion', cta: 'packet', href: packetHref })}
          >
            {resolved.packetLabel || 'View Sponsorship Options'}
          </a>

          {submitted && <p className="sponsor-form-confirm">Thanks. Opening your email draft now.</p>}
        </aside>
      </div>
    </section>
  );
};
