import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { useState } from 'react';
import { Icon } from './Icon';

export const Layout = ({ content }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: state => state.location.pathname });
  const navigation = Array.isArray(content.navigation) ? content.navigation : [];
  const brandName = content.brand?.name || 'Robotics Team';
  const location = content.brand?.location || '';
  const email = content.brand?.email || '';
  const school = content.brand?.school || '';
  const tagline = content.brand?.tagline || '';

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <Link to="/" className="brand-lockup" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">P2</span>
          <span>
            <strong>{brandName}</strong>
            <small>{location}</small>
          </span>
        </Link>

        <button
          className="icon-button nav-toggle"
          type="button"
          onClick={() => setMenuOpen(value => !value)}
          aria-label="Toggle navigation"
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
        >
          <Icon name={menuOpen ? 'x' : 'menu'} />
        </button>

        <nav id="primary-navigation" className={menuOpen ? 'site-nav is-open' : 'site-nav'} aria-label="Primary navigation">
          {navigation.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={pathname === item.path ? 'nav-link is-active' : 'nav-link'}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/admin" className="nav-link nav-admin" onClick={() => setMenuOpen(false)}>
            Admin
          </Link>
        </nav>
      </header>

      <main id="main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div>
          <span className="footer-kicker">PCSS II Robotics</span>
          <p>{tagline}</p>
        </div>
        <div className="footer-links">
          {email && <a href={`mailto:${email}`}>{email}</a>}
          {school && <span>{school}</span>}
        </div>
      </footer>
    </div>
  );
};
