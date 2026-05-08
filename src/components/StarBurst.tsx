import { useEffect, useState } from 'react';

const COLORS = ['#FF4B4B', '#4B9CFF', '#FFD84B', '#4BE07A', '#FF9B4B', '#B44BFF', '#FF7EB3'];
const SYMBOLS = ['⭐', '🌟', '✨', '💫', '🎉', '🎊', '❤️'];

interface StarBurstProps {
  show: boolean;
  onDone?: () => void;
}

export default function StarBurst({ show, onDone }: StarBurstProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; symbol: string; color: string; delay: number }>>([]);

  useEffect(() => {
    if (!show) {
      setParticles([]);
      return;
    }

    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
      symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.3,
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
      onDone?.();
    }, 1500);
    return () => clearTimeout(timer);
  }, [show]);

  if (!show || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute text-4xl animate-confetti"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            color: p.color,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}
