import { RubricCategory, Recommendation, MetricCard } from '../types';

export const OVERALL_SCORES = {
  repo: 7.2,
  website: 8.6,
  ecosystem: 7.9,
  repoGrade: 'B / Solid Foundation',
  websiteGrade: 'A- / High-Impact Showcase',
  ecosystemGrade: 'B+ / Standout High School STEM Platform'
};

export const REPO_METRICS: MetricCard[] = [
  {
    label: 'Commit Count',
    value: '1 Commit',
    sublabel: 'Squashed import dump (c5e4fbb)',
    status: 'warning'
  },
  {
    label: 'Primary Framework',
    value: 'React 19 + Vite 6',
    sublabel: 'Modern frontend ecosystem',
    status: 'positive'
  },
  {
    label: 'Lockfile Status',
    value: 'Dual Locks',
    sublabel: 'Both package-lock.json & bun.lock present',
    status: 'warning'
  },
  {
    label: 'Automated Tests',
    value: '0 Tests',
    sublabel: 'No Vitest / Jest / E2E suites installed',
    status: 'negative'
  },
  {
    label: 'Dependencies',
    value: '11 Packages',
    sublabel: 'Includes unused Express & unused GenAI client',
    status: 'neutral'
  },
  {
    label: 'Open Source License',
    value: 'MIT License',
    sublabel: 'Explicitly licensed with LICENSE file',
    status: 'positive'
  }
];

export const WEBSITE_METRICS: MetricCard[] = [
  {
    label: 'Hosting & CDN',
    value: 'Vercel Edge',
    sublabel: 'Global CDN with HTTP/2 and HSTS',
    status: 'positive'
  },
  {
    label: 'JS Bundle Size',
    value: '480 KB',
    sublabel: '~130 KB gzipped transfer',
    status: 'positive'
  },
  {
    label: 'CSS Bundle Size',
    value: '56.1 KB',
    sublabel: 'Tailwind utility output',
    status: 'positive'
  },
  {
    label: 'Hero Asset Size',
    value: '2.14 MB',
    sublabel: 'PNG loaded; WebP (136KB) exists but unused',
    status: 'negative'
  },
  {
    label: 'SEO Canonical Domain',
    value: 'Domain Mismatch',
    sublabel: 'Live on .org, meta tags link to .xyz',
    status: 'negative'
  },
  {
    label: 'AEO / LLM Readiness',
    value: 'LLMs.txt & GPTBot',
    sublabel: 'Pioneering AI search indexing enabled',
    status: 'positive'
  }
];

