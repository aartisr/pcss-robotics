import React, { useState } from 'react';
import { TEAM_PROFILE } from '../data/roboticsData';
import { NavSection } from '../types';
import celestialHeroImg from '../assets/celestial_robot_hero.jpg';
import labHeroWebp from '../assets/robotics-lab-hero.webp';
import labHeroPng from '../assets/robotics-lab-hero.png';
import { 
  ArrowRight, 
  Activity, 
  Sparkles, 
  ShieldCheck, 
  Terminal, 
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
  BookOpen
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
      {/* Heavenly Ambient Aurora Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-cyan-500/10 via-purple-600/10 to-blue-600/5 blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-950/40 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-mono tracking-wide">ASRRL // PCSS II APPLIED CYBERNETICS LAB</span>
          </div>

          <button 
            onClick={() => onNavigate('research')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 backdrop-blur-md transition"
          >
            <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
            <span>4 Working Papers &bull; 500Hz EKF Odometry</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900/80 text-slate-300 border border-white/10 backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>501(c)(3) Entity &bull; Saugus, MA</span>
          </div>
        </div>

        {/* Main Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:items-center">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
              Engineering{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-300 bg-clip-text text-transparent">
                Beyond Gravity.
              </span>{' '}
              <span className="block mt-1 text-slate-100 text-3xl sm:text-4xl lg:text-5xl font-extrabold">
                Empowering Tomorrow&apos;s Pioneers.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              We are <strong className="text-white font-bold">PCSS II Robotics</strong> from Pioneer Charter School of Science II. Our student skunkworks engineers competitive FTC machines with <span className="text-cyan-300 font-mono font-medium">500Hz optical odometry</span>, <span className="text-purple-300 font-mono font-medium">cascading continuous slides</span>, and autonomous RoadRunner trajectories—fostering high school excellence while mentoring hundreds of North Shore youth.
            </p>

            {/* DUAL GATEWAY FOR STUDENTS & SPONSORS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Portal 1: For Students */}
              <div className="p-4 rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/40 via-slate-900/60 to-slate-950/80 backdrop-blur-xl space-y-3 hover:border-cyan-400/60 transition group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold font-mono uppercase tracking-wider">
                    <GraduationCap className="w-4 h-4 text-cyan-400" />
                    <span>For Students (Grades 6–12)</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Join our Hardware, Software, Autonomous AI, or Business teams. No prior experience needed—we mentor and train everyone!
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={onOpenStudentModal}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shadow-md shadow-cyan-950/50"
                  >
                    <span>Apply to Join Team</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('arcade')}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-800/40 transition"
                    title="Play Cyber Driver Arena"
                  >
                    <Gamepad2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Portal 2: For Sponsors */}
              <div className="p-4 rounded-2xl border border-purple-500/30 bg-gradient-to-b from-purple-950/40 via-slate-900/60 to-slate-950/80 backdrop-blur-xl space-y-3 hover:border-purple-400/60 transition group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-300 text-xs font-bold font-mono uppercase tracking-wider">
                    <HeartHandshake className="w-4 h-4 text-purple-400" />
                    <span>For Corporate Sponsors</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  100% tax-deductible contributions under 501(c)(3) public charity status. Put your brand on our robot & pit displays at regional championships.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onNavigate('sponsors')}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition shadow-md shadow-purple-950/50"
                  >
                    <span>Launch Sponsor ROI</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('simulator')}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/40 transition"
                    title="Autonomous Field Lab"
                  >
                    <Activity className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Credibility & Impact Micro-Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Tax Deductible</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>State Championship Contender</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>450+ Middle Schoolers Trained</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Media: Heavenly Robot Showcase */}
          <div className="lg:col-span-5 relative">
            {/* Crystalline Card Frame with Specular Border */}
            <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-slate-900/90 to-slate-950/95 shadow-2xl shadow-cyan-950/50 backdrop-blur-2xl group">
              {/* Media View Selector Tabs */}
              <div className="absolute top-3 left-3 z-20 flex gap-1 p-1 rounded-xl bg-slate-950/85 border border-white/10 backdrop-blur-md">
                <button
                  onClick={() => setActiveView('lab')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                    activeView === 'lab'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Saugus Lab
                </button>
                <button
                  onClick={() => setActiveView('celestial')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                    activeView === 'celestial'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Kraken V2 Render
                </button>
              </div>

              {/* Real-time Telemetry Overlay Tag */}
              <div className="absolute top-3 right-3 z-20 px-3 py-1 rounded-xl bg-slate-950/85 border border-cyan-500/40 backdrop-blur-md text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 shadow-md">
                {activeView === 'lab' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-300 font-semibold">SAUGUS CAMPUS LAB</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>500Hz ODOMETRY</span>
                  </>
                )}
              </div>

              {/* Main Image View */}
              <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-slate-950 flex items-center justify-center">
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
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
              </div>

              {/* Contextual Spec Card at Bottom of Frame */}
              <div className="p-4 border-t border-white/10 bg-slate-950/90 backdrop-blur-md space-y-2">
                {activeView === 'lab' ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-emerald-400" />
                        <span className="text-white font-bold text-xs tracking-wide">
                          PCSS II Robotics Lab &bull; Saugus, MA
                        </span>
                      </div>
                      <span className="text-emerald-400 font-mono text-[11px] font-bold">
                        ACTIVE SKUNKWORKS // 501(c)(3)
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] font-mono pt-1 text-slate-300">
                      <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
                        <div className="text-slate-500 uppercase text-[9px]">Fabrication</div>
                        <div className="text-white font-bold">CNC & 3D Print</div>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
                        <div className="text-slate-500 uppercase text-[9px]">Arena Field</div>
                        <div className="text-cyan-300 font-bold">12&apos;x12&apos; Regulation</div>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
                        <div className="text-slate-500 uppercase text-[9px]">Student Cadre</div>
                        <div className="text-emerald-400 font-bold">Grades 6–12</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span className="text-white font-bold text-xs tracking-wide">
                          Kraken V2 (Chassis #23548)
                        </span>
                      </div>
                      <span className="text-cyan-400 font-mono text-[11px] font-bold">
                        36.8 LBS // READY FOR QUALIFIERS
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] font-mono pt-1 text-slate-300">
                      <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
                        <div className="text-slate-500 uppercase text-[9px]">Drivetrain</div>
                        <div className="text-white font-bold">4x Mecanum HD</div>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
                        <div className="text-slate-500 uppercase text-[9px]">Cascade</div>
                        <div className="text-cyan-300 font-bold">42&quot; in 0.65s</div>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
                        <div className="text-slate-500 uppercase text-[9px]">Vision</div>
                        <div className="text-emerald-400 font-bold">SparkFun OTOS</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Live Performance & Impact Metric Ribbons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 border-t border-white/10">
          {TEAM_PROFILE.stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md hover:border-cyan-500/40 hover:bg-slate-900/80 transition"
            >
              <div className="text-[11px] font-medium text-slate-400 truncate">{stat.label}</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight truncate">
                {stat.value}
              </div>
              <div className="text-[10px] text-cyan-400 font-mono mt-0.5 truncate">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
