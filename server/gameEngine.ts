import { WebSocket } from 'ws';

export type Alliance = 'blue' | 'red' | 'spectator';

export interface PlayerBot {
  id: string;
  name: string;
  alliance: Alliance;
  x: number;
  y: number;
  vx: number;
  vy: number;
  heading: number; // in radians
  speed: number;
  score: number;
  carriedSamples: number; // max 2
  boostActive: boolean;
  boostFuel: number; // 0 - 100
  ping: number;
  lastPingTime: number;
  isReady: boolean;
  isAi?: boolean;
}

export interface GameSample {
  id: string;
  x: number;
  y: number;
  type: 'gold' | 'blue' | 'red';
  points: number;
}

export interface PowerUp {
  id: string;
  x: number;
  y: number;
  type: 'speed' | 'magnet' | 'pulse';
  duration: number;
}

export interface GameEvent {
  id: string;
  text: string;
  type: 'score' | 'pickup' | 'join' | 'leave' | 'match_end' | 'powerup';
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  sender: string;
  alliance: Alliance;
  text: string;
  time: string;
}

export type MatchStatus = 'waiting' | 'countdown' | 'teleop' | 'finished';

const FIELD_WIDTH = 800;
const FIELD_HEIGHT = 500;
const ROBOT_RADIUS = 22;

export class GameRoom {
  public id: string;
  public players: Map<string, { ws?: WebSocket; bot: PlayerBot }> = new Map();
  public samples: GameSample[] = [];
  public powerups: PowerUp[] = [];
  public matchStatus: MatchStatus = 'waiting';
  public matchTimer: number = 60; // 60 second match
  public countdownTimer: number = 3;
  public scores = { blue: 0, red: 0 };
  public events: GameEvent[] = [];
  public chatHistory: ChatMessage[] = [];
  private tickInterval: NodeJS.Timeout | null = null;
  private nextSampleId = 1;

  constructor(id: string) {
    this.id = id;
    this.resetField();
    this.startEngine();
  }

  public resetField() {
    this.samples = [];
    this.powerups = [];
    this.scores = { blue: 0, red: 0 };
    this.matchStatus = 'waiting';
    this.matchTimer = 60;
    this.countdownTimer = 3;

    // Center Gold Samples (high points)
    for (let i = 0; i < 5; i++) {
      this.samples.push({
        id: `s_gold_${this.nextSampleId++}`,
        x: 360 + Math.random() * 80,
        y: 180 + Math.random() * 140,
        type: 'gold',
        points: 25
      });
    }

    // Blue Alliance field samples (Left side)
    for (let i = 0; i < 5; i++) {
      this.samples.push({
        id: `s_blue_${this.nextSampleId++}`,
        x: 120 + Math.random() * 180,
        y: 80 + Math.random() * 340,
        type: 'blue',
        points: 15
      });
    }

    // Red Alliance field samples (Right side)
    for (let i = 0; i < 5; i++) {
      this.samples.push({
        id: `s_red_${this.nextSampleId++}`,
        x: 500 + Math.random() * 180,
        y: 80 + Math.random() * 340,
        type: 'red',
        points: 15
      });
    }

    // Powerups
    this.powerups.push({
      id: `pw_1`,
      x: 400,
      y: 90,
      type: 'speed',
      duration: 6
    });
    this.powerups.push({
      id: `pw_2`,
      x: 400,
      y: 410,
      type: 'magnet',
      duration: 8
    });

    // Reset player positions & states
    for (const [_, item] of this.players) {
      this.positionPlayer(item.bot);
      item.bot.score = 0;
      item.bot.carriedSamples = 0;
      item.bot.boostFuel = 100;
    }
  }

  private positionPlayer(bot: PlayerBot) {
    if (bot.alliance === 'blue') {
      bot.x = 100;
      bot.y = 250;
      bot.heading = 0;
    } else if (bot.alliance === 'red') {
      bot.x = 700;
      bot.y = 250;
      bot.heading = Math.PI;
    } else {
      bot.x = 400;
      bot.y = 250;
      bot.heading = 0;
    }
    bot.vx = 0;
    bot.vy = 0;
  }

