import { useEffect, useMemo, useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Puck, usePuck } from '@puckeditor/core';
import '@puckeditor/core/puck.css';
import { Hero, SectionRenderer } from '../components/Sections';
import { useContent } from '../data/ContentContext';
import {
  applyPuckDataToContent,
  createPuckDataForSlug,
  getSectionTypeOptions,
  slugFromPathname,
  types
} from './puckAdapter';

const toTitleCase = value => value
  .replace(/[-_]+/g, ' ')
  .replace(/\b\w/g, char => char.toUpperCase());

const parseJsonWithoutThrowing = value => {
  if (!value || !String(value).trim()) {
    return {};
  }

  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};

const parseArrayWithoutThrowing = value => {
  if (!value || !String(value).trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const createPuckConfig = (brand, sectionTypes) => {
  const sectionTypeOptions = sectionTypes.map(type => ({ label: toTitleCase(type), value: type }));

  return {
    components: {
      [types.HOME_HERO_TYPE]: {
        label: 'Home Hero',
        fields: {
          eyebrow: { type: 'text', label: 'Eyebrow' },
          title: { type: 'text', label: 'Title' },
          body: { type: 'textarea', label: 'Body' },
          primaryLabel: { type: 'text', label: 'Primary CTA Label' },
          primaryHref: { type: 'text', label: 'Primary CTA Href' },
          secondaryLabel: { type: 'text', label: 'Secondary CTA Label' },
          secondaryHref: { type: 'text', label: 'Secondary CTA Href' },
          statsJson: { type: 'textarea', label: 'Stats JSON (array)' },
          extrasJson: { type: 'textarea', label: 'Advanced Hero JSON' }
        },
        defaultProps: {
          eyebrow: '',
          title: '',
          body: '',
          primaryLabel: '',
          primaryHref: '/',
          secondaryLabel: '',
          secondaryHref: '/',
          statsJson: '[]',
          extrasJson: '{}'
        },
        render: props => {
          const hero = {
            ...parseJsonWithoutThrowing(props.extrasJson),
            eyebrow: props.eyebrow || '',
            title: props.title || '',
            body: props.body || '',
            primaryCta: {
              label: props.primaryLabel || '',
              href: props.primaryHref || '/'
            },
            secondaryCta: {
              label: props.secondaryLabel || '',
              href: props.secondaryHref || '/'
            },
            stats: parseArrayWithoutThrowing(props.statsJson)
          };

          return <Hero hero={hero} brand={brand} />;
        }
      },
      [types.PAGE_HEADER_TYPE]: {
        label: 'Page Header',
        fields: {
          title: { type: 'text', label: 'Title' },
          summary: { type: 'textarea', label: 'Summary' }
        },
        defaultProps: {
          title: 'Untitled Page',
          summary: ''
        },
        render: props => (
          <section className="page-hero">
            <p className="eyebrow">PCSS II Robotics</p>
            <h1>{props.title}</h1>
            <p>{props.summary}</p>
          </section>
        )
      },
      [types.SECTION_BLOCK_TYPE]: {
        label: 'Section',
        fields: {
          sectionType: {
            type: 'select',
            label: 'Section Type',
            options: sectionTypeOptions
          },
          eyebrow: { type: 'text', label: 'Eyebrow' },
          title: { type: 'text', label: 'Title' },
          body: { type: 'textarea', label: 'Body' },
          extrasJson: { type: 'textarea', label: 'Advanced Section JSON' }
        },
        defaultProps: {
          sectionType: 'featureGrid',
          eyebrow: '',
          title: 'Section',
          body: '',
          extrasJson: '{}'
        },
        render: props => {
          const section = {
            ...parseJsonWithoutThrowing(props.extrasJson),
            type: props.sectionType || 'featureGrid',
            eyebrow: props.eyebrow || '',
            title: props.title || '',
            body: props.body || ''
          };

          return <SectionRenderer section={section} />;
        }
      }
    }
  };
};

const EditorToolbarPreviewButton = () => {
  const { dispatch } = usePuck();
  const [preview, setPreview] = useState(false);

  return (
    <button
      type="button"
      className="button ghost dark"
      onClick={() => {
        const nextPreview = !preview;
        setPreview(nextPreview);
        dispatch({
          type: 'setUi',
          ui: nextPreview
            ? {
                previewMode: 'interactive',
                leftSideBarVisible: false,
                rightSideBarVisible: false
              }
            : {
                previewMode: 'edit',
                leftSideBarVisible: true,
                rightSideBarVisible: true
              }
        });
      }}
    >
      {preview ? 'Exit Preview' : 'Preview'}
    </button>
  );
};

export const AdminEditorPage = () => {
  const { content, save } = useContent();
  const pathname = useRouterState({ select: state => state.location.pathname });
  const slug = useMemo(() => slugFromPathname(pathname), [pathname]);
  const sectionTypes = useMemo(() => getSectionTypeOptions(content), [content]);
  const config = useMemo(() => createPuckConfig(content.brand, sectionTypes), [content.brand, sectionTypes]);

  const [data, setData] = useState(() => createPuckDataForSlug(content, slug));
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    setData(createPuckDataForSlug(content, slug));
    setSaveError('');
  }, [content, slug]);

  const viewPath = slug === types.HOME_SLUG ? '/' : `/${slug}`;

  return (
    <section className="admin-page admin-editor-page">
      <div className="admin-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Editing {slug === types.HOME_SLUG ? 'home' : slug}</h1>
          <p>Every page can be managed in the Puck editor. Use advanced JSON fields for section-specific data models.</p>
        </div>
        <div className="admin-actions">
          <Link className="button ghost dark" to="/admin">All Pages</Link>
          <a className="button ghost dark" href={viewPath} target="_blank" rel="noreferrer">View Live</a>
        </div>
      </div>

      {saveError && <p className="json-error">Save blocked: {saveError}</p>}

      <div className="admin-panel puck-admin-panel">
        <Puck
          key={slug}
          config={config}
          data={data}
          onPublish={nextData => {
            const result = applyPuckDataToContent(content, slug, nextData);

            if (result.errors.length > 0) {
              setSaveError(result.errors.join(' '));
              return;
            }

            setSaveError('');
            save(result.content);
            setData(nextData);
          }}
          overrides={{
            headerActions: ({ children }) => (
              <>
                <EditorToolbarPreviewButton />
                {children}
              </>
            )
          }}
        />
      </div>
    </section>
  );
};
