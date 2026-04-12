import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { COMPONENT_META } from '../../utils/componentMeta';
import type { ComponentType } from '../../types';
import ComponentIcon from '../SystemComponents/ComponentIcon';

interface Props {
  onDragStart: (type: ComponentType) => void;
}

export default function Sidebar({ onDragStart }: Props) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return COMPONENT_META;
    const q = search.toLowerCase();
    return COMPONENT_META.filter(m =>
      m.label.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      style={{
        width: 260,
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

        {/* Search box */}
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
        padding: '8px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}>
        {filtered.map((meta, i) => (
          <motion.div
            key={meta.type}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.04, type: 'spring', stiffness: 200 }}
            draggable
            onDragStart={(e) => {
              const event = e as unknown as React.DragEvent;
              event.dataTransfer?.setData('componentType', meta.type);
              onDragStart(meta.type);
            }}
            whileHover={{
              scale: 1.03,
              x: 4,
              boxShadow: `0 0 20px ${meta.glowColor}`,
            }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid rgba(${hexToRgb(meta.color)}, 0.15)`,
              cursor: 'grab',
              transition: 'border-color 0.3s',
              userSelect: 'none',
            }}
          >
            <div style={{
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
              background: `rgba(${hexToRgb(meta.color)}, 0.1)`,
              flexShrink: 0,
            }}>
              <ComponentIcon type={meta.type} size={22} color={meta.color} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: "'Exo 2', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: meta.color,
                whiteSpace: 'nowrap',
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
        ))}
        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 20,
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 13,
            color: '#444466',
          }}>
            No components match "{search}"
          </div>
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

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}
