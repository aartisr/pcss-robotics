const WIDTH = 960;
const HEIGHT = 600;
const TAU = Math.PI * 2;

const controls = {
  p1: { up: 'w', down: 's', left: 'a', right: 'd', action: 'f' },
  p2: { up: 'arrowup', down: 'arrowdown', left: 'arrowleft', right: 'arrowright', action: 'enter' },
  p3: { up: 'i', down: 'k', left: 'j', right: 'l', action: 'o' },
  p4: { up: 't', down: 'g', left: 'f', right: 'h', action: 'y' }
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const normalize = vector => {
  const magnitude = Math.hypot(vector.x, vector.y) || 1;
  return { x: vector.x / magnitude, y: vector.y / magnitude };
};

const applyMovement = (entity, input, speed, dt) => {
  const direction = {
    x: (input.right ? 1 : 0) - (input.left ? 1 : 0),
    y: (input.down ? 1 : 0) - (input.up ? 1 : 0)
  };
  const normalized = direction.x || direction.y ? normalize(direction) : direction;
  entity.vx += normalized.x * speed * dt;
  entity.vy += normalized.y * speed * dt;
};

const getPlayerInput = (keys, mapping) => ({
  up: Boolean(keys[mapping.up]),
  down: Boolean(keys[mapping.down]),
  left: Boolean(keys[mapping.left]),
  right: Boolean(keys[mapping.right]),
  action: Boolean(keys[mapping.action])
});

const fillBackground = (ctx, accent) => {
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, '#04111f');
  gradient.addColorStop(0.5, accent);
  gradient.addColorStop(1, '#091e35');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
};

const drawHudText = (ctx, text, x, y, options = {}) => {
  ctx.save();
  ctx.fillStyle = options.color || 'rgba(241, 247, 255, 0.96)';
  ctx.font = options.font || '700 18px "Space Grotesk", sans-serif';
  ctx.textAlign = options.align || 'left';
  ctx.fillText(text, x, y);
  ctx.restore();
};

const roundRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
};

const drawRobot = (ctx, robot) => {
  ctx.save();
  ctx.translate(robot.x, robot.y);
  ctx.shadowColor = `${robot.color}66`;
  ctx.shadowBlur = 24;
  ctx.fillStyle = robot.color;
  ctx.beginPath();
  ctx.arc(0, 0, robot.radius, 0, TAU);
  ctx.fill();
  ctx.fillStyle = '#03111f';
  ctx.fillRect(-robot.radius * 0.68, -6, robot.radius * 1.36, 12);
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.fillRect(robot.radius * 0.15, -4, robot.radius * 0.46, 8);
  ctx.restore();
};

const drawBadge = (ctx, x, y, width, label, value, color) => {
  ctx.save();
  ctx.fillStyle = 'rgba(8, 18, 32, 0.78)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  roundRect(ctx, x, y, width, 62, 16);
  ctx.fill();
  ctx.stroke();
  drawHudText(ctx, label, x + 16, y + 23, { color: 'rgba(189, 210, 240, 0.88)', font: '700 12px Sora, sans-serif' });
  drawHudText(ctx, value, x + 16, y + 46, { color, font: '800 22px "Space Grotesk", sans-serif' });
  ctx.restore();
};

const getSoccerAiInput = (player, state) => {
  const homeX = player.team === 'A' ? 220 : WIDTH - 220;
  const attackBias = player.team === 'A' ? 1 : -1;
  const target = state.ball.x * attackBias > homeX * attackBias - 80
    ? { x: state.ball.x - attackBias * 42, y: state.ball.y + (player.label === 'A2' || player.label === 'B2' ? 60 : -60) }
    : { x: homeX, y: player.label === 'A2' || player.label === 'B2' ? HEIGHT * 0.68 : HEIGHT * 0.32 };
  return {
    up: player.y > target.y + 10,
    down: player.y < target.y - 10,
    left: player.x > target.x + 10,
    right: player.x < target.x - 10,
    action: distance(player, state.ball) < player.radius + state.ball.radius + 14
  };
};

