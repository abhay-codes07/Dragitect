import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { CanvasNode, Connection, CanvasTransform } from '../../types';
import { getComponentMeta } from '../../utils/componentMeta';

interface Props {
  nodes: CanvasNode[];
  connections: Connection[];
  transform: CanvasTransform;
  canvasWidth: number;
  canvasHeight: number;
  onNavigate: (offsetX: number, offsetY: number) => void;
}

const MAP_W = 160;
const MAP_H = 110;

export default function MiniMap({ nodes, connections, transform, canvasWidth, canvasHeight, onNavigate }: Props) {
  const { bounds, scale } = useMemo(() => {
    if (nodes.length === 0) return { bounds: { minX: 0, minY: 0, maxX: 600, maxY: 400 }, scale: 0.15 };
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of nodes) {
      minX = Math.min(minX, n.position.x - 80);
      minY = Math.min(minY, n.position.y - 60);
      maxX = Math.max(maxX, n.position.x + 80);
      maxY = Math.max(maxY, n.position.y + 60);
    }
    const pad = 60;
    minX -= pad; minY -= pad; maxX += pad; maxY += pad;
    const w = maxX - minX;
    const h = maxY - minY;
    const s = Math.min(MAP_W / w, MAP_H / h);
    return { bounds: { minX, minY, maxX, maxY }, scale: s };
  }, [nodes]);

  const nodeMap = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes]);

  // Viewport rectangle in minimap coordinates
  const vpX = (-transform.offsetX / transform.scale - bounds.minX) * scale;
  const vpY = (-transform.offsetY / transform.scale - bounds.minY) * scale;
  const vpW = (canvasWidth / transform.scale) * scale;
  const vpH = (canvasHeight / transform.scale) * scale;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const worldX = clickX / scale + bounds.minX;
    const worldY = clickY / scale + bounds.minY;
    const newOffsetX = -(worldX * transform.scale - canvasWidth / 2);
    const newOffsetY = -(worldY * transform.scale - canvasHeight / 2);
    onNavigate(newOffsetX, newOffsetY);
  };

  if (nodes.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      onClick={handleClick}
      style={{
        position: 'absolute',
        bottom: 12,
        left: 12,
        width: MAP_W,
        height: MAP_H,
        background: 'rgba(10, 10, 30, 0.85)',
        border: '1px solid rgba(0, 245, 255, 0.15)',
        borderRadius: 8,
        overflow: 'hidden',
        cursor: 'crosshair',
        zIndex: 55,
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Connections */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {connections.map(c => {
          const from = nodeMap.get(c.from);
          const to = nodeMap.get(c.to);
          if (!from || !to) return null;
          return (
            <line
              key={c.id}
              x1={(from.position.x - bounds.minX) * scale}
              y1={(from.position.y - bounds.minY) * scale}
              x2={(to.position.x - bounds.minX) * scale}
              y2={(to.position.y - bounds.minY) * scale}
              stroke="rgba(0, 245, 255, 0.2)"
              strokeWidth={0.5}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map(n => {
        const meta = getComponentMeta(n.type);
        return (
          <div
            key={n.id}
            style={{
              position: 'absolute',
              left: (n.position.x - bounds.minX) * scale - 3,
              top: (n.position.y - bounds.minY) * scale - 3,
              width: 6,
              height: 6,
              borderRadius: 2,
              background: meta.color,
              opacity: 0.8,
            }}
          />
        );
      })}

      {/* Viewport rectangle */}
      <div
        style={{
          position: 'absolute',
          left: Math.max(0, vpX),
          top: Math.max(0, vpY),
          width: Math.min(vpW, MAP_W),
          height: Math.min(vpH, MAP_H),
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Label */}
      <div style={{
        position: 'absolute',
        top: 2,
        right: 4,
        fontFamily: "'Exo 2', sans-serif",
        fontSize: 7,
        color: '#555577',
        letterSpacing: '0.1em',
      }}>
        MAP
      </div>
    </motion.div>
  );
}
