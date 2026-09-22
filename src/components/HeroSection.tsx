import React, { useState } from 'react';
import { TEAM_PROFILE } from '../data/roboticsData';
import { LAB_PROFILE, RESEARCH_PAPERS } from '../data/researchData';
import { NavSection } from '../types';
import celestialHeroImg from '../assets/celestial_robot_hero.jpg';
import labHeroWebp from '../assets/robotics-lab-hero.webp';
import labHeroPng from '../assets/robotics-lab-hero.png';
import { 
  ArrowRight, 
  Activity, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  FileText,
  GraduationCap,
  HeartHandshake,
  Gamepad2,
  Cpu,
  Layers,
  Zap,
  Eye,
  Download,
  FlaskConical,
  BookOpen,
  ExternalLink,
  Award,
  Microscope,
  Compass
} from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (section: NavSection) => void;
  onOpenAi: () => void;
  onOpenStudentModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onNavigate, 
  onOpenAi,
  onOpenStudentModal 
}) => {
  const [activeView, setActiveView] = useState<'lab' | 'celestial'>('lab');
  const [imageLoaded, setImageLoaded] = useState(true);

  return (
    <section className="relative overflow-hidden py-10 sm:py-16 lg:py-20">
      {/* PCSS Deep Blue & Academic Gold Ambient Aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-sky-500/10 via-amber-500/5 to-blue-600/10 blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Academic & Institution Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="https://saugus.pioneercss.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#0B1E3B] hover:bg-[#112A4F] text-sky-200 border border-sky-500/40 shadow-lg shadow-black/40 backdrop-blur-md transition group"
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">Pioneer Charter School of Science II (Saugus, MA)</span>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white" />
          </a>

          <button 
            onClick={() => onNavigate('research')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-sky-950/80 hover:bg-sky-900/80 text-sky-300 border border-sky-500/30 backdrop-blur-md transition"
          >
            <FlaskConical className="w-3.5 h-3.5 text-sky-400" />
            <span>ASRRL Research Division &bull; 5 Working Papers</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#071326] text-amber-300 border border-amber-500/30 backdrop-blur-md">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>FTC Team #23548 &bull; 501(c)(3) Entity</span>
          </div>
        </div>

        {/* Main Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2">
                <Microscope className="w-4 h-4 text-amber-400" />
                <span>Division of Applied Cybernetics & Engineering Research</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
                Rigorous Robotics Research.{' '}
                <span className="bg-gradient-to-r from-sky-300 via-sky-200 to-amber-200 bg-clip-text text-transparent">
                  Pioneering Autonomous Systems.
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
              Operating from <strong className="text-white font-bold">Pioneer Charter School of Science II</strong> in Saugus, Massachusetts, our student research fellows and faculty engineer competition robots through peer-reviewed principles—coupling <span className="text-sky-300 font-mono font-medium">500Hz optical state estimation</span>, <span className="text-amber-300 font-mono font-medium">C² quintic splines</span>, and <span className="text-sky-300 font-mono font-medium">finite element dynamics</span> with STEM outreach across the North Shore.
            </p>

            {/* ACADEMIC RESEARCH & LAB QUICK ACTION GATEWAYS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Portal 1: Academic Research & Technical Preprints */}
              <div className="p-4 rounded-2xl border border-sky-500/30 bg-gradient-to-b from-[#0B1E3B]/90 via-[#071326]/90 to-[#040D1A]/95 backdrop-blur-xl space-y-3 hover:border-sky-400/60 transition group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sky-300 text-xs font-bold font-mono uppercase tracking-wider">
                    <FlaskConical className="w-4 h-4 text-sky-400" />
                    <span>Academic Research & Papers</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-950 text-sky-300 border border-sky-500/40">
                    5 Preprints
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Explore peer-reviewed publications on EKF odometry, continuous Dyneema elevator FEA, and AprilTag edge vision pipelines.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onNavigate('research')}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition shadow-md shadow-black/50"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Preprints & Math</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('simulator')}
                    className="p-2.5 rounded-xl bg-[#071326] hover:bg-[#0B1E3B] text-sky-300 border border-sky-500/30 transition"
                    title="Open 500Hz EKF Simulator"
                  >
                    <Activity className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Portal 2: Student Fellowship & Corporate Sponsorship */}
              <div className="p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-[#0B1E3B]/90 via-[#071326]/90 to-[#040D1A]/95 backdrop-blur-xl space-y-3 hover:border-amber-400/60 transition group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-bold font-mono uppercase tracking-wider">
                    <GraduationCap className="w-4 h-4 text-amber-400" />
                    <span>Student Fellowship & STEM</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500/40">
                    Grades 6–12
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Join our autonomous engineering cohort or sponsor our 501(c)(3) research endowment. 100% tax deductible contributions.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={onOpenStudentModal}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs transition shadow-md shadow-black/50"
                  >
                    <span>Apply for Fellowship</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                  </button>
                  <button
                    onClick={() => onNavigate('sponsors')}
                    className="p-2.5 rounded-xl bg-[#071326] hover:bg-[#0B1E3B] text-amber-300 border border-amber-500/30 transition"
                    title="501(c)(3) Sponsorship Tiers"
                  >
                    <HeartHandshake className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Academic Credibility Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>AP Physics & Calculus Integrated</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>MIT & WPI Mentor Network</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>501(c)(3) Public Charity</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Media: Saugus Campus Lab & Robot Specimen */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-[#1d3e70] bg-[#071326]/95 shadow-2xl shadow-black/80 backdrop-blur-2xl group">
              {/* Media View Selector Tabs */}
              <div className="absolute top-3 left-3 z-20 flex gap-1 p-1 rounded-xl bg-[#071326]/90 border border-white/10 backdrop-blur-md">
                <button
                  onClick={() => setActiveView('lab')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                    activeView === 'lab'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Saugus Lab
                </button>
                <button
                  onClick={() => setActiveView('celestial')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                    activeView === 'celestial'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Kraken V2 Assembly
                </button>
              </div>

              {/* Real-time Telemetry Overlay Tag */}
              <div className="absolute top-3 right-3 z-20 px-3 py-1 rounded-xl bg-[#071326]/90 border border-sky-500/40 backdrop-blur-md text-[10px] font-mono text-sky-300 flex items-center gap-1.5 shadow-md">
                {activeView === 'lab' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-300 font-semibold">SAUGUS CAMPUS LAB</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-amber-300 font-semibold">500Hz OTOS EKF</span>
                  </>
                )}
              </div>

              {/* Main Image View */}
              <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-[#040D1A] flex items-center justify-center">
                {activeView === 'lab' ? (
                  <picture>
                    <source srcSet={labHeroWebp} type="image/webp" />
                    <img
                      src={labHeroPng}
                      alt="PCSS II Robotics Student Engineering Lab and Physical Robot in Saugus MA"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      loading="eager"
                    />
                  </picture>
                ) : (
                  <img
                    src={celestialHeroImg}
                    alt="Kraken V2 FIRST Tech Challenge Competition Robot with Celestial Aurora Lighting"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                    onError={() => setImageLoaded(false)}
                  />
                )}

                {/* Ethereal Vignette Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#071326] via-[#071326]/20 to-transparent pointer-events-none" />
              </div>

              {/* Contextual Spec Card at Bottom of Frame */}
              <div className="p-4 border-t border-[#1d3e70] bg-[#071326]/95 backdrop-blur-md space-y-2">
                {activeView === 'lab' ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-emerald-400" />
                        <span className="text-white font-bold text-xs tracking-wide">
                          PCSS II Cybernetics Lab &bull; Saugus, MA
                        </span>
                      </div>
                      <span className="text-amber-400 font-mono text-[11px] font-bold">
                        501(c)(3) STEM RESEARCH
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] font-mono pt-1 text-slate-300">
                      <div className="p-1.5 rounded-lg bg-[#0B1E3B] border border-[#1d3e70] text-center">
                        <div className="text-slate-400 uppercase text-[9px]">Fabrication</div>
                        <div className="text-white font-bold">CNC & 3D Print</div>
                      </div>
                      <div className="p-1.5 rounded-lg bg-[#0B1E3B] border border-[#1d3e70] text-center">
                        <div className="text-slate-400 uppercase text-[9px]">Odometry Rig</div>
                        <div className="text-sky-300 font-bold">500Hz Laser Stage</div>
                      </div>
                      <div className="p-1.5 rounded-lg bg-[#0B1E3B] border border-[#1d3e70] text-center">
                        <div className="text-slate-400 uppercase text-[9px]">Fellowship</div>
                        <div className="text-amber-400 font-bold">Grades 6–12</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-sky-400" />
                        <span className="text-white font-bold text-xs tracking-wide">
                          Kraken V2 (Chassis #23548)
                        </span>
                      </div>
                      <span className="text-sky-400 font-mono text-[11px] font-bold">
                        36.8 LBS // COMPETITION READY
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] font-mono pt-1 text-slate-300">
                      <div className="p-1.5 rounded-lg bg-[#0B1E3B] border border-[#1d3e70] text-center">
                        <div className="text-slate-400 uppercase text-[9px]">Drivetrain</div>
                        <div className="text-white font-bold">4x Mecanum HD</div>
                      </div>
                      <div className="p-1.5 rounded-lg bg-[#0B1E3B] border border-[#1d3e70] text-center">
                        <div className="text-slate-400 uppercase text-[9px]">Cascade</div>
                        <div className="text-sky-300 font-bold">42&quot; in 0.65s</div>
                      </div>
                      <div className="p-1.5 rounded-lg bg-[#0B1E3B] border border-[#1d3e70] text-center">
                        <div className="text-slate-400 uppercase text-[9px]">Vision</div>
                        <div className="text-amber-400 font-bold">SparkFun OTOS</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Live Performance & Impact Metric Ribbons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 border-t border-[#1d3e70]">
          {TEAM_PROFILE.stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-[#1d3e70] bg-[#0B1E3B]/70 backdrop-blur-md hover:border-sky-500/40 hover:bg-[#102A52] transition"
            >
              <div className="text-[11px] font-medium text-slate-400 truncate">{stat.label}</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight truncate">
                {stat.value}
              </div>
              <div className="text-[10px] text-sky-400 font-mono mt-0.5 truncate">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
