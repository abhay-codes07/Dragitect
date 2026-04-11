import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { CanvasNode, Connection } from '../../types';
import { getComponentMeta } from '../../utils/componentMeta';

interface Props {
  nodes: CanvasNode[];
  connections: Connection[];
  onDeleteConnection: (id: string) => void;
}

export default function ConnectionLayer({ nodes, connections, onDeleteConnection }: Props) {
  const nodeMap = useMemo(() => {
    const map = new Map<string, CanvasNode>();
    nodes.forEach(n => map.set(n.id, n));
    return map;
  }, [nodes]);

  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      <defs>
        {/* Animated gradient for connections */}
        <linearGradient id="conn-grad-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#00f5ff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00f5ff" stopOpacity="0.8" />
        </linearGradient>
        <filter id="conn-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#00f5ff"
            opacity="0.7"
          />
        </marker>
      </defs>

      {connections.map((conn) => {
        const fromNode = nodeMap.get(conn.from);
        const toNode = nodeMap.get(conn.to);
        if (!fromNode || !toNode) return null;

        const fromMeta = getComponentMeta(fromNode.type);
        const x1 = fromNode.position.x;
        const y1 = fromNode.position.y;
        const x2 = toNode.position.x;
        const y2 = toNode.position.y;

        // Curved path
        const dx = x2 - x1;
        const cx1 = x1 + dx * 0.3;
        const cy1 = y1;
        const cx2 = x2 - dx * 0.3;
        const cy2 = y2;
        const path = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

        // Mid point for label/delete
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2 - 10;

        return (
          <g key={conn.id}>
            {/* Glow line */}
            <motion.path
              d={path}
              stroke={fromMeta.color}
              strokeWidth="4"
              fill="none"
              opacity="0.15"
              filter="url(#conn-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }}
            />

            {/* Main line */}
            <motion.path
              d={path}
              stroke={fromMeta.color}
              strokeWidth="2"
              fill="none"
              opacity="0.6"
              strokeDasharray="8 4"
              markerEnd="url(#arrowhead)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }}
            >
              <animate
                attributeName="stroke-dashoffset"
                values="24;0"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </motion.path>

            {/* Flowing particle dots */}
            <circle r="3" fill={fromMeta.color} opacity="0.8" filter="url(#conn-glow)">
              <animateMotion dur="2s" repeatCount="indefinite" path={path} />
            </circle>
            <circle r="2" fill="white" opacity="0.6">
              <animateMotion dur="2s" repeatCount="indefinite" path={path} begin="0.5s" />
            </circle>

            {/* Delete button at midpoint */}
            <g
              style={{ cursor: 'pointer', pointerEvents: 'all' }}
              onClick={() => onDeleteConnection(conn.id)}
            >
              <circle cx={mx} cy={my} r="8" fill="#1a1a3e" stroke="rgba(255,51,102,0.4)" strokeWidth="1" opacity="0" >
                <set attributeName="opacity" to="1" begin="mouseover" end="mouseout" />
              </circle>
              <text x={mx} y={my + 4} textAnchor="middle" fill="#ff3366" fontSize="10" fontWeight="bold" opacity="0" style={{ pointerEvents: 'none' }}>
                x
                <set attributeName="opacity" to="1" begin="mouseover" end="mouseout" />
              </text>
            </g>

            {/* Connection label */}
            {conn.label && (
              <text
                x={mx}
                y={my - 12}
                textAnchor="middle"
                fill="#8888aa"
                fontSize="10"
                fontFamily="'Exo 2', sans-serif"
                style={{ pointerEvents: 'none' }}
              >
                {conn.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
