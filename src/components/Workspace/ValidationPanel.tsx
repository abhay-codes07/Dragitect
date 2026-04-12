import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CanvasNode, Connection } from '../../types';
import { validateDesign } from '../../utils/validation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  nodes: CanvasNode[];
  connections: Connection[];
}

const SEVERITY_COLORS = {
  error: '#ff3366',
  warning: '#ffd700',
  info: '#00f5ff',
};

const CATEGORY_COLORS = {
  scalability: '#00f5ff',
  reliability: '#00ff88',
  performance: '#ffd700',
  security: '#ff00e5',
};

function ScoreRing({ value, color, label, size = 60 }: { value: number; color: string; label: string; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div style={{
        position: 'relative',
        top: -(size / 2) - 8,
        fontFamily: "'Orbitron', sans-serif",
        fontSize: size > 60 ? 16 : 12,
        fontWeight: 700,
        color,
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: "'Exo 2', sans-serif",
        fontSize: 9,
        fontWeight: 600,
        color: '#555577',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginTop: -(size / 2) + 4,
      }}>
        {label}
      </div>
    </div>
  );
}

export default function ValidationPanel({ isOpen, onClose, nodes, connections }: Props) {
  const score = useMemo(() => validateDesign(nodes, connections), [nodes, connections]);

  const overallColor = score.overall >= 70 ? '#00ff88' : score.overall >= 40 ? '#ffd700' : '#ff3366';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 200,
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 520, maxWidth: '90vw', maxHeight: '85vh',
              background: 'linear-gradient(135deg, #0f0f2a, #0a0a1f)',
              border: '1px solid rgba(0, 255, 136, 0.15)',
              borderRadius: 16,
              overflow: 'hidden',
              zIndex: 201,
              boxShadow: '0 0 60px rgba(0, 255, 136, 0.1), 0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(0, 255, 136, 0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <motion.h2
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: 16, fontWeight: 700,
                    letterSpacing: '0.15em',
                    color: '#00ff88',
                  }}
                  animate={{ textShadow: ['0 0 10px rgba(0,255,136,0.3)', '0 0 20px rgba(0,255,136,0.5)', '0 0 10px rgba(0,255,136,0.3)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  DESIGN ANALYSIS
                </motion.h2>
                <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 13, color: '#555577' }}>
                  Architecture health check
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, color: '#ff3366' }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{ background: 'none', border: 'none', color: '#555577', fontSize: 20, cursor: 'pointer' }}
              >
                ✕
              </motion.button>
            </div>

            <div style={{ padding: 24, overflowY: 'auto', maxHeight: 'calc(85vh - 80px)' }}>
              {/* Overall score */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                <ScoreRing value={score.overall} color={overallColor} label="Overall" size={90} />
              </div>

              {/* Category scores */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 28 }}>
                {(Object.entries(score.categories) as [keyof typeof CATEGORY_COLORS, number][]).map(([key, val]) => (
                  <ScoreRing key={key} value={val} color={CATEGORY_COLORS[key]} label={key} />
                ))}
              </div>

              {/* Issues */}
              <div>
                <div style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.2em',
                  color: '#444466',
                  marginBottom: 10,
                }}>
                  FINDINGS ({score.issues.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {score.issues.map((issue, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 8,
                        background: `${SEVERITY_COLORS[issue.severity]}08`,
                        borderLeft: `3px solid ${SEVERITY_COLORS[issue.severity]}50`,
                      }}
                    >
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4,
                      }}>
                        <span style={{
                          fontFamily: "'Exo 2', sans-serif",
                          fontSize: 9, fontWeight: 700,
                          color: SEVERITY_COLORS[issue.severity],
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                        }}>
                          {issue.severity}
                        </span>
                        <span style={{
                          fontFamily: "'Rajdhani', sans-serif",
                          fontSize: 13, color: '#c0c0e0',
                        }}>
                          {issue.message}
                        </span>
                      </div>
                      <div style={{
                        fontFamily: "'Rajdhani', sans-serif",
                        fontSize: 11, color: '#7777aa',
                        paddingLeft: 40,
                      }}>
                        {issue.suggestion}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