export const RUBRIC_CATEGORIES: RubricCategory[] = [
  {
    id: 'architecture',
    name: 'Frontend Architecture & Routing',
    target: 'repo',
    score: 8.5,
    weight: 15,
    badge: 'Strong Pattern',
    summary: 'Content-driven schema approach with dynamic TanStack Router integration and Puck CMS.',
    strengths: [
      'Modular route generation using TanStack Router based on src/content/siteContent.json slugs.',
      'Includes browser-based visual page editor integration (@puckeditor/core) for non-developer updates.',
      'Content normalization layer and application-level React Error Boundary.'
    ],
    weaknesses: [
      'Duplicate entry points: src/main.jsx is the active build root, but dead template files src/main.tsx and src/App.tsx are still present in repository.',
      'Express is declared in package.json dependencies despite the project building purely as a static SPA for Vercel.'
    ],
    evidence: 'src/router.jsx cleanly maps content.pages to TanStack routes. However, package.json lists express: ^4.21.2 without any server.ts or express backend.'
  },
  {
    id: 'code-hygiene',
    name: 'Code Hygiene & Repo Structure',
    target: 'repo',
    score: 5.8,
    weight: 15,
    badge: 'Needs Remediation',
    summary: 'Single-commit squashed codebase, template artifacts, and dual lockfiles hurt maintainability.',
    strengths: [
      'Clean folder separation into src/admin, src/components, src/data, src/games, and src/content.',
      'Presence of informative CONTRIBUTING.md, LICENSE, and research documentation.'
    ],
    weaknesses: [
      'Git history contains only 1 commit ("c5e4fbb feat: 100% responsiveness..."), obscuring development history, authorship, and peer reviews.',
      'package.json retains placeholder name "react-example" and version "0.0.0".',
      'Contains both package-lock.json (npm) and bun.lock (bun), risking CI dependency drift.'
    ],
    evidence: 'git log shows a single commit from Sep 16, 2026. package.json line 2 has "name": "react-example".'
  },
  {
    id: 'ci-cd-quality',
    name: 'Quality Assurance & CI/CD',
    target: 'repo',
    score: 5.5,
    weight: 15,
    badge: 'Critical Gap',
    summary: 'GitHub Actions workflow is present, but lacking automated tests and failing typechecks.',
    strengths: [
      'Basic GitHub Actions workflow (.github/workflows/ci.yml) configured for pushes and pull requests.',
      'Vercel automated deployment integration with vercel.json rewrite configuration.'
    ],
    weaknesses: [
      'Zero test suites: No unit tests, component tests, or integration tests with Vitest or Playwright.',
      'The "lint" script is set to "tsc --noEmit", but the codebase is written in plain JSX while tsconfig.json is configured for TS, causing lint step errors or false negatives.'
    ],
    evidence: 'package.json lacks vitest or jest. ci.yml runs "npm run lint" which triggers "tsc --noEmit" on a JSX codebase.'
  },
  {
    id: 'visual-design',
    name: 'Visual Design & Aesthetics',
    target: 'website',
    score: 8.8,
    weight: 15,
    badge: 'High Impact',
    summary: 'High-energy robotics theme with glowing circuit motifs, sleek dark styling, and crisp typography.',
    strengths: [
      'Distinctive FTC STEM visual identity with high contrast, telemetry accents, and circuit board graphics.',
      'Smooth micro-interactions powered by motion animations and responsive navigation drawer.',
      'Polished interactive tools such as the Robot Spec Inspector and interactive Command Palette.'
    ],
    weaknesses: [
      'Some high-contrast saturated cyan text on dark backgrounds can challenge WCAG AA readability in smaller body sizes.',
      'Overuse of dark-mode neon glows in secondary card borders.'
    ],
    evidence: 'Production site uses custom Tailwind styling with high visual appeal and dedicated robot telemetry callouts.'
  },
  {
    id: 'domain-content',
    name: 'STEM Content & Team Presentation',
    target: 'website',
    score: 9.5,
    weight: 20,
    badge: 'Outstanding',
    summary: 'Exceptionally rich, authentic documentation of FTC Team #23548 and 501(c)(3) mission.',
    strengths: [
      'Detailed mechanical & software specs for 3 robot generations: Kraken V2 (Into The Deep), AeroStrike (CenterStage), Vortex (PowerPlay).',
      'Explicit 501(c)(3) tax status, EIN/tax receipt clarity, and structured corporate sponsorship tiers (Bronze $500 to Platinum $5,000+).',
      'Real educational mission: RoadRunner pathing, REV robotics parts, CAD workflows, and student team divisions.'
    ],
    weaknesses: [
      'Student and mentor rosters could feature actual team photography in place of generated avatar placeholders in certain gallery sections.'
    ],
    evidence: 'Extensive coverage of REV HD Hex motors, odometry pods, 500Hz optical telemetry, and Into The Deep game strategy.'
  },
  {
    id: 'seo-aeo',
    name: 'SEO, AEO & Metadata Integrity',
    target: 'website',
    score: 8.0,
    weight: 10,
    badge: 'Innovative but Buggy',
    summary: 'Pioneering LLM/AI search indexing, but crippled by a live domain vs. canonical metadata mismatch.',
    strengths: [
      'Industry-leading AI search engine optimization with /llms.txt and /llms-full.txt files.',
      'Granular robots.txt specifying custom allowances for GPTBot, ClaudeBot, PerplexityBot, and Google-Extended.',
      'Complete Schema.org JSON-LD graph with EducationalOrganization, SportsTeam, and FAQPage schemas.'
    ],
    weaknesses: [
      'CRITICAL: Canonical domain mismatch! While hosted on https://www.pcssiirobotics.org/, og:url, Schema @id, sitemap.xml, and llms.txt all declare https://pcssiirobotics.xyz/ as the canonical URL.',
      'Search engines risk splitting domain authority between .org and .xyz.'
    ],
    evidence: 'HTML head on pcssiirobotics.org contains: <meta property="og:url" content="https://pcssiirobotics.xyz/" /> and Sitemap: https://pcssiirobotics.xyz/sitemap.xml.'
  },
  {
    id: 'interactive-features',
    name: 'Interactive Features & Innovation',
    target: 'website',
    score: 9.0,
    weight: 10,
    badge: 'Delightful',
    summary: 'Interactive Sponsor ROI Calculator, Robot Spec Inspector, Arcade Mini-Games, and AI Assistant.',
    strengths: [
      'Sponsor ROI Calculator allows corporate partners to calculate marketing reach, tax deductions, and logo placement impact.',
      'Arcade Game Center (/games) with custom canvas game engine and party mode.',
      'Quick command palette (Ctrl+K) for instant keyboard navigation.'
    ],
    weaknesses: [
      'The "PCSS II RoboBot AI" assistant drawer uses local keyword matching rather than the declared @google/genai SDK.',
      'Arcade games are a fun easter egg but are secondary to the team sponsorship and engineering mission.'
    ],
    evidence: 'src/components/sections/SponsorRoiCalculator.jsx and src/games/arcadeEngine.js provide rich interactive engagement.'
  }
];

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    title: 'Fix Critical Canonical Domain Mismatch in Metadata & Sitemap',
    target: 'website',
    priority: 'P0 - Critical',
    impact: 'Prevents search ranking split, broken social share links, and SEO duplicate content penalties.',
    effort: 'Quick (< 1 hr)',
    description: 'The live site at https://www.pcssiirobotics.org/ declares https://pcssiirobotics.xyz/ in og:url, twitter cards, Schema.org @id, sitemap.xml, and robots.txt. Update all canonical references to use the primary .org domain (or setup proper 301 redirects).',
    filePath: 'index.html & public/robots.txt & public/sitemap.xml',
    codeSolution: `<!-- Change in index.html -->
<meta property="og:url" content="https://www.pcssiirobotics.org/" />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [{
    "@type": "EducationalOrganization",
    "@id": "https://www.pcssiirobotics.org/#organization",
    "url": "https://www.pcssiirobotics.org/",
    ...
  }]
}
</script>`
  },
  {
    id: 'rec-2',
    title: 'Switch Hero Banner from 2.14MB PNG to 136KB WebP',
    target: 'website',
    priority: 'P1 - High',
    impact: 'Cuts initial page load payload by 2.0 MB (93% reduction in hero image weight), drastically boosting Largest Contentful Paint (LCP) on mobile networks.',
    effort: 'Quick (< 1 hr)',
    description: 'The repository already contains robotics-lab-hero.webp (136 KB), but HeroSection.jsx loads robotics-lab-hero.png (2.14 MB). Implement a <picture> element with WebP fallback.',
    filePath: 'src/components/sections/HeroSection.jsx',
    codeSolution: `<picture>
  <source srcSet="/src/assets/robotics-lab-hero.webp" type="image/webp" />
  <img 
    src="/src/assets/robotics-lab-hero.png" 
    alt="PCSS II Robotics Engineering Lab"
    loading="eager"
    fetchpriority="high"
    className="hero-image"
  />
</picture>`
  },
  {
    id: 'rec-3',
    title: 'Clean Up Dead Entrypoint Boilerplate & Package Metadata',
    target: 'repo',
    priority: 'P1 - High',
    impact: 'Eliminates developer confusion, speeds up onboarding, and cleans up package manifests.',
    effort: 'Quick (< 1 hr)',
    description: 'Remove leftover boilerplate files src/App.tsx and src/main.tsx which collide with active src/main.jsx. Update package.json name from "react-example" to "pcss-robotics", and remove the unused express dependency.',
    filePath: 'package.json, src/App.tsx, src/main.tsx',
    codeSolution: `// Run in terminal:
rm src/App.tsx src/main.tsx

// In package.json:
{
  "name": "pcss-robotics",
  "version": "1.0.0",
  "description": "Official web portal for PCSS II Robotics FTC #23548",
  ...
}`
  },
  {
    id: 'rec-4',
    title: 'Align TypeScript Configuration & ESLint for JSX Codebase',
    target: 'repo',
    priority: 'P2 - Medium',
    impact: 'Restores working "npm run lint" and ensures CI/CD catches actual syntax errors rather than crashing on missing type definitions.',
    effort: 'Moderate (1-3 hrs)',
    description: 'Currently npm run lint invokes "tsc --noEmit", which expects pure TypeScript. Either migrate key components to .tsx or configure ESLint (eslint src --ext .js,.jsx) as the primary linter.',
    filePath: 'package.json & .eslintrc.cjs',
    codeSolution: `// In package.json:
"scripts": {
  "lint": "eslint src --ext .js,.jsx"
}`
  },
  {
    id: 'rec-5',
    title: 'Wire Up Live Gemini API or Remove Unused @google/genai Package',
    target: 'repo',
    priority: 'P2 - Medium',
    impact: 'Provides real intelligent responses for robotics questions, or cleans up unused SDK dependencies and .env.example secrets.',
    effort: 'Moderate (1-3 hrs)',
    description: '@google/genai is listed in package.json and GEMINI_API_KEY in .env.example, but RoboticsAiAssistant.jsx uses a local regex string-matching simulator. Either connect a serverless Gemini endpoint or remove the dependency.',
    filePath: 'src/components/RoboticsAiAssistant.jsx'
  },
  {
    id: 'rec-6',
    title: 'Introduce Automated Component & Integration Tests with Vitest',
    target: 'repo',
    priority: 'P3 - Low / Polish',
    impact: 'Guarantees that content updates, route changes, and calculator formulas do not break during future competition seasons.',
    effort: 'Substantial (1+ days)',
    description: 'Install vitest and @testing-library/react to test the SponsorRoiCalculator, RobotSpecInspector, and routing fallback.',
    filePath: 'package.json & src/__tests__/'
  }
];
