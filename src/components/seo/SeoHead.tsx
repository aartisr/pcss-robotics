import React, { useEffect } from 'react';
import { NavSection } from '../../types';

interface SeoHeadProps {
  activeSection: NavSection;
}

const SECTION_METADATA: Record<NavSection, { title: string; description: string; path: string }> = {
  home: {
    title: 'PCSS Robotics Evaluation & Audit – FTC #23548 Saugus MA',
    description: 'Academic research laboratory portal, FTC #23548 engineering platform, holonomic kinematics Jacobian solver, 500Hz optical odometry, and 501(c)(3) sponsorship ROI engine.',
    path: '/'
  },
  research: {
    title: 'Peer-Reviewed Robotics Working Papers & Technical Reports – PCSS Robotics',
    description: 'Explore 4 published academic technical reports covering feedforward quintic splines, optical odometry, FEA cascading elevators, and edge INT8 YOLOv8 vision pipelines by Aarti Sri Ravikumar and fellows.',
    path: '/?section=research'
  },
  robots: {
    title: 'Kraken V2 FTC Robot Engineering, CAD & Subsystems – PCSS Robotics',
    description: 'Interactive CAD viewer, bill of materials, and kinematic telemetry for Kraken V2, AeroStrike, and Vortex competitive FIRST Tech Challenge robots.',
    path: '/?section=robots'
  },
  simulator: {
    title: 'Autonomous Holonomic Path Simulator & 500Hz OTOS State Estimator',
    description: 'Real-time interactive 144-inch FTC match field simulator with quintic Hermite spline generation, PIDF tuning, and live odometry drift visualization.',
    path: '/?section=simulator'
  },
  sponsors: {
    title: '501(c)(3) Corporate Sponsorship & IRS Tax Deduction Center – PCSS Robotics',
    description: 'Calculate corporate tax credits, examine sponsorship tiers ($500–$5,000+), and download instant IRS Form W-9 verification for tax-deductible contributions.',
    path: '/?section=sponsors'
  },
  outreach: {
    title: 'Circuit 2026 STEM Outreach, Scrapyard Workshops & Community – PCSS Robotics',
    description: 'Regional STEM workshops, Daydream hackathons, JPL mentorship days, and hands-on robotics engineering across Essex and Middlesex counties.',
    path: '/?section=outreach'
  },
  arcade: {
    title: 'Cyber Arena & Multiplayer Autonomous Robotics Driving Game – PCSS Robotics',
    description: 'Test drive competitive robots in real-time solo, 2-player local split-screen, or WebSocket multiplayer cyber arena with live sample scoring.',
    path: '/?section=arcade'
  },
  team: {
    title: 'Student Research Fellows & Team Roster – PCSS Robotics FTC #23548',
    description: 'Meet student engineers, division leads, and student fellows including Lead Systems Fellow Aarti Sri Ravikumar, with portfolio and publication archives.',
    path: '/?section=team'
  }
};

export const SeoHead: React.FC<SeoHeadProps> = ({ activeSection }) => {
  useEffect(() => {
    const meta = SECTION_METADATA[activeSection] || SECTION_METADATA.home;

    // Update document title
    document.title = meta.title;

    // Update Meta Description
    let descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute('content', meta.description);
    }

    // Update OpenGraph Title & Description
    let ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (ogTitleTag) {
      ogTitleTag.setAttribute('content', meta.title);
    }
    let ogDescTag = document.querySelector('meta[property="og:description"]');
    if (ogDescTag) {
      ogDescTag.setAttribute('content', meta.description);
    }

    // Update Canonical URL
    const baseUrl = 'https://www.pcssiirobotics.org';
    const canonicalUrl = meta.path === '/' ? baseUrl + '/' : baseUrl + meta.path;
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag) {
      canonicalTag.setAttribute('href', canonicalUrl);
    }
    let ogUrlTag = document.querySelector('meta[property="og:url"]');
    if (ogUrlTag) {
      ogUrlTag.setAttribute('content', canonicalUrl);
    }

    // Sync browser URL cleanly without page reload if in browser
    if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
      const targetUrl = meta.path === '/' ? '/' : meta.path;
      if (window.location.search !== (meta.path === '/' ? '' : meta.path.replace('/', ''))) {
        window.history.replaceState({ section: activeSection }, meta.title, targetUrl);
      }
    }
  }, [activeSection]);

  return null;
};
