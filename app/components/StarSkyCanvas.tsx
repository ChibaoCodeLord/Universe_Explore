"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  phase: number;
  color: string;
};

type Meteor = {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  active: boolean;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
};

type StarSkyCanvasProps = {
  accentColor?: string;
  density?: "normal" | "dense";
};

const STAR_COLORS = [
  "#ffffff",
  "#fbf7ec",
  "#9ecde0",
  "#f6d190",
  "#ef9a78",
  "#d9b46f",
  "#b7a6dd",
];

export default function StarSkyCanvas({
  accentColor = "#e77459",
  density = "normal",
}: StarSkyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const accentRef = useRef(accentColor);

  useEffect(() => {
    accentRef.current = accentColor;
  }, [accentColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let lastFrameTime = Number.NEGATIVE_INFINITY;
    let documentVisible = !document.hidden;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    const handleVisibilityChange = () => {
      documentVisible = !document.hidden;
      lastFrameTime = Number.NEGATIVE_INFINITY;
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const stars: Star[] = [];

    const initStars = () => {
      stars.length = 0;
      const starCount = density === "dense"
        ? Math.floor((width * height) / 4500)
        : Math.floor((width * height) / 7500);
      for (let i = 0; i < starCount; i++) {
        const isBright = Math.random() < 0.12;
        const color = isBright
          ? STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]
          : "#ffffff";

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: isBright ? Math.random() * 2.2 + 1.2 : Math.random() * 1.2 + 0.5,
          baseAlpha: isBright ? Math.random() * 0.5 + 0.5 : Math.random() * 0.4 + 0.2,
          alpha: Math.random(),
          twinkleSpeed: Math.random() * 0.03 + 0.008,
          phase: Math.random() * Math.PI * 2,
          color,
        });
      }
    };

    initStars();

    // Meteors
    const meteors: Meteor[] = [];
    const createMeteor = () => {
      if (meteors.length >= 2 || Math.random() > 0.035) return;
      meteors.push({
        x: Math.random() * width * 0.8 + width * 0.1,
        y: Math.random() * (height * 0.4),
        length: Math.random() * 120 + 80,
        speed: Math.random() * 9 + 12,
        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
        alpha: 1,
        active: true,
      });
    };

    // Cursor Stardust Particles
    const particles: Particle[] = [];
    let mousePos = { x: -100, y: -100 };
    let lastMousePos = { x: -100, y: -100 };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos = { x: e.clientX, y: e.clientY };
      const dist = Math.hypot(mousePos.x - lastMousePos.x, mousePos.y - lastMousePos.y);
      
      if (dist > 15 && particles.length < 35) {
        lastMousePos = { ...mousePos };
        for (let i = 0; i < 2; i++) {
          particles.push({
            x: mousePos.x + (Math.random() * 12 - 6),
            y: mousePos.y + (Math.random() * 12 - 6),
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8 - 0.4,
            life: 1,
            maxLife: Math.random() * 40 + 30,
            size: Math.random() * 2 + 1,
            color: accentRef.current,
          });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const render = (frameTime = 0) => {
      animId = requestAnimationFrame(render);

      if (!documentVisible) return;

      const frameInterval = reduceMotion.matches
        ? Number.POSITIVE_INFINITY
        : 1000 / 30;
      if (frameTime - lastFrameTime < frameInterval) return;
      lastFrameTime = frameTime;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Subtle Nebula Glows
      const nebula1 = ctx.createRadialGradient(
        width * 0.25,
        height * 0.25,
        20,
        width * 0.25,
        height * 0.25,
        width * 0.45
      );
      nebula1.addColorStop(0, `${accentRef.current}18`);
      nebula1.addColorStop(0.5, `${accentRef.current}08`);
      nebula1.addColorStop(1, "transparent");
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, width, height);

      const nebula2 = ctx.createRadialGradient(
        width * 0.78,
        height * 0.65,
        50,
        width * 0.78,
        height * 0.65,
        width * 0.5
      );
      nebula2.addColorStop(0, "rgba(85, 95, 200, 0.12)");
      nebula2.addColorStop(0.6, "rgba(45, 60, 150, 0.04)");
      nebula2.addColorStop(1, "transparent");
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Twinkling Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.phase += star.twinkleSpeed;
        const currentAlpha = star.baseAlpha + Math.sin(star.phase) * (star.baseAlpha * 0.65);

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
        ctx.fillStyle = star.color;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = star.size > 2 ? 8 : 2;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Cross diffraction spikes for brightest stars
        if (star.size > 2.2 && currentAlpha > 0.7) {
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(star.x - star.size * 3, star.y);
          ctx.lineTo(star.x + star.size * 3, star.y);
          ctx.moveTo(star.x, star.y - star.size * 3);
          ctx.lineTo(star.x, star.y + star.size * 3);
          ctx.stroke();
        }

        ctx.restore();
      }

      // 3. Draw Meteors
      if (Math.random() < 0.008) {
        createMeteor();
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        const dx = Math.cos(m.angle) * m.speed;
        const dy = Math.sin(m.angle) * m.speed;

        m.x += dx;
        m.y += dy;
        m.alpha -= 0.015;

        if (m.alpha <= 0 || m.x > width + 100 || m.y > height + 100) {
          meteors.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = m.alpha;
        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(0.7, `${accentRef.current}88`);
        grad.addColorStop(1, "#ffffff");

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.lineCap = "round";
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(m.x, m.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.restore();
      }

      // 4. Draw Cursor Stardust Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1 / p.maxLife;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.life * 0.8;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className="constellation-canvas-sky"
      aria-hidden="true"
    />
  );
}
