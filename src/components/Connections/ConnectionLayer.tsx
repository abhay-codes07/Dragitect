import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { CanvasNode, Connection } from '../../types';
import { getComponentMeta } from '../../utils/componentMeta';

const PROTOCOL_COLORS: Record<string, string> = {
  http: '#3b82f6',
  websocket: '#00ff88',
  grpc: '#ff6b00',
  tcp: '#8b5cf6',
  amqp: '#ffd700',
  custom: '#888888',
};

interface Props {
  nodes: CanvasNode[];
  connections: Connection[];
  selectedConnection: string | null;
  onSelectConnection: (id: string | null) => void;
  onDeleteConnection: (id: string) => void;
  simulationHighlight?: string | null;
}

export default function ConnectionLayer({
  nodes, connections, selectedConnection, onSelectConnection, onDeleteConnection,
  simulationHighlight,
}: Props) {
  const nodeMap = useMemo(() => {
    const map = new Map<string, CanvasNode>();
    nodes.forEach(n => map.set(n.id, n));
    return map;
  }, [nodes]);

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 9999,
        height: 9999,
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      <defs>
        <filter id="conn-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="conn-bloom" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker
          id="arrowhead"
          markerWidth="12"
          markerHeight="8"
          refX="10"
          refY="4"
          orient="auto"
        >
          <polygon points="0 0, 12 4, 0 8" fill="#00f5ff" opacity="0.9" />
        </marker>
        {Object.entries(PROTOCOL_COLORS).map(([key, color]) => (
          <marker
            key={key}
            id={`arrow-${key}`}
            markerWidth="12"
            markerHeight="8"
            refX="10"
            refY="4"
            orient="auto"
          >
            <polygon points="0 0, 12 4, 0 8" fill={color} opacity="0.9" />
          </marker>
        ))}
      </defs>

      {connections.map((conn) => {
        const fromNode = nodeMap.get(conn.from);
        const toNode = nodeMap.get(conn.to);
        if (!fromNode || !toNode) return null;

        const fromMeta = getComponentMeta(fromNode.type);
        const lineColor = conn.protocol ? PROTOCOL_COLORS[conn.protocol] || fromMeta.color : fromMeta.color;
        const arrowId = conn.protocol ? `arrow-${conn.protocol}` : 'arrowhead';
        const isSelected = selectedConnection === conn.id;
        const isSimActive = simulationHighlight === conn.id;

        const x1 = fromNode.position.x;
        const y1 = fromNode.position.y;
        const x2 = toNode.position.x;
        const y2 = toNode.position.y;

        const dx = x2 - x1;
        const cx1 = x1 + dx * 0.3;
        const cy1 = y1;
        const cx2 = x2 - dx * 0.3;
        const cy2 = y2;
        const path = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2 - 10;

        return (
          <g key={conn.id}>
            {/* Hit area for click (invisible, wider) */}
            <path
              d={path}
              stroke="transparent"
              strokeWidth="16"
              fill="none"
              style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); onSelectConnection(conn.id); }}
            />

            {/* Simulation pulse highlight */}
            {isSimActive && (
              <motion.path
                d={path}
                stroke="#ff6b00"
                strokeWidth="8"
                fill="none"
                opacity="0.4"
                filter="url(#conn-glow)"
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            )}

            {/* Selection highlight */}
            {isSelected && (
              <motion.path
                d={path}
                stroke={lineColor}
                strokeWidth="6"
                fill="none"
                opacity="0.3"
                filter="url(#conn-glow)"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}

            {/* Outer bloom */}
            <motion.path
              d={path}
              stroke={lineColor}
              strokeWidth="10"
              fill="none"
              opacity={isSelected ? 0.25 : 0.1}
              filter="url(#conn-bloom)"
              initial={{ pathLength: 0 }}
              animate={{
                pathLength: 1,
                opacity: isSelected ? [0.2, 0.4, 0.2] : [0.08, 0.18, 0.08],
              }}
              transition={{
                pathLength: { duration: 0.6 },
                opacity: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
              }}
            />

            {/* Inner glow line */}
            <motion.path
              d={path}
              stroke={lineColor}
              strokeWidth="5"
              fill="none"
              opacity={isSelected ? 0.4 : 0.22}
              filter="url(#conn-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }}
            />

            {/* Main line */}
            <motion.path
              d={path}
              stroke={lineColor}
              strokeWidth={isSelected ? 2.8 : 2.2}
              fill="none"
              opacity={isSelected ? 0.95 : 0.75}
              strokeDasharray="10 5"
              markerEnd={`url(#${arrowId})`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }}
            >
              <animate
                attributeName="stroke-dashoffset"
                values="30;0"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </motion.path>

            {/* Flowing chakra particles */}
            <circle r="4" fill={lineColor} opacity="0.9" filter="url(#conn-bloom)">
              <animateMotion dur="1.8s" repeatCount="indefinite" path={path} />
              <animate attributeName="r" values="3;5;3" dur="1.8s" repeatCount="indefinite" />
            </circle>
            <circle r="2.5" fill="white" opacity="0.95">
              <animateMotion dur="1.8s" repeatCount="indefinite" path={path} />
            </circle>
            <circle r="3" fill={lineColor} opacity="0.7" filter="url(#conn-glow)">
              <animateMotion dur="2.4s" repeatCount="indefinite" path={path} begin="0.6s" />
            </circle>
            <circle r="1.8" fill="white" opacity="0.7">
              <animateMotion dur="2.4s" repeatCount="indefinite" path={path} begin="0.6s" />
            </circle>
            <circle r="2" fill={lineColor} opacity="0.5" filter="url(#conn-glow)">
              <animateMotion dur="3s" repeatCount="indefinite" path={path} begin="1.2s" />
            </circle>

            {/* Label */}
            {conn.label && (
              <g style={{ pointerEvents: 'none' }}>
                {/* Label background */}
                <rect
                  x={mx - conn.label.length * 3.5 - 6}
                  y={my - 20}
                  width={conn.label.length * 7 + 12}
                  height={16}
                  rx="4"
                  fill="rgba(10, 10, 30, 0.85)"
                  stroke={`${lineColor}33`}
                  strokeWidth="1"
                />
                <text
                  x={mx}
                  y={my - 9}
                  textAnchor="middle"
                  fill={lineColor}
                  fontSize="9"
                  fontFamily="'Exo 2', sans-serif"
                  fontWeight="600"
                  letterSpacing="0.5"
                >
                  {conn.label}
                </text>
              </g>
            )}

            {/* Protocol badge */}
            {conn.protocol && !conn.label && (
              <g style={{ pointerEvents: 'none' }}>
                <rect
                  x={mx - 16}
                  y={my - 20}
                  width={32}
                  height={14}
                  rx="4"
                  fill="rgba(10, 10, 30, 0.85)"
                  stroke={`${lineColor}33`}
                  strokeWidth="1"
                />
                <text
                  x={mx}
                  y={my - 10}
                  textAnchor="middle"
                  fill={lineColor}
                  fontSize="8"
                  fontFamily="'Exo 2', sans-serif"
                  fontWeight="600"
                  letterSpacing="0.5"
                >
                  {conn.protocol.toUpperCase()}
                </text>
              </g>
            )}

            {/* Delete button (visible on hover) */}
            <g
              style={{ cursor: 'pointer', pointerEvents: 'all' }}
              onClick={(e) => { e.stopPropagation(); onDeleteConnection(conn.id); }}
            >
              <circle cx={mx + 20} cy={my} r="8" fill="#1a1a3e" stroke="rgba(255,51,102,0.4)" strokeWidth="1" opacity="0">
                <set attributeName="opacity" to="1" begin="mouseover" end="mouseout" />
              </circle>
              <text x={mx + 20} y={my + 4} textAnchor="middle" fill="#ff3366" fontSize="10" fontWeight="bold" opacity="0" style={{ pointerEvents: 'none' }}>
                x
                <set attributeName="opacity" to="1" begin="mouseover" end="mouseout" />
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