  public addPlayer(id: string, name: string, preferredAlliance: Alliance, ws?: WebSocket): PlayerBot {
    // Choose balanced alliance if not specified or already full
    let alliance = preferredAlliance;
    if (alliance !== 'spectator') {
      let blueCount = 0;
      let redCount = 0;
      for (const [_, p] of this.players) {
        if (p.bot.alliance === 'blue') blueCount++;
        if (p.bot.alliance === 'red') redCount++;
      }

      if (preferredAlliance === 'blue' && blueCount > redCount) {
        alliance = 'red';
      } else if (preferredAlliance === 'red' && redCount > blueCount) {
        alliance = 'blue';
      } else if (blueCount <= redCount) {
        alliance = 'blue';
      } else {
        alliance = 'red';
      }
    }

    const bot: PlayerBot = {
      id,
      name: name || `Pilot #${id.slice(-4)}`,
      alliance,
      x: alliance === 'blue' ? 100 : 700,
      y: 250,
      vx: 0,
      vy: 0,
      heading: alliance === 'blue' ? 0 : Math.PI,
      speed: 4.6,
      score: 0,
      carriedSamples: 0,
      boostActive: false,
      boostFuel: 100,
      ping: 15,
      lastPingTime: Date.now(),
      isReady: false
    };

    this.positionPlayer(bot);
    this.players.set(id, { ws, bot });

    this.addEvent(`${bot.name} joined ${bot.alliance.toUpperCase()} alliance!`, 'join');
    return bot;
  }

  public removePlayer(id: string) {
    const p = this.players.get(id);
    if (p) {
      this.addEvent(`${p.bot.name} disconnected.`, 'leave');
      this.players.delete(id);
    }
  }

  public toggleAiOpponent() {
    const aiId = 'ai-sparring-drone';
    if (this.players.has(aiId)) {
      this.removePlayer(aiId);
    } else {
      // Find opposite alliance of existing human player
      let opposingAlliance: Alliance = 'red';
      for (const [_, p] of this.players) {
        if (!p.bot.isAi) {
          opposingAlliance = p.bot.alliance === 'blue' ? 'red' : 'blue';
          break;
        }
      }

      const bot: PlayerBot = {
        id: aiId,
        name: 'AI Sparring Bot (Vance-2)',
        alliance: opposingAlliance,
        x: opposingAlliance === 'blue' ? 100 : 700,
        y: 250,
        vx: 0,
        vy: 0,
        heading: opposingAlliance === 'blue' ? 0 : Math.PI,
        speed: 3.8,
        score: 0,
        carriedSamples: 0,
        boostActive: false,
        boostFuel: 100,
        ping: 2,
        lastPingTime: Date.now(),
        isReady: true,
        isAi: true
      };
      this.players.set(aiId, { bot });
      this.addEvent(`AI Sparring Bot activated on ${opposingAlliance.toUpperCase()} alliance!`, 'join');
    }
  }

  public handleInput(id: string, input: { vx: number; vy: number; heading?: number; boost?: boolean }) {
    const p = this.players.get(id);
    if (!p || this.matchStatus !== 'teleop') return;

    const bot = p.bot;
    const baseSpeed = bot.speed;
    const isBoosting = !!input.boost && bot.boostFuel > 10;
    const multiplier = isBoosting ? 1.45 : 1.0;

    bot.boostActive = isBoosting;
    if (isBoosting) {
      bot.boostFuel = Math.max(0, bot.boostFuel - 0.8);
    } else {
      bot.boostFuel = Math.min(100, bot.boostFuel + 0.25);
    }

    // Holonomic Mecanum Vector input
    bot.vx = (input.vx || 0) * baseSpeed * multiplier;
    bot.vy = (input.vy || 0) * baseSpeed * multiplier;

    if (input.heading !== undefined) {
      bot.heading = input.heading;
    } else if (Math.hypot(bot.vx, bot.vy) > 0.1) {
      bot.heading = Math.atan2(bot.vy, bot.vx);
    }
  }

