import { useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CanvasNode } from '../../types';
import { getComponentMeta } from '../../utils/componentMeta';
import ComponentIcon from './ComponentIcon';

interface Props {
  node: CanvasNode;
  isSelected: boolean;
  isConnecting: boolean;
  isSimHighlight?: boolean;
  onSelect: (id: string) => void;
  onDrag: (id: string, x: number, y: number) => void;
  onConnectionStart: (id: string) => void;
  onConnectionEnd: (id: string) => void;
  onDelete: (id: string) => void;
  onLabelChange: (id: string, label: string) => void;
}

export default function CanvasNodeComponent({
  node, isSelected, isConnecting, isSimHighlight,
  onSelect, onDrag, onConnectionStart, onConnectionEnd, onDelete, onLabelChange,
}: Props) {
  const meta = getComponentMeta(node.type);
  const dragRef = useRef<{ startX: number; startY: number; nodeX: number; nodeY: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Deterministic offsets so each node floats at its own phase
  const seed = useMemo(() => {
    let h = 0;
    for (let i = 0; i < node.id.length; i++) h = (h * 31 + node.id.charCodeAt(i)) | 0;
    return Math.abs(h);
  }, [node.id]);
  const floatDelay = (seed % 100) / 100;
  const floatDuration = 3 + ((seed >> 4) % 5) * 0.3;
  const rgb = hexToRgb(meta.color);

  // Orbiting chakra sparks around the node
  const sparks = useMemo(() =>
    Array.from({ length: 3 }, (_, i) => ({
      id: i,
      orbit: 60 + (i * 10),
      duration: 4 + i * 0.6,
      phase: (seed >> (i * 3)) % 360,
    })), [seed]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isEditing) return;
    e.stopPropagation();
    e.preventDefault();
    onSelect(node.id);
    dragRef.current = {
      startX: e.clientX, startY: e.clientY,
      nodeX: node.position.x, nodeY: node.position.y,
    };
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [node.id, node.position, onSelect, isEditing]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current || !isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    onDrag(node.id, dragRef.current.nodeX + dx, dragRef.current.nodeY + dy);
  }, [isDragging, node.id, onDrag]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      dragRef.current = null;
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  }, [isDragging]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: -180 }}
      animate={{
        scale: 1,
        opacity: 1,
        rotate: 0,
        y: isDragging ? 0 : [0, -3, 0],
      }}
      transition={{
        scale: { type: 'spring', stiffness: 260, damping: 20 },
        opacity: { duration: 0.35 },
        rotate: { type: 'spring', stiffness: 260, damping: 20 },
        y: isDragging
          ? { duration: 0 }
          : { duration: floatDuration, delay: floatDelay, repeat: Infinity, ease: 'easeInOut' },
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        left: node.position.x - 60,
        top: node.position.y - 45,
        width: 120,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 100 : isSelected ? 50 : 10,
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {/* Placement shockwave — fires once on spawn */}
      <motion.div
        initial={{ scale: 0, opacity: 0.8 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `2px solid ${meta.color}`,
          boxShadow: `0 0 40px ${meta.glowColor}`,
          pointerEvents: 'none',
        }}
      />
      <motion.div
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{ scale: 4.5, opacity: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `1px solid rgba(${rgb}, 0.6)`,
          pointerEvents: 'none',
        }}
      />

      {/* Permanent soft aura */}
      <motion.div
        style={{
          position: 'absolute',
          inset: -24,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${rgb}, 0.18), transparent 70%)`,
          pointerEvents: 'none',
        }}
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }}
      />

      {/* Orbiting chakra sparks */}
      {!isDragging && sparks.map(sp => (
        <motion.div
          key={`spark-${sp.id}`}
          style={{
            position: 'absolute',
            top: 30, left: 60,
            width: 4, height: 4,
            marginLeft: -2, marginTop: -2,
            borderRadius: '50%',
            background: meta.color,
            boxShadow: `0 0 8px ${meta.color}, 0 0 16px ${meta.color}`,
            pointerEvents: 'none',
          }}
          animate={{
            x: [
              Math.cos((sp.phase) * Math.PI / 180) * sp.orbit,
              Math.cos((sp.phase + 120) * Math.PI / 180) * sp.orbit,
              Math.cos((sp.phase + 240) * Math.PI / 180) * sp.orbit,
              Math.cos((sp.phase + 360) * Math.PI / 180) * sp.orbit,
            ],
            y: [
              Math.sin((sp.phase) * Math.PI / 180) * sp.orbit * 0.55,
              Math.sin((sp.phase + 120) * Math.PI / 180) * sp.orbit * 0.55,
              Math.sin((sp.phase + 240) * Math.PI / 180) * sp.orbit * 0.55,
              Math.sin((sp.phase + 360) * Math.PI / 180) * sp.orbit * 0.55,
            ],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            x: { duration: sp.duration, repeat: Infinity, ease: 'linear' },
            y: { duration: sp.duration, repeat: Infinity, ease: 'linear' },
            opacity: { duration: sp.duration, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      ))}

      {/* Simulation highlight ring */}
      {isSimHighlight && !isSelected && (
        <motion.div
          style={{
            position: 'absolute',
            inset: -8,
            borderRadius: 16,
            border: '2px solid #ff6b00',
            boxShadow: '0 0 30px rgba(255, 107, 0, 0.5)',
          }}
          animate={{
            boxShadow: [
              '0 0 15px rgba(255, 107, 0, 0.3)',
              '0 0 50px rgba(255, 107, 0, 0.8)',
              '0 0 15px rgba(255, 107, 0, 0.3)',
            ],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}

      {/* Selection ring */}
      {isSelected && (
        <motion.div
          layoutId="selection-ring"
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: 14,
            border: `2px solid ${meta.color}`,
            boxShadow: `0 0 20px ${meta.glowColor}`,
          }}
          animate={{
            boxShadow: [
              `0 0 10px ${meta.glowColor}`,
              `0 0 40px ${meta.glowColor}`,
              `0 0 10px ${meta.glowColor}`,
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Hover spark burst */}
      <AnimatePresence>
        {isHovered && !isDragging && (
          <>
            {[0, 60, 120, 180, 240, 300].map(deg => (
              <motion.div
                key={`burst-${deg}`}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((deg * Math.PI) / 180) * 48,
                  y: Math.sin((deg * Math.PI) / 180) * 48,
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  width: 5, height: 5,
                  marginLeft: -2.5, marginTop: -2.5,
                  borderRadius: '50%',
                  background: meta.color,
                  boxShadow: `0 0 10px ${meta.color}`,
                  pointerEvents: 'none',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main card */}
      <motion.div
        animate={
          isDragging
            ? { scale: 1.1, y: -4, rotate: [0, -2, 2, 0] }
            : isHovered
              ? { scale: 1.05, y: -2 }
              : { scale: 1, y: 0, rotate: 0 }
        }
        transition={
          isDragging
            ? { rotate: { duration: 0.4, repeat: Infinity } }
            : { type: 'spring', stiffness: 260, damping: 20 }
        }
        style={{
          background: `linear-gradient(135deg, rgba(${rgb}, 0.18), rgba(${rgb}, 0.04))`,
          border: `1px solid rgba(${rgb}, ${isSelected ? 0.7 : 0.3})`,
          borderRadius: 10,
          padding: '12px 10px 10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          backdropFilter: 'blur(8px)',
          boxShadow: isDragging
            ? `0 10px 40px rgba(0,0,0,0.5), 0 0 40px ${meta.glowColor}`
            : isHovered
              ? `0 6px 22px rgba(0,0,0,0.4), 0 0 24px ${meta.glowColor}`
              : `0 2px 12px rgba(0,0,0,0.3), 0 0 12px rgba(${rgb}, 0.15)`,
          transition: 'box-shadow 0.3s, border-color 0.3s',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Moving shimmer */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(120deg, transparent 30%, rgba(${rgb}, 0.15) 50%, transparent 70%)`,
            pointerEvents: 'none',
          }}
          animate={{ x: ['-150%', '150%'] }}
          transition={{ duration: 4 + (seed % 3), repeat: Infinity, ease: 'linear', delay: floatDelay * 2 }}
        />

        {/* Icon with pulse + rotation */}
        <motion.div
          style={{
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            background: `rgba(${rgb}, 0.15)`,
            border: `1px solid rgba(${rgb}, 0.3)`,
            position: 'relative',
          }}
          animate={{
            boxShadow: [
              `0 0 5px rgba(${rgb}, 0.3)`,
              `0 0 20px rgba(${rgb}, 0.7)`,
              `0 0 5px rgba(${rgb}, 0.3)`,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ComponentIcon type={node.type} size={24} color={meta.color} />
        </motion.div>

        {/* Label */}
        {isEditing ? (
          <input
            autoFocus
            defaultValue={node.label}
            onBlur={(e) => {
              onLabelChange(node.id, e.target.value || meta.label);
              setIsEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onLabelChange(node.id, (e.target as HTMLInputElement).value || meta.label);
                setIsEditing(false);
              }
            }}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.3)',
              border: `1px solid ${meta.color}`,
              borderRadius: 4,
              color: '#fff',
              fontFamily: "'Exo 2', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              textAlign: 'center',
              padding: '2px 4px',
              outline: 'none',
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div style={{
            fontFamily: "'Exo 2', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: meta.color,
            textAlign: 'center',
            lineHeight: 1.2,
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textShadow: `0 0 8px ${meta.glowColor}`,
          }}>
            {node.label}
          </div>
        )}
      </motion.div>

      {/* Connection handle bottom */}
      {(isHovered || isSelected || isConnecting) && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: 'absolute',
            bottom: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: isConnecting ? '#ff00e5' : meta.color,
            border: '2px solid rgba(255,255,255,0.4)',
            cursor: 'crosshair',
            boxShadow: `0 0 14px ${isConnecting ? 'rgba(255,0,229,0.8)' : meta.glowColor}`,
            zIndex: 20,
          }}
          whileHover={{ scale: 1.4 }}
          onPointerDown={(e) => {
            e.stopPropagation();
            if (isConnecting) onConnectionEnd(node.id);
            else onConnectionStart(node.id);
          }}
        />
      )}

      {/* Delete button */}
      {isSelected && !isDragging && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.2, background: '#ff3366' }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(node.id);
          }}
          style={{
            position: 'absolute',
            top: -8,
            right: -8,
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: '1px solid rgba(255,51,102,0.5)',
            background: 'rgba(255,51,102,0.2)',
            color: '#ff3366',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            zIndex: 30,
          }}
        >
          x
        </motion.button>
      )}

      {/* Connection handle top */}
      {(isHovered || isConnecting) && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: 'absolute',
            top: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: isConnecting ? '#00ff88' : meta.color,
            border: '2px solid rgba(255,255,255,0.4)',
            cursor: 'crosshair',
            boxShadow: `0 0 14px ${isConnecting ? 'rgba(0,255,136,0.8)' : meta.glowColor}`,
            zIndex: 20,
          }}
          whileHover={{ scale: 1.4 }}
          onPointerDown={(e) => {
            e.stopPropagation();
            if (isConnecting) onConnectionEnd(node.id);
            else onConnectionStart(node.id);
          }}
        />
      )}
    </motion.div>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}
