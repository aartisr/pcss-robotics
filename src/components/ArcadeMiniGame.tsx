import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, 
  Play, 
  RotateCcw, 
  Trophy, 
  Sparkles, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Flame,
  Users,
  Wifi,
  WifiOff,
  Bot,
  Copy,
  Check,
  Send,
  Volume2,
  VolumeX,
  Radio,
  Zap,
  Shield,
  Clock,
  Swords,
  Target
} from 'lucide-react';
import { soundEffects } from '../utils/audioSynth';

export type GameMode = 'multiplayer' | 'local2p' | 'solo';
export type Alliance = 'blue' | 'red' | 'spectator';

interface RemoteBot {
  id: string;
  name: string;
  alliance: Alliance;
  x: number;
  y: number;
  vx: number;
  vy: number;
  heading: number;
  speed: number;
  score: number;
  carriedSamples: number;
  boostActive: boolean;
  boostFuel: number;
  ping: number;
  isAi?: boolean;
}

interface GameSample {
  id: string | number;
  x: number;
  y: number;
  type?: 'gold' | 'blue' | 'red';
  color?: string;
  points: number;
  radius?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  size?: number;
}

interface ChatMessage {
  id: string;
  sender: string;
  alliance: Alliance;
  text: string;
  time: string;
}

const FIELD_WIDTH = 800;
const FIELD_HEIGHT = 500;
const ROBOT_SIZE = 34;