const createArenaGame = () => {
  const center = { x: WIDTH / 2, y: HEIGHT / 2 + 24 };
  const spawnPlayers = () => ([
    { id: 'p1', name: 'Neon Ram', x: center.x - 128, y: center.y, vx: 0, vy: 0, radius: 24, color: '#4fd1ff', score: 0, boost: 100, angle: 0 },
    { id: 'p2', name: 'Solar Crash', x: center.x + 128, y: center.y, vx: 0, vy: 0, radius: 24, color: '#ff7a59', score: 0, boost: 100, angle: Math.PI }
  ]);

  return {
    meta: {
      title: 'Robot Arena Knockout',
      controls: [
        'P1: `W A S D` move, `F` boost',
        'P2: arrow keys move, `Enter` boost'
      ]
    },
    createState() {
      return {
        players: spawnPlayers(),
        arenaRadius: 228,
        round: 1,
        roundTimer: 45,
        announcement: 'Hold center. Time your boost.'
      };
    },
    update(state, dt, inputState) {
      state.roundTimer = Math.max(0, state.roundTimer - dt);
      state.arenaRadius = Math.max(124, state.arenaRadius - dt * 2.2);

      state.players.forEach(player => {
        const input = getPlayerInput(inputState.keys, controls[player.id]);
        applyMovement(player, input, 620, dt);
        if (input.action && player.boost > 18) {
          const impulse = normalize({ x: player.vx || Math.cos(player.angle), y: player.vy || Math.sin(player.angle) });
          player.vx += impulse.x * 540 * dt;
          player.vy += impulse.y * 540 * dt;
          player.boost = Math.max(0, player.boost - 52 * dt);
        } else {
          player.boost = Math.min(100, player.boost + 22 * dt);
        }
        player.x += player.vx * dt;
        player.y += player.vy * dt;
        player.vx *= 0.988;
        player.vy *= 0.988;
        if (player.vx || player.vy) {
          player.angle = Math.atan2(player.vy, player.vx);
        }
      });

      const [a, b] = state.players;
      const gap = distance(a, b);
      const minGap = a.radius + b.radius;
      if (gap < minGap && gap > 0) {
        const overlap = minGap - gap;
        const nx = (b.x - a.x) / gap;
        const ny = (b.y - a.y) / gap;
        a.x -= nx * overlap * 0.5;
        a.y -= ny * overlap * 0.5;
        b.x += nx * overlap * 0.5;
        b.y += ny * overlap * 0.5;
        a.vx -= nx * 90 * dt;
        a.vy -= ny * 90 * dt;
        b.vx += nx * 90 * dt;
        b.vy += ny * 90 * dt;
      }

      const eliminated = state.players.find(player => distance(player, center) > state.arenaRadius + player.radius * 0.6);
      if (eliminated || state.roundTimer === 0) {
        const winner = eliminated
          ? state.players.find(player => player.id !== eliminated.id)
          : state.players.reduce((best, player) => (
              distance(player, center) < distance(best, center) ? player : best
            ), state.players[0]);

        winner.score += 1;
        state.announcement = `${winner.name} wins round ${state.round}.`;
        state.round += 1;
        state.roundTimer = 45;
        state.arenaRadius = 228;
        state.players = state.players.map(player => ({
          ...player,
          ...spawnPlayers().find(next => next.id === player.id),
          score: player.score
        }));
      }
    },
    render(ctx, state) {
      fillBackground(ctx, '#0f3358');
      ctx.save();
      ctx.translate(center.x, center.y);
      const ring = ctx.createRadialGradient(0, 0, state.arenaRadius * 0.28, 0, 0, state.arenaRadius + 12);
      ring.addColorStop(0, 'rgba(18, 52, 90, 0.18)');
      ring.addColorStop(0.7, 'rgba(37, 110, 205, 0.34)');
      ring.addColorStop(1, 'rgba(255, 112, 77, 0.92)');
      ctx.strokeStyle = ring;
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.arc(0, 0, state.arenaRadius, 0, TAU);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.beginPath();
      ctx.arc(0, 0, state.arenaRadius - 12, 0, TAU);
      ctx.fill();
      ctx.restore();

      state.players.forEach(player => drawRobot(ctx, player));
      drawBadge(ctx, 26, 24, 210, 'Round', `${state.round}`, '#ffd166');
      drawBadge(ctx, 250, 24, 210, 'Time Left', `${Math.ceil(state.roundTimer)}s`, '#8fd3ff');
      drawBadge(ctx, 474, 24, 210, state.players[0].name, `${state.players[0].score} wins`, state.players[0].color);
      drawBadge(ctx, 698, 24, 236, state.players[1].name, `${state.players[1].score} wins`, state.players[1].color);
      drawHudText(ctx, state.announcement, WIDTH / 2, HEIGHT - 28, { align: 'center', color: '#f1f7ff', font: '800 20px "Space Grotesk", sans-serif' });
    }
  };
};

