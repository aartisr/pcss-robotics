import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { downloadJson, loadContent, resetContent, saveContent } from '../data/contentStore';
import { Icon } from '../components/Icon';

export const AdminPage = () => {
  const queryClient = useQueryClient();
  const { data: content } = useQuery({ queryKey: ['site-content'], queryFn: loadContent, staleTime: Infinity });
  const [jsonDraft, setJsonDraft] = useState('');
  const [jsonError, setJsonError] = useState('');

  useEffect(() => {
    if (content) {
      setJsonDraft(JSON.stringify(content, null, 2));
    }
  }, [content]);

  const mutation = useMutation({
    mutationFn: saveContent,
    onSuccess: data => queryClient.setQueryData(['site-content'], data)
  });

  if (!content) {
    return (
      <section className="admin-page">
        <div className="admin-header">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Loading content</h1>
            <p>Preparing editable content model.</p>
          </div>
        </div>
      </section>
    );
  }

  const update = nextContent => mutation.mutate(nextContent);

  const updateBrand = (field, value) => {
    update({ ...content, brand: { ...content.brand, [field]: value } });
  };

  const updatePage = (slug, field, value) => {
    update({
      ...content,
      pages: content.pages.map(page => page.slug === slug ? { ...page, [field]: value } : page)
    });
  };

  const handleJsonChange = value => {
    setJsonDraft(value);
    try {
      const parsed = JSON.parse(value);
      setJsonError('');
      update(parsed);
    } catch (error) {
      setJsonError(error.message);
      return;
    }
  };

  const handleReset = () => {
    const nextContent = resetContent();
    queryClient.setQueryData(['site-content'], nextContent);
  };

  return (
    <section className="admin-page">
      <div className="admin-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Editable site content</h1>
          <p>Changes save to this browser immediately. Export the JSON when you want to commit content back into the project.</p>
        </div>
        <div className="admin-actions">
          <button className="button ghost dark" type="button" onClick={() => downloadJson(content)}><Icon name="file" />Export JSON</button>
          <button className="button ghost dark" type="button" onClick={handleReset}>Reset</button>
        </div>
      </div>

      <div className="admin-grid">
        <form className="admin-panel">
          <h2>Brand</h2>
          {['name', 'tagline', 'location', 'email', 'school'].map(field => (
            <label key={field}>
              <span>{field}</span>
              <input value={content.brand[field]} onChange={event => updateBrand(field, event.target.value)} />
            </label>
          ))}
        </form>

        <div className="admin-panel">
          <h2>Pages</h2>
          <div className="page-editor-list">
            {content.pages.map(page => (
              <article key={page.slug} className="page-editor">
                <strong>{page.slug}</strong>
                <label>
                  <span>Title</span>
                  <input value={page.title} onChange={event => updatePage(page.slug, 'title', event.target.value)} />
                </label>
                <label>
                  <span>Summary</span>
                  <textarea value={page.summary} onChange={event => updatePage(page.slug, 'summary', event.target.value)} />
                </label>
              </article>
            ))}
          </div>
        </div>

        <div className="admin-panel json-panel">
          <h2>Raw JSON</h2>
          {jsonError && <p className="json-error">JSON is not saved yet: {jsonError}</p>}
          <textarea
            aria-label="Raw site JSON"
            spellCheck="false"
            value={jsonDraft}
            onChange={event => handleJsonChange(event.target.value)}
          />
        </div>
      </div>
    </section>
  );
};
