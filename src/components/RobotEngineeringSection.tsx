import React, { useState } from 'react';
import { ROBOTS_DATA } from '../data/roboticsData';
import { RobotSpec } from '../types';
import { 
  Compass, 
  Cpu, 
  Layers, 
  Activity, 
  CheckCircle, 
  Zap, 
  Gauge, 
  Maximize2, 
  Eye, 
  RotateCw,
  Box
} from 'lucide-react';

export const RobotEngineeringSection: React.FC = () => {
  const [selectedRobotId, setSelectedRobotId] = useState<string>(ROBOTS_DATA[0].id);
  const [activeSubsystemIndex, setActiveSubsystemIndex] = useState<number>(0);

  const selectedRobot = ROBOTS_DATA.find((r) => r.id === selectedRobotId) || ROBOTS_DATA[0];

  return (
    <section className="py-12 sm:py-16 space-y-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/40 font-mono">
              <Compass className="w-3.5 h-3.5" />
              ENGINEERING ARCHIVES & TELEMETRY
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Competition Robots & CAD Subsystems
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Every season of FIRST Tech Challenge demands bespoke mechanical ingenuity. Explore our student-designed robots, from closed-loop PID elevators to optical odometry kinematics.
            </p>
          </div>

          {/* Robot Selector Tabs */}
          <div className="inline-flex rounded-xl border border-slate-800 bg-slate-900 p-1.5 shrink-0 overflow-x-auto">
            {ROBOTS_DATA.map((robot) => (
              <button
                key={robot.id}
                onClick={() => {
                  setSelectedRobotId(robot.id);
                  setActiveSubsystemIndex(0);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  selectedRobotId === robot.id
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{robot.name}</span>
                <span className="text-[10px] opacity-80">({robot.game.split('℠')[0]})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Robot Showcase Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Robot Overview & Subsystems */}
          <div className="lg:col-span-7 space-y-6">
            {/* Robot Header Card */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      {selectedRobot.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                      {selectedRobot.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {selectedRobot.season} &bull; Challenge: <strong className="text-slate-200">{selectedRobot.game}</strong>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono text-cyan-400 font-bold">
                    {selectedRobot.cycleTime}
                  </div>
                  <div className="text-[10px] text-slate-400">Match Cycle Performance</div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedRobot.description}
              </p>

              {/* Subsystem Carousel / Tabs */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
                  Select Subsystem Module:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {selectedRobot.subsystems.map((sub, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSubsystemIndex(idx)}
                      className={`p-3 rounded-xl border text-left transition text-xs ${
                        activeSubsystemIndex === idx
                          ? 'border-cyan-500 bg-cyan-950/60 text-white shadow-md'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="font-semibold text-cyan-300 truncate">{sub.name}</div>
                      <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">Module #{idx + 1}</div>
                    </button>
                  ))}
                </div>

                {/* Subsystem Detail View */}
                {selectedRobot.subsystems[activeSubsystemIndex] && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      {selectedRobot.subsystems[activeSubsystemIndex].name}
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {selectedRobot.subsystems[activeSubsystemIndex].description}
                    </p>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300">
                      <strong>Kinematic & Material Spec:</strong> {selectedRobot.subsystems[activeSubsystemIndex].specs}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Engineering Telemetry & Specs Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-4">
              <h4 className="text-sm font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Technical & Hardware Specifications
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Total Robot Mass:</span>
                  <span className="font-mono font-bold text-white">{selectedRobot.weight}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Chassis Dimensions:</span>
                  <span className="font-mono font-bold text-white">{selectedRobot.dimensions}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Drive Configuration:</span>
                  <span className="font-mono font-bold text-white text-right max-w-[200px]">{selectedRobot.drivetrain}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Actuators & Motors:</span>
                  <span className="font-mono font-bold text-cyan-300 text-right max-w-[200px]">{selectedRobot.motors}</span>
                </div>
              </div>

              {/* Integrated Sensor Suite */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Integrated Sensor Instrumentation:
                </span>
                <div className="space-y-1.5">
                  {selectedRobot.sensors.map((sensor, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-2"
                    >
                      <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{sensor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Autonomous Routine Highlight */}
              <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-blue-300">
                  <Cpu className="w-4 h-4" />
                  Autonomous Routine Benchmark
                </div>
                <p className="text-[11px] leading-relaxed">
                  {selectedRobot.autonomousHighlight}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
