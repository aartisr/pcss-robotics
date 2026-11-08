import { useMemo, useState } from 'react';
import { ArrowUpRight, BookOpen, Compass, RotateCcw, SlidersHorizontal } from 'lucide-react';

const SOURCE = 'https://docs.wpilib.org/en/latest/docs/software/kinematics-and-odometry/mecanum-drive-kinematics.html';
const INITIAL = { forward: 0.6, sideways: 0, rotation: 0, radius: 0.05, halfLength: 0.18, halfWidth: 0.18 };
type Settings = typeof INITIAL;

const controls: { key: keyof Settings; label: string; unit: string; min: number; max: number; step: number }[] = [
  { key: 'forward', label: 'Forward speed', unit: 'm/s', min: -1.5, max: 1.5, step: 0.1 },
  { key: 'sideways', label: 'Leftward speed', unit: 'm/s', min: -1.5, max: 1.5, step: 0.1 },
  { key: 'rotation', label: 'Counterclockwise turn', unit: 'rad/s', min: -3, max: 3, step: 0.1 },
  { key: 'radius', label: 'Wheel radius', unit: 'm', min: 0.03, max: 0.1, step: 0.005 },
  { key: 'halfLength', label: 'Half the wheelbase', unit: 'm', min: 0.1, max: 0.3, step: 0.01 },
  { key: 'halfWidth', label: 'Half the track width', unit: 'm', min: 0.1, max: 0.3, step: 0.01 }
];

function RangeControl({ control, value, onChange }: { control: typeof controls[number]; value: number; onChange: (value: number) => void }) {
  return <label className="block">
    <span className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="font-medium text-slate-200">{control.label}</span><output className="tabular-nums text-sky-200">{value.toFixed(String(control.step).split('.')[1]?.length ?? 0)} {control.unit}</output></span>
    <input type="range" min={control.min} max={control.max} step={control.step} value={value} onChange={event => onChange(Number(event.target.value))} className="w-full accent-sky-400" />
  </label>;
}

export function ResearchSection() {
  const [settings, setSettings] = useState<Settings>(INITIAL);
  const wheelSpeeds = useMemo(() => {
    const { forward, sideways, rotation, radius, halfLength, halfWidth } = settings;
    const turn = (halfLength + halfWidth) * rotation;
    const toRpm = (metersPerSecond: number) => (metersPerSecond / radius) * 60 / (2 * Math.PI);
    return [
      { label: 'Front left', rpm: toRpm(forward - sideways - turn) },
      { label: 'Front right', rpm: toRpm(forward + sideways + turn) },
      { label: 'Rear left', rpm: toRpm(forward + sideways - turn) },
      { label: 'Rear right', rpm: toRpm(forward - sideways + turn) }
    ];
  }, [settings]);
  const maxSpeed = Math.max(1, ...wheelSpeeds.map(wheel => Math.abs(wheel.rpm)));

  return (
    <section className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <header className="max-w-3xl space-y-5">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-300"><BookOpen className="h-4 w-4" aria-hidden="true" /> Robotics learning lab</p>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Learn by changing the inputs.</h1>
        <p className="text-lg leading-relaxed text-slate-300">Explore how a four wheel mecanum drive turns a desired robot motion into wheel speeds. Adjust one value at a time and watch the results change.</p>
        <p className="rounded-2xl border border-sky-400/25 bg-sky-400/10 px-5 py-4 text-sm leading-relaxed text-sky-100">This is an educational calculation with example dimensions. It is not live robot data, a design specification, or a measured team result.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 sm:p-7">
          <div className="mb-7 flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-xl font-semibold text-white"><SlidersHorizontal className="h-5 w-5 text-sky-300" aria-hidden="true" /> Choose a motion</h2><button type="button" onClick={() => setSettings(INITIAL)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-sky-200 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"><RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset</button></div>
          <div className="space-y-6">
            {controls.slice(0, 3).map(control => <RangeControl key={control.key} control={control} value={settings[control.key]} onChange={value => setSettings(current => ({ ...current, [control.key]: value }))} />)}
          </div>
          <details className="mt-7 border-t border-white/10 pt-5"><summary className="cursor-pointer text-sm font-medium text-sky-200">Adjust wheel and chassis dimensions</summary><div className="mt-6 space-y-6">{controls.slice(3).map(control => <RangeControl key={control.key} control={control} value={settings[control.key]} onChange={value => setSettings(current => ({ ...current, [control.key]: value }))} />)}</div></details>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 sm:p-7">
          <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold text-white"><Compass className="h-5 w-5 text-emerald-300" aria-hidden="true" /> Wheel speed estimate</h2>
          <p className="mb-7 text-sm leading-relaxed text-slate-400">Positive and negative values show opposite wheel directions. The bars compare speed magnitude.</p>
          <div className="space-y-6" aria-live="polite">
            {wheelSpeeds.map(wheel => <div key={wheel.label}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="font-medium text-slate-200">{wheel.label}</span><span className="tabular-nums font-semibold text-white">{wheel.rpm >= 0 ? '+' : ''}{wheel.rpm.toFixed(1)} rpm</span></div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-700"><div className="h-full rounded-full bg-sky-400 transition-[width] duration-150" style={{ width: `${Math.abs(wheel.rpm) / maxSpeed * 100}%` }} /></div>
            </div>)}
          </div>
          <p className="mt-8 rounded-xl bg-slate-800 px-4 py-3 text-sm leading-relaxed text-slate-300">Try setting forward speed to zero and changing only sideways speed. Then add rotation to see why the four wheel speeds separate.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['1. Choose a direction', 'Forward, sideways, and turn speed describe the robot’s intended motion.'],
          ['2. Account for geometry', 'Wheel radius and wheel locations affect the speed needed at each wheel.'],
          ['3. Test on hardware', 'Real motion also depends on traction, motor limits, calibration, and control code.']
        ].map(([title, description]) => <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-5" key={title}><h3 className="font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-300">{description}</p></article>)}
      </div>
      <p className="text-sm leading-relaxed text-slate-400">The model follows the coordinate convention described in <a href={SOURCE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sky-300 underline underline-offset-4 hover:text-sky-200">WPILib’s mecanum drive documentation <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></a>. Your robot’s motor signs and wheel orientation may differ.</p>
    </section>
  );
}
