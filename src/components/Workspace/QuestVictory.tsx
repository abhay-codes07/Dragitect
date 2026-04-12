import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  questTitle: string | null;
}

export default function QuestVictory({ questTitle }: Props) {
  return (
    <AnimatePresence>
      {questTitle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.25), rgba(0,0,0,0.7))',
            backdropFilter: 'blur(4px)',
          }}
        >
          {/* Radial burst lines */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: [0, 1, 0.6], opacity: [0, 0.8, 0] }}
              transition={{ duration: 1.2, delay: i * 0.04, repeat: Infinity, repeatDelay: 1 }}
              style={{
                position: 'absolute',
                width: 6,
                height: 220,
                top: '50%',
                left: '50%',
                background: 'linear-gradient(to bottom, transparent, #ffd700, transparent)',
                transformOrigin: 'center top',
                transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-260px)`,
                filter: 'blur(1px)',
              }}
            />
          ))}

          {/* Sparkles */}
          {[...Array(30)].map((_, i) => {
            const angle = (i / 30) * Math.PI * 2;
            const dist = 150 + Math.random() * 200;
            return (
              <motion.div
                key={`sp-${i}`}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{
                  x: Math.cos(angle) * dist,
                  y: Math.sin(angle) * dist,
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{ duration: 1.5, delay: 0.2 + Math.random() * 0.5 }}
                style={{
                  position: 'absolute',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: ['#ffd700', '#ff6b00', '#ff00e5', '#00f5ff'][i % 4],
                  boxShadow: '0 0 12px currentColor',
                }}
              />
            );
          })}

          {/* Main banner */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: [0, 1.15, 1], rotate: [-20, 5, 0] }}
            transition={{ type: 'spring', stiffness: 160, damping: 14 }}
            style={{
              padding: '36px 60px',
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 107, 0, 0.2))',
              border: '2px solid rgba(255, 215, 0, 0.6)',
              borderRadius: 20,
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              boxShadow: '0 0 80px rgba(255, 215, 0, 0.6)',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 14,
                letterSpacing: '0.4em',
                color: '#ffd700',
                marginBottom: 8,
              }}
            >
              QUEST COMPLETE
            </motion.div>
            <div style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 36,
              fontWeight: 900,
              background: 'linear-gradient(90deg, #ffd700, #ff6b00, #ff00e5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.08em',
              textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
            }}>
              {questTitle}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
