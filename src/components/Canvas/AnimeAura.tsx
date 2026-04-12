import { motion } from 'framer-motion';
import { useMemo } from 'react';

// Drifting particles + gradient aura behind the canvas — pure atmosphere.
export default function AnimeAura() {
  const particles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      startX: Math.random() * 100,
      startY: 100 + Math.random() * 20,
      duration: 18 + Math.random() * 14,
      delay: Math.random() * 18,
      size: 2 + Math.random() * 4,
      color: ['#ff00e5', '#00f5ff', '#ffd700', '#ff6b00', '#00ff88'][i % 5],
    })), []);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 0,
    }}>
      {/* Radial aura */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 30% 40%, rgba(0,245,255,0.06), transparent 60%)',
            'radial-gradient(circle at 70% 60%, rgba(255,0,229,0.06), transparent 60%)',
            'radial-gradient(circle at 40% 70%, rgba(255,215,0,0.06), transparent 60%)',
            'radial-gradient(circle at 30% 40%, rgba(0,245,255,0.06), transparent 60%)',
          ],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          inset: 0,
        }}
      />

      {/* Rising particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: '100vh', x: `${p.startX}vw`, opacity: 0 }}
          animate={{
            y: '-10vh',
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            filter: 'blur(0.5px)',
          }}
        />
      ))}
    </div>
  );
}
