import { motion, AnimatePresence } from 'framer-motion';
import type { UserProgress } from '../../types';
import { ACHIEVEMENTS } from '../../utils/achievements';
import { getXPForNextLevel } from '../../utils/challenges';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
}

const RANK_COLORS: Record<string, string> = {
  Genin: '#3b82f6',
  Chunin: '#00ff88',
  Jonin: '#ffd700',
  Anbu: '#ff00e5',
  Kage: '#ff6b00',
  Hokage: '#ff3366',
};

export default function AchievementsModal({ isOpen, onClose, progress }: Props) {
  const xpInfo = getXPForNextLevel(progress.xp);
  const xpPercent = Math.min(100, (xpInfo.current / xpInfo.needed) * 100);

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
              border: '1px solid rgba(255, 215, 0, 0.15)',
              borderRadius: 16,
              overflow: 'hidden',
              zIndex: 201,
              boxShadow: '0 0 60px rgba(255, 215, 0, 0.1), 0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255, 215, 0, 0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <motion.h2
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: 16, fontWeight: 700,
                    letterSpacing: '0.15em',
                    color: '#ffd700',
                  }}
                  animate={{ textShadow: ['0 0 10px rgba(255,215,0,0.3)', '0 0 20px rgba(255,215,0,0.5)', '0 0 10px rgba(255,215,0,0.3)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  NINJA PROFILE
                </motion.h2>
                <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 13, color: '#555577' }}>
                  Your system design journey
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
              {/* Profile card */}
              <div style={{
                padding: 20,
                borderRadius: 12,
                background: 'rgba(255, 215, 0, 0.03)',
                border: '1px solid rgba(255, 215, 0, 0.1)',
                marginBottom: 20,
                textAlign: 'center',
              }}>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    fontSize: 36,
                    marginBottom: 8,
                  }}
                >
                  {progress.rank === 'Hokage' ? '🔥' : progress.rank === 'Kage' ? '👑' : progress.rank === 'Anbu' ? '🥷' : '⚔️'}
                </motion.div>
                <div style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: 20,
                  fontWeight: 800,
                  color: RANK_COLORS[progress.rank] || '#ffd700',
                  letterSpacing: '0.15em',
                  marginBottom: 4,
                }}>
                  {progress.rank.toUpperCase()}
                </div>
                <div style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: 12,
                  color: '#8888aa',
                  marginBottom: 12,
                }}>
                  Level {progress.level} &middot; {progress.xp} XP
                </div>

                {/* XP bar */}
                <div style={{
                  width: '100%',
                  height: 6,
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, ${RANK_COLORS[progress.rank] || '#ffd700'}, #ffd700)`,
                      borderRadius: 3,
                    }}
                  />
                </div>
                <div style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: 10,
                  color: '#555577',
                  marginTop: 4,
                }}>
                  {xpInfo.current} / {xpInfo.needed} XP to next level
                </div>
              </div>

              {/* Stats */}
              <div style={{
                display: 'flex',
                gap: 12,
                marginBottom: 20,
              }}>
                {[
                  { label: 'NODES', value: progress.totalNodesPlaced, color: '#00f5ff' },
                  { label: 'LINKS', value: progress.totalConnectionsMade, color: '#ff00e5' },
                  { label: 'SAVES', value: progress.totalDesignsSaved, color: '#00ff88' },
                  { label: 'QUESTS', value: progress.completedChallenges.length, color: '#ffd700' },
                ].map(stat => (
                  <div key={stat.label} style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    textAlign: 'center',
                  }}>
                    <div style={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: 16,
                      fontWeight: 700,
                      color: stat.color,
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      fontFamily: "'Exo 2', sans-serif",
                      fontSize: 8,
                      fontWeight: 600,
                      color: '#444466',
                      letterSpacing: '0.15em',
                      marginTop: 2,
                    }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Achievements */}
              <div style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: '#444466',
                marginBottom: 10,
              }}>
                ACHIEVEMENTS ({progress.achievements.length}/{ACHIEVEMENTS.length})
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: 8,
              }}>
                {ACHIEVEMENTS.map((ach, i) => {
                  const unlocked = progress.achievements.includes(ach.id);
                  return (
                    <motion.div
                      key={ach.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      style={{
                        padding: 10,
                        borderRadius: 8,
                        background: unlocked ? 'rgba(255, 215, 0, 0.05)' : 'rgba(255,255,255,0.01)',
                        border: `1px solid ${unlocked ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255,255,255,0.04)'}`,
                        textAlign: 'center',
                        opacity: unlocked ? 1 : 0.4,
                      }}
                    >
                      <div style={{ fontSize: 20, marginBottom: 4, filter: unlocked ? 'none' : 'grayscale(1)' }}>
                        {ach.icon}
                      </div>
                      <div style={{
                        fontFamily: "'Exo 2', sans-serif",
                        fontSize: 10,
                        fontWeight: 600,
                        color: unlocked ? '#ffd700' : '#444466',
                        marginBottom: 2,
                      }}>
                        {ach.title}
                      </div>
                      <div style={{
                        fontFamily: "'Rajdhani', sans-serif",
                        fontSize: 9,
                        color: '#555577',
                        lineHeight: 1.3,
                      }}>
                        {ach.description}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
