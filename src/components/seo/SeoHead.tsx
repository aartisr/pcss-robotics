import { useEffect } from 'react';
import type { NavSection } from '../../types';
import { AUTHOR, SECTION_METADATA, SITE_URL, structuredDataFor } from '../../seo/siteMetadata';

interface SeoHeadProps {
  activeSection: NavSection;
}

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function setLink(rel: string, href: string) {
  let tag = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement('link');
    tag.rel = rel;
    document.head.appendChild(tag);
  }
  tag.href = href;
}

export function SeoHead({ activeSection }: SeoHeadProps) {
  useEffect(() => {
    const meta = SECTION_METADATA[activeSection];
    const canonicalUrl = `${SITE_URL}${meta.path}`;
    document.title = meta.title;
    setMeta('meta[name="description"]', 'name', 'description', meta.description);
    setMeta('meta[name="author"]', 'name', 'author', AUTHOR.name);
    setMeta('meta[name="robots"]', 'name', 'robots', meta.indexable === false ? 'noindex,follow' : 'index,follow,max-image-preview:large');
    setMeta('meta[property="og:title"]', 'property', 'og:title', meta.title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', meta.description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', meta.description);
    setLink('canonical', canonicalUrl);
    setLink('author', AUTHOR.url);

    let schema = document.querySelector<HTMLScriptElement>('script#site-jsonld');
    if (!schema) {
      schema = document.createElement('script');
      schema.id = 'site-jsonld';
      schema.type = 'application/ld+json';
      document.head.appendChild(schema);
    }
    schema.textContent = JSON.stringify(structuredDataFor(activeSection)).replace(/</g, '\\u003c');
  }, [activeSection]);

  return null;
}
