import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  failed: boolean;
}

/** Keep the site shell usable if a feature chunk or section render fails. */
export class SectionErrorBoundary extends React.Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div role="alert" className="mx-auto my-16 max-w-xl rounded-2xl border border-amber-500/40 bg-slate-900 p-8 text-center">
          <h2 className="text-xl font-bold text-white">This section could not load</h2>
          <p className="mt-2 text-sm text-slate-300">Please try again. The rest of the site is still available.</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-5 rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-500">Reload section</button>
        </div>
      );
    }

    return this.props.children;
  }
}
