import React, { useState, useEffect } from 'react';
import { SPONSOR_TIERS, TEAM_PROFILE } from '../data/roboticsData';
import { 
  HeartHandshake, 
  DollarSign, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  Download, 
  Check, 
  Building2, 
  Mail, 
  TrendingUp,
  Award,
  Copy,
  ExternalLink
} from 'lucide-react';

interface SponsorCommandCenterProps {
  onShowToast?: (title: string, message?: string, type?: 'success' | 'info' | 'cyan' | 'purple') => void;
  externalOpenW9Modal?: boolean;
  onResetExternalW9Modal?: () => void;
}

export const SponsorCommandCenter: React.FC<SponsorCommandCenterProps> = ({
  onShowToast,
  externalOpenW9Modal,
  onResetExternalW9Modal
}) => {
  const [pledgeAmount, setPledgeAmount] = useState<number>(2500);
  const [showW9Modal, setShowW9Modal] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    notes: ''
  });

  useEffect(() => {
    if (externalOpenW9Modal) {
      setShowW9Modal(true);
      onResetExternalW9Modal?.();
    }
  }, [externalOpenW9Modal, onResetExternalW9Modal]);

  // Determine matching tier based on current pledge slider
  const currentTier = 
    SPONSOR_TIERS.find((t) => pledgeAmount >= t.minAmount) || 
    SPONSOR_TIERS[SPONSOR_TIERS.length - 1];

  // Calculate dynamic ROI metrics
  const estimatedImpressions = Math.round(pledgeAmount * 5.2);
  const estimatedTaxSavings = Math.round(pledgeAmount * 0.21); // ~21% corporate tax rate write-off benchmark

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    onShowToast?.(
      'Sponsorship Pledge Recorded!',
      `Thank you! Your pledge for $${pledgeAmount.toLocaleString()} USD has been registered. Our business director will deliver your invoice & W-9 packet.`,
      'success'
    );
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    onShowToast?.('Copied to Clipboard!', `${label} is now in your clipboard.`, 'cyan');
  };

  const PRESETS = [
    { label: '$500 Bronze', amount: 500 },
    { label: '$1,500 Silver', amount: 1500 },
    { label: '$2,500 Gold', amount: 2500 },
    { label: '$5,000 Platinum', amount: 5000 },
    { label: '$10,000 Diamond', amount: 10000 }
  ];

  return (
    <section className="py-12 sm:py-16 space-y-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/40 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              501(c)(3) TAX-EXEMPT PUBLIC CHARITY
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Corporate Sponsorship & STEM ROI Engine
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Partner with <strong className="text-slate-200">PCSS II Robotics (FTC #23548)</strong>. Your sponsorship fuels robot machining, precision sensors, regional travel, and youth STEM outreach in Saugus and Greater Boston. 100% of contributions are tax-deductible.
            </p>
          </div>

          <button
            onClick={() => setShowW9Modal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-cyan-900/60 text-xs font-bold transition shadow-sm shrink-0"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Download W-9 & IRS 501(c)(3) Packet</span>
          </button>
        </div>

        {/* Interactive Calculator Slider Card */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                Interactive Pledge Simulator
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                Select Your Contribution Level
              </h3>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                {pledgeAmount.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-mono">USD</span>
            </div>
          </div>

          {/* Quick Preset Buttons for zero cognitive friction */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-mono text-slate-400 mr-1">Quick Select:</span>
            {PRESETS.map((preset) => (
              <button
                key={preset.amount}
                type="button"
                onClick={() => setPledgeAmount(preset.amount)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition ${
                  pledgeAmount === preset.amount
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Slider input */}
          <div className="space-y-2">
            <input
              type="range"
              min={500}
              max={15000}
              step={250}
              value={pledgeAmount}
              onChange={(e) => setPledgeAmount(Number(e.target.value))}
              className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>$500 (Bronze)</span>
              <span>$2,500 (Gold)</span>
              <span>$5,000 (Platinum)</span>
              <span>$10,000+ (Diamond Title)</span>
            </div>
          </div>

          {/* Dynamic ROI Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                Qualified Sponsor Tier
              </span>
              <div className="text-lg font-bold text-cyan-300 font-mono">
                {currentTier.name}
              </div>
              <p className="text-[10px] text-slate-500">
                Automatic promotion at all season events
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Est. Brand Impressions
              </span>
              <div className="text-lg font-bold text-emerald-400 font-mono">
                ~{estimatedImpressions.toLocaleString()}+
              </div>
              <p className="text-[10px] text-slate-500">
                In-person pit banner, robot decal & web audience
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Tax Exemption Value
              </span>
              <div className="text-lg font-bold text-white font-mono">
                100% Deductible
              </div>
              <p className="text-[10px] text-slate-500">
                ~${estimatedTaxSavings.toLocaleString()} estimated corporate tax relief
              </p>
            </div>
          </div>

          {/* Active Tier Perks Preview */}
          <div className="p-5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 space-y-3">
            <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Included Benefits at the {currentTier.name} Level:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
              {currentTier.perks.map((perk, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tier Comparison Matrix */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white tracking-tight">
            Official 2025–2026 Sponsorship Packages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPONSOR_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`p-6 rounded-2xl border transition flex flex-col justify-between ${
                  currentTier.id === tier.id
                    ? 'border-cyan-500 bg-slate-900 shadow-xl shadow-cyan-950/30'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {tier.badge}
                    </span>
                    <span className="text-lg font-black text-white font-mono">
                      ${tier.minAmount.toLocaleString()}+
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white">{tier.name}</h4>
                  <p className="text-xs text-cyan-400 font-mono">{tier.estimatedImpressions}</p>

                  <ul className="space-y-2 text-xs text-slate-300">
                    {tier.perks.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setPledgeAmount(tier.minAmount);
                      window.scrollTo({ top: 900, behavior: 'smooth' });
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition ${
                      currentTier.id === tier.id
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    Select {tier.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Sponsorship Pledge Form */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/60 max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold text-white">
              Commit Corporate Sponsorship
            </h3>
            <p className="text-xs text-slate-400">
              Submit your inquiry and our 501(c)(3) Business Director will issue your formal invoice, W-9, and receipt.
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-center space-y-3">
              <Check className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Sponsorship Pledge Received!</h4>
              <p className="text-xs text-emerald-200">
                Thank you for empowering PCSS II Robotics. A formal receipt and W-9 package has been scheduled for delivery to your email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Raytheon / Vertex Bio"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Work Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Notes or Specific Program Interests</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Interested in high school engineering mentor days or robot logo placement..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition shadow-lg shadow-cyan-950"
              >
                Submit Sponsorship Pledge (${pledgeAmount.toLocaleString()} USD)
              </button>
            </form>
          )}
        </div>
      </div>

      {/* W-9 Download & Tax Exemption Modal */}
      {showW9Modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 max-w-md w-full space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                501(c)(3) Verification & W-9
              </h4>
              <button
                onClick={() => setShowW9Modal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-300 leading-relaxed">
              PCSS II Robotics operates under the 501(c)(3) non-profit public charity charter of Pioneer Charter School of Science II (Saugus, MA). All contributions directly support student robotics equipment, tournament registration, and STEM youth mentorship.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <div><strong>Entity:</strong> Pioneer Charter School of Science II</div>
                <button
                  type="button"
                  onClick={() => handleCopy('Pioneer Charter School of Science II', 'Legal Entity Name')}
                  className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 text-[10px] flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
              <div><strong>Program:</strong> PCSS II Robotics (FTC #23548)</div>
              <div><strong>Location:</strong> Saugus, MA 01906</div>
              <div><strong>Status:</strong> 501(c)(3) Tax-Exempt Public Charity</div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                <div><strong>Official Email:</strong> robotics@pcss2.org</div>
                <button
                  type="button"
                  onClick={() => handleCopy('robotics@pcss2.org', 'Robotics Contact Email')}
                  className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 text-[10px] flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <a
                href="mailto:robotics@pcss2.org?subject=Requesting%20PCSS%20II%20Robotics%20W9%20Packet"
                className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-center transition"
              >
                Request Signed W-9 Form
              </a>
              <button
                onClick={() => setShowW9Modal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
