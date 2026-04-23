import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COMPONENT_META } from '../../utils/componentMeta';
import type { ComponentType } from '../../types';
import ComponentIcon from '../SystemComponents/ComponentIcon';

interface Props {
  onDragStart: (type: ComponentType) => void;
}

type Category = {
  id: string;
  label: string;
  kanji: string;
  accent: string;
  types: ComponentType[];
};

const CATEGORIES: Category[] = [
  {
    id: 'edge',
    label: 'Edge & Delivery',
    kanji: '境界',
    accent: '#00f5ff',
    types: ['client', 'dns', 'cdn', 'blob-cdn', 'edge-worker', 'reverse-proxy', 'loadbalancer'],
  },
  {
    id: 'gateway',
    label: 'Gateway & Routing',
    kanji: '門',
    accent: '#8b5cf6',
    types: ['api-gateway', 'graphql', 'rate-limiter', 'service-mesh'],
  },
  {
    id: 'compute',
    label: 'Compute',
    kanji: '演算',
    accent: '#34d399',
    types: ['server', 'microservice', 'kubernetes', 'websocket', 'scheduler'],
  },
  {
    id: 'data',
    label: 'Data & Storage',
    kanji: '貯蔵',
    accent: '#ff00e5',
    types: ['database', 'cache', 'session-store', 'storage', 'search-engine', 'vector-db', 'data-warehouse'],
  },
  {
    id: 'messaging',
    label: 'Messaging & Streams',
    kanji: '伝達',
    accent: '#ff6b00',
    types: ['queue', 'event-bus', 'stream-processor', 'notification'],
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    kanji: '知能',
    accent: '#c084fc',
    types: ['ml-service', 'analytics'],
  },
  {
    id: 'security',
    label: 'Security & Identity',
    kanji: '守護',
    accent: '#ef4444',
    types: ['firewall', 'auth-service', 'secret-vault', 'payment-gateway'],
  },
  {
    id: 'observability',
    label: 'Observability',
    kanji: '観測',
    accent: '#fde047',
    types: ['monitoring', 'log-aggregator'],
  },
];

