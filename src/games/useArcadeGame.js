import { useEffect, useRef, useState } from 'react';
import { createArcadeSession, GAME_WORLD, renderArcadeFrame } from './arcadeEngine';

const normalizeKey = key => (key ? key.toLowerCase() : '');

export const useArcadeGame = gameId => {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const sessionRef = useRef({
    ...createArcadeSession(gameId),
    input: { keys: {} }
  });
  const [meta, setMeta] = useState(sessionRef.current.definition.meta);

  useEffect(() => {
    sessionRef.current = {
      ...createArcadeSession(gameId),
      input: { keys: {} }
    };
    setMeta(sessionRef.current.definition.meta);
  }, [gameId]);

  useEffect(() => {
    const handleKeyDown = event => {
      const key = normalizeKey(event.key);
      sessionRef.current.input.keys[key] = true;
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
        event.preventDefault();
      }
    };

    const handleKeyUp = event => {
      const key = normalizeKey(event.key);
      sessionRef.current.input.keys[key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = GAME_WORLD.width * dpr;
    canvas.height = GAME_WORLD.height * dpr;
    canvas.style.aspectRatio = `${GAME_WORLD.width} / ${GAME_WORLD.height}`;

    const loop = timestamp => {
      const previous = lastTimeRef.current || timestamp;
      const dt = Math.min((timestamp - previous) / 1000, 0.032);
      lastTimeRef.current = timestamp;
      sessionRef.current.definition.update(sessionRef.current.state, dt, sessionRef.current.input);
      renderArcadeFrame(context, sessionRef.current, dpr);
      frameRef.current = window.requestAnimationFrame(loop);
    };

    frameRef.current = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      lastTimeRef.current = 0;
    };
  }, [gameId]);

  return {
    canvasRef,
    meta
  };
};
