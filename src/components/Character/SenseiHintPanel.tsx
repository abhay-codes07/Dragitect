import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CanvasNode, Connection, Challenge } from '../../types';
import { getLesson } from '../../utils/challengeLessons';
import { getComponentMeta } from '../../utils/componentMeta';
import ComponentIcon from '../SystemComponents/ComponentIcon';

interface Props {
  challenge: Challenge | null;
  nodes: CanvasNode[];
  connections: Connection[];
  onAbandon: () => void;
}

export default function SenseiHintPanel({ challenge, nodes, connections, onAbandon }: Props) {
  const [hintsShown, setHintsShown] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  // Reset when challenge changes
  useEffect(() => {
    setHintsShown(0);
    setCollapsed(false);
  }, [challenge?.id]);

  const lesson = challenge ? getLesson(challenge.id) : null;
  const accent = lesson?.accent || '#00f5ff';

  const objectiveStatus = useMemo(() => {
    if (!challenge) return [];
    return challenge.objectives.map(o => ({ id: o.id, completed: o.check(nodes, connections) }));
  }, [challenge, nodes, connections]);

  const completedCount = objectiveStatus.filter(s => s.completed).length;
  const totalCount = objectiveStatus.length;

  // Next incomplete objective
  const nextIncompleteId = useMemo(() => {
    if (!challenge) return null;
    const incomplete = objectiveStatus.find(s => !s.completed);
    return incomplete?.id || null;
  }, [challenge, objectiveStatus]);

  // Find the hint for the next incomplete objective
  const nextHint = useMemo(() => {
    if (!lesson || !nextIncompleteId) return null;
    return lesson.nextStepHints.find(h => h.forObjectiveId === nextIncompleteId) || null;
  }, [lesson, nextIncompleteId]);

  if (!challenge) return null;

  const allDone = completedCount === totalCount && totalCount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      style={{
        position: 'absolute',
        bottom: 92,
        right: 20,
        zIndex: 55,
        width: collapsed ? 200 : 340,
        background: 'linear-gradient(135deg, rgba(12,12,38,0.96), rgba(8,8,28,0.96))',
        border: `1px solid ${accent}33`,
        borderRadius: 14,
        boxShadow: `0 0 35px ${accent}22, 0 10px 30px rgba(0,0,0,0.5)`,
        overflow: 'hidden',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Scanning line */}
      <motion.div
        animate={{ left: ['-30%', '130%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          top: 0,
          width: '30%',
          height: 1,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div
        onClick={() => setCollapsed(c => !c)}
        style={{
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          borderBottom: collapsed ? 'none' : `1px solid ${accent}18`,
          background: `${accent}06`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <motion.span
            animate={{ textShadow: [`0 0 6px ${accent}80`, `0 0 14px ${accent}`, `0 0 6px ${accent}80`] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              fontFamily: "'Noto Sans JP', 'Orbitron', sans-serif",
              fontSize: 16,
              color: accent,
              fontWeight: 700,
            }}
          >
            {lesson?.kanji || '\u5E2B'}
          </motion.span>
          <div>
            <div style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.2em',
              color: accent,
            }}>
              SENSEI GUIDE
            </div>
            <div style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 11,
              color: '#8888aa',
              marginTop: 1,
            }}>
              {completedCount}/{totalCount} objectives
            </div>
          </div>
        </div>
        <span style={{ color: '#666688', fontSize: 12 }}>{collapsed ? '\u25B2' : '\u25BC'}</span>
      </div>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Progress bar */}
              <div style={{
                height: 6,
                borderRadius: 3,
                background: 'rgba(255,255,255,0.06)',
                overflow: 'hidden',
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedCount / Math.max(totalCount, 1)) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  style={{
                    height: '100%',
                    background: `linear-gradient(90deg, ${accent}, ${accent}cc)`,
                    boxShadow: `0 0 10px ${accent}`,
                  }}
                />
              </div>

              {/* Challenge title */}
              <div style={{
                fontFamily: "'Exo 2', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: '#e0e0ff',
              }}>
                {challenge.title}
              </div>

              {/* Objective ticks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {challenge.objectives.map((obj, i) => {
                  const done = objectiveStatus[i]?.completed;
                  const isNext = !done && obj.id === nextIncompleteId;
                  return (
                    <div
                      key={obj.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '4px 6px',
                        borderRadius: 4,
                        background: isNext ? `${accent}0f` : 'transparent',
                        border: isNext ? `1px solid ${accent}30` : '1px solid transparent',
                      }}
                    >
                      <span style={{
                        fontSize: 11,
                        color: done ? '#00ff88' : isNext ? accent : '#555577',
                        width: 14,
                      }}>
                        {done ? '\u2713' : isNext ? '\u25B6' : '\u25CB'}
                      </span>
                      <span style={{
                        fontFamily: "'Rajdhani', sans-serif",
                        fontSize: 11,
                        color: done ? '#555577' : isNext ? '#d0d0ee' : '#7777aa',
                        textDecoration: done ? 'line-through' : 'none',
                        lineHeight: 1.3,
                      }}>
                        {obj.description}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Hint area */}
              {allDone ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    background: 'rgba(0,255,136,0.08)',
                    border: '1px solid rgba(0,255,136,0.3)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    color: '#00ff88',
                    marginBottom: 4,
                  }}>
                    TRAINING COMPLETE
                  </div>
                  <div style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: 11,
                    color: '#88ccaa',
                  }}>
                    All objectives passed. Sensei is proud.
                  </div>
                </motion.div>
              ) : hintsShown > 0 && nextHint ? (
                <motion.div
                  key={nextHint.forObjectiveId + String(hintsShown)}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    background: `${accent}0a`,
                    border: `1px solid ${accent}30`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    {nextHint.targetType && (
                      <div style={{
                        width: 36,
                        height: 36,
                        flexShrink: 0,
                        borderRadius: 8,
                        background: `${getComponentMeta(nextHint.targetType).color}20`,
                        border: `1px solid ${getComponentMeta(nextHint.targetType).color}55`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <ComponentIcon
                          type={nextHint.targetType}
                          size={22}
                          color={getComponentMeta(nextHint.targetType).color}
                        />
                      </div>
                    )}
                    <div style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: 12,
                      color: '#d0d0ee',
                      lineHeight: 1.5,
                    }}>
                      {nextHint.line}
                    </div>
                  </div>

                  {nextHint.miniNodes && nextHint.miniNodes.length > 0 && (
                    <MiniStepDiagram
                      nodes={nextHint.miniNodes}
                      edges={nextHint.miniEdges || []}
                      accent={accent}
                    />
                  )}
                </motion.div>
              ) : (
                <div style={{
                  padding: 10,
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 12,
                  color: '#7777aa',
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                }}>
                  Try the objective above on your own first. When you\u2019re stuck, ask Sensei for the next step.
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                {!allDone && (
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: `0 0 18px ${accent}55` }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setHintsShown(n => n + 1)}
                    style={{
                      flex: 1,
                      padding: '9px 12px',
                      background: `linear-gradient(135deg, ${accent}25, ${accent}10)`,
                      border: `1px solid ${accent}55`,
                      borderRadius: 8,
                      color: accent,
                      fontFamily: "'Exo 2', sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      cursor: 'pointer',
                    }}
                  >
                    {hintsShown === 0 ? 'SENSEI, GUIDE ME' : 'NEXT HINT'}
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.04, background: 'rgba(255,51,102,0.15)' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onAbandon}
                  style={{
                    padding: '9px 12px',
                    background: 'rgba(255,51,102,0.06)',
                    border: '1px solid rgba(255,51,102,0.2)',
                    borderRadius: 8,
                    color: '#ff3366',
                    fontFamily: "'Exo 2', sans-serif",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                  }}
                >
                  EXIT
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MiniStepDiagram({
  nodes,
  edges,
  accent,
}: {
  nodes: { type: import('../../types').ComponentType; label: string; x: number; y: number; highlight?: boolean }[];
  edges: { fromIdx: number; toIdx: number }[];
  accent: string;
}) {
  const width = 280;
  const height = 100;
  const pad = 20;
  const xs = nodes.map(n => n.x);
  const ys = nodes.map(n => n.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const spanX = Math.max(Math.max(...xs) - minX, 1);
  const spanY = Math.max(Math.max(...ys) - minY, 1);

  const project = (x: number, y: number) => ({
    x: pad + ((x - minX) / spanX) * (width - pad * 2),
    y: pad + ((y - minY) / spanY) * (height - pad * 2),
  });

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: `${width} / ${height}`,
      borderRadius: 6,
      background: 'rgba(0,0,0,0.3)',
      border: `1px solid ${accent}22`,
    }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {edges.map((e, i) => {
          const a = nodes[e.fromIdx];
          const b = nodes[e.toIdx];
          if (!a || !b) return null;
          const p1 = project(a.x, a.y);
          const p2 = project(b.x, b.y);
          return (
            <line key={i}
              x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke={accent} strokeWidth={1.2} opacity={0.5} strokeDasharray="4 3"
            />
          );
        })}
      </svg>
      {nodes.map((n, i) => {
        const p = project(n.x, n.y);
        const meta = getComponentMeta(n.type);
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${(p.x / width) * 100}%`,
            top: `${(p.y / height) * 100}%`,
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}>
            <div style={{
              width: 24, height: 24,
              borderRadius: 5,
              background: `${meta.color}20`,
              border: `1px solid ${meta.color}${n.highlight ? '' : '55'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: n.highlight ? `0 0 10px ${meta.glowColor}` : 'none',
            }}>
              <ComponentIcon type={n.type} size={14} color={meta.color} />
            </div>
            <div style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: 7,
              color: meta.color,
              whiteSpace: 'nowrap',
            }}>
              {n.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