  public addChatMessage(sender: string, alliance: Alliance, text: string) {
    const msg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender,
      alliance,
      text: text.slice(0, 100),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    this.chatHistory.push(msg);
    if (this.chatHistory.length > 25) {
      this.chatHistory.shift();
    }
    this.broadcast({ type: 'chat', message: msg });
  }

  public addEvent(text: string, type: GameEvent['type']) {
    const event: GameEvent = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      type,
      timestamp: Date.now()
    };
    this.events.unshift(event);
    if (this.events.length > 20) this.events.pop();
  }

  public triggerMatchStart() {
    this.resetField();
    this.matchStatus = 'countdown';
    this.countdownTimer = 3;
    this.addEvent('Match Countdown Commencing: 3, 2, 1...', 'join');
  }

  private startEngine() {
    let tickCount = 0;
    this.tickInterval = setInterval(() => {
      tickCount++;
      this.updatePhysics();

      // Broadcast state every tick (~30Hz)
      this.broadcastState();

      // Check match clock every 30 ticks (1 sec)
      if (tickCount % 30 === 0) {
        this.updateTimers();
      }
    }, 1000 / 30);
  }

  private updateTimers() {
    if (this.matchStatus === 'countdown') {
      this.countdownTimer--;
      if (this.countdownTimer <= 0) {
        this.matchStatus = 'teleop';
        this.matchTimer = 60;
        this.addEvent('🟢 TELEOP MATCH ACTIVE: Collect & Score!', 'score');
      }
    } else if (this.matchStatus === 'teleop') {
      this.matchTimer--;
      if (this.matchTimer <= 0) {
        this.matchStatus = 'finished';
        const victor =
          this.scores.blue > this.scores.red
            ? 'BLUE ALLIANCE VICTORY!'
            : this.scores.red > this.scores.blue
            ? 'RED ALLIANCE VICTORY!'
            : 'MATCH TIED!';
        this.addEvent(`🏆 MATCH CONCLUDED: ${victor}`, 'match_end');
      }
    }
  }

  private updateAiBot(bot: PlayerBot) {
    if (this.matchStatus !== 'teleop') return;

    // AI Logic:
    // If carrying 2 samples, navigate to own alliance basket to deposit!
    // Otherwise find closest available sample
    let targetX = 400;
    let targetY = 250;

    if (bot.carriedSamples >= 2) {
      // Navigate to own basket
      targetX = bot.alliance === 'blue' ? 50 : 750;
      targetY = 250;
    } else {
      // Find nearest sample
      let nearestDist = Infinity;
      let targetSample: GameSample | null = null;
      for (const s of this.samples) {
        const d = Math.hypot(s.x - bot.x, s.y - bot.y);
        if (d < nearestDist) {
          nearestDist = d;
          targetSample = s;
        }
      }
      if (targetSample) {
        targetX = targetSample.x;
        targetY = targetSample.y;
      }
    }

    const dx = targetX - bot.x;
    const dy = targetY - bot.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 5) {
      bot.vx = (dx / dist) * bot.speed;
      bot.vy = (dy / dist) * bot.speed;
      bot.heading = Math.atan2(dy, dx);
    } else {
      bot.vx = 0;
      bot.vy = 0;
    }
  }

  private updatePhysics() {
    const bots = Array.from(this.players.values()).map((p) => p.bot);

    // Update AI bot if present
    for (const bot of bots) {
      if (bot.isAi) {
        this.updateAiBot(bot);
      }
    }

    // Move bots & enforce arena bounds
    for (const bot of bots) {
      bot.x += bot.vx;
      bot.y += bot.vy;

      // Friction
      bot.vx *= 0.88;
      bot.vy *= 0.88;

      // Clamp to field perimeter
      bot.x = Math.max(ROBOT_RADIUS + 5, Math.min(FIELD_WIDTH - ROBOT_RADIUS - 5, bot.x));
      bot.y = Math.max(ROBOT_RADIUS + 5, Math.min(FIELD_HEIGHT - ROBOT_RADIUS - 5, bot.y));
    }

    // Robot vs Robot Collisions (Elastic Bumping)
    for (let i = 0; i < bots.length; i++) {
      for (let j = i + 1; j < bots.length; j++) {
        const b1 = bots[i];
        const b2 = bots[j];
        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const dist = Math.hypot(dx, dy);
        const minDist = ROBOT_RADIUS * 2;

        if (dist < minDist && dist > 0) {
          const overlap = (minDist - dist) / 2;
          const nx = dx / dist;
          const ny = dy / dist;

          // Separate
          b1.x -= nx * overlap;
          b1.y -= ny * overlap;
          b2.x += nx * overlap;
          b2.y += ny * overlap;

          // Push velocities
          b1.vx -= nx * 2;
          b1.vy -= ny * 2;
          b2.vx += nx * 2;
          b2.vy += ny * 2;
        }
      }
    }

    if (this.matchStatus !== 'teleop') return;

    // Sample Pickup Logic
    for (const bot of bots) {
      if (bot.carriedSamples >= 2) continue; // max capacity

      for (let i = this.samples.length - 1; i >= 0; i--) {
        const s = this.samples[i];
        const dist = Math.hypot(bot.x - s.x, bot.y - s.y);
        if (dist < ROBOT_RADIUS + 12) {
          bot.carriedSamples++;
          this.samples.splice(i, 1);
          this.addEvent(`${bot.name} scooped ${s.type.toUpperCase()} sample!`, 'pickup');
          break;
        }
      }
    }

    // Sample Respawning if field empty
    if (this.samples.length <= 3) {
      this.samples.push({
        id: `s_dyn_${this.nextSampleId++}`,
        x: 200 + Math.random() * 400,
        y: 100 + Math.random() * 300,
        type: Math.random() > 0.4 ? 'gold' : Math.random() > 0.5 ? 'blue' : 'red',
        points: 20
      });
    }

    // Basket Scoring Zones:
    // Blue Basket: x <= 75 && y between 190 and 310
    // Red Basket: x >= 725 && y between 190 and 310
    for (const bot of bots) {
      if (bot.carriedSamples > 0) {
        const inBlueBasket = bot.x <= 85 && bot.y >= 180 && bot.y <= 320;
        const inRedBasket = bot.x >= 715 && bot.y >= 180 && bot.y <= 320;

        if (bot.alliance === 'blue' && inBlueBasket) {
          const pts = bot.carriedSamples * 30;
          this.scores.blue += pts;
          bot.score += pts;
          this.addEvent(`🔵 ${bot.name} deposited in High Basket (+${pts} pts)!`, 'score');
          bot.carriedSamples = 0;
        } else if (bot.alliance === 'red' && inRedBasket) {
          const pts = bot.carriedSamples * 30;
          this.scores.red += pts;
          bot.score += pts;
          this.addEvent(`🔴 ${bot.name} deposited in High Basket (+${pts} pts)!`, 'score');
          bot.carriedSamples = 0;
        }
      }
    }
  }

  public broadcast(data: any) {
    const payload = JSON.stringify(data);
    for (const [_, p] of this.players) {
      if (p.ws && p.ws.readyState === WebSocket.OPEN) {
        p.ws.send(payload);
      }
    }
  }

  public broadcastState() {
    const bots = Array.from(this.players.values()).map((p) => p.bot);
    this.broadcast({
      type: 'state',
      matchStatus: this.matchStatus,
      matchTimer: this.matchTimer,
      countdownTimer: this.countdownTimer,
      scores: this.scores,
      bots,
      samples: this.samples,
      powerups: this.powerups,
      events: this.events.slice(0, 8),
      serverTime: Date.now()
    });
  }

  public destroy() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
    }
  }
}

// Room Manager
export class GameManager {
  private static instance: GameManager;
  public rooms: Map<string, GameRoom> = new Map();

  private constructor() {
    // Default Prime Room
    this.getOrCreateRoom('prime-arena');
  }

  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  public getOrCreateRoom(roomId: string): GameRoom {
    let room = this.rooms.get(roomId);
    if (!room) {
      room = new GameRoom(roomId);
      this.rooms.set(roomId, room);
    }
    return room;
  }
}
