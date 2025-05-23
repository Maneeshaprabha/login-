import React, { useEffect, useRef, useState } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  originalX: number;
  originalY: number;
};

type Connection = {
  from: number;
  to: number;
  distance: number;
};

const ParticleNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particles = useRef<Particle[]>([]);
  const connections = useRef<Connection[]>([]);
  const animationFrameRef = useRef<number>();
  const [showContent, setShowContent] = useState(false);
  const mouse = useRef({ x: 0, y: 0, moved: false });

  const getRandomColor = () => {
    const hue = Math.random() * 60 + 220;
    const saturation = Math.random() * 30 + 70;
    const lightness = Math.random() * 20 + 50;
    return `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`;
  };

  const updateConnections = () => {
    const newConnections: Connection[] = [];
    for (let i = 0; i < particles.current.length; i++) {
      for (let j = i + 1; j < particles.current.length; j++) {
        const dx = particles.current[i].x - particles.current[j].x;
        const dy = particles.current[i].y - particles.current[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          newConnections.push({ from: i, to: j, distance });
        }
      }
    }
    connections.current = newConnections;
  };

 const animate = () => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.current.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

      if (mouse.current.moved) {
        const dx = mouse.current.x - particle.x;
        const dy = mouse.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const magneticRadius = 200;

        if (distance < magneticRadius) {
          const force = 0.9 * (1 - distance / magneticRadius);
          const angle = Math.atan2(dy, dx);
          particle.vx += Math.cos(angle) * force * 0.2;
          particle.vy += Math.sin(angle) * force * 0.2;

          const speed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2);
          const maxSpeed = 3;
          if (speed > maxSpeed) {
            particle.vx = (particle.vx / speed) * maxSpeed;
            particle.vy = (particle.vy / speed) * maxSpeed;
          }
        } else {
          const returnForce = 0.01;
          particle.vx += (particle.originalX - particle.x) * returnForce;
          particle.vy += (particle.originalY - particle.y) * returnForce;
          particle.vx *= 0.98;
          particle.vy *= 0.98;
        }
      }
    });

    ctx.lineWidth = 0.3;
    connections.current.forEach((conn) => {
      const p1 = particles.current[conn.from];
      const p2 = particles.current[conn.to];
      const opacity = 1 - conn.distance / 150;
      if (opacity > 0) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
        ctx.stroke();
      }
    });

    particles.current.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    if (Math.random() < 0.05) updateConnections();

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const count = Math.floor((canvas.width * canvas.height) / 8000);
    particles.current = Array.from({ length: count }).map(() => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2.5 + 1,
        color: getRandomColor(),
        originalX: x,
        originalY: y,
      };
    });

    updateConnections();
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY, moved: true };
    };

    window.addEventListener('mousemove', handleMouseMove);
   window.addEventListener('resize', () => window.location.reload());


    setTimeout(() => setShowContent(true), 500);

    return () => {
      cancelAnimationFrame(animationFrameRef.current!);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      <div className="relative z-10 flex items-center justify-center h-full">
        {showContent && (
          <div className="max-w-md bg-black/60 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
            <p className="text-white text-xl font-medium mb-4">
              React is crazy awesome! We should create every new project with React!
            </p>
            <div className="flex items-center">
              <div className="h-10 w-10 mr-3 border-2 border-gray-700 rounded-full overflow-hidden">
                <img
                  src="../public/black.jpg"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-white text-sm font-medium">@danielkellyio</p>
                <p className="text-gray-400 text-xs">Developer</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticleNetwork;