const createSoccerGame = () => {
  const resetPositions = score => ({
    score,
    timer: 90,
    goalFlash: 0,
    ball: { x: WIDTH / 2, y: HEIGHT / 2, vx: 0, vy: 0, radius: 14 },
    players: [
      { id: 'p1', team: 'A', x: 190, y: 210, vx: 0, vy: 0, radius: 22, color: '#48c7ff', label: 'A1' },
      { id: 'p4', team: 'A', x: 190, y: 390, vx: 0, vy: 0, radius: 22, color: '#8af0da', label: 'A2' },
      { id: 'p2', team: 'B', x: WIDTH - 190, y: 210, vx: 0, vy: 0, radius: 22, color: '#ff8464', label: 'B1' },
      { id: 'p3', team: 'B', x: WIDTH - 190, y: 390, vx: 0, vy: 0, radius: 22, color: '#ffd166', label: 'B2' }
    ]
  });

  return {
    meta: {
      title: 'Robot Soccer 2v2',
      controls: [
        'Captain A: `W A S D` move, `F` kick',
        'Captain B: arrow keys move, `Enter` kick',
        'Wingmates use assist AI to keep 2v2 flow readable on one screen'
      ]
    },
    createState() {
      return resetPositions({ A: 0, B: 0 });
    },
    update(state, dt, inputState) {
      state.timer = Math.max(0, state.timer - dt);
      state.goalFlash = Math.max(0, state.goalFlash - dt);

      state.players.forEach(player => {
        const input = player.id === 'p3' || player.id === 'p4'
          ? getSoccerAiInput(player, state)
          : getPlayerInput(inputState.keys, controls[player.id]);
        applyMovement(player, input, 700, dt);
        player.x = clamp(player.x + player.vx * dt, 58, WIDTH - 58);
        player.y = clamp(player.y + player.vy * dt, 70, HEIGHT - 70);
        player.vx *= 0.94;
        player.vy *= 0.94;

        const ballGap = distance(player, state.ball);
        if (ballGap < player.radius + state.ball.radius + 8) {
          const toBall = normalize({ x: state.ball.x - player.x, y: state.ball.y - player.y });
          state.ball.vx += toBall.x * 320 * dt;
          state.ball.vy += toBall.y * 320 * dt;

          if (input.action) {
            state.ball.vx += toBall.x * 880 * dt;
            state.ball.vy += toBall.y * 880 * dt;
          }
        }
      });

      state.ball.x += state.ball.vx * dt;
      state.ball.y += state.ball.vy * dt;
      state.ball.vx *= 0.992;
      state.ball.vy *= 0.992;

      if (state.ball.y < 46 || state.ball.y > HEIGHT - 46) {
        state.ball.vy *= -0.94;
        state.ball.y = clamp(state.ball.y, 46, HEIGHT - 46);
      }

      const goalTop = HEIGHT / 2 - 82;
      const goalBottom = HEIGHT / 2 + 82;
      const ballInGoalLane = state.ball.y > goalTop && state.ball.y < goalBottom;

      if (state.ball.x < 18 && ballInGoalLane) {
        state.score.B += 1;
        Object.assign(state, resetPositions(state.score));
        state.goalFlash = 1.25;
      } else if (state.ball.x > WIDTH - 18 && ballInGoalLane) {
        state.score.A += 1;
        Object.assign(state, resetPositions(state.score));
        state.goalFlash = 1.25;
      } else if (state.ball.x < 28 || state.ball.x > WIDTH - 28) {
        state.ball.vx *= -0.96;
        state.ball.x = clamp(state.ball.x, 28, WIDTH - 28);
      }
    },
    render(ctx, state) {
      fillBackground(ctx, '#0b3a2c');
      ctx.save();
      ctx.fillStyle = 'rgba(38, 119, 86, 0.86)';
      roundRect(ctx, 28, 28, WIDTH - 56, HEIGHT - 56, 24);
      ctx.fill();
      ctx.strokeStyle = 'rgba(217, 247, 227, 0.88)';
      ctx.lineWidth = 4;
      roundRect(ctx, 52, 52, WIDTH - 104, HEIGHT - 104, 22);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(WIDTH / 2, 52);
      ctx.lineTo(WIDTH / 2, HEIGHT - 52);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(WIDTH / 2, HEIGHT / 2, 72, 0, TAU);
      ctx.stroke();
      ctx.fillRect(52, HEIGHT / 2 - 82, 22, 164);
      ctx.fillRect(WIDTH - 74, HEIGHT / 2 - 82, 22, 164);
      ctx.restore();

      state.players.forEach(player => {
        drawRobot(ctx, player);
        drawHudText(ctx, player.label, player.x, player.y - 34, { align: 'center', font: '800 13px Sora, sans-serif' });
      });

      ctx.save();
      ctx.fillStyle = '#f8fbff';
      ctx.shadowColor = '#ffffff88';
      ctx.shadowBlur = 22;
      ctx.beginPath();
      ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, TAU);
      ctx.fill();
      ctx.restore();

      drawBadge(ctx, 26, 24, 210, 'Alliance A', `${state.score.A}`, '#7ae7ff');
      drawBadge(ctx, 250, 24, 210, 'Clock', `${Math.ceil(state.timer)}s`, '#dff7e5');
      drawBadge(ctx, 474, 24, 210, 'Alliance B', `${state.score.B}`, '#ffd3b8');
      drawBadge(ctx, 698, 24, 236, 'Mode', 'Turbo 2v2', '#ffd166');
      if (state.goalFlash > 0) {
        drawHudText(ctx, 'GOAL!', WIDTH / 2, 94, { align: 'center', color: '#fff3c1', font: '900 44px "Space Grotesk", sans-serif' });
      }
    }
  };
};

