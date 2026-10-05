"use client";

import React, { useEffect, useRef } from "react";

interface ConfettiBurstProps {
  onComplete?: () => void;
}

export function ConfettiBurst({ onComplete }: ConfettiBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#10b981", "#06b6d4", "#f59e0b", "#8b5cf6", "#ec4899", "#3b82f6"];
    const particlesCount = 80;

    const particles = Array.from({ length: particlesCount }).map(() => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.8) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)]!,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
      gravity: 0.35,
    }));

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let activeCount = 0;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.015;

        if (p.opacity > 0) {
          activeCount++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (activeCount > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        if (onComplete) onComplete();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
}
