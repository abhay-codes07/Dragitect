import { motion } from 'framer-motion';
import ComponentIcon from '../SystemComponents/ComponentIcon';
import { getComponentMeta } from '../../utils/componentMeta';
import type { ComponentType } from '../../types';

interface DiagramNode {
  id?: string;
  type: ComponentType;
  label: string;
  x: number;
  y: number;
  highlight?: boolean;
}

interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
}

interface Props {
  nodes: DiagramNode[];
  edges?: DiagramEdge[];
  width?: number;
  height?: number;
  caption?: string;
  accent?: string;
}

export default function MiniDiagram({
  nodes, edges = [], width = 760, height = 320, caption, accent = '#00f5ff',
}: Props) {
  const pad = 40;
  const xs = nodes.map(n => n.x);
  const ys = nodes.map(n => n.y);
  const minX = Math.min(...xs, 0);
  const minY = Math.min(...ys, 0);
  const maxX = Math.max(...xs, width - pad * 2);
  const maxY = Math.max(...ys, height - pad * 2);
  const spanX = Math.max(maxX - minX, 1);
  const spanY = Math.max(maxY - minY, 1);

  const project = (x: number, y: number) => ({
    x: pad + ((x - minX) / spanX) * (width - pad * 2),
    y: pad + ((y - minY) / spanY) * (height - pad * 2),
  });

  const nodeMap = new Map<string, DiagramNode>();
  nodes.forEach(n => { if (n.id) nodeMap.set(n.id, n); });

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: `${width} / ${height}`,
          borderRadius: 14,
          background: 'radial-gradient(ellipse at center, rgba(0,245,255,0.04), rgba(0,0,0,0.4))',
          border: `1px solid ${accent}22`,
          overflow: 'hidden',
        }}
      >
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(${accent}0a 1px, transparent 1px),
            linear-gradient(90deg, ${accent}0a 1px, transparent 1px)
          `,
          backgroundSize: '28px 28px',
          opacity: 0.4,
          pointerEvents: 'none',
        }} />

        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <defs>
            <marker id={`mini-arrow-${accent.replace('#','')}`} markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
              <polygon points="0 0, 10 4, 0 8" fill={accent} opacity="0.85" />
            </marker>
          </defs>

          {edges.map((e, i) => {
            const from = nodeMap.get(e.from);
            const to = nodeMap.get(e.to);
            if (!from || !to) return null;
            const p1 = project(from.x, from.y);
            const p2 = project(to.x, to.y);
            const mx = (p1.x + p2.x) / 2;
            const my = (p1.y + p2.y) / 2;
            const dx = p2.x - p1.x;
            const cx1 = p1.x + dx * 0.4;
            const cx2 = p2.x - dx * 0.4;
            const d = `M ${p1.x} ${p1.y} C ${cx1} ${p1.y}, ${cx2} ${p2.y}, ${p2.x} ${p2.y}`;
            return (
              <g key={i}>
                <motion.path
                  d={d}
                  stroke={accent}
                  strokeWidth={1.6}
                  fill="none"
                  opacity={0.6}
                  strokeDasharray="6 4"
                  markerEnd={`url(#mini-arrow-${accent.replace('#','')})`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                >
                  <animate attributeName="stroke-dashoffset" values="20;0" dur="1.5s" repeatCount="indefinite" />
                </motion.path>
                {e.label && (
                  <g>
                    <rect x={mx - e.label.length * 3.2} y={my - 14} width={e.label.length * 6.5} height={12} rx={3} fill="rgba(10,10,30,0.8)" stroke={`${accent}33`} />
                    <text x={mx} y={my - 5} textAnchor="middle" fill={accent} fontSize="8" fontFamily="'Exo 2', sans-serif" fontWeight={600}>
                      {e.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {nodes.map((n, i) => {
          const p = project(n.x, n.y);
          const meta = getComponentMeta(n.type);
          return (
            <motion.div
              key={n.id ?? i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.05, type: 'spring', stiffness: 240, damping: 18 }}
              style={{
                position: 'absolute',
                left: `${(p.x / width) * 100}%`,
                top: `${(p.y / height) * 100}%`,
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                pointerEvents: 'none',
              }}
            >
              {n.highlight && (
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  style={{
                    position: 'absolute',
                    width: 46, height: 46,
                    borderRadius: '50%',
                    border: `2px solid ${meta.color}`,
                    top: -3, left: '50%', marginLeft: -23,
                  }}
                />
              )}
              <div style={{
                width: 40, height: 40,
                borderRadius: 8,
                background: `linear-gradient(135deg, ${meta.color}33, ${meta.color}10)`,
                border: `1px solid ${meta.color}${n.highlight ? '' : '55'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: n.highlight ? `0 0 18px ${meta.glowColor}` : `0 0 8px ${meta.color}33`,
              }}>
                <ComponentIcon type={n.type} size={22} color={meta.color} />
              </div>
              <div style={{
                fontFamily: "'Exo 2', sans-serif",
                fontSize: 9,
                fontWeight: 600,
                color: meta.color,
                letterSpacing: '0.05em',
                textShadow: `0 0 6px ${meta.glowColor}`,
                whiteSpace: 'nowrap',
              }}>
                {n.label}
              </div>
            </motion.div>
          );
        })}
      </div>
      {caption && (
        <div style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 12,
          color: '#7777aa',
          textAlign: 'center',
          fontStyle: 'italic',
        }}>
          {caption}
        </div>
      )}
    </div>
  );
}
