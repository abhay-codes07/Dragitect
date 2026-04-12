import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getQuestById } from '../../utils/quests';
import type { CanvasNode, Connection, QuestState } from '../../types';

interface Props {
  questState: QuestState;
  nodes: CanvasNode[];
  connections: Connection[];
  onAdvanceStep: () => void;
  onComplete: () => void;
  onAbandon: () => void;
  onUseHint: () => void;
}

export default function QuestGuide({
  questState, nodes, connections,
  onAdvanceStep, onComplete, onAbandon, onUseHint,
}: Props) {
  const [showHint, setShowHint] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const quest = questState.activeQuestId ? getQuestById(questState.activeQuestId) : null;

  // Reset intro on quest change
  useEffect(() => {
    if (questState.activeQuestId) {
      setShowIntro(true);
      setShowHint(false);
      setCollapsed(false);
    }
  }, [questState.activeQuestId]);

  // Check current step completion
  useEffect(() => {
    if (!quest || showIntro) return;
    const step = quest.steps[questState.currentStep];
    if (!step) return;
    if (step.check(nodes, connections)) {
      // auto-advance on next tick
      const timer = setTimeout(() => {
        if (questState.currentStep >= quest.steps.length - 1) {
          onComplete();
        } else {
          onAdvanceStep();
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [quest, questState.currentStep, nodes, connections, showIntro, onAdvanceStep, onComplete]);

  if (!quest) return null;

  const currentStep = quest.steps[questState.currentStep];
  const progressPercent = (questState.currentStep / quest.steps.length) * 100;

  return (
    <>
      {/* Intro overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(5, 5, 20, 0.9)',
              backdropFilter: 'blur(12px)',
              zIndex: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 180, damping: 22 }}
              style={{
                maxWidth: 620,
                padding: '32px 36px',
                background: 'linear-gradient(160deg, rgba(10,10,30,0.96), rgba(30,15,40,0.96))',
                border: '1px solid rgba(255, 215, 0, 0.35)',
                borderRadius: 16,
                boxShadow: '0 0 80px rgba(255, 215, 0, 0.25)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Animated sakura petals */}
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -40, x: Math.random() * 600 - 300, opacity: 0, rotate: 0 }}
                  animate={{
                    y: [0, 280, 400],
                    x: [null, Math.random() * 600 - 300],
                    opacity: [0, 1, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    width: 10,
                    height: 10,
                    background: 'radial-gradient(circle, #ff6bb5, #ff00e5)',
                    borderRadius: '50% 0',
                    pointerEvents: 'none',
                  }}
                />
              ))}

              <div style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 11,
                letterSpacing: '0.3em',
                color: '#ffd700',
                opacity: 0.8,
              }}>
                QUEST · LEVEL {quest.level}
              </div>
              <h2 style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 28,
                fontWeight: 800,
                margin: '12px 0 4px',
                background: 'linear-gradient(90deg, #00f5ff, #ff00e5, #ffd700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.08em',
              }}>
                {quest.title}
              </h2>
              <div style={{
                fontFamily: "'Exo 2', sans-serif",
                fontSize: 13,
                color: '#888',
                fontStyle: 'italic',
                marginBottom: 20,
              }}>
                {quest.realWorld}
              </div>

              {/* Sensei speech */}
              <div style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                padding: '18px 16px',
                background: 'rgba(255, 215, 0, 0.05)',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                borderRadius: 12,
                textAlign: 'left',
                marginBottom: 22,
              }}>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ffd700, #ff6b00)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  🦊
                </motion.div>
                <div>
                  <div style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    color: '#ffd700',
                    marginBottom: 4,
                  }}>
                    SENSEI SAYS
                  </div>
                  <div style={{
                    fontFamily: "'Exo 2', sans-serif",
                    fontSize: 14,
                    color: '#fff',
                    lineHeight: 1.6,
                  }}>
                    {quest.intro}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button
                  onClick={onAbandon}
                  style={{
                    padding: '10px 22px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#aaa',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: 11,
                    letterSpacing: '0.15em',
                  }}
                >
                  RETREAT
                </button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowIntro(false)}
                  style={{
                    padding: '10px 28px',
                    background: 'linear-gradient(90deg, #ffd700, #ff6b00)',
                    border: 'none',
                    color: '#000',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: '0.2em',
                    boxShadow: '0 0 30px rgba(255, 215, 0, 0.4)',
                  }}
                >
                  BEGIN QUEST
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step guide panel */}
      {!showIntro && currentStep && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          style={{
            position: 'fixed',
            left: 20,
            bottom: 20,
            width: collapsed ? 64 : 360,
            background: 'linear-gradient(160deg, rgba(10,10,30,0.96), rgba(20,15,40,0.96))',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            borderRadius: 14,
            boxShadow: '0 0 40px rgba(255, 215, 0, 0.15)',
            zIndex: 800,
            overflow: 'hidden',
            transition: 'width 0.3s',
          }}
        >
          {/* Collapsed state */}
          {collapsed ? (
            <motion.button
              onClick={() => setCollapsed(false)}
              whileHover={{ scale: 1.06 }}
              style={{
                width: 64,
                height: 64,
                border: 'none',
                background: 'linear-gradient(135deg, #ffd700, #ff6b00)',
                cursor: 'pointer',
                fontSize: 28,
              }}
            >
              🦊
            </motion.button>
          ) : (
            <>
              {/* Header with progress */}
              <div style={{
                padding: '10px 14px',
                borderBottom: '1px solid rgba(255,215,0,0.15)',
                background: 'linear-gradient(90deg, rgba(255,215,0,0.08), transparent)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: 9,
                    letterSpacing: '0.25em',
                    color: '#ffd700',
                    opacity: 0.8,
                  }}>
                    QUEST · LV {quest.level}
                  </div>
                  <div style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: '0.05em',
                  }}>
                    {quest.title}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => setCollapsed(true)} title="Minimize" style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#888',
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 11,
                  }}>-</button>
                  <button onClick={onAbandon} title="Abandon" style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 51, 102, 0.2)',
                    color: '#ff3366',
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 11,
                  }}>x</button>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{
                height: 3,
                background: 'rgba(255,255,255,0.06)',
              }}>
                <motion.div
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #ffd700, #ff6b00, #ff00e5)',
                    boxShadow: '0 0 10px rgba(255, 215, 0, 0.6)',
                  }}
                />
              </div>

              {/* Current step */}
              <div style={{ padding: 16 }}>
                <div style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: 9,
                  letterSpacing: '0.2em',
                  color: '#888',
                  marginBottom: 6,
                }}>
                  STEP {questState.currentStep + 1} / {quest.steps.length}
                </div>

                <motion.div
                  key={currentStep.id}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  style={{
                    fontFamily: "'Exo 2', sans-serif",
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#ffd700',
                    marginBottom: 6,
                    lineHeight: 1.3,
                  }}
                >
                  {currentStep.instruction}
                </motion.div>

                <div style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: 12,
                  color: '#bbb',
                  lineHeight: 1.5,
                  marginBottom: 12,
                }}>
                  {currentStep.detail}
                </div>

                {/* Sensei line */}
                <motion.div
                  key={`sensei-${currentStep.id}`}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  style={{
                    display: 'flex',
                    gap: 8,
                    padding: '10px 12px',
                    background: 'rgba(255, 215, 0, 0.05)',
                    border: '1px solid rgba(255, 215, 0, 0.15)',
                    borderRadius: 8,
                    fontFamily: "'Exo 2', sans-serif",
                    fontSize: 12,
                    fontStyle: 'italic',
                    color: '#fff',
                    marginBottom: 10,
                  }}
                >
                  <span style={{ fontSize: 16, flexShrink: 0 }}>🦊</span>
                  <span>"{currentStep.senseiLine}"</span>
                </motion.div>

                {/* Hint */}
                {currentStep.hint && (
                  <AnimatePresence>
                    {showHint ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{
                          padding: '8px 10px',
                          background: 'rgba(0, 245, 255, 0.06)',
                          border: '1px solid rgba(0, 245, 255, 0.18)',
                          borderRadius: 6,
                          fontFamily: "'Exo 2', sans-serif",
                          fontSize: 11,
                          color: '#00f5ff',
                          marginBottom: 8,
                        }}
                      >
                        💡 {currentStep.hint}
                      </motion.div>
                    ) : (
                      <button
                        onClick={() => { setShowHint(true); onUseHint(); }}
                        style={{
                          width: '100%',
                          padding: '6px',
                          background: 'transparent',
                          border: '1px dashed rgba(0, 245, 255, 0.25)',
                          color: '#00f5ff',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontFamily: "'Orbitron', sans-serif",
                          fontSize: 10,
                          letterSpacing: '0.15em',
                        }}
                      >
                        SHOW HINT
                      </button>
                    )}
                  </AnimatePresence>
                )}
              </div>

              {/* Step dots */}
              <div style={{
                padding: '0 16px 12px',
                display: 'flex',
                gap: 4,
                justifyContent: 'center',
              }}>
                {quest.steps.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === questState.currentStep ? 16 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: i < questState.currentStep
                        ? '#00ff88'
                        : i === questState.currentStep
                          ? '#ffd700'
                          : 'rgba(255,255,255,0.1)',
                      transition: 'all 0.3s',
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}
    </>
  );
}