const createBuildBattleGame = () => {
  const partTypes = [
    { type: 'core', color: '#7fd9ff' },
    { type: 'arm', color: '#ffd166' },
    { type: 'sensor', color: '#7df0ba' },
    { type: 'wheel', color: '#ff8d6d' }
  ];
  const recipes = [
    ['core', 'wheel', 'arm'],
    ['core', 'sensor', 'arm'],
    ['core', 'wheel', 'sensor']
  ];

  const createPart = type => ({
    type,
    color: partTypes.find(part => part.type === type)?.color || '#ffffff',
    x: 230 + Math.random() * 500,
    y: 100 + Math.random() * 380,
    radius: 12
  });

  const nextRecipe = index => recipes[index % recipes.length];

  return {
    meta: {
      title: 'Bot Build Battle',
      controls: [
        'P1: `W A S D` move, `F` deliver build',
        'P2: arrow keys move, `Enter` deliver build'
      ]
    },
    createState() {
      return {
        timer: 75,
        score: { p1: 0, p2: 0 },
        players: [
          { id: 'p1', name: 'Assembler One', x: 120, y: HEIGHT / 2, vx: 0, vy: 0, radius: 20, color: '#4fd1ff', inventory: [], recipeIndex: 0 },
          { id: 'p2', name: 'Forge Rival', x: WIDTH - 120, y: HEIGHT / 2, vx: 0, vy: 0, radius: 20, color: '#ff8d6d', inventory: [], recipeIndex: 1 }
        ],
        parts: Array.from({ length: 10 }, (_, index) => createPart(partTypes[index % partTypes.length].type)),
        announcement: 'Collect the recipe parts, then deliver at your bay.'
      };
    },
    update(state, dt, inputState) {
      state.timer = Math.max(0, state.timer - dt);

      state.players.forEach(player => {
        const input = getPlayerInput(inputState.keys, controls[player.id]);
        applyMovement(player, input, 610, dt);
        player.x = clamp(player.x + player.vx * dt, 48, WIDTH - 48);
        player.y = clamp(player.y + player.vy * dt, 48, HEIGHT - 48);
        player.vx *= 0.92;
        player.vy *= 0.92;

        state.parts = state.parts.filter(part => {
          if (distance(player, part) < player.radius + part.radius + 2 && player.inventory.length < 3) {
            player.inventory.push(part.type);
            return false;
          }
          return true;
        });

        const homeEdge = player.id === 'p1' ? player.x < 118 : player.x > WIDTH - 118;
        const recipe = nextRecipe(player.recipeIndex);
        const exactMatch = recipe.every((type, index) => player.inventory[index] === type);
        if (input.action && homeEdge && exactMatch) {
          state.score[player.id] += 1;
          player.inventory = [];
          player.recipeIndex += 1;
          state.announcement = `${player.name} completed a build.`;
        }
      });

      while (state.parts.length < 10) {
        const type = partTypes[Math.floor(Math.random() * partTypes.length)].type;
        state.parts.push(createPart(type));
      }
    },
    render(ctx, state) {
      fillBackground(ctx, '#37220f');
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      roundRect(ctx, 38, 38, WIDTH - 76, HEIGHT - 76, 28);
      ctx.fill();
      ctx.fillStyle = 'rgba(79, 209, 255, 0.18)';
      roundRect(ctx, 52, 162, 96, 276, 22);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 141, 109, 0.18)';
      roundRect(ctx, WIDTH - 148, 162, 96, 276, 22);
      ctx.fill();
      ctx.restore();

      state.parts.forEach(part => {
        ctx.save();
        ctx.fillStyle = part.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = `${part.color}88`;
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.radius, 0, TAU);
        ctx.fill();
        ctx.restore();
        drawHudText(ctx, part.type.toUpperCase(), part.x, part.y - 16, { align: 'center', font: '800 10px "IBM Plex Mono", monospace' });
      });

      state.players.forEach(player => {
        drawRobot(ctx, player);
        const recipe = nextRecipe(player.recipeIndex);
        const inventoryText = player.inventory.join(' > ') || 'empty';
        drawHudText(ctx, `${player.name}: ${inventoryText}`, player.id === 'p1' ? 54 : WIDTH - 54, 138, {
          align: player.id === 'p1' ? 'left' : 'right',
          color: player.color,
          font: '800 13px "IBM Plex Mono", monospace'
        });
        drawHudText(ctx, `Target: ${recipe.join(' > ')}`, player.id === 'p1' ? 54 : WIDTH - 54, 158, {
          align: player.id === 'p1' ? 'left' : 'right',
          color: '#eef5ff',
          font: '700 12px "IBM Plex Mono", monospace'
        });
      });

      drawBadge(ctx, 26, 24, 210, 'Assembler One', `${state.score.p1}`, '#7ae7ff');
      drawBadge(ctx, 250, 24, 210, 'Clock', `${Math.ceil(state.timer)}s`, '#ffe7cf');
      drawBadge(ctx, 474, 24, 210, 'Forge Rival', `${state.score.p2}`, '#ffb8a4');
      drawBadge(ctx, 698, 24, 236, 'Factory Floor', 'Recipe race', '#ffd166');
      drawHudText(ctx, state.announcement, WIDTH / 2, HEIGHT - 28, { align: 'center', color: '#fff4dc', font: '800 20px "Space Grotesk", sans-serif' });
    }
  };
};

const definitions = {
  'arena-knockout': createArenaGame,
  'robot-soccer': createSoccerGame,
  'bot-build-battle': createBuildBattleGame
};

export const GAME_WORLD = { width: WIDTH, height: HEIGHT };

export const createArcadeSession = gameId => {
  const factory = definitions[gameId] || definitions['arena-knockout'];
  const definition = factory();
  return {
    definition,
    state: definition.createState()
  };
};

export const renderArcadeFrame = (ctx, session, dpr) => {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  session.definition.render(ctx, session.state);
};

export const tickArcadeSession = (session, dt) => {
  session.definition.update(session.state, clamp(dt, 0, 0.032), { keys: session.input.keys });
};
