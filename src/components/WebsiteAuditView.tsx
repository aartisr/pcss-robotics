import React, { useState } from 'react';
import { Globe, ShieldAlert, Sparkles, Image, Search, Bot, CheckCircle, ExternalLink, Calculator, Gamepad2 } from 'lucide-react';

export const WebsiteAuditView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'seo-domain' | 'features' | 'performance'>('overview');

  return (
    <div className="space-y-6">
      {/* Website Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2">
            <Globe className="w-4 h-4" />
            Website Evaluation &bull; Score: 8.6 / 10
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            PCSS II Robotics Live Web Portal
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Live URL: <code className="text-cyan-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded">https://www.pcssiirobotics.org/</code>
            &bull; Hosted on Vercel Global Edge &bull; HTTP/2 Enabled &bull; HSTS Active
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
            Rating: 8.6 / 10 (Grade A-)
          </span>
          <a
            href="https://www.pcssiirobotics.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition shadow-sm flex items-center gap-1.5"
          >
            <span>Visit Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveSection('overview')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
            activeSection === 'overview'
              ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          UX & Visual Impression
        </button>
        <button
          onClick={() => setActiveSection('features')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
            activeSection === 'features'
              ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calculator className="w-4 h-4 text-emerald-400" />
          Interactive Features
        </button>
        <button
          onClick={() => setActiveSection('seo-domain')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
            activeSection === 'seo-domain'
              ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Search className="w-4 h-4 text-amber-400" />
          Domain & SEO Mismatch
        </button>
        <button
          onClick={() => setActiveSection('performance')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
            activeSection === 'performance'
              ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Image className="w-4 h-4 text-cyan-400" />
          Performance & Asset Weight
        </button>
      </div>

      {/* Section 1: Overview */}
      {activeSection === 'overview' && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4 text-xs sm:text-sm text-slate-300">
            <h4 className="text-base font-semibold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Outstanding FIRST Robotics Team Storytelling
            </h4>
            <p className="leading-relaxed">
              The live site represents an exceptional showcase for Pioneer Charter School of Science II (Saugus, MA). It balances technical robot specs, team ethos, competition schedule, and corporate 501(c)(3) sponsorship in a unified, professional presentation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs font-semibold text-cyan-400">Kraken V2 (Into The Deep)</span>
                <p className="text-[11px] text-slate-400">
                  Detailed 4x REV HD Hex Mecanum drive, Pinpoint Odometry, specimen elevator, and 500Hz optical telemetry.
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs font-semibold text-cyan-400">501(c)(3) Non-Profit Clarity</span>
                <p className="text-[11px] text-slate-400">
                  Tax-deductible partnership details, corporate W-9 info, and tier perks from $500 to $5,000+.
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs font-semibold text-cyan-400">STEM Outreach & Growth</span>
                <p className="text-[11px] text-slate-400">
                  Feeder mentoring for middle school FLL and VEX divisions with open enrollment for 6-12th graders.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Interactive Features */}
      {activeSection === 'features' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Calculator className="w-4 h-4 text-emerald-400" />
                Sponsor ROI Calculator
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Companies can input prospective donation budgets and receive real-time projections of tax savings under 501(c)(3), estimated regional competition impressions, and jersey/robot logo sizing.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Gamepad2 className="w-4 h-4 text-purple-400" />
                Arcade Mini-Games Center (/games)
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Includes interactive canvas-based retro games with custom state engines, high-score tracking, and party mode, reinforcing the student-led spirit of the robotics lab.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Bot className="w-4 h-4 text-cyan-400" />
                RoboBot AI Assistant Drawer
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provides instant answers about upcoming events, robot specifications, and how to join the team with pre-baked quick prompts.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                In-Browser CMS (/admin)
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Integrated visual builder for non-coder team mentors to update competition dates and sponsor logos without touching git.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Domain & SEO Mismatch */}
      {activeSection === 'seo-domain' && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-rose-950/30 border border-rose-800/40 space-y-2 text-rose-200 text-xs">
            <div className="flex items-center gap-2 font-bold text-sm text-rose-400">
              <ShieldAlert className="w-4 h-4" />
              Critical SEO Flaw: Canonical Domain Mismatch
            </div>
            <p className="leading-relaxed">
              The website is publicly deployed and accessed at <strong className="text-white font-mono">https://www.pcssiirobotics.org/</strong>. However, the production HTML source, Open Graph tags, Twitter cards, Schema.org JSON-LD, sitemap, and robots.txt all hardcode <strong className="text-white font-mono">https://pcssiirobotics.xyz/</strong>!
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3 text-xs">
            <h5 className="font-semibold text-white">Live Verified HTML Tags on https://www.pcssiirobotics.org/:</h5>
            <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-amber-300 overflow-x-auto">
{`<!-- Current Live Headers on www.pcssiirobotics.org -->
<meta property="og:url" content="https://pcssiirobotics.xyz/" />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": "https://pcssiirobotics.xyz/#organization",
      "url": "https://pcssiirobotics.xyz/", ...
    }
  ]
}
</script>
<!-- robots.txt -->
Sitemap: https://pcssiirobotics.xyz/sitemap.xml
LLM-Text: https://pcssiirobotics.xyz/llms.txt`}
            </pre>
            <div className="text-slate-400 space-y-1">
              <p><strong className="text-slate-200">Search Penalty:</strong> Google interprets this as duplicate content or signals that the .org domain is an unauthorized mirror of the .xyz domain, diluting backlink equity.</p>
              <p><strong className="text-slate-200">Fix Required:</strong> Standardize on the primary .org domain across all meta and schema tags.</p>
            </div>
          </div>
        </div>
      )}

      {/* Section 4: Performance & Asset Weight */}
      {activeSection === 'performance' && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3 text-xs sm:text-sm text-slate-300">
            <h4 className="text-base font-semibold text-white flex items-center gap-2">
              <Image className="w-4 h-4 text-cyan-400" />
              Heavy Hero Banner Asset (2.14 MB PNG)
            </h4>
            <p className="leading-relaxed text-xs">
              Live HTTP inspection reveals that <code className="text-cyan-300 font-mono">robotics-lab-hero.png</code> is downloaded on page load, consuming 2,142,171 bytes (~2.14 MB).
            </p>
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>PNG Asset: <strong>2,142 KB</strong></span>
                <span>WebP Equivalent (Already in repo!): <strong>136 KB</strong></span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
                <div className="bg-emerald-500 h-full w-[6%]" />
              </div>
              <p className="text-[11px] text-emerald-400 pt-1">
                Switching to WebP delivers an immediate 93.6% image payload reduction (saving 2.0 MB), slashing initial mobile LCP load times.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
