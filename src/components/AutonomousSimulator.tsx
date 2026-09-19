import React, { useState, useEffect, useRef } from 'react';
import { TelemetryState } from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Compass, 
  Activity, 
  Eye, 
  Cpu, 
  Sparkles, 
  Zap,
  Crosshair
} from 'lucide-react';

interface Waypoint {
  x: number;
  y: number;
  heading: number;
  speed: number;
  action: string;
}

export const AutonomousSimulator: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeRoutine, setActiveRoutine] = useState<'specimen' | 'submersible' | 'hang'>('specimen');
  const [showSensors, setShowSensors] = useState(true);
  const [showPathLine, setShowPathLine] = useState(true);

  // Robot telemetry state
  const [telemetry, setTelemetry] = useState<TelemetryState>({
    x: 24,
    y: 16,
    heading: 90,
    velocity: 0,
    batteryVoltage: 13.82,
    specimenCount: 0,
    status: 'IDLE // ALLIANCE RED READY'
  });

  const progressRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Route waypoints based on FTC Into The Deep game field (normalized to 0-100 coordinates)
  const ROUTINES: Record<'specimen' | 'submersible' | 'hang', Waypoint[]> = {
    specimen: [
      { x: 18, y: 15, heading: 90, speed: 0, action: 'Starting Position' },
      { x: 28, y: 35, heading: 90, speed: 1.4, action: 'Driving to Submersible Rung' },
      { x: 38, y: 55, heading: 90, speed: 0.8, action: 'Hooking Pre-loaded Specimen on High Chamber' },
      { x: 50, y: 30, heading: 180, speed: 1.6, action: 'Spline to Neutral Zone Samples' },
      { x: 65, y: 25, heading: 270, speed: 1.2, action: 'Intake Sample #1 via Color Classification' },
      { x: 38, y: 55, heading: 90, speed: 1.5, action: 'High Chamber Score #2' },
      { x: 80, y: 18, heading: 0, speed: 1.8, action: 'Park in Observation Zone (112 pts Total)' }
    ],
    submersible: [
      { x: 18, y: 15, heading: 90, speed: 0, action: 'Auto Start' },
      { x: 45, y: 40, heading: 45, speed: 1.5, action: 'Entering Submersible Core' },
      { x: 52, y: 50, heading: 45, speed: 0.6, action: 'Intake Yellow Sample with Compliant Roller' },
      { x: 22, y: 78, heading: 135, speed: 1.8, action: 'Driving to High Basket' },
      { x: 16, y: 84, heading: 135, speed: 0.4, action: 'Extending Continuous Slide & Basket Drop' },
      { x: 48, y: 45, heading: 45, speed: 1.7, action: 'Cycle #2 Intake' }
    ],
    hang: [
      { x: 20, y: 20, heading: 90, speed: 0, action: 'Start' },
      { x: 35, y: 45, heading: 90, speed: 1.2, action: 'Navigating to Submersible Truss' },
      { x: 48, y: 52, heading: 90, speed: 0.7, action: 'Elevating Telescoping Hooks' },
      { x: 48, y: 52, heading: 90, speed: 0, action: 'L1 Ascent Hanging Confirmed (30 pts)' }
    ]
  };

  const waypoints = ROUTINES[activeRoutine];

  useEffect(() => {
    if (!isRunning) return;

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      progressRef.current += delta * 0.28; // Controls overall journey speed

      if (progressRef.current >= waypoints.length - 1) {
        progressRef.current = waypoints.length - 1;
        setIsRunning(false);
      }

      const currentIndex = Math.floor(progressRef.current);
      const nextIndex = Math.min(currentIndex + 1, waypoints.length - 1);
      const subProgress = progressRef.current - currentIndex;

      const p0 = waypoints[currentIndex];
      const p1 = waypoints[nextIndex];

      const currentX = p0.x + (p1.x - p0.x) * subProgress;
      const currentY = p0.y + (p1.y - p0.y) * subProgress;
      const currentHeading = p0.heading + (p1.heading - p0.heading) * subProgress;
      const currentVelocity = (p0.speed + (p1.speed - p0.speed) * subProgress).toFixed(2);

      setTelemetry({
        x: +((currentX / 100) * 144).toFixed(1), // convert to inches (144" field)
        y: +((currentY / 100) * 144).toFixed(1),
        heading: +(currentHeading % 360).toFixed(1),
        velocity: +currentVelocity,
        batteryVoltage: +(13.8 - progressRef.current * 0.05).toFixed(2),
        specimenCount: Math.min(Math.floor(progressRef.current / 1.5), 3),
        status: p0.action
      });

      if (progressRef.current < waypoints.length - 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, waypoints]);

  const handleReset = () => {
    setIsRunning(false);
    progressRef.current = 0;
    const p0 = waypoints[0];
    setTelemetry({
      x: +((p0.x / 100) * 144).toFixed(1),
      y: +((p0.y / 100) * 144).toFixed(1),
      heading: p0.heading,
      velocity: 0,
      batteryVoltage: 13.82,
      specimenCount: 0,
      status: 'AUTONOMOUS RESET // READY AT START'
    });
  };

  // Convert current normalized x, y to SVG coordinates
  const currentIndex = Math.floor(progressRef.current);
  const nextIndex = Math.min(currentIndex + 1, waypoints.length - 1);
  const subProgress = progressRef.current - currentIndex;
  const p0 = waypoints[currentIndex];
  const p1 = waypoints[nextIndex];
  const robotSvgX = p0.x + (p1.x - p0.x) * subProgress;
  const robotSvgY = 100 - (p0.y + (p1.y - p0.y) * subProgress); // Invert Y for SVG field

  return (
    <section className="py-12 sm:py-16 space-y-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/40 font-mono">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              ROADRUNNER KINEMATICS & FIELD SIMULATOR
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Autonomous Pathing & 500Hz Telemetry Lab
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Experience our autonomous routines for FTC <strong className="text-slate-200">INTO THE DEEP℠</strong>. We use SparkFun OTOS pinpoint optical odometry coupled with RoadRunner quintic splines for millimeter-precision trajectory execution.
            </p>
          </div>

          {/* Routine Selector */}
          <div className="inline-flex rounded-xl border border-slate-800 bg-slate-900 p-1.5 shrink-0 overflow-x-auto">
            <button
              onClick={() => {
                setActiveRoutine('specimen');
                handleReset();
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeRoutine === 'specimen'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              High Chamber Hook (112 pts)
            </button>
            <button
              onClick={() => {
                setActiveRoutine('submersible');
                handleReset();
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeRoutine === 'submersible'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Submersible Basket Cycle
            </button>
            <button
              onClick={() => {
                setActiveRoutine('hang');
                handleReset();
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeRoutine === 'hang'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Endgame Ascent Hang
            </button>
          </div>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 144" x 144" FTC Field Canvas */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:p-6 shadow-2xl shadow-cyan-950/20">
              {/* Field SVG Visualization */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-950">
                <svg viewBox="0 0 100 100" className="w-full h-full select-none">
                  {/* Grid Lines (Representing 2ft x 2ft foam tiles on 12ft field) */}
                  {[...Array(6)].map((_, i) => (
                    <line
                      key={`h-${i}`}
                      x1="0"
                      y1={(i + 1) * 16.66}
                      x2="100"
                      y2={(i + 1) * 16.66}
                      stroke="#1e293b"
                      strokeWidth="0.4"
                      strokeDasharray="1,1"
                    />
                  ))}
                  {[...Array(6)].map((_, i) => (
                    <line
                      key={`v-${i}`}
                      x1={(i + 1) * 16.66}
                      y1="0"
                      x2={(i + 1) * 16.66}
                      y2="100"
                      stroke="#1e293b"
                      strokeWidth="0.4"
                      strokeDasharray="1,1"
                    />
                  ))}

                  {/* Submersible Zone (Center 4ft x 4ft barrier) */}
                  <rect
                    x="35"
                    y="35"
                    width="30"
                    height="30"
                    fill="#0f172a"
                    stroke="#06b6d4"
                    strokeWidth="0.8"
                    rx="1"
                  />
                  <text x="50" y="51" textAnchor="middle" fill="#06b6d4" fontSize="2.8" fontWeight="bold" opacity="0.6">
                    SUBMERSIBLE CORE
                  </text>

                  {/* High Chamber Scoring Rungs */}
                  <line x1="38" y1="42" x2="38" y2="58" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" />
                  <text x="36" y="50" textAnchor="end" fill="#60a5fa" fontSize="2.2" transform="rotate(-90 36 50)">
                    HIGH CHAMBER
                  </text>

                  {/* High Basket Scoring Target */}
                  <rect x="12" y="8" width="16" height="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="0.6" rx="1" />
                  <text x="20" y="15" textAnchor="middle" fill="#c7d2fe" fontSize="2.2">
                    HIGH BASKET
                  </text>

                  {/* Observation Zone */}
                  <rect x="75" y="75" width="23" height="23" fill="#1e293b" stroke="#475569" strokeWidth="0.6" rx="1" />
                  <text x="86.5" y="87" textAnchor="middle" fill="#94a3b8" fontSize="2.2">
                    OBSERVATION ZONE
                  </text>

                  {/* Sample Clusters */}
                  <circle cx="50" cy="22" r="1.8" fill="#eab308" />
                  <circle cx="56" cy="24" r="1.8" fill="#eab308" />
                  <circle cx="62" cy="22" r="1.8" fill="#eab308" />

                  {/* Spline Path Trace */}
                  {showPathLine && (
                    <polyline
                      points={waypoints.map((w) => `${w.x},${100 - w.y}`).join(' ')}
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="0.8"
                      strokeDasharray="1.5,1.5"
                      opacity="0.8"
                    />
                  )}

                  {/* Waypoint Marker Pins */}
                  {waypoints.map((w, idx) => (
                    <g key={idx} transform={`translate(${w.x}, ${100 - w.y})`}>
                      <circle r="1.2" fill={idx === 0 ? '#10b981' : '#38bdf8'} />
                      <text y="-2" textAnchor="middle" fill="#94a3b8" fontSize="2" fontWeight="bold">
                        W{idx + 1}
                      </text>
                    </g>
                  ))}

                  {/* Animated Robot Chassis Avatar */}
                  <g
                    transform={`translate(${robotSvgX}, ${robotSvgY}) rotate(${telemetry.heading})`}
                    className="transition-transform duration-75"
                  >
                    {/* Vision Cone (HuskyLens) */}
                    {showSensors && (
                      <path
                        d="M 0 0 L -8 -16 L 8 -16 Z"
                        fill="rgba(6, 182, 212, 0.15)"
                        stroke="rgba(6, 182, 212, 0.4)"
                        strokeWidth="0.3"
                      />
                    )}

                    {/* Robot 18"x18" Chassis Box */}
                    <rect
                      x="-6"
                      y="-6"
                      width="12"
                      height="12"
                      fill="#0284c7"
                      stroke="#38bdf8"
                      strokeWidth="0.8"
                      rx="1"
                      style={{ filter: 'drop-shadow(0 0 4px rgba(6,182,212,0.8))' }}
                    />
                    {/* Direction Heading Indicator */}
                    <polygon points="0,-7 3,-3 -3,-3" fill="#ffffff" />
                    {/* Odometry Pod Center */}
                    <circle cx="0" cy="0" r="1.2" fill="#ffffff" />
                  </g>
                </svg>

                {/* Field Overlay Watermark */}
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-400 backdrop-blur-sm">
                  FIELD SCALE: 144&quot; × 144&quot; // ALLIANCE FIELD PERIMETER
                </div>
              </div>

              {/* Controls Toolbar */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md ${
                      isRunning
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                    }`}
                  >
                    {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isRunning ? 'Pause Routine' : 'Execute Autonomous'}</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Overlay Toggles */}
                <div className="flex items-center gap-3 text-xs">
                  <label className="inline-flex items-center gap-1.5 text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showSensors}
                      onChange={(e) => setShowSensors(e.target.checked)}
                      className="accent-cyan-500 rounded"
                    />
                    <span>Vision Frustum</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showPathLine}
                      onChange={(e) => setShowPathLine(e.target.checked)}
                      className="accent-cyan-500 rounded"
                    />
                    <span>Splines</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Telemetry Instrument Panel */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Crosshair className="w-4 h-4 text-cyan-400" />
                  Live Kinematics Bus
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                  500 Hz
                </span>
              </div>

              {/* Status Banner */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                <div className="text-[10px] text-slate-400">CURRENT SUB-ROUTINE:</div>
                <div className="text-xs font-bold text-cyan-300 mt-0.5 truncate">{telemetry.status}</div>
              </div>

              {/* Coordinate Gauges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">X Coordinate</span>
                  <span className="text-lg font-bold text-white">{telemetry.x}&quot;</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Y Coordinate</span>
                  <span className="text-lg font-bold text-white">{telemetry.y}&quot;</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Heading (Theta)</span>
                  <span className="text-lg font-bold text-cyan-400">{telemetry.heading}°</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Velocity</span>
                  <span className="text-lg font-bold text-emerald-400">{telemetry.velocity} m/s</span>
                </div>
              </div>

              {/* System Vital Sensors */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Battery Potential:</span>
                  <span className="text-emerald-400 font-bold">{telemetry.batteryVoltage} V</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Autonomous Score:</span>
                  <span className="text-cyan-300 font-bold">
                    {activeRoutine === 'specimen' ? '112 pts' : activeRoutine === 'submersible' ? '88 pts' : '30 pts'}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Control Hub Loop:</span>
                  <span className="text-white">2.1 ms (Deterministic)</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-cyan-200">
                <strong className="text-cyan-300">Motion Profiler:</strong> RoadRunner 1.0.2 quintic Hermite splines with feedforward velocity profiling and active anti-skid heading correction.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
