import { useEffect, useRef } from 'react';

export default function AuthBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let lines = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create flowing lines
    const LINE_COUNT = 18;
    for (let i = 0; i < LINE_COUNT; i++) {
      lines.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: 80 + Math.random() * 200,
        speed: 0.2 + Math.random() * 0.6,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.003,
        opacity: 0.03 + Math.random() * 0.08,
        width: 0.5 + Math.random() * 1.5,
        drift: Math.random() * 0.3,
      });
    }

    // Floating particles
    const PARTICLE_COUNT = 40;
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 1 + Math.random() * 2,
        speed: 0.1 + Math.random() * 0.3,
        opacity: 0.05 + Math.random() * 0.15,
        drift: (Math.random() - 0.5) * 0.5,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw flowing lines
      lines.forEach((line) => {
        line.angle += line.rotSpeed;
        line.x += Math.cos(line.angle) * line.drift;
        line.y -= line.speed;

        if (line.y + line.length < 0) {
          line.y = canvas.height + line.length;
          line.x = Math.random() * canvas.width;
        }
        if (line.x < -100) line.x = canvas.width + 100;
        if (line.x > canvas.width + 100) line.x = -100;

        const endX = line.x + Math.cos(line.angle) * line.length;
        const endY = line.y + Math.sin(line.angle) * line.length;

        const grad = ctx.createLinearGradient(line.x, line.y, endX, endY);
        grad.addColorStop(0, `rgba(15, 207, 188, 0)`);
        grad.addColorStop(0.5, `rgba(15, 207, 188, ${line.opacity})`);
        grad.addColorStop(1, `rgba(15, 207, 188, 0)`);

        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = line.width;
        ctx.stroke();
      });

      // Draw particles
      particles.forEach((p) => {
        p.y -= p.speed;
        p.x += p.drift;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(15, 207, 188, ${p.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
