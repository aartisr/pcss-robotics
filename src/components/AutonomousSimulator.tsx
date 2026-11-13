import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';

const routes = [
  { id: 'direct', label: 'Direct', description: 'The shortest route has only a start and destination.', points: [[15, 75], [85, 25]] },
  { id: 'detour', label: 'Around an obstacle', description: 'Waypoints can steer the robot around a blocked area.', points: [[15, 75], [28, 50], [72, 50], [85, 25]] },
  { id: 'visit', label: 'Visit a target', description: 'A route can stop at one target before heading to another.', points: [[15, 75], [32, 30], [60, 30], [85, 70]] }
] as const;

type Point = readonly [number, number];

function positionAt(points: readonly Point[], progress: number): Point {
  const segment = Math.min(points.length - 2, Math.floor(progress * (points.length - 1)));
  const fraction = Math.min(1, progress * (points.length - 1) - segment);
  const from = points[segment];
  const to = points[segment + 1];
  return [from[0] + (to[0] - from[0]) * fraction, from[1] + (to[1] - from[1]) * fraction];
}

export function AutonomousSimulator() {
  const [routeId, setRouteId] = useState<string>('direct');
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const lastFrame = useRef<number | null>(null);
  const route = routes.find(item => item.id === routeId) ?? routes[0];

  useEffect(() => {
    if (!playing) return;
    let frame: number;
    const tick = (now: number) => {
      if (lastFrame.current !== null && now - lastFrame.current >= 33) {
        const elapsed = now - lastFrame.current;
        setProgress(current => {
          const next = Math.min(1, current + elapsed / 4000);
          return next;
        });
        lastFrame.current = now;
      }
      if (lastFrame.current === null) lastFrame.current = now;
      frame = requestAnimationFrame(tick);
    };
    const pauseWhenHidden = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener('visibilitychange', pauseWhenHidden);
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', pauseWhenHidden); lastFrame.current = null; };
  }, [playing]);

  useEffect(() => { if (progress >= 1) setPlaying(false); }, [progress]);

  const [x, y] = positionAt(route.points, progress);
  return <section className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
    <header className="max-w-3xl space-y-5"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">Interactive learning tool</p><h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">See how waypoints shape a path.</h1><p className="text-lg leading-relaxed text-slate-300">Choose a route and watch a robot marker move between points. This simple animation shows a path planning idea; it does not model real speed, physics, sensors, or a team autonomous routine.</p></header>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)]">
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6"><h2 className="text-xl font-semibold text-white">Choose a route</h2><div className="mt-5 space-y-3">{routes.map(item => <button type="button" key={item.id} onClick={() => { setPlaying(false); setProgress(0); setRouteId(item.id); }} aria-pressed={routeId === item.id} className={`w-full rounded-xl border p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 ${routeId === item.id ? 'border-sky-400 bg-sky-400/10' : 'border-white/10 bg-slate-800/70 hover:border-sky-400/50'}`}><span className="block font-semibold text-white">{item.label}</span><span className="mt-1 block text-sm leading-relaxed text-slate-300">{item.description}</span></button>)}</div><div className="mt-7 flex gap-3"><button type="button" onClick={() => { if (progress >= 1) setProgress(0); setPlaying(value => !value); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500">{playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}{playing ? 'Pause' : 'Play'}</button><button type="button" onClick={() => { setPlaying(false); setProgress(0); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"><RotateCcw className="h-4 w-4" aria-hidden="true" />Reset</button></div></div>
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 sm:p-7"><h2 className="mb-4 text-xl font-semibold text-white">Path view</h2><svg viewBox="0 0 100 100" role="img" aria-label={`${route.label} route with ${route.points.length} waypoints; animation ${Math.round(progress * 100)} percent complete`} className="aspect-square w-full rounded-2xl border border-white/10 bg-slate-950"><defs><pattern id="path-grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth=".3" /></pattern></defs><rect width="100" height="100" fill="url(#path-grid)" /><polyline points={route.points.map(point => point.join(',')).join(' ')} fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="2 1" />{route.points.map(([px,py], index) => <g key={`${px}-${py}`}><circle cx={px} cy={py} r="2" fill="#fbbf24" /><text x={px + 3} y={py - 3} fill="#e2e8f0" fontSize="3">{index === 0 ? 'Start' : index === route.points.length - 1 ? 'Finish' : `Point ${index}`}</text></g>)}<circle cx={x} cy={y} r="3.4" fill="#38bdf8" stroke="#fff" strokeWidth=".6" /></svg><p className="mt-4 text-sm text-slate-300">{route.description}</p></div>
    </div>
  </section>;
}