export default function Sidebar({ onDragStart }: Props) {
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const metaByType = useMemo(() => {
    const m = new Map<ComponentType, typeof COMPONENT_META[number]>();
    COMPONENT_META.forEach(c => m.set(c.type, c));
    return m;
  }, []);

  const q = search.trim().toLowerCase();
  const isSearching = q.length > 0;

  const filteredMeta = useMemo(() => {
    if (!q) return COMPONENT_META;
    return COMPONENT_META.filter(m =>
      m.label.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.type.includes(q)
    );
  }, [q]);

  return (
    <motion.aside
      data-tour="sidebar"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      style={{
        width: 280,
        height: '100%',
        background: 'linear-gradient(180deg, #0f0f2a 0%, #0a0a1f 100%)',
        borderRight: '1px solid rgba(0, 245, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Animated border glow */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 1,
          height: '100%',
          background: 'linear-gradient(180deg, transparent, #00f5ff, transparent)',
          opacity: 0.3,
        }}
        animate={{ opacity: [0.1, 0.4, 0.1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Scanning laser line */}
      <motion.div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: 2,
          background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.6), transparent)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Header */}
      <div style={{
        padding: '20px 16px 12px',
        borderBottom: '1px solid rgba(0, 245, 255, 0.08)',
      }}>
        <motion.h2
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: '#00f5ff',
            marginBottom: 4,
          }}
          animate={{ textShadow: ['0 0 10px rgba(0,245,255,0.3)', '0 0 20px rgba(0,245,255,0.6)', '0 0 10px rgba(0,245,255,0.3)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          COMPONENTS
        </motion.h2>
        <p style={{
          fontFamily: "'Exo 2', sans-serif",
          fontSize: 11,
          color: '#555577',
          letterSpacing: '0.1em',
          marginBottom: 8,
        }}>
          Drag to canvas to place
        </p>

        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search components..."
          style={{
            width: '100%',
            padding: '6px 10px',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(0, 245, 255, 0.12)',
            borderRadius: 6,
            color: '#c0c0e0',
            fontFamily: "'Exo 2', sans-serif",
            fontSize: 11,
            outline: 'none',
          }}
        />
      </div>

      {/* Component list */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px 10px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}>
        {isSearching ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {filteredMeta.map((meta, i) => (
              <ComponentRow key={meta.type} meta={meta} index={i} onDragStart={onDragStart} />
            ))}
            {filteredMeta.length === 0 && (
              <div style={{
                textAlign: 'center', padding: 20,
                fontFamily: "'Rajdhani', sans-serif", fontSize: 13, color: '#444466',
              }}>
                No components match "{search}"
              </div>
            )}
          </div>
        ) : (
          CATEGORIES.map((cat, catIdx) => {
            const isCollapsed = collapsed[cat.id];
            const rgb = hexToRgb(cat.accent);
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + catIdx * 0.05, type: 'spring', stiffness: 150 }}
                style={{ marginBottom: 6 }}
              >
                <motion.button
                  onClick={() => setCollapsed(c => ({ ...c, [cat.id]: !c[cat.id] }))}
                  whileHover={{ background: `rgba(${rgb}, 0.1)` }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    background: `rgba(${rgb}, 0.05)`,
                    border: `1px solid rgba(${rgb}, 0.2)`,
                    borderRadius: 6,
                    cursor: 'pointer',
                    marginBottom: 4,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <motion.span
                      style={{
                        fontFamily: "'Noto Serif JP', 'Orbitron', serif",
                        fontSize: 14,
                        color: cat.accent,
                        textShadow: `0 0 8px rgba(${rgb}, 0.6)`,
                        letterSpacing: '0.1em',
                      }}
                      animate={{ textShadow: [
                        `0 0 4px rgba(${rgb}, 0.4)`,
                        `0 0 12px rgba(${rgb}, 0.8)`,
                        `0 0 4px rgba(${rgb}, 0.4)`,
                      ] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: catIdx * 0.2 }}
                    >
                      {cat.kanji}
                    </motion.span>
                    <span style={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      color: cat.accent,
                    }}>
                      {cat.label.toUpperCase()}
                    </span>
                  </div>
                  <motion.span
                    animate={{ rotate: isCollapsed ? -90 : 0 }}
                    style={{ color: cat.accent, fontSize: 10, opacity: 0.7 }}
                  >
                    ▼
                  </motion.span>
                </motion.button>

                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 4 }}
                    >
                      {cat.types.map((type, i) => {
                        const meta = metaByType.get(type);
                        if (!meta) return null;
                        return <ComponentRow key={type} meta={meta} index={i} onDragStart={onDragStart} />;
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid rgba(0, 245, 255, 0.08)',
        textAlign: 'center',
      }}>
        <motion.div
          style={{
            fontFamily: "'Exo 2', sans-serif",
            fontSize: 10,
            color: '#444466',
            letterSpacing: '0.15em',
          }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {COMPONENT_META.length} COMPONENTS LOADED
        </motion.div>
      </div>
    </motion.aside>
  );
}

function ComponentRow({ meta, index, onDragStart }: {
  meta: typeof COMPONENT_META[number];
  index: number;
  onDragStart: (type: ComponentType) => void;
}) {
  const rgb = hexToRgb(meta.color);
  const rowRef = useRef<HTMLDivElement>(null);

  // Attach native HTML5 dragstart listener. Framer Motion strips the
  // onDragStart prop (it's reserved for pan gestures), so a JSX handler
  // never fires on motion.div — we bind directly to the DOM node instead.
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const handle = (e: DragEvent) => {
      e.dataTransfer?.setData('componentType', meta.type);
      if (e.dataTransfer) e.dataTransfer.effectAllowed = 'copy';
      onDragStart(meta.type);
    };
    el.addEventListener('dragstart', handle);
    return () => el.removeEventListener('dragstart', handle);
  }, [meta.type, onDragStart]);

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.04 + index * 0.02, type: 'spring', stiffness: 220 }}
      draggable
      whileHover={{
        scale: 1.03,
        x: 4,
        boxShadow: `0 0 24px ${meta.glowColor}`,
        borderColor: `rgba(${rgb}, 0.5)`,
      }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 10px',
        borderRadius: 8,
        background: `rgba(${rgb}, 0.03)`,
        border: `1px solid rgba(${rgb}, 0.15)`,
        cursor: 'grab',
        transition: 'border-color 0.3s',
        userSelect: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, transparent, rgba(${rgb}, 0.08), transparent)`,
          pointerEvents: 'none',
        }}
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.7 }}
      />
      <motion.div
        style={{
          width: 34,
          height: 34,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
          background: `rgba(${rgb}, 0.12)`,
          flexShrink: 0,
          border: `1px solid rgba(${rgb}, 0.2)`,
        }}
        animate={{ boxShadow: [
          `0 0 4px rgba(${rgb}, 0.2)`,
          `0 0 12px rgba(${rgb}, 0.5)`,
          `0 0 4px rgba(${rgb}, 0.2)`,
        ] }}
        transition={{ duration: 3, repeat: Infinity, delay: index * 0.1 }}
      >
        <ComponentIcon type={meta.type} size={20} color={meta.color} />
      </motion.div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{
          fontFamily: "'Exo 2', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          color: meta.color,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {meta.label}
        </div>
        <div style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 10,
          color: '#555577',
          lineHeight: 1.3,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {meta.description}
        </div>
      </div>
    </motion.div>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}
