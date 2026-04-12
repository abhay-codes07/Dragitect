import { motion, AnimatePresence } from 'framer-motion';
import { QUESTS } from '../../utils/quests';
import type { UserProgress } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  completedQuests: string[];
  progress: UserProgress;
  onStartQuest: (questId: string) => void;
}

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: '#00ff88',
  intermediate: '#00f5ff',
  advanced: '#ff00e5',
  expert: '#ff6b00',
};

export default function QuestMap({ isOpen, onClose, completedQuests, progress, onStartQuest }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 5, 20, 0.82)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <motion.div
            initial={{ scale: 0.85, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 40 }}
            transition={{ type: 'spring', stiffness: 160, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 900,
              maxHeight: '88vh',
              background: 'linear-gradient(160deg, rgba(12,12,32,0.96), rgba(22,18,48,0.96))',
              border: '1px solid rgba(255, 215, 0, 0.25)',
              borderRadius: 16,
              boxShadow: '0 0 80px rgba(255, 215, 0, 0.15)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 28px',
              borderBottom: '1px solid rgba(255, 215, 0, 0.15)',
              background: 'linear-gradient(90deg, rgba(255,215,0,0.08), transparent)',
              position: 'relative',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: 11,
                    letterSpacing: '0.3em',
                    color: '#ffd700',
                    opacity: 0.8,
                    marginBottom: 4,
                  }}>
                    SHINOBI SCROLLS
                  </div>
                  <h2 style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: 22,
                    fontWeight: 800,
                    margin: 0,
                    background: 'linear-gradient(90deg, #ffd700, #ff6b00)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.1em',
                  }}>
                    QUEST MAP
                  </h2>
                  <div style={{
                    fontFamily: "'Exo 2', sans-serif",
                    fontSize: 12,
                    color: '#aaa',
                    marginTop: 4,
                  }}>
                    Learn system design from basics to master. Each quest is guided step-by-step by Sensei.
                  </div>
                </div>
                <button onClick={onClose} style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 16,
                }}>x</button>
              </div>
            </div>

            {/* Quests list */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: 24,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 14,
            }}>
              {QUESTS.map((q, idx) => {
                const done = completedQuests.includes(q.id);
                const locked = idx > 0 && !completedQuests.includes(QUESTS[idx - 1].id) && q.level > 1;
                const unlocked = !locked || progress.level >= q.level;
                const color = DIFFICULTY_COLOR[q.difficulty];

                return (
                  <motion.button
                    key={q.id}
                    whileHover={unlocked ? { scale: 1.025, y: -3 } : {}}
                    whileTap={unlocked ? { scale: 0.98 } : {}}
                    disabled={!unlocked}
                    onClick={() => { if (unlocked) { onStartQuest(q.id); onClose(); } }}
                    style={{
                      position: 'relative',
                      textAlign: 'left',
                      padding: 16,
                      borderRadius: 12,
                      background: done
                        ? `linear-gradient(140deg, ${color}22, ${color}0a)`
                        : 'linear-gradient(140deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                      border: done ? `1px solid ${color}66` : `1px solid ${unlocked ? color + '33' : 'rgba(255,255,255,0.06)'}`,
                      cursor: unlocked ? 'pointer' : 'not-allowed',
                      opacity: unlocked ? 1 : 0.4,
                      color: '#fff',
                      boxShadow: done ? `0 0 24px ${color}22` : 'none',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Level badge */}
                    <div style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color,
                      opacity: 0.8,
                    }}>
                      LV {q.level}
                    </div>

                    {done && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          color: '#000',
                          fontWeight: 700,
                        }}
                      >
                        ✓
                      </motion.div>
                    )}

                    <div style={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      color,
                      marginTop: 18,
                      marginBottom: 2,
                      letterSpacing: '0.05em',
                    }}>
                      {q.title}
                    </div>
                    <div style={{
                      fontFamily: "'Exo 2', sans-serif",
                      fontSize: 11,
                      color: '#888',
                      fontStyle: 'italic',
                      marginBottom: 10,
                    }}>
                      {q.realWorld}
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: 6,
                      flexWrap: 'wrap',
                    }}>
                      <span style={{
                        fontSize: 9,
                        fontFamily: "'Orbitron', sans-serif",
                        letterSpacing: '0.1em',
                        padding: '2px 8px',
                        borderRadius: 10,
                        background: `${color}18`,
                        color,
                        border: `1px solid ${color}33`,
                      }}>
                        {q.difficulty.toUpperCase()}
                      </span>
                      <span style={{
                        fontSize: 9,
                        fontFamily: "'Orbitron', sans-serif",
                        letterSpacing: '0.1em',
                        padding: '2px 8px',
                        borderRadius: 10,
                        background: 'rgba(255,215,0,0.1)',
                        color: '#ffd700',
                        border: '1px solid rgba(255,215,0,0.25)',
                      }}>
                        +{q.xpReward} XP
                      </span>
                      <span style={{
                        fontSize: 9,
                        fontFamily: "'Orbitron', sans-serif",
                        letterSpacing: '0.1em',
                        padding: '2px 8px',
                        borderRadius: 10,
                        background: 'rgba(255,255,255,0.05)',
                        color: '#aaa',
                      }}>
                        {q.steps.length} STEPS
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
