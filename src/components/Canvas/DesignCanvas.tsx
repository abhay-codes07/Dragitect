import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { CanvasNode, Connection, ComponentType } from '../../types';
import CanvasNodeComponent from '../SystemComponents/CanvasNodeComponent';
import ConnectionLayer from '../Connections/ConnectionLayer';

interface Props {
  nodes: CanvasNode[];
  connections: Connection[];
  selectedNode: string | null;
  connectingFrom: string | null;
  onAddNode: (type: ComponentType, pos: { x: number; y: number }) => void;
  onUpdateNodePosition: (id: string, pos: { x: number; y: number }) => void;
  onSelectNode: (id: string | null) => void;
  onDeleteNode: (id: string) => void;
  onUpdateNodeLabel: (id: string, label: string) => void;
  onConnectionStart: (id: string) => void;
  onConnectionEnd: (id: string) => void;
  onSetConnectingFrom: (id: string | null) => void;
  onDeleteConnection: (id: string) => void;
}

export default function DesignCanvas({
  nodes, connections, selectedNode, connectingFrom,
  onAddNode, onUpdateNodePosition, onSelectNode,
  onDeleteNode, onUpdateNodeLabel,
  onConnectionStart, onConnectionEnd, onSetConnectingFrom,
  onDeleteConnection,
}: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [gridVisible] = useState(true);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('componentType') as ComponentType;
    if (!type || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onAddNode(type, { x, y });
  }, [onAddNode]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).dataset.canvas) {
      onSelectNode(null);
      if (connectingFrom) {
        onSetConnectingFrom(null);
      }
    }
  }, [onSelectNode, connectingFrom, onSetConnectingFrom]);

  return (
    <motion.div
      ref={canvasRef}
      data-canvas="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleCanvasClick}
      style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        background: gridVisible
          ? `
            radial-gradient(ellipse at center, rgba(0,245,255,0.03) 0%, transparent 70%),
            linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)
          `
          : '#0a0a1a',
        backgroundSize: gridVisible ? '100% 100%, 40px 40px, 40px 40px' : undefined,
        cursor: connectingFrom ? 'crosshair' : 'default',
      }}
    >
      {/* Grid origin marker */}
      <div data-canvas="true" style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}>
        {/* Ambient corner glows */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 300,
          height: 300,
          background: 'radial-gradient(circle at 0 0, rgba(0,245,255,0.04), transparent)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 300,
          height: 300,
          background: 'radial-gradient(circle at 100% 100%, rgba(255,0,229,0.04), transparent)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Connection layer */}
      <ConnectionLayer
        nodes={nodes}
        connections={connections}
        onDeleteConnection={onDeleteConnection}
      />

      {/* Nodes */}
      {nodes.map(node => (
        <CanvasNodeComponent
          key={node.id}
          node={node}
          isSelected={selectedNode === node.id}
          isConnecting={connectingFrom !== null}
          onSelect={onSelectNode}
          onDrag={(id, x, y) => onUpdateNodePosition(id, { x, y })}
          onConnectionStart={onConnectionStart}
          onConnectionEnd={onConnectionEnd}
          onDelete={onDeleteNode}
          onLabelChange={onUpdateNodeLabel}
        />
      ))}

      {/* Empty state */}
      {nodes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          data-canvas="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: '#222244',
              letterSpacing: '0.15em',
              marginBottom: 12,
            }}
          >
            DRAG COMPONENTS HERE
          </motion.div>
          <div style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 14,
            color: '#333355',
          }}>
            Build your system architecture, one component at a time
          </div>

          {/* Animated arrows pointing from sidebar */}
          <motion.svg width="60" height="30" viewBox="0 0 60 30" style={{ marginTop: 20 }}>
            <motion.path
              d="M5 15 L50 15"
              stroke="#333355"
              strokeWidth="1.5"
              fill="none"
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.path
              d="M40 8 L52 15 L40 22"
              stroke="#333355"
              strokeWidth="1.5"
              fill="none"
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.svg>
        </motion.div>
      )}

      {/* Connecting mode indicator */}
      {connectingFrom && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 20px',
            background: 'rgba(255, 0, 229, 0.15)',
            border: '1px solid rgba(255, 0, 229, 0.3)',
            borderRadius: 20,
            fontFamily: "'Exo 2', sans-serif",
            fontSize: 12,
            color: '#ff00e5',
            letterSpacing: '0.1em',
            zIndex: 60,
          }}
        >
          Click another component to connect | ESC to cancel
        </motion.div>
      )}

      {/* Top bar with project info */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.3), transparent)',
      }} />
    </motion.div>
  );
}
