import {StrictMode, lazy, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const Admin = lazy(() => import('./editor/Admin'));
const isAdmin = window.location.pathname.replace(/\/+$/, '') === '/admin';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdmin ? <Suspense fallback={<div>Opening editor…</div>}><Admin /></Suspense> : <App />}
  </StrictMode>,
);
