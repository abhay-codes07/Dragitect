import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleField from './ParticleField';
import EnergyRing from './EnergyRing';
import AnimeCharacter from './AnimeCharacter';

interface Props {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: Props) {
  const [isExiting, setIsExiting] = useState(false);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(onEnter, 1200);
  };

  const title = 'DRAGITECT';
  const subtitle = 'SYSTEM DESIGN SENSEI';

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1 }}
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(ellipse at center, #12122a 0%, #0a0a1a 70%)',
            overflow: 'hidden',
            zIndex: 100,
          }}
        >
          <ParticleField />
          <EnergyRing />

          {/* Scan lines overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
            pointerEvents: 'none',
            zIndex: 1,
          }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            {/* Character */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 1.2, delay: 0.2 }}
              style={{ marginBottom: 20 }}
            >
              <AnimeCharacter scale={0.9} />
            </motion.div>

            {/* Title with letter animation */}
            <motion.h1
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 'clamp(36px, 6vw, 72px)',
                fontWeight: 900,
                letterSpacing: '0.15em',
                marginBottom: 8,
                display: 'flex',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              {title.split('').map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 50, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.8 + i * 0.08,
                    type: 'spring',
                    stiffness: 200,
                  }}
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #00f5ff 0%, #ff00e5 50%, #ffd700 100%)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'shimmer 3s linear infinite',
                    textShadow: 'none',
                    filter: 'drop-shadow(0 0 20px rgba(0, 245, 255, 0.3))',
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              style={{
                fontFamily: "'Exo 2', sans-serif",
                fontSize: 'clamp(14px, 2vw, 20px)',
                color: '#8888aa',
                letterSpacing: '0.3em',
                fontWeight: 300,
                marginBottom: 40,
              }}
            >
              {subtitle}
            </motion.p>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 1 }}
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: 'clamp(14px, 1.8vw, 18px)',
                color: '#6666aa',
                maxWidth: 500,
                margin: '0 auto 50px',
                lineHeight: 1.6,
              }}
            >
              Drag. Connect. Design systems like a true architect.
              <br />
              Your Sensei awaits.
            </motion.p>

            {/* Enter Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.6, type: 'spring', stiffness: 200 }}
              whileHover={{
                scale: 1.08,
                boxShadow: '0 0 40px rgba(0, 245, 255, 0.5), 0 0 80px rgba(0, 245, 255, 0.2)',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEnter}
              style={{
                position: 'relative',
                padding: '16px 60px',
                fontSize: 18,
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: '#00f5ff',
                background: 'transparent',
                border: '2px solid #00f5ff',
                borderRadius: 4,
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
              }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>ENTER DOJO</span>
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1), rgba(255, 0, 229, 0.1))',
                }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>

            {/* Power level text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 1 }}
              style={{
                marginTop: 30,
                display: 'flex',
                gap: 30,
                justifyContent: 'center',
                fontFamily: "'Exo 2', sans-serif",
                fontSize: 12,
                color: '#555577',
                letterSpacing: '0.15em',
              }}
            >
              <span>LEVEL: <span style={{ color: '#00ff88' }}>ARCHITECT</span></span>
              <span>POWER: <span style={{ color: '#ffd700' }}>9001</span></span>
              <span>MODE: <span style={{ color: '#ff00e5' }}>DESIGN</span></span>
            </motion.div>
          </div>

          {/* Corner decorations */}
          {(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const).map((corner) => {
            const isTop = corner.includes('top');
            const isLeft = corner.includes('Left');
            return (
              <motion.div
                key={corner}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 3.5 }}
                style={{
                  position: 'absolute',
                  [isTop ? 'top' : 'bottom']: 20,
                  [isLeft ? 'left' : 'right']: 20,
                  width: 40,
                  height: 40,
                  borderTop: isTop ? '2px solid #00f5ff' : 'none',
                  borderBottom: !isTop ? '2px solid #00f5ff' : 'none',
                  borderLeft: isLeft ? '2px solid #00f5ff' : 'none',
                  borderRight: !isLeft ? '2px solid #00f5ff' : 'none',
                }}
              />
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{
            opacity: 0,
            scale: 1.5,
            filter: 'blur(20px)',
          }}
          transition={{ duration: 1.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'radial-gradient(ellipse at center, #00f5ff22 0%, #0a0a1a 70%)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.span
            initial={{ scale: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 48,
              fontWeight: 900,
              color: '#00f5ff',
              textShadow: '0 0 40px rgba(0, 245, 255, 0.8)',
            }}
          >
            HAJIME!
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
