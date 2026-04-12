import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    title: 'Welcome to the Dojo!',
    text: 'Dragitect is your personal system design training ground. Build architectures by dragging components and connecting them.',
    icon: '⛩️',
    color: '#00f5ff',
  },
  {
    title: 'Drag Components',
    text: 'Pick components from the left sidebar and drag them onto the canvas. Each component represents a building block of distributed systems.',
    icon: '🧩',
    color: '#3b82f6',
  },
  {
    title: 'Create Connections',
    text: 'Hover over a component to reveal connection handles (dots). Click a handle, then click another component to draw a connection.',
    icon: '🔗',
    color: '#ff00e5',
  },
  {
    title: 'Inspect & Configure',
    text: 'Click any component or connection to view its properties in the right panel. Learn system design tips from Sensei!',
    icon: '🔍',
    color: '#ffd700',
  },
  {
    title: 'Try Challenges',
    text: 'Test your skills with design challenges. Complete objectives to earn XP and level up your ninja rank!',
    icon: '⚔️',
    color: '#ff3366',
  },
  {
    title: 'Save & Export',
    text: 'Save your designs, load templates, export as JSON, and simulate request flows through your architecture.',
    icon: '💾',
    color: '#00ff88',
  },
  {
    title: 'Ready to Begin!',
    text: 'Your journey as a System Design Architect starts now. Design wisely, young ninja!',
    icon: '🔥',
    color: '#ff6b00',
  },
];

export default function TutorialOverlay({ isOpen, onClose }: Props) {
  const [step, setStep] = useState(0);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              zIndex: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              style={{
                width: 440,
                maxWidth: '90vw',
                background: 'linear-gradient(135deg, #0f0f2a, #0a0a1f)',
                border: `1px solid ${current.color}33`,
                borderRadius: 20,
                padding: 36,
                textAlign: 'center',
                boxShadow: `0 0 80px ${current.color}15, 0 20px 60px rgba(0,0,0,0.5)`,
              }}
            >
              {/* Icon */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ fontSize: 48, marginBottom: 20 }}
              >
                {current.icon}
              </motion.div>

              {/* Title */}
              <h3 style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: current.color,
                marginBottom: 12,
              }}>
                {current.title}
              </h3>

              {/* Text */}
              <p style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: 15,
                color: '#9999bb',
                lineHeight: 1.6,
                marginBottom: 28,
              }}>
                {current.text}
              </p>

              {/* Progress dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
                {STEPS.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      background: i === step ? current.color : 'rgba(255,255,255,0.1)',
                      scale: i === step ? 1.3 : 1,
                    }}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      cursor: 'pointer',
                    }}
                    onClick={() => setStep(i)}
                  />
                ))}
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                {step > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(s => s - 1)}
                    style={{
                      padding: '10px 24px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 10,
                      color: '#8888aa',
                      fontFamily: "'Exo 2', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    BACK
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${current.color}40` }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => isLast ? onClose() : setStep(s => s + 1)}
                  style={{
                    padding: '10px 32px',
                    background: `${current.color}20`,
                    border: `1px solid ${current.color}40`,
                    borderRadius: 10,
                    color: current.color,
                    fontFamily: "'Exo 2', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                  }}
                >
                  {isLast ? 'START DESIGNING' : 'NEXT'}
                </motion.button>
                {!isLast && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    style={{
                      padding: '10px 16px',
                      background: 'none',
                      border: 'none',
                      color: '#555577',
                      fontFamily: "'Exo 2', sans-serif",
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    SKIP
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
