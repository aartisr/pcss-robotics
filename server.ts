import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { GameManager, Alliance } from './server/gameEngine';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = 3000;

  app.use(express.json());

  const gameManager = GameManager.getInstance();

  // API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.get('/api/arena/rooms', (req, res) => {
    const roomsInfo = Array.from(gameManager.rooms.entries()).map(([id, room]) => ({
      id,
      playerCount: room.players.size,
      matchStatus: room.matchStatus,
      scores: room.scores
    }));
    res.json({ rooms: roomsInfo });
  });

  // WebSocket Server attached to same HTTP Server
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket, req) => {
    // Parse query params: ?room=XYZ&name=ABC&alliance=blue
    const url = new URL(req.url || '', `http://${req.headers.host || 'localhost:3000'}`);
    const roomId = url.searchParams.get('room') || 'prime-arena';
    const rawName = url.searchParams.get('name') || '';
    const allianceParam = (url.searchParams.get('alliance') as Alliance) || 'blue';
    const playerId = `p_${Math.random().toString(36).substring(2, 8)}`;

    const room = gameManager.getOrCreateRoom(roomId);
    const bot = room.addPlayer(playerId, rawName, allianceParam, ws);

    // Send welcome packet with initial room state and player ID
    ws.send(
      JSON.stringify({
        type: 'init',
        playerId,
        playerBot: bot,
        roomId: room.id,
        chatHistory: room.chatHistory,
        matchStatus: room.matchStatus,
        matchTimer: room.matchTimer
      })
    );

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());

        switch (data.type) {
          case 'input':
            room.handleInput(playerId, data);
            break;

          case 'start_match':
            room.triggerMatchStart();
            break;

          case 'reset_match':
            room.resetField();
            room.broadcastState();
            break;

          case 'toggle_ai':
            room.toggleAiOpponent();
            break;

          case 'chat':
            if (data.text) {
              const currentBot = room.players.get(playerId)?.bot;
              room.addChatMessage(
                currentBot?.name || 'Pilot',
                currentBot?.alliance || 'blue',
                String(data.text)
              );
            }
            break;

          case 'ping':
            ws.send(JSON.stringify({ type: 'pong', clientTime: data.clientTime, serverTime: Date.now() }));
            break;

          default:
            break;
        }
      } catch (err) {
        console.error('Error handling WebSocket message:', err);
      }
    });

    ws.on('close', () => {
      room.removePlayer(playerId);
      room.broadcastState();
    });

    ws.on('error', (err) => {
      console.error(`WebSocket error on player ${playerId}:`, err);
    });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT} with WebSocket at ws://0.0.0.0:${PORT}/ws`);
  });
}

startServer();
