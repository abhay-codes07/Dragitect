import { motion } from 'framer-motion';
import { useMemo } from 'react';

// Anime-movie ambient layer: radial aura, rising energy embers,
// drifting sakura petals, parallax starfield, flickering lightning arcs.
export default function AnimeAura() {
  const embers = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      startX: Math.random() * 100,
      duration: 18 + Math.random() * 14,
      delay: Math.random() * 18,
      size: 2 + Math.random() * 4,
      color: ['#ff00e5', '#00f5ff', '#ffd700', '#ff6b00', '#00ff88', '#c084fc'][i % 6],
      drift: (Math.random() - 0.5) * 12,
    })), []);

  const petals = useMemo(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      startX: Math.random() * 100,
      startDelay: Math.random() * 25,
      duration: 22 + Math.random() * 18,
      size: 8 + Math.random() * 8,
      rotate: 180 + Math.random() * 540,
      drift: (Math.random() - 0.5) * 40,
      hue: 330 + Math.random() * 30,
    })), []);

  const stars = useMemo(() =>
    Array.from({ length: 70 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.6 + Math.random() * 1.8,
      twinkle: 2 + Math.random() * 4,
      delay: Math.random() * 5,
      depth: Math.random() < 0.5 ? 0.5 : 1,
    })), []);

  const bolts = useMemo(() =>
    Array.from({ length: 3 }, (_, i) => ({
      id: i,
      delay: i * 4 + Math.random() * 3,
      x: 15 + Math.random() * 70,
      y: 20 + Math.random() * 40,
    })), []);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 0,
    }}>
      {/* Parallax starfield */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {stars.map((s, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              borderRadius: '50%',
              background: '#fff',
              boxShadow: `0 0 ${s.size * 2}px rgba(255,255,255,0.6)`,
              opacity: s.depth * 0.7,
            }}
            animate={{ opacity: [s.depth * 0.1, s.depth * 0.8, s.depth * 0.1] }}
            transition={{ duration: s.twinkle, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Shifting radial aura */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 30% 40%, rgba(0,245,255,0.08), transparent 60%)',
            'radial-gradient(circle at 70% 60%, rgba(255,0,229,0.08), transparent 60%)',
            'radial-gradient(circle at 40% 70%, rgba(255,215,0,0.08), transparent 60%)',
            'radial-gradient(circle at 60% 30%, rgba(192,132,252,0.08), transparent 60%)',
            'radial-gradient(circle at 30% 40%, rgba(0,245,255,0.08), transparent 60%)',
          ],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', inset: 0 }}
      />

      {/* Horizon glow */}
      <motion.div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '40%',
          background: 'linear-gradient(180deg, transparent, rgba(255,0,229,0.04) 40%, rgba(0,245,255,0.06))',
          pointerEvents: 'none',
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Rising chakra embers */}
      {embers.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: '105vh', x: `calc(${p.startX}vw)`, opacity: 0 }}
          animate={{
            y: '-10vh',
            x: [`calc(${p.startX}vw)`, `calc(${p.startX}vw + ${p.drift}vw)`, `calc(${p.startX}vw)`],
            opacity: [0, 0.8, 0.8, 0],
            scale: [0.6, 1, 0.8],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
            x: { duration: p.duration / 2, repeat: Infinity, ease: 'easeInOut' },
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}, 0 0 ${p.size * 8}px ${p.color}`,
            filter: 'blur(0.5px)',
          }}
        />
      ))}

      {/* Drifting sakura petals */}
      {petals.map(p => (
        <motion.div
          key={`petal-${p.id}`}
          initial={{ y: '-8vh', x: `calc(${p.startX}vw)`, rotate: 0, opacity: 0 }}
          animate={{
            y: '108vh',
            x: [
              `calc(${p.startX}vw)`,
              `calc(${p.startX}vw + ${p.drift}vw)`,
              `calc(${p.startX}vw - ${p.drift / 2}vw)`,
              `calc(${p.startX}vw + ${p.drift}vw)`,
            ],
            rotate: p.rotate,
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.startDelay,
            repeat: Infinity,
            ease: 'linear',
            x: { duration: p.duration, repeat: Infinity, ease: 'easeInOut' },
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size * 0.6,
            borderRadius: '50% 10% 50% 10%',
            background: `radial-gradient(ellipse at 30% 30%, hsla(${p.hue}, 80%, 85%, 0.9), hsla(${p.hue}, 70%, 65%, 0.4))`,
            boxShadow: `0 0 8px hsla(${p.hue}, 80%, 80%, 0.5)`,
            transformOrigin: 'center',
          }}
        />
      ))}

      {/* Flickering lightning arcs */}
      {bolts.map(b => (
        <motion.svg
          key={`bolt-${b.id}`}
          style={{
            position: 'absolute',
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: 160,
            height: 160,
            pointerEvents: 'none',
            mixBlendMode: 'screen',
          }}
          viewBox="0 0 160 160"
          animate={{ opacity: [0, 0, 1, 0, 0] }}
          transition={{ duration: 1.2, delay: b.delay, repeat: Infinity, repeatDelay: 10 + Math.random() * 6, times: [0, 0.3, 0.4, 0.55, 1] }}
        >
          <defs>
            <filter id={`bolt-glow-${b.id}`}>
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>
          <path
            d="M 80 10 L 70 50 L 90 55 L 65 100 L 85 95 L 60 150"
            stroke="#9efcff"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            filter={`url(#bolt-glow-${b.id})`}
          />
          <path
            d="M 80 10 L 70 50 L 90 55 L 65 100 L 85 95 L 60 150"
            stroke="#ffffff"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
        </motion.svg>
      ))}

      {/* Scanning vignette */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.35) 100%)',
          pointerEvents: 'none',
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
