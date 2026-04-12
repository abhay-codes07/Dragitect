import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CanvasNode, Connection, Challenge, ChallengeState } from '../../types';
import { CHALLENGES } from '../../utils/challenges';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  challengeState: ChallengeState;
  nodes: CanvasNode[];
  connections: Connection[];
  onStartChallenge: (challenge: Challenge) => void;
  onCompleteChallenge: (id: string, xp: number) => void;
  onAbandonChallenge: () => void;
}

const DIFF_COLORS = {
  beginner: '#00ff88',
  intermediate: '#ffd700',
  advanced: '#ff3366',
};

export default function ChallengePanel({
  isOpen, onClose, challengeState, nodes, connections,
  onStartChallenge, onCompleteChallenge, onAbandonChallenge,
}: Props) {
  const [showHints, setShowHints] = useState(false);

  const active = challengeState.active;

  // Check objectives
  const objectiveStatus = useMemo(() => {
    if (!active) return [];
    return active.objectives.map(obj => ({
      ...obj,
      completed: obj.check(nodes, connections),
    }));
  }, [active, nodes, connections]);

  const allComplete = objectiveStatus.length > 0 && objectiveStatus.every(o => o.completed);

  // Auto-complete check
  useEffect(() => {
    if (allComplete && active && !challengeState.completed.includes(active.id)) {
      onCompleteChallenge(active.id, active.xpReward);
    }
  }, [allComplete, active, challengeState.completed, onCompleteChallenge]);

  // Timer
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!active || !challengeState.startTime) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - challengeState.startTime!) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [active, challengeState.startTime]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

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
              position: 'fixed',
              inset: 0,
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
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 620,
              maxWidth: '90vw',
              maxHeight: '85vh',
              background: 'linear-gradient(135deg, #0f0f2a, #0a0a1f)',
              border: '1px solid rgba(255, 0, 229, 0.15)',
              borderRadius: 16,
              overflow: 'hidden',
              zIndex: 201,
              boxShadow: '0 0 60px rgba(255, 0, 229, 0.1), 0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255, 0, 229, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <motion.h2
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    color: '#ff00e5',
                    marginBottom: 4,
                  }}
                  animate={{ textShadow: ['0 0 10px rgba(255,0,229,0.3)', '0 0 20px rgba(255,0,229,0.5)', '0 0 10px rgba(255,0,229,0.3)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {active ? 'ACTIVE CHALLENGE' : 'DESIGN CHALLENGES'}
                </motion.h2>
                <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 13, color: '#555577' }}>
                  {active ? `Time: ${formatTime(elapsed)}` : 'Test your system design skills'}
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

            <div style={{ padding: 20, overflowY: 'auto', maxHeight: 'calc(85vh - 80px)' }}>
              {active ? (
                // Active challenge view
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{
                    padding: 16,
                    borderRadius: 12,
                    background: 'rgba(255, 0, 229, 0.05)',
                    border: '1px solid rgba(255, 0, 229, 0.15)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{
                        fontFamily: "'Exo 2', sans-serif",
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#e0e0ff',
                      }}>
                        {active.title}
                      </span>
                      <span style={{
                        fontFamily: "'Exo 2', sans-serif",
                        fontSize: 10,
                        fontWeight: 600,
                        color: DIFF_COLORS[active.difficulty],
                        padding: '2px 8px',
                        borderRadius: 10,
                        background: `${DIFF_COLORS[active.difficulty]}15`,
                        border: `1px solid ${DIFF_COLORS[active.difficulty]}33`,
                        textTransform: 'uppercase',
                      }}>
                        {active.difficulty}
                      </span>
                    </div>
                    <p style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: 13,
                      color: '#8888aa',
                      lineHeight: 1.5,
                    }}>
                      {active.description}
                    </p>
                    <div style={{
                      marginTop: 8,
                      fontFamily: "'Exo 2', sans-serif",
                      fontSize: 11,
                      color: '#ffd700',
                    }}>
                      Reward: {active.xpReward} XP
                    </div>
                  </div>

                  {/* Objectives */}
                  <div>
                    <div style={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.2em',
                      color: '#444466',
                      marginBottom: 10,
                    }}>
                      OBJECTIVES
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {objectiveStatus.map((obj, i) => (
                        <motion.div
                          key={obj.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '8px 12px',
                            borderRadius: 6,
                            background: obj.completed ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${obj.completed ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255,255,255,0.05)'}`,
                          }}
                        >
                          <span style={{
                            fontSize: 14,
                            width: 20,
                            textAlign: 'center',
                          }}>
                            {obj.completed ? '✓' : '○'}
                          </span>
                          <span style={{
                            fontFamily: "'Rajdhani', sans-serif",
                            fontSize: 13,
                            color: obj.completed ? '#00ff88' : '#8888aa',
                            textDecoration: obj.completed ? 'line-through' : 'none',
                          }}>
                            {obj.description}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Hints toggle */}
                  <div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowHints(!showHints)}
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(139, 92, 246, 0.08)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: 6,
                        color: '#8b5cf6',
                        fontFamily: "'Exo 2', sans-serif",
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'center',
                      }}
                    >
                      {showHints ? 'HIDE HINTS' : 'SHOW HINTS'}
                    </motion.button>
                    <AnimatePresence>
                      {showHints && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          style={{ overflow: 'hidden', marginTop: 8 }}
                        >
                          {active.hints.map((hint, i) => (
                            <div key={i} style={{
                              fontFamily: "'Rajdhani', sans-serif",
                              fontSize: 12,
                              color: '#8b5cf6',
                              padding: '6px 10px',
                              borderLeft: '2px solid rgba(139, 92, 246, 0.3)',
                              marginBottom: 4,
                            }}>
                              {hint}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Abandon */}
                  <motion.button
                    whileHover={{ scale: 1.02, background: 'rgba(255,51,102,0.15)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { onAbandonChallenge(); }}
                    style={{
                      padding: '8px 12px',
                      background: 'rgba(255,51,102,0.08)',
                      border: '1px solid rgba(255,51,102,0.2)',
                      borderRadius: 6,
                      color: '#ff3366',
                      fontFamily: "'Exo 2', sans-serif",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    ABANDON CHALLENGE
                  </motion.button>
                </div>
              ) : (
                // Challenge list
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {CHALLENGES.map((ch, i) => {
                    const isCompleted = challengeState.completed.includes(ch.id);
                    return (
                      <motion.div
                        key={ch.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        whileHover={!isCompleted ? {
                          scale: 1.02,
                          borderColor: 'rgba(255, 0, 229, 0.4)',
                          boxShadow: '0 0 20px rgba(255, 0, 229, 0.1)',
                        } : {}}
                        onClick={() => !isCompleted && onStartChallenge(ch)}
                        style={{
                          padding: 14,
                          borderRadius: 12,
                          background: isCompleted ? 'rgba(0, 255, 136, 0.03)' : 'rgba(255, 255, 255, 0.02)',
                          border: `1px solid ${isCompleted ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255,255,255,0.06)'}`,
                          cursor: isCompleted ? 'default' : 'pointer',
                          opacity: isCompleted ? 0.7 : 1,
                          display: 'flex',
                          gap: 14,
                          alignItems: 'center',
                        }}
                      >
                        <div style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: isCompleted ? 'rgba(0, 255, 136, 0.1)' : `${DIFF_COLORS[ch.difficulty]}10`,
                          border: `1px solid ${isCompleted ? 'rgba(0, 255, 136, 0.2)' : `${DIFF_COLORS[ch.difficulty]}25`}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 18,
                          flexShrink: 0,
                        }}>
                          {isCompleted ? '✓' : '⚔'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{
                              fontFamily: "'Exo 2', sans-serif",
                              fontSize: 14,
                              fontWeight: 600,
                              color: isCompleted ? '#00ff88' : '#e0e0ff',
                            }}>
                              {ch.title}
                            </span>
                            <span style={{
                              fontFamily: "'Exo 2', sans-serif",
                              fontSize: 9,
                              fontWeight: 600,
                              color: DIFF_COLORS[ch.difficulty],
                              padding: '1px 6px',
                              borderRadius: 8,
                              background: `${DIFF_COLORS[ch.difficulty]}15`,
                              border: `1px solid ${DIFF_COLORS[ch.difficulty]}33`,
                              textTransform: 'uppercase',
                            }}>
                              {ch.difficulty}
                            </span>
                          </div>
                          <div style={{
                            fontFamily: "'Rajdhani', sans-serif",
                            fontSize: 12,
                            color: '#7777aa',
                            lineHeight: 1.3,
                          }}>
                            {ch.description}
                          </div>
                          <div style={{
                            fontFamily: "'Exo 2', sans-serif",
                            fontSize: 10,
                            color: isCompleted ? '#00ff88' : '#ffd700',
                            marginTop: 4,
                          }}>
                            {isCompleted ? 'COMPLETED' : `${ch.xpReward} XP · ${ch.objectives.length} objectives`}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