export const ArcadeMiniGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeTab, setActiveTab] = useState<GameMode>('multiplayer');
  const [soundMuted, setSoundMuted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // --- MULTIPLAYER WEBSOCKET STATE ---
  const [wsConnected, setWsConnected] = useState(false);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [roomName, setRoomName] = useState('prime-arena');
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('pilot_callsign') || `Pilot_${Math.floor(100 + Math.random() * 900)}`;
  });
  const [selectedAlliance, setSelectedAlliance] = useState<Alliance>('blue');
  const [netLatency, setNetLatency] = useState(18);

  const [matchStatus, setMatchStatus] = useState<'waiting' | 'countdown' | 'teleop' | 'finished'>('waiting');
  const [matchTimer, setMatchTimer] = useState(60);
  const [countdownTimer, setCountdownTimer] = useState(3);
  const [allianceScores, setAllianceScores] = useState({ blue: 0, red: 0 });
  const [connectedBots, setConnectedBots] = useState<RemoteBot[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [gameEvents, setGameEvents] = useState<{ id: string; text: string; type: string }[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number | null>(null);
  const keysRef = useRef<{ [key: string]: boolean }>({});

  // Local game state for Solo and Local 2P modes
  const [soloScore, setSoloScore] = useState(0);
  const [soloHighScore, setSoloHighScore] = useState(140);
  const [soloTimeLeft, setSoloTimeLeft] = useState(30);
  const [soloState, setSoloState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [local2pScores, setLocal2pScores] = useState({ blue: 0, red: 0 });
  const [local2pState, setLocal2pState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [local2pTimer, setLocal2pTimer] = useState(45);

  // Local bot references for offline modes
  const localPlayer1Ref = useRef({
    x: 140,
    y: 250,
    vx: 0,
    vy: 0,
    heading: 0,
    carried: 0,
    boost: 100,
    isBoosting: false
  });
  const localPlayer2Ref = useRef({
    x: 660,
    y: 250,
    vx: 0,
    vy: 0,
    heading: Math.PI,
    carried: 0,
    boost: 100,
    isBoosting: false
  });
  const localSamplesRef = useRef<GameSample[]>([]);

  // Check URL search params for room invite code on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const r = params.get('room');
      if (r) {
        setRoomName(r);
        setActiveTab('multiplayer');
      }
    }
  }, []);

  // Save callsign
  useEffect(() => {
    if (playerName) {
      localStorage.setItem('pilot_callsign', playerName);
    }
  }, [playerName]);

  // Connect WebSocket when tab is 'multiplayer'
  useEffect(() => {
    if (activeTab !== 'multiplayer') {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setWsConnected(false);
      return;
    }

    let isSubscribed = true;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws?room=${encodeURIComponent(roomName)}&name=${encodeURIComponent(
      playerName
    )}&alliance=${selectedAlliance}`;

    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      if (!isSubscribed) return;
      setWsConnected(true);
      // Start ping loop
      const pingInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'ping', clientTime: Date.now() }));
        }
      }, 3000);
      (socket as any)._pingInterval = pingInterval;
    };

    socket.onmessage = (event) => {
      if (!isSubscribed) return;
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === 'init') {
          setMyPlayerId(msg.playerId);
          setChatMessages(msg.chatHistory || []);
          setMatchStatus(msg.matchStatus || 'waiting');
          setMatchTimer(msg.matchTimer || 60);
        } else if (msg.type === 'state') {
          setMatchStatus(msg.matchStatus);
          setMatchTimer(msg.matchTimer);
          setCountdownTimer(msg.countdownTimer);
          setAllianceScores(msg.scores);
          setConnectedBots(msg.bots || []);
          setGameEvents(msg.events || []);

          // Audio triggers
          if (msg.matchStatus === 'countdown' && msg.countdownTimer > 0) {
            soundEffects.playBeep(false);
          } else if (msg.matchStatus === 'teleop' && msg.matchTimer === 60) {
            soundEffects.playBeep(true);
          }
        } else if (msg.type === 'chat') {
          setChatMessages((prev) => [...prev.slice(-24), msg.message]);
        } else if (msg.type === 'pong') {
          const rtt = Date.now() - msg.clientTime;
          setNetLatency(Math.max(5, Math.round(rtt)));
        }
      } catch (err) {
        console.error('WS Parse Error:', err);
      }
    };

    socket.onclose = () => {
      if (!isSubscribed) return;
      setWsConnected(false);
      if ((socket as any)._pingInterval) clearInterval((socket as any)._pingInterval);
    };

    socket.onerror = () => {
      setWsConnected(false);
    };

    return () => {
      isSubscribed = false;
      if ((socket as any)._pingInterval) clearInterval((socket as any)._pingInterval);
      socket.close();
      wsRef.current = null;
    };
  }, [activeTab, roomName, selectedAlliance]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current[key] = true;
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
        // Prevent scrolling while driving
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current[key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Send input tick to WebSocket at 30Hz
  useEffect(() => {
    if (activeTab !== 'multiplayer') return;

    const interval = setInterval(() => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

      let dx = 0;
      let vy = 0;
      const k = keysRef.current;

      if (k['w'] || k['arrowup']) vy -= 1;
      if (k['s'] || k['arrowdown']) vy += 1;
      if (k['a'] || k['arrowleft']) dx -= 1;
      if (k['d'] || k['arrowright']) dx += 1;

      if (dx !== 0 && vy !== 0) {
        dx *= 0.7071;
        vy *= 0.7071;
      }

      const isBoost = !!k[' '] || !!k['shift'];

      wsRef.current.send(
        JSON.stringify({
          type: 'input',
          vx: dx,
          vy,
          boost: isBoost
        })
      );
    }, 1000 / 30);

    return () => clearInterval(interval);
  }, [activeTab]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localSamples: GameSample[] = [];
    if (activeTab === 'solo') {
      localSamples = localSamplesRef.current;
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Cyber Grid Background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Center Field Divider line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center Submersible Zone
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(340, 180, 120, 140);
      ctx.fillStyle = 'rgba(234, 179, 8, 0.03)';
      ctx.fillRect(340, 180, 120, 140);

      ctx.fillStyle = 'rgba(234, 179, 8, 0.8)';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SUBMERSIBLE GOLD ZONE', 400, 255);

      // Blue Basket Zone (Left)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 180, 75, 140);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.fillRect(10, 180, 75, 140);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.fillText('BLUE BASKET', 47, 245);
      ctx.font = '8px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('DEPOSIT', 47, 260);

      // Red Basket Zone (Right)
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.8)';
      ctx.lineWidth = 2;
      ctx.strokeRect(canvas.width - 85, 180, 75, 140);
      ctx.fillStyle = 'rgba(244, 63, 94, 0.08)';
      ctx.fillRect(canvas.width - 85, 180, 75, 140);
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.fillText('RED BASKET', canvas.width - 47, 245);
      ctx.font = '8px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('DEPOSIT', canvas.width - 47, 260);

      // Render Active Game Mode Entities
      if (activeTab === 'multiplayer') {
        // Render Bots from WebSocket
        connectedBots.forEach((bot) => {
          drawRobot(ctx, bot.x, bot.y, bot.heading, bot.alliance, bot.name, bot.id === myPlayerId, bot.carriedSamples, bot.boostActive);
        });
      } else if (activeTab === 'local2p') {
        // Render 2 Local Players
        const p1 = localPlayer1Ref.current;
        const p2 = localPlayer2Ref.current;
        drawRobot(ctx, p1.x, p1.y, p1.heading, 'blue', 'P1 Blue (WASD)', true, p1.carried, p1.isBoosting);
        drawRobot(ctx, p2.x, p2.y, p2.heading, 'red', 'P2 Red (Arrows)', false, p2.carried, p2.isBoosting);

        // Render Local Samples
        localSamplesRef.current.forEach((sample) => {
          ctx.beginPath();
          ctx.arc(sample.x, sample.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = sample.type === 'gold' ? '#eab308' : sample.type === 'blue' ? '#38bdf8' : '#f43f5e';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
      } else {
        // Solo Mode
        const p1 = localPlayer1Ref.current;
        drawRobot(ctx, p1.x, p1.y, p1.heading, 'blue', playerName, true, p1.carried, p1.isBoosting);
        localSamplesRef.current.forEach((sample) => {
          ctx.beginPath();
          ctx.arc(sample.x, sample.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = sample.color || '#eab308';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
      }

      // Render Particles
      particlesRef.current.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 0.04;

        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size || 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
      particlesRef.current = particlesRef.current.filter((pt) => pt.life > 0);

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [activeTab, connectedBots, myPlayerId, playerName]);

  // Helper to draw realistic Mecanum Chassis Robot
  const drawRobot = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    heading: number,
    alliance: Alliance,
    name: string,
    isLocal: boolean,
    carriedSamples: number,
    isBoosting: boolean
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(heading);

    const isBlue = alliance === 'blue';
    const mainColor = isBlue ? '#0284c7' : '#e11d48';
    const accentColor = isBlue ? '#38bdf8' : '#fb7185';

    // Boost Thruster Flame
    if (isBoosting) {
      ctx.fillStyle = isBlue ? '#38bdf8' : '#fb923c';
      ctx.beginPath();
      ctx.moveTo(-ROBOT_SIZE / 2, -6);
      ctx.lineTo(-ROBOT_SIZE / 2 - 14 - Math.random() * 8, 0);
      ctx.lineTo(-ROBOT_SIZE / 2, 6);
      ctx.closePath();
      ctx.fill();
    }

    // Mecanum Chassis Base
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = isLocal ? 2.5 : 1.5;
    ctx.fillRect(-ROBOT_SIZE / 2, -ROBOT_SIZE / 2, ROBOT_SIZE, ROBOT_SIZE);
    ctx.strokeRect(-ROBOT_SIZE / 2, -ROBOT_SIZE / 2, ROBOT_SIZE, ROBOT_SIZE);

    // Aluminum Bumper Frame with Alliance Color
    ctx.fillStyle = mainColor;
    ctx.fillRect(-ROBOT_SIZE / 2 + 3, -ROBOT_SIZE / 2 + 3, ROBOT_SIZE - 6, ROBOT_SIZE - 6);

    // 4 Mecanum Rollers (Wheels)
    ctx.fillStyle = '#475569';
    ctx.fillRect(-ROBOT_SIZE / 2 - 5, -ROBOT_SIZE / 2 - 1, 5, 11);
    ctx.fillRect(ROBOT_SIZE / 2, -ROBOT_SIZE / 2 - 1, 5, 11);
    ctx.fillRect(-ROBOT_SIZE / 2 - 5, ROBOT_SIZE / 2 - 10, 5, 11);
    ctx.fillRect(ROBOT_SIZE / 2, ROBOT_SIZE / 2 - 10, 5, 11);

    // Front Claw / Intake Roller
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(ROBOT_SIZE / 2 - 3, -8, 6, 16);

    // Carried Sample Orbs (Visual indicator)
    if (carriedSamples >= 1) {
      ctx.beginPath();
      ctx.arc(-4, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#eab308';
      ctx.fill();
    }
    if (carriedSamples >= 2) {
      ctx.beginPath();
      ctx.arc(4, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#eab308';
      ctx.fill();
    }

    // Directional Front Arrow
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(ROBOT_SIZE / 2 - 2, 0);
    ctx.lineTo(ROBOT_SIZE / 2 - 8, -5);
    ctx.lineTo(ROBOT_SIZE / 2 - 8, 5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Nameplate & Carried Badge (unrotated)
    ctx.save();
    ctx.font = 'bold 9px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = isLocal ? '#38bdf8' : '#ffffff';
    ctx.fillText(name, x, y - ROBOT_SIZE / 2 - 8);

    if (carriedSamples > 0) {
      ctx.fillStyle = '#eab308';
      ctx.fillText(`[${carriedSamples}/2 SAMPLES]`, x, y + ROBOT_SIZE / 2 + 12);
    }
    ctx.restore();
  };

  // Start multiplayer match trigger
  const handleStartMatch = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'start_match' }));
    }
  };

  // Toggle AI Sparring Drone
  const handleToggleAi = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'toggle_ai' }));
    }
  };

  // Send Chat Message
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: 'chat', text: chatInput.trim() }));
    setChatInput('');
  };

  // Tactical Quick Pings
  const handleSendQuickPing = (pingText: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: 'chat', text: pingText }));
  };

  // Copy Room Link to clipboard
  const handleCopyInviteLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${encodeURIComponent(roomName)}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Local 2-Player Loop
  const startLocal2pMatch = () => {
    setLocal2pState('playing');
    setLocal2pScores({ blue: 0, red: 0 });
    setLocal2pTimer(45);
    localPlayer1Ref.current = {
      x: 140,
      y: 250,
      vx: 0,
      vy: 0,
      heading: 0,
      carried: 0,
      boost: 100,
      isBoosting: false
    };
    localPlayer2Ref.current = {
      x: 660,
      y: 250,
      vx: 0,
      vy: 0,
      heading: Math.PI,
      carried: 0,
      boost: 100,
      isBoosting: false
    };

    // Spawn field samples
    const samples: GameSample[] = [];
    for (let i = 0; i < 8; i++) {
      samples.push({
        id: i,
        x: 240 + Math.random() * 320,
        y: 80 + Math.random() * 340,
        type: i % 2 === 0 ? 'gold' : i % 4 === 1 ? 'blue' : 'red',
        points: 20
      });
    }
    localSamplesRef.current = samples;
  };

  // Local 2P Timer & Physics ticker
  useEffect(() => {
    if (activeTab !== 'local2p' || local2pState !== 'playing') return;

    const timer = setInterval(() => {
      setLocal2pTimer((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setLocal2pState('gameover');
          soundEffects.playBeep(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const physicsInterval = setInterval(() => {
      const k = keysRef.current;
      const p1 = localPlayer1Ref.current;
      const p2 = localPlayer2Ref.current;

      // P1 (WASD)
      let p1dx = 0;
      let p1dy = 0;
      if (k['w']) p1dy -= 1;
      if (k['s']) p1dy += 1;
      if (k['a']) p1dx -= 1;
      if (k['d']) p1dx += 1;
      p1.isBoosting = !!k[' '];

      const p1Speed = p1.isBoosting ? 6.2 : 4.2;
      p1.x += p1dx * p1Speed;
      p1.y += p1dy * p1Speed;
      if (p1dx !== 0 || p1dy !== 0) p1.heading = Math.atan2(p1dy, p1dx);
      p1.x = Math.max(30, Math.min(FIELD_WIDTH - 30, p1.x));
      p1.y = Math.max(30, Math.min(FIELD_HEIGHT - 30, p1.y));

      // P2 (Arrows)
      let p2dx = 0;
      let p2dy = 0;
      if (k['arrowup']) p2dy -= 1;
      if (k['arrowdown']) p2dy += 1;
      if (k['arrowleft']) p2dx -= 1;
      if (k['arrowright']) p2dx += 1;
      p2.isBoosting = !!k['enter'] || !!k['shift'];

      const p2Speed = p2.isBoosting ? 6.2 : 4.2;
      p2.x += p2dx * p2Speed;
      p2.y += p2dy * p2Speed;
      if (p2dx !== 0 || p2dy !== 0) p2.heading = Math.atan2(p2dy, p2dx);
      p2.x = Math.max(30, Math.min(FIELD_WIDTH - 30, p2.x));
      p2.y = Math.max(30, Math.min(FIELD_HEIGHT - 30, p2.y));

      // Pickups
      localSamplesRef.current = localSamplesRef.current.filter((s) => {
        const d1 = Math.hypot(p1.x - s.x, p1.y - s.y);
        if (d1 < 25 && p1.carried < 2) {
          p1.carried++;
          soundEffects.playPickup();
          return false;
        }
        const d2 = Math.hypot(p2.x - s.x, p2.y - s.y);
        if (d2 < 25 && p2.carried < 2) {
          p2.carried++;
          soundEffects.playPickup();
          return false;
        }
        return true;
      });

      // Scoring
      if (p1.carried > 0 && p1.x <= 85 && p1.y >= 180 && p1.y <= 320) {
        setLocal2pScores((sc) => ({ ...sc, blue: sc.blue + p1.carried * 30 }));
        soundEffects.playScore();
        p1.carried = 0;
      }
      if (p2.carried > 0 && p2.x >= FIELD_WIDTH - 85 && p2.y >= 180 && p2.y <= 320) {
        setLocal2pScores((sc) => ({ ...sc, red: sc.red + p2.carried * 30 }));
        soundEffects.playScore();
        p2.carried = 0;
      }

      // Respawn samples
      if (localSamplesRef.current.length < 3) {
        localSamplesRef.current.push({
          id: Math.random(),
          x: 260 + Math.random() * 280,
          y: 90 + Math.random() * 320,
          type: 'gold',
          points: 25
        });
      }
    }, 1000 / 30);

    return () => {
      clearInterval(timer);
      clearInterval(physicsInterval);
    };
  }, [activeTab, local2pState]);

  return (
    <section className="py-12 sm:py-16 space-y-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-800/40 font-mono shadow-lg shadow-purple-950/30">
              <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
              <span>FTC ALLIANCE CYBER ARENA // REAL-TIME MULTIPLAYER</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Kraken Alliance Duel</span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800/40 font-mono font-normal">
                WebSocket 30Hz
              </span>
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Holonomic Mecanum dueling simulator. Connect with teammates across browser sessions in real-time, scoop submersible samples, execute defensive bumper checks, and score in the high basket!
            </p>
          </div>

          {/* Controls Bar: Sound & Mode Pill Switcher */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                const isMuted = soundEffects.toggleMute();
                setSoundMuted(isMuted);
              }}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition"
              title={soundMuted ? 'Unmute Game SFX' : 'Mute Game SFX'}
            >
              {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => setActiveTab('multiplayer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'multiplayer'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Live Online (WS)</span>
              </button>
              <button
                onClick={() => setActiveTab('local2p')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'local2p'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Local 2-Player (Split-Key)</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- TAB 1: MULTIPLAYER ONLINE MODE --- */}
        {activeTab === 'multiplayer' && (
          <div className="space-y-6">
            {/* Room & Matchmaking Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
              {/* Pilot Callsign */}
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Pilot Callsign
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  placeholder="Enter callsign..."
                  maxLength={16}
                />
              </div>

              {/* Room Code */}
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Arena Room Code
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. prime-arena"
                  />
                  <button
                    onClick={handleCopyInviteLink}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition shrink-0"
                    title="Copy direct invite link"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Alliance Selection */}
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Alliance Station
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setSelectedAlliance('blue')}
                    className={`px-2 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-1 border ${
                      selectedAlliance === 'blue'
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Shield className="w-3 h-3 text-cyan-400" />
                    <span>BLUE</span>
                  </button>
                  <button
                    onClick={() => setSelectedAlliance('red')}
                    className={`px-2 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-1 border ${
                      selectedAlliance === 'red'
                        ? 'bg-rose-950 border-rose-500 text-rose-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Shield className="w-3 h-3 text-rose-400" />
                    <span>RED</span>
                  </button>
                </div>
              </div>

              {/* Connection Status & Actions */}
              <div className="flex flex-col justify-end">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    {wsConnected ? (
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <Wifi className="w-3.5 h-3.5" />
                        <span>Connected ({netLatency}ms)</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-rose-400">
                        <WifiOff className="w-3.5 h-3.5" />
                        <span>Connecting...</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleToggleAi}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-purple-950/80 hover:bg-purple-900 border border-purple-700/50 text-purple-200 transition"
                  >
                    <Bot className="w-3 h-3 text-purple-400" />
                    <span>Sparring AI</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Arena Main Display Box */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950 space-y-4">
              {/* Telemetry Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs border-b border-slate-900 pb-3">
                {/* Alliance Scores */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-slate-400">BLUE ALLIANCE:</span>
                    <span className="text-xl font-bold text-cyan-400">{allianceScores.blue}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
                    <span className="text-slate-400">RED ALLIANCE:</span>
                    <span className="text-xl font-bold text-rose-400">{allianceScores.red}</span>
                  </div>
                </div>

                {/* Match Timer & State */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400">MATCH CLOCK:</span>
                    <span
                      className={`text-xl font-bold ${
                        matchTimer <= 10 && matchStatus === 'teleop' ? 'text-rose-400 animate-ping' : 'text-emerald-400'
                      }`}
                    >
                      {matchStatus === 'countdown' ? `STARTING IN ${countdownTimer}s` : `${matchTimer}s`}
                    </span>
                  </div>

                  {matchStatus === 'waiting' && (
                    <button
                      onClick={handleStartMatch}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shadow-md shadow-cyan-950"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Start 60s Match</span>
                    </button>
                  )}

                  {matchStatus === 'finished' && (
                    <button
                      onClick={handleStartMatch}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md shadow-emerald-950"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Rematch</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Canvas Arena Container */}
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={FIELD_WIDTH}
                  height={FIELD_HEIGHT}
                  className="w-full max-w-[800px] aspect-[8/5] touch-none"
                />

                {/* Status Overlay when Countdown or Finished */}
                {matchStatus === 'countdown' && (
                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-6xl font-black text-cyan-400 font-mono animate-bounce">
                      {countdownTimer}
                    </span>
                    <p className="text-xs font-mono text-slate-300 mt-2">STANDBY FOR AUTONOMOUS & TELEOP</p>
                  </div>
                )}

                {matchStatus === 'finished' && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <Trophy className="w-12 h-12 text-amber-400" />
                    <h3 className="text-2xl font-black text-white">
                      {allianceScores.blue > allianceScores.red
                        ? 'BLUE ALLIANCE VICTORY!'
                        : allianceScores.red > allianceScores.blue
                        ? 'RED ALLIANCE VICTORY!'
                        : 'ALLIANCE TIE!'}
                    </h3>
                    <div className="flex items-center gap-6 font-mono text-lg">
                      <span className="text-cyan-400 font-bold">BLUE: {allianceScores.blue} pts</span>
                      <span className="text-slate-500">|</span>
                      <span className="text-rose-400 font-bold">RED: {allianceScores.red} pts</span>
                    </div>
                    <button
                      onClick={handleStartMatch}
                      className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shadow-lg shadow-cyan-950 font-mono"
                    >
                      LAUNCH REMATCH
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Telemetry & Quick Tactical Pings */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
                {/* Tactical Quick Pings */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>TACTICAL TEAM RADIO PINGS</span>
                    <Radio className="w-3 h-3 text-cyan-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => handleSendQuickPing('Defending Blue Basket!')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-left text-[11px] font-mono text-cyan-300 transition truncate"
                    >
                      🛡️ Defend Basket
                    </button>
                    <button
                      onClick={() => handleSendQuickPing('Scooping Gold Samples!')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-left text-[11px] font-mono text-amber-300 transition truncate"
                    >
                      🟡 Scoop Gold
                    </button>
                    <button
                      onClick={() => handleSendQuickPing('Turbo Overclock Active!')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-left text-[11px] font-mono text-purple-300 transition truncate"
                    >
                      ⚡ Turbo Boost
                    </button>
                    <button
                      onClick={() => handleSendQuickPing('GG Alliance! Great match!')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-left text-[11px] font-mono text-emerald-300 transition truncate"
                    >
                      🏆 GG WP
                    </button>
                  </div>
                </div>

                {/* Live Connected Drivers Roster */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>CONNECTED PILOTS ({connectedBots.length})</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                    {connectedBots.map((bot) => (
                      <div
                        key={bot.id}
                        className="flex items-center justify-between text-[11px] font-mono p-1 rounded bg-slate-950/60"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span
                            className={`w-2 h-2 rounded-full ${bot.alliance === 'blue' ? 'bg-cyan-400' : 'bg-rose-400'}`}
                          />
                          <span className={bot.id === myPlayerId ? 'text-cyan-300 font-bold' : 'text-slate-300'}>
                            {bot.name} {bot.id === myPlayerId && '(You)'}
                          </span>
                        </div>
                        <span className="text-slate-400">{bot.score} pts</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Match Event Log */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>FIELD EVENT TELEMETRY</span>
                    <Zap className="w-3 h-3 text-amber-400" />
                  </div>
                  <div className="space-y-1 max-h-24 overflow-y-auto text-[10px] font-mono text-slate-400 pr-1">
                    {gameEvents.length === 0 ? (
                      <div className="text-slate-600 italic">Waiting for match actions...</div>
                    ) : (
                      gameEvents.slice(0, 4).map((evt) => (
                        <div key={evt.id} className="truncate text-slate-300">
                          &bull; {evt.text}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Broadcast message to arena pilots..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  maxLength={100}
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-mono flex items-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* --- TAB 2: LOCAL 2-PLAYER SPLIT-KEY BATTLE --- */}
        {activeTab === 'local2p' && (
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-900 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Swords className="w-5 h-5 text-purple-400" />
                  <span>Local Same-Device Duel: Blue Kraken vs Red Kraken</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Two students, one keyboard! Player 1 operates WASD + Spacebar. Player 2 operates Arrow Keys + Enter.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-cyan-400 font-bold">BLUE: {local2pScores.blue}</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-rose-400 font-bold">RED: {local2pScores.red}</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-emerald-400 font-bold">{local2pTimer}s</span>
                </div>

                {local2pState === 'idle' ? (
                  <button
                    onClick={startLocal2pMatch}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono flex items-center gap-1.5 transition"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Start 2-Player Match</span>
                  </button>
                ) : (
                  <button
                    onClick={startLocal2pMatch}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs font-mono flex items-center gap-1.5 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Duel</span>
                  </button>
                )}
              </div>
            </div>

            {/* Canvas */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex justify-center">
              <canvas
                ref={canvasRef}
                width={FIELD_WIDTH}
                height={FIELD_HEIGHT}
                className="w-full max-w-[800px] aspect-[8/5]"
              />

              {local2pState === 'gameover' && (
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <Trophy className="w-12 h-12 text-amber-400" />
                  <h3 className="text-2xl font-black text-white">
                    {local2pScores.blue > local2pScores.red
                      ? 'PLAYER 1 (BLUE) WINS!'
                      : local2pScores.red > local2pScores.blue
                      ? 'PLAYER 2 (RED) WINS!'
                      : 'DEAD HEAT DRAW!'}
                  </h3>
                  <button
                    onClick={startLocal2pMatch}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono transition"
                  >
                    REMATCH
                  </button>
                </div>
              )}
            </div>

            {/* Split Key Control Guide */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span>PLAYER 1: BLUE KRAKEN</span>
                </div>
                <div className="text-slate-300 space-y-1 text-[11px]">
                  <div>&bull; <strong className="text-white">W / A / S / D</strong>: Holonomic Vector Drive</div>
                  <div>&bull; <strong className="text-white">SPACEBAR</strong>: Overclock Turbo Boost</div>
                  <div>&bull; <strong className="text-cyan-300">Goal</strong>: Scoop samples & score in Blue Basket (Left)</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/40 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span>PLAYER 2: RED KRAKEN</span>
                </div>
                <div className="text-slate-300 space-y-1 text-[11px]">
                  <div>&bull; <strong className="text-white">ARROW KEYS</strong>: Holonomic Vector Drive</div>
                  <div>&bull; <strong className="text-white">ENTER / SHIFT</strong>: Overclock Turbo Boost</div>
                  <div>&bull; <strong className="text-rose-300">Goal</strong>: Scoop samples & score in Red Basket (Right)</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
