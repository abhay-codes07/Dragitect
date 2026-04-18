import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Challenge } from '../../types';
import { getLesson } from '../../utils/challengeLessons';
import MiniDiagram from './MiniDiagram';

interface Props {
  isOpen: boolean;
  challenge: Challenge | null;
  onBegin: () => void;
  onClose: () => void;
}

type Tab = 'concept' | 'example' | 'challenge';

const TABS: { id: Tab; kanji: string; label: string }[] = [
  { id: 'concept', kanji: '\u5B66', label: 'CONCEPT' },
  { id: 'example', kanji: '\u4F8B', label: 'EXAMPLE' },
  { id: 'challenge', kanji: '\u6311', label: 'CHALLENGE' },
];

const DIFF_COLORS: Record<string, string> = {
  beginner: '#00ff88',
  intermediate: '#ffd700',
  advanced: '#ff3366',
};

export default function SenseiLessonModal({ isOpen, challenge, onBegin, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('concept');
  const lesson = challenge ? getLesson(challenge.id) : null;

  const accent = lesson?.accent || '#00f5ff';

  return (
    <AnimatePresence>
      {isOpen && challenge && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.82)',
              backdropFilter: 'blur(10px)',
              zIndex: 400,
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 860,
              maxWidth: '95vw',
              maxHeight: '92vh',
              background: 'linear-gradient(135deg, #0d0d26, #0a0a1f)',
              border: `1px solid ${accent}33`,
              borderRadius: 20,
              overflow: 'hidden',
              zIndex: 401,
              boxShadow: `0 0 80px ${accent}22, 0 30px 80px rgba(0,0,0,0.7)`,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 28px',
              borderBottom: `1px solid ${accent}22`,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              background: `linear-gradient(90deg, ${accent}08, transparent)`,
            }}>
              <SenseiAvatar accent={accent} />
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.25em',
                  color: '#555577',
                  marginBottom: 4,
                }}>
                  SENSEI TEACHES \u2014 {challenge.difficulty.toUpperCase()}
                </div>
                <motion.h2
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#e0e0ff',
                    margin: 0,
                  }}
                  animate={{ textShadow: [`0 0 12px ${accent}40`, `0 0 24px ${accent}80`, `0 0 12px ${accent}40`] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  {lesson?.conceptTitle || challenge.title}
                </motion.h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.15, color: '#ff3366' }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#666688',
                  fontSize: 22,
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                \u2715
              </motion.button>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              borderBottom: `1px solid ${accent}15`,
              padding: '0 28px',
              gap: 4,
            }}>
              {TABS.map(t => (
                <motion.button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  whileHover={{ y: -1 }}
                  style={{
                    padding: '12px 18px',
                    background: 'none',
                    border: 'none',
                    borderBottom: `2px solid ${tab === t.id ? accent : 'transparent'}`,
                    color: tab === t.id ? accent : '#666688',
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                >
                  <span style={{ fontSize: 16, fontFamily: "'Noto Sans JP', 'Exo 2', sans-serif" }}>{t.kanji}</span>
                  {t.label}
                </motion.button>
              ))}
            </div>

            {/* Body */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px 28px 12px',
            }}>
              <AnimatePresence mode="wait">
                {tab === 'concept' && (
                  <motion.div
                    key="concept"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.22 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                  >
                    {lesson ? lesson.conceptSections.map((s, i) => (
                      <motion.div
                        key={s.heading}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        style={{
                          padding: '14px 16px',
                          background: 'rgba(255,255,255,0.02)',
                          border: `1px solid ${accent}12`,
                          borderLeft: `3px solid ${accent}`,
                          borderRadius: 8,
                        }}
                      >
                        <div style={{
                          fontFamily: "'Orbitron', sans-serif",
                          fontSize: 12,
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          color: accent,
                          marginBottom: 8,
                        }}>
                          {s.heading}
                        </div>
                        <p style={{
                          fontFamily: "'Rajdhani', sans-serif",
                          fontSize: 14,
                          color: '#c8c8e4',
                          lineHeight: 1.65,
                          margin: 0,
                        }}>
                          {s.body}
                        </p>
                      </motion.div>
                    )) : (
                      <div style={{ color: '#888', fontFamily: "'Rajdhani', sans-serif" }}>
                        No lesson content available for this challenge.
                      </div>
                    )}
                  </motion.div>
                )}

                {tab === 'example' && (
                  <motion.div
                    key="example"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.22 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
                  >
                    <div style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: 13,
                      color: '#aaaacc',
                      lineHeight: 1.5,
                    }}>
                      Here is one valid solution shape. Study how the pieces flow, then build your own in the challenge tab. You do not need to copy it exactly.
                    </div>
                    {lesson && (
                      <MiniDiagram
                        nodes={lesson.example.nodes}
                        edges={lesson.example.edges}
                        caption={lesson.example.caption}
                        accent={accent}
                      />
                    )}
                  </motion.div>
                )}

                {tab === 'challenge' && (
                  <motion.div
                    key="challenge"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.22 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
                  >
                    <div style={{
                      padding: 16,
                      borderRadius: 12,
                      background: `${accent}08`,
                      border: `1px solid ${accent}25`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{
                          fontFamily: "'Exo 2', sans-serif",
                          fontSize: 16,
                          fontWeight: 700,
                          color: '#e0e0ff',
                        }}>
                          {challenge.title}
                        </span>
                        <span style={{
                          fontFamily: "'Exo 2', sans-serif",
                          fontSize: 10,
                          fontWeight: 600,
                          color: DIFF_COLORS[challenge.difficulty],
                          padding: '2px 8px',
                          borderRadius: 10,
                          background: `${DIFF_COLORS[challenge.difficulty]}15`,
                          border: `1px solid ${DIFF_COLORS[challenge.difficulty]}33`,
                          textTransform: 'uppercase',
                        }}>
                          {challenge.difficulty}
                        </span>
                        <span style={{
                          marginLeft: 'auto',
                          fontFamily: "'Exo 2', sans-serif",
                          fontSize: 11,
                          color: '#ffd700',
                        }}>
                          +{challenge.xpReward} XP
                        </span>
                      </div>
                      <p style={{
                        fontFamily: "'Rajdhani', sans-serif",
                        fontSize: 13,
                        color: '#9999bb',
                        lineHeight: 1.5,
                        margin: 0,
                      }}>
                        {challenge.description}
                      </p>
                    </div>

                    <div>
                      <div style={{
                        fontFamily: "'Orbitron', sans-serif",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.25em',
                        color: '#555577',
                        marginBottom: 10,
                      }}>
                        OBJECTIVES
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {challenge.objectives.map((o, i) => (
                          <motion.div
                            key={o.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            style={{
                              padding: '8px 12px',
                              borderRadius: 6,
                              background: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.05)',
                              fontFamily: "'Rajdhani', sans-serif",
                              fontSize: 13,
                              color: '#9999bb',
                              display: 'flex',
                              gap: 10,
                            }}
                          >
                            <span style={{ color: accent, fontWeight: 700 }}>{String(i + 1).padStart(2, '0')}</span>
                            <span>{o.description}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: 12,
                      color: '#7777aa',
                      fontStyle: 'italic',
                      lineHeight: 1.5,
                    }}>
                      Tip: once training begins, the Sensei Guide panel (bottom-right) will reveal the next step one at a time whenever you click \u201CGuide me\u201D.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div style={{
              padding: '14px 28px 18px',
              borderTop: `1px solid ${accent}15`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
            }}>
              <div style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: 12,
                color: '#555577',
              }}>
                Step {TABS.findIndex(t => t.id === tab) + 1} of {TABS.length}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    const idx = TABS.findIndex(t => t.id === tab);
                    if (idx > 0) setTab(TABS[idx - 1].id);
                  }}
                  disabled={tab === 'concept'}
                  style={{
                    padding: '9px 18px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 8,
                    color: tab === 'concept' ? '#333355' : '#8888aa',
                    fontFamily: "'Exo 2', sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    cursor: tab === 'concept' ? 'default' : 'pointer',
                  }}
                >
                  BACK
                </motion.button>
                {tab !== 'challenge' ? (
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: `0 0 22px ${accent}60` }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      const idx = TABS.findIndex(t => t.id === tab);
                      if (idx < TABS.length - 1) setTab(TABS[idx + 1].id);
                    }}
                    style={{
                      padding: '9px 22px',
                      background: `${accent}1a`,
                      border: `1px solid ${accent}55`,
                      borderRadius: 8,
                      color: accent,
                      fontFamily: "'Exo 2', sans-serif",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      cursor: 'pointer',
                    }}
                  >
                    NEXT \u2192
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${accent}88` }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onBegin}
                    animate={{
                      boxShadow: [`0 0 12px ${accent}40`, `0 0 28px ${accent}80`, `0 0 12px ${accent}40`],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      padding: '10px 28px',
                      background: `linear-gradient(135deg, ${accent}30, ${accent}10)`,
                      border: `1px solid ${accent}`,
                      borderRadius: 8,
                      color: accent,
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.2em',
                      cursor: 'pointer',
                    }}
                  >
                    BEGIN TRAINING
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SenseiAvatar({ accent }: { accent: string }) {
  return (
    <motion.div
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #1a1a3e, #0a0a2e)',
        border: `2px solid ${accent}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 0 20px ${accent}55`,
        flexShrink: 0,
        position: 'relative',
      }}
    >
      <svg width="40" height="40" viewBox="0 0 40 40">
        <path d="M8 18 L6 8 L14 16" fill="#1a1a4e" />
        <path d="M14 16 L12 5 L20 13" fill="#1a1a4e" />
        <path d="M20 13 L20 3 L28 13" fill="#1a1a4e" />
        <path d="M26 16 L28 5 L34 18" fill="#1a1a4e" />
        <ellipse cx="20" cy="22" rx="12" ry="12" fill="#fce4d6" />
        <path d="M8 18 L10 10 L15 17 L18 8 L22 17 L25 8 L30 17 L34 10 L34 20" fill="#2d1b69" />
        <motion.ellipse cx="15" cy="23" rx="3" ry="3.5" fill={accent}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.ellipse cx="25" cy="23" rx="3" ry="3.5" fill={accent}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
        />
        <circle cx="14" cy="22" r="1.2" fill="white" opacity="0.9" />
        <circle cx="24" cy="22" r="1.2" fill="white" opacity="0.9" />
        <path d="M17 30 Q20 32 23 30" stroke="#c4846b" strokeWidth="1" fill="none" />
      </svg>
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          position: 'absolute', inset: -3,
          borderRadius: '50%',
          border: `2px solid ${accent}`,
        }}
      />
    </motion.div>
  );
}
