import React, { useEffect, useRef } from 'react';

export type CelestialAura = 'cyan' | 'violet' | 'gold';

interface CelestialStarfieldProps {
  aura: CelestialAura;
}

export const CelestialStarfield: React.FC<CelestialStarfieldProps> = ({ aura }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Check if user has requested reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number | null = null;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 150);
    };

    window.addEventListener('resize', handleResize);

    // Adaptive particle count based on screen size (preserves battery & GPU on mobile)
    const isMobile = window.innerWidth < 768;
    const starCount = isMobile ? 26 : 52;

    const stars: {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      speed: number;
      twinkleSpeed: number;
      color: string;
    }[] = [];

    const colorPalette = {
      cyan: ['#38bdf8', '#7dd3fc', '#bae6fd', '#ffffff', '#818cf8'],
      violet: ['#c084fc', '#e879f9', '#f0abfc', '#ffffff', '#a855f7'],
      gold: ['#fbbf24', '#fde68a', '#fef08a', '#ffffff', '#f59e0b']
    };

    const activePalette = colorPalette[aura] || colorPalette.cyan;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.4 + 0.6,
        alpha: Math.random() * 0.6 + 0.3,
        speed: Math.random() * 0.12 + 0.04,
        twinkleSpeed: Math.random() * 0.02 + 0.008,
        color: activePalette[Math.floor(Math.random() * activePalette.length)]
      });
    }

    let tick = 0;

    const drawNebulaAndStars = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint celestial nebulas with radial gradient
      const gradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.25,
        40,
        width * 0.5,
        height * 0.25,
        width * 0.55
      );

      if (aura === 'violet') {
        gradient.addColorStop(0, 'rgba(168, 85, 247, 0.08)');
        gradient.addColorStop(0.5, 'rgba(192, 132, 252, 0.02)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else if (aura === 'gold') {
        gradient.addColorStop(0, 'rgba(251, 191, 36, 0.07)');
        gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.02)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
        gradient.addColorStop(0.5, 'rgba(14, 165, 233, 0.02)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render twinkling starlight
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        if (!prefersReducedMotion) {
          star.y -= star.speed;
          if (star.y < 0) {
            star.y = height;
            star.x = Math.random() * width;
          }
        }

        const oscillatingAlpha = prefersReducedMotion
          ? star.alpha
          : star.alpha + Math.sin(tick * star.twinkleSpeed + i) * 0.25;
        const finalAlpha = Math.max(0.1, Math.min(1, oscillatingAlpha));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = finalAlpha;
        ctx.fill();

        // Cross glint on brightest stars
        if (!isMobile && star.radius > 1.3 && finalAlpha > 0.65) {
          ctx.strokeStyle = star.color;
          ctx.globalAlpha = finalAlpha * 0.35;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(star.x - star.radius * 2.2, star.y);
          ctx.lineTo(star.x + star.radius * 2.2, star.y);
          ctx.moveTo(star.x, star.y - star.radius * 2.2);
          ctx.lineTo(star.x, star.y + star.radius * 2.2);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1.0;
    };

    const render = () => {
      if (document.hidden) {
        // Stop CPU cycle when browser tab is inactive
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      tick += 1;
      drawNebulaAndStars();

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // If reduced motion is requested, render once and don't loop
    if (prefersReducedMotion) {
      drawNebulaAndStars();
    } else {
      render();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [aura]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-70 transition-opacity duration-1000"
      />
      {/* Heavenly Ethereal Horizon Glow */}
      <div 
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] blur-[140px] pointer-events-none transition-colors duration-1000 ${
          aura === 'violet' 
            ? 'bg-gradient-to-b from-purple-600/15 via-indigo-600/10 to-transparent' 
            : aura === 'gold' 
              ? 'bg-gradient-to-b from-amber-500/15 via-yellow-600/10 to-transparent' 
              : 'bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent'
        }`} 
      />
    </div>
  );
};
