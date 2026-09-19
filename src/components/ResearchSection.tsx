import React, { useState, useMemo } from 'react';
import { LAB_PROFILE, RESEARCH_PAPERS, LAB_INSTRUMENTS } from '../data/researchData';
import { ResearchPaper } from '../types';
import { TechnicalPaperModal } from './TechnicalPaperModal';
import { MathFormula, FormattedAcademicText } from './MathFormula';
import { 
  BookOpen, 
  Cpu, 
  Calculator, 
  Layers, 
  FileText, 
  Download, 
  ExternalLink, 
  Award, 
  CheckCircle2, 
  Sliders, 
  Activity, 
  Zap, 
  Search, 
  Copy, 
  Check, 
  GraduationCap, 
  FlaskConical,
  Microscope,
  Compass,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Binary
} from 'lucide-react';

interface ResearchSectionProps {
  onShowToast?: (title: string, message?: string, type?: 'success' | 'info' | 'cyan' | 'purple') => void;
}

export const ResearchSection: React.FC<ResearchSectionProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'papers' | 'workbench' | 'instrumentation' | 'personnel'>('papers');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // --- Kinematics Workbench State ---
  const [vx, setVx] = useState<number>(1.2); // m/s forward
  const [vy, setVy] = useState<number>(0.6); // m/s strafe
  const [omega, setOmega] = useState<number>(1.5); // rad/s rotation
  const wheelRadius = 0.048; // 96mm diameter mecanum wheel = 0.048m radius
  const lx = 0.175; // half track length (m)
  const ly = 0.165; // half track width (m)
  const lSum = lx + ly; // 0.34m

  // Compute 4 wheel angular velocities from Mecanum Jacobian:
  // w1 (Front Left)  = (1/r) * (vx - vy - (lx+ly)*omega)
  // w2 (Front Right) = (1/r) * (vx + vy + (lx+ly)*omega)
  // w3 (Rear Left)   = (1/r) * (vx + vy - (lx+ly)*omega)
  // w4 (Rear Right)  = (1/r) * (vx - vy + (lx+ly)*omega)
  const kinematicsResults = useMemo(() => {
    const w1 = (1 / wheelRadius) * (vx - vy - lSum * omega);
    const w2 = (1 / wheelRadius) * (vx + vy + lSum * omega);
    const w3 = (1 / wheelRadius) * (vx + vy - lSum * omega);
    const w4 = (1 / wheelRadius) * (vx - vy + lSum * omega);

    const radToRpm = 60 / (2 * Math.PI);
    const resultantSpeed = Math.sqrt(vx * vx + vy * vy);
    const headingDeg = (Math.atan2(vy, vx) * 180) / Math.PI;

    return {
      w1: { rad: w1, rpm: w1 * radToRpm },
      w2: { rad: w2, rpm: w2 * radToRpm },
      w3: { rad: w3, rpm: w3 * radToRpm },
      w4: { rad: w4, rpm: w4 * radToRpm },
      resultantSpeed,
      headingDeg
    };
  }, [vx, vy, omega, lSum, wheelRadius]);

  // --- PIDF Simulation State ---
  const [kp, setKp] = useState<number>(2.4);
  const [ki, setKi] = useState<number>(0.15);
  const [kd, setKd] = useState<number>(0.45);
  const [kv, setKv] = useState<number>(1.05);

  // Generate simulated step response curve (40 time steps)
  const pidPoints = useMemo(() => {
    const points: { t: number; y: number; ref: number }[] = [];
    const dt = 0.05;
    let pos = 0;
    let vel = 0;
    let integral = 0;
    let prevError = 0;
    const target = 1.0;

    for (let i = 0; i <= 40; i++) {
      const t = i * dt;
      const error = target - pos;
      integral += error * dt;
      const derivative = (error - prevError) / dt;
      prevError = error;

      // PIDF output torque/effort
      const u = kp * error + ki * integral + kd * derivative + kv * (target > pos ? 0.2 : 0);
      
      // Simple second order inertia approximation: acc = u - damping * vel
      const acc = Math.max(-12, Math.min(12, u * 3.5 - 2.2 * vel));
      vel += acc * dt;
      pos += vel * dt;

      points.push({
        t: Number(t.toFixed(2)),
        y: Math.max(0, Number(pos.toFixed(3))),
        ref: target
      });
    }

    // Estimate characteristics
    const maxVal = Math.max(...points.map((p) => p.y));
    const overshoot = Math.max(0, ((maxVal - target) / target) * 100);
    const riseTimePoint = points.find((p) => p.y >= 0.9 * target);
    const riseTime = riseTimePoint ? riseTimePoint.t : 2.0;

    return { points, overshoot, riseTime };
  }, [kp, ki, kd, kv]);

  const categories = ['All', 'Kinematics & Controls', 'Mechanical Dynamics', 'Computer Vision', 'STEM Pedagogy'];

  const filteredPapers = useMemo(() => {
    if (selectedCategory === 'All') return RESEARCH_PAPERS;
    return RESEARCH_PAPERS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const handleCopyBibtex = (paper: ResearchPaper) => {
    navigator.clipboard?.writeText(paper.bibtex);
    setCopiedId(paper.id);
    onShowToast?.('LaTeX BibTeX Copied', `Citation for ${paper.reportId} is now in your clipboard.`, 'cyan');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section className="py-10 sm:py-14 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Academic Institutional Header */}
      <div className="p-8 sm:p-10 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 backdrop-blur-2xl relative overflow-hidden shadow-2xl shadow-cyan-950/40">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider uppercase text-cyan-400 font-bold">
                <FlaskConical className="w-4 h-4 text-cyan-400" />
                <span>PIONEER CHARTER SCHOOL OF SCIENCE II // DIVISION OF APPLIED CYBERNETICS</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif-academic font-bold text-white tracking-tight leading-tight">
                {LAB_PROFILE.labName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-serif-academic max-w-3xl leading-relaxed">
                {LAB_PROFILE.missionStatement}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 font-mono text-[11px] space-y-1.5 shrink-0 text-slate-300">
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Institutional Registry</div>
              <div><strong>Team Entity:</strong> FTC #23548</div>
              <div><strong>Location:</strong> Saugus, Massachusetts</div>
              <div><strong>Director:</strong> {LAB_PROFILE.director}</div>
              <div className="text-emerald-400"><strong>Charity Status:</strong> 501(c)(3) Tax Exempt</div>
            </div>
          </div>

          {/* Academic Laboratory KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 font-mono">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase">Working Papers</div>
              <div className="text-lg sm:text-xl font-bold text-white">4 Preprints</div>
              <div className="text-[10px] text-cyan-400">PCSS Tech Reports</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase">Odometry Drift</div>
              <div className="text-lg sm:text-xl font-bold text-cyan-300">2.1 mm / 30m</div>
              <div className="text-[10px] text-slate-400">500Hz Optical EKF</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase">Loop Execution</div>
              <div className="text-lg sm:text-xl font-bold text-purple-300">500 Hz</div>
              <div className="text-[10px] text-slate-400">2.0ms Latency Bounded</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase">STEM Grants</div>
              <div className="text-lg sm:text-xl font-bold text-emerald-400">$38,500</div>
              <div className="text-[10px] text-slate-400">RTX & MassCEC</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-400 uppercase">STEM Matriculation</div>
              <div className="text-lg sm:text-xl font-bold text-amber-300">94.2%</div>
              <div className="text-[10px] text-slate-400">4-Year Cohort Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Research Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('papers')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition flex items-center gap-2 ${
              activeTab === 'papers'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Technical Papers & Preprints (4)</span>
          </button>

          <button
            onClick={() => setActiveTab('workbench')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition flex items-center gap-2 ${
              activeTab === 'workbench'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Kinematics & PIDF Lab Workbench</span>
          </button>

          <button
            onClick={() => setActiveTab('instrumentation')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition flex items-center gap-2 ${
              activeTab === 'instrumentation'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Microscope className="w-3.5 h-3.5" />
            <span>Metrology & Instruments (6)</span>
          </button>

          <button
            onClick={() => setActiveTab('personnel')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition flex items-center gap-2 ${
              activeTab === 'personnel'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Lab Fellows & Grants</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
          LaTeX & BibTeX Enabled Repository
        </div>
      </div>

      {/* TAB 1: TECHNICAL PAPERS & PREPRINTS */}
      {activeTab === 'papers' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 mr-2">Discipline:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-mono transition ${
                  selectedCategory === cat
                    ? 'bg-slate-100 text-slate-900 font-bold shadow-sm'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Papers Grid */}
          <div className="space-y-6">
            {filteredPapers.map((paper) => (
              <article
                key={paper.id}
                className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl hover:border-cyan-500/40 transition space-y-5 group"
              >
                {/* Paper Header & Badges */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800/60 text-[10px] font-mono font-bold tracking-wider">
                      {paper.reportId}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      DOI: {paper.doi}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[10px] font-mono">
                      {paper.category}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-slate-400">{paper.date}</span>
                </div>

                {/* Title & Authors */}
                <div className="space-y-2">
                  <h2 
                    onClick={() => setSelectedPaper(paper)}
                    className="text-xl sm:text-2xl font-serif-academic font-bold text-white group-hover:text-cyan-300 transition cursor-pointer leading-snug"
                  >
                    {paper.title}
                  </h2>
                  <div className="text-xs text-slate-300 font-mono flex flex-wrap items-center gap-1">
                    <span className="text-slate-400">Authors:</span>
                    {paper.authors.map((author, i) => (
                      <span key={author} className="inline-flex items-center">
                        {author.toLowerCase().includes('aarti') ? (
                          <a
                            href="https://ai-aarti.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-300 hover:text-white underline decoration-cyan-500/40 hover:decoration-cyan-300 inline-flex items-center gap-0.5 transition"
                            title="Visit Aarti's Portfolio (https://ai-aarti.com)"
                          >
                            <span>{author}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-cyan-400 inline" />
                          </a>
                        ) : (
                          <span className="text-cyan-200">{author}</span>
                        )}
                        {i < paper.authors.length - 1 && <span className="text-slate-500 mr-1">,</span>}
                      </span>
                    ))}
                    <span className="text-slate-500 ml-1">&bull; {paper.venue}</span>
                  </div>
                </div>

                {/* Abstract Preview */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                    Executive Abstract
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 font-serif-academic leading-relaxed text-justify">
                    <FormattedAcademicText text={paper.abstract} />
                  </p>
                </div>

                {/* Mathematical Theorems Highlights */}
                {paper.keyTheorems.length > 0 && (
                  <div className="space-y-2">
                    <MathFormula 
                      formula={paper.keyTheorems[0].latexFormula || paper.keyTheorems[0].content}
                      label={paper.keyTheorems[0].title}
                    />
                  </div>
                )}

                {/* Empirical Benchmark Snapshot */}
                {paper.empiricalData.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    {paper.empiricalData.slice(0, 4).map((d, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-950/50 border border-white/5 space-y-0.5">
                        <div className="text-[10px] font-mono text-slate-400 truncate">{d.metric}</div>
                        <div className="text-xs font-bold text-cyan-300 font-mono">{d.proposedMethod}</div>
                        <div className="text-[10px] text-emerald-400 font-mono">{d.delta} vs baseline</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {paper.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyBibtex(paper)}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono transition flex items-center gap-1.5"
                      title="Copy LaTeX BibTeX entry"
                    >
                      {copiedId === paper.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">BibTeX Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy BibTeX</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setSelectedPaper(paper)}
                      className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-cyan-950/40"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Read Monograph & Benchmarks &rarr;</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE KINEMATICS & CONTROLS WORKBENCH */}
      {activeTab === 'workbench' && (
        <div className="space-y-10 animate-in fade-in duration-200">
          {/* Section Description */}
          <div className="p-6 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl space-y-2">
            <h2 className="text-lg font-mono font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-cyan-400" />
              <span>Computational Kinematics & PIDF Dynamics Workbench</span>
            </h2>
            <p className="text-xs text-slate-300 font-serif-academic leading-relaxed">
              Real-time mathematical simulator solving the holonomic Mecanum Jacobian matrix and closed-loop PIDF transfer functions used directly in the Kraken V2 RoadRunner codebase.
            </p>
          </div>

          {/* SIMULATOR 1: MECANUM INVERSE KINEMATICS SOLVER */}
          <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  Lab Tool 01 // Forward & Inverse Velocity Transformations
                </span>
                <h3 className="text-xl font-serif-academic font-bold text-white">
                  Holonomic Mecanum Jacobian Velocity Solver
                </h3>
              </div>
              <div className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300">
                Wheel r = 48mm &bull; 2(Lx+Ly) = 0.68m
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Controls Column */}
              <div className="lg:col-span-6 space-y-5">
                <div className="space-y-4">
                  {/* Vx */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Longitudinal Velocity (v_x):</span>
                      <span className="text-cyan-400 font-bold">{vx.toFixed(2)} m/s</span>
                    </div>
                    <input
                      type="range"
                      min="-2.5"
                      max="2.5"
                      step="0.05"
                      value={vx}
                      onChange={(e) => setVx(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>-2.5 m/s (Reverse)</span>
                      <span>0.0 m/s</span>
                      <span>+2.5 m/s (Forward)</span>
                    </div>
                  </div>

                  {/* Vy */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Transverse Strafe Velocity (v_y):</span>
                      <span className="text-cyan-400 font-bold">{vy.toFixed(2)} m/s</span>
                    </div>
                    <input
                      type="range"
                      min="-2.5"
                      max="2.5"
                      step="0.05"
                      value={vy}
                      onChange={(e) => setVy(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>-2.5 m/s (Strafe Left)</span>
                      <span>0.0 m/s</span>
                      <span>+2.5 m/s (Strafe Right)</span>
                    </div>
                  </div>

                  {/* Omega */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Yaw Angular Rate (ω):</span>
                      <span className="text-purple-400 font-bold">{omega.toFixed(2)} rad/s ({(omega * 57.3).toFixed(1)}°/s)</span>
                    </div>
                    <input
                      type="range"
                      min="-6.0"
                      max="6.0"
                      step="0.1"
                      value={omega}
                      onChange={(e) => setOmega(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-400"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>-6.0 rad/s (CCW)</span>
                      <span>0.0</span>
                      <span>+6.0 rad/s (CW)</span>
                    </div>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="text-[11px] font-mono text-slate-400 self-center">Presets:</span>
                  <button
                    onClick={() => { setVx(2.0); setVy(0); setOmega(0); }}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-[11px] font-mono text-slate-300 border border-slate-800"
                  >
                    Sprint Forward (2.0 m/s)
                  </button>
                  <button
                    onClick={() => { setVx(0); setVy(1.8); setOmega(0); }}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-[11px] font-mono text-slate-300 border border-slate-800"
                  >
                    Pure Strafe Right
                  </button>
                  <button
                    onClick={() => { setVx(1.2); setVy(1.2); setOmega(2.5); }}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-[11px] font-mono text-slate-300 border border-slate-800"
                  >
                    Diagonal Orbit
                  </button>
                </div>
              </div>

              {/* Real-time Equations & Wheel RPM Results */}
              <div className="lg:col-span-6 space-y-4">
                {/* Dynamically Rendered Matrix Equation */}
                <MathFormula
                  label="Live Jacobian Matrix Evaluation"
                  formula={`\\begin{bmatrix} \\omega_1 \\\\ \\omega_2 \\\\ \\omega_3 \\\\ \\omega_4 \\end{bmatrix} = \\frac{1}{0.048} \\begin{bmatrix} 1 & -1 & -0.34 \\\\ 1 & 1 & 0.34 \\\\ 1 & 1 & -0.34 \\\\ 1 & -1 & 0.34 \\end{bmatrix} \\begin{bmatrix} ${vx.toFixed(2)} \\\\ ${vy.toFixed(2)} \\\\ ${omega.toFixed(2)} \\end{bmatrix} = \\begin{bmatrix} ${kinematicsResults.w1.rad.toFixed(1)} \\\\ ${kinematicsResults.w2.rad.toFixed(1)} \\\\ ${kinematicsResults.w3.rad.toFixed(1)} \\\\ ${kinematicsResults.w4.rad.toFixed(1)} \\end{bmatrix} \\text{ rad/s}`}
                />

                {/* 4-Wheel Visual Chassis Diagram */}
                <div className="p-5 rounded-2xl bg-slate-950/90 border border-white/10 space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400 uppercase">Chassis Drivetrain Actuation</span>
                    <span className="text-emerald-400 font-bold">
                      Resultant: {kinematicsResults.resultantSpeed.toFixed(2)} m/s @ {kinematicsResults.headingDeg.toFixed(0)}°
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-400">Front Left (Wheel 1)</div>
                      <div className="text-cyan-300 font-bold">{kinematicsResults.w1.rpm.toFixed(0)} RPM</div>
                      <div className="text-[10px] text-slate-500">{kinematicsResults.w1.rad.toFixed(1)} rad/s</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-400">Front Right (Wheel 2)</div>
                      <div className="text-cyan-300 font-bold">{kinematicsResults.w2.rpm.toFixed(0)} RPM</div>
                      <div className="text-[10px] text-slate-500">{kinematicsResults.w2.rad.toFixed(1)} rad/s</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-400">Rear Left (Wheel 3)</div>
                      <div className="text-cyan-300 font-bold">{kinematicsResults.w3.rpm.toFixed(0)} RPM</div>
                      <div className="text-[10px] text-slate-500">{kinematicsResults.w3.rad.toFixed(1)} rad/s</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-400">Rear Right (Wheel 4)</div>
                      <div className="text-cyan-300 font-bold">{kinematicsResults.w4.rpm.toFixed(0)} RPM</div>
                      <div className="text-[10px] text-slate-500">{kinematicsResults.w4.rad.toFixed(1)} rad/s</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SIMULATOR 2: PIDF CLOSED-LOOP STEP RESPONSE TUNER */}
          <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  Lab Tool 02 // Transfer Function & Velocity Response
                </span>
                <h3 className="text-xl font-serif-academic font-bold text-white">
                  PIDF Velocity Step-Response & Transient Stability
                </h3>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-slate-400">Overshoot: <strong className="text-amber-400">{pidPoints.overshoot.toFixed(1)}%</strong></span>
                <span className="text-slate-400">Rise Time: <strong className="text-cyan-300">{pidPoints.riseTime.toFixed(2)}s</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Sliders */}
              <div className="lg:col-span-5 space-y-4 font-mono text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Proportional Gain (Kp):</span>
                    <span className="text-cyan-400 font-bold">{kp.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="6.0"
                    step="0.1"
                    value={kp}
                    onChange={(e) => setKp(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded cursor-pointer accent-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Integral Gain (Ki):</span>
                    <span className="text-cyan-400 font-bold">{ki.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.05"
                    value={ki}
                    onChange={(e) => setKi(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded cursor-pointer accent-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Derivative Gain (Kd):</span>
                    <span className="text-cyan-400 font-bold">{kd.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="1.5"
                    step="0.05"
                    value={kd}
                    onChange={(e) => setKd(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded cursor-pointer accent-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Feedforward Velocity (Kv):</span>
                    <span className="text-purple-400 font-bold">{kv.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="2.5"
                    step="0.05"
                    value={kv}
                    onChange={(e) => setKv(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded cursor-pointer accent-purple-400"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed font-serif-academic">
                  Formula: <span className="font-mono text-cyan-300">u(t) = K_v·v_ref + K_p·e(t) + K_i·∫e(τ)dτ + K_d·de/dt</span>
                </div>
              </div>

              {/* Dynamic Step Response Graph */}
              <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Step Response Transient Curve</span>
                  <span className="text-cyan-400">Target Setpoint = 1.0</span>
                </div>

                <div className="w-full h-48 bg-slate-900/90 rounded-xl p-3 relative overflow-hidden border border-slate-800 flex flex-col justify-end">
                  {/* Reference line at 1.0 (approx 65% height) */}
                  <div className="absolute top-[35%] left-0 right-0 border-b border-dashed border-slate-600 z-0">
                    <span className="absolute right-2 -top-4 text-[9px] font-mono text-slate-400">Setpoint (1.0)</span>
                  </div>

                  {/* SVG response path */}
                  <svg className="w-full h-full absolute inset-0 z-10 p-2 overflow-visible" preserveAspectRatio="none" viewBox="0 0 40 1.6">
                    <polyline
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="0.06"
                      points={pidPoints.points.map((p, i) => `${i},${1.6 - p.y * 1.05}`).join(' ')}
                    />
                  </svg>
                </div>

                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>t = 0.0s</span>
                  <span>t = 1.0s</span>
                  <span>t = 2.0s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: METROLOGY & LAB INSTRUMENTS */}
      {activeTab === 'instrumentation' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl space-y-2">
            <h2 className="text-lg font-mono font-bold text-white flex items-center gap-2">
              <Microscope className="w-5 h-5 text-cyan-400" />
              <span>Laboratory Instrumentation & Fabrication Metrology</span>
            </h2>
            <p className="text-xs text-slate-300 font-serif-academic leading-relaxed">
              Research equipment deployed within the PCSS II Robotics Laboratory in Saugus, MA, supporting rapid mechanical iteration, 25-micron stereolithography, and nanosecond signal integrity debugging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LAB_INSTRUMENTS.map((inst) => (
              <div
                key={inst.id}
                className="p-6 rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl hover:border-cyan-500/40 transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800/60 text-[10px] font-mono font-bold">
                      {inst.category}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                      {inst.precision}
                    </span>
                  </div>

                  <h3 className="font-serif-academic font-bold text-lg text-white leading-snug">
                    {inst.name}
                  </h3>

                  <div className="text-xs font-mono text-slate-400">
                    Model: <span className="text-slate-200">{inst.model}</span>
                  </div>

                  <p className="text-xs text-slate-300 font-serif-academic leading-relaxed">
                    {inst.role}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 text-[11px] font-mono text-slate-400">
                  <span className="text-cyan-400 font-semibold">Specs:</span> {inst.specifications}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RESEARCH FELLOWS & GRANTS */}
      {activeTab === 'personnel' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Principal Investigator & Mentorship */}
            <div className="lg:col-span-6 p-8 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  Faculty Leadership & Governance
                </span>
                <h3 className="text-2xl font-serif-academic font-bold text-white">
                  Principal Investigator & Faculty Advisors
                </h3>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-base">Dr. Marcus Vance, Ph.D.</h4>
                    <div className="text-xs font-mono text-cyan-300">Lead Laboratory Advisor & Systems Director</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 text-[10px] font-mono">
                    Aerospace & Control
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-serif-academic leading-relaxed">
                  Doctoral research in non-linear adaptive flight control systems. Oversees laboratory safety protocols, student academic publishing, high-voltage battery architecture, and FIRST Tech Challenge competition compliance.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Student Research Fellows (2025–2026 Academic Cohort)
                </h4>
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex justify-between items-center group/fellow hover:border-cyan-500/40 transition">
                    <div>
                      <a
                        href="https://ai-aarti.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-cyan-300 font-bold inline-flex items-center gap-1 underline decoration-cyan-500/30 hover:decoration-cyan-400 transition"
                        title="Visit Aarti Sri Ravikumar's Portfolio"
                      >
                        <span>Aarti Sri Ravikumar</span>
                        <ExternalLink className="w-3 h-3 text-cyan-400 inline" />
                      </a>
                      <span className="text-slate-400"> &bull; Grade 9 (Lead Systems Fellow)</span>
                    </div>
                    <span className="text-cyan-400">RoadRunner & State Estimation</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex justify-between items-center">
                    <div>
                      <strong className="text-white">Kavya P.</strong>
                      <span className="text-slate-400"> &bull; Grade 11 (Mechanical Fellow)</span>
                    </div>
                    <span className="text-cyan-400">Onshape FEA & Dyneema Rigging</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex justify-between items-center">
                    <div>
                      <strong className="text-white">Devon M.</strong>
                      <span className="text-slate-400"> &bull; Grade 12 (Signals Fellow)</span>
                    </div>
                    <span className="text-cyan-400">I2C Timing & Edge Computer Vision</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex justify-between items-center">
                    <div>
                      <strong className="text-white">Elena R.</strong>
                      <span className="text-slate-400"> &bull; Grade 11 (Pedagogy & Outreach)</span>
                    </div>
                    <span className="text-cyan-400">501(c)(3) Stewardship & Grants</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Research Grants & Funding Portfolio */}
            <div className="lg:col-span-6 p-8 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  Sponsored Research & Equipment Grants
                </span>
                <h3 className="text-2xl font-serif-academic font-bold text-white">
                  Active Grants: $38,500
                </h3>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/20 space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <strong className="text-white">RTX STEM Aerospace Equipment Grant</strong>
                    <span className="text-emerald-400 font-bold">$15,000</span>
                  </div>
                  <p className="text-xs text-slate-400 font-serif-academic">
                    Funding high-precision CNC equipment, precision tooling, and titanium fasteners for competitive robotics research.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/20 space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <strong className="text-white">MassCEC Clean Tech & Autonomous Systems Fund</strong>
                    <span className="text-cyan-400 font-bold">$12,500</span>
                  </div>
                  <p className="text-xs text-slate-400 font-serif-academic">
                    Supporting low-power edge computer vision accelerators, high-efficiency brushless planetary motors, and battery health telemetry.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/20 space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <strong className="text-white">FIRST Robotics STEM Equity & Youth Access Grant</strong>
                    <span className="text-purple-400 font-bold">$11,000</span>
                  </div>
                  <p className="text-xs text-slate-400 font-serif-academic">
                    Providing equipment toolkits, transportation, and free registration for 450+ middle school students in Saugus, Lynn, and Revere.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2 text-xs font-mono text-slate-400">
                <div className="text-white font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>501(c)(3) Fiscal Sponsorship & Grant Compliance</span>
                </div>
                <p className="text-[11px] font-serif-academic leading-relaxed text-slate-300">
                  All grant appropriations are administered directly through the Pioneer Charter School of Science II 501(c)(3) tax-exempt charter. Independent financial audits are published annually.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Technical Paper Modal */}
      <TechnicalPaperModal
        paper={selectedPaper}
        isOpen={!!selectedPaper}
        onClose={() => setSelectedPaper(null)}
        onShowToast={onShowToast}
      />
    </section>
  );
};
