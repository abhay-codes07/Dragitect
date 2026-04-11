import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../Sidebar/Sidebar';
import DesignCanvas from '../Canvas/DesignCanvas';
import SenseiGuide from '../Character/SenseiGuide';
import TopBar from './TopBar';
import type { ComponentType, Position, CanvasNode, Connection, SenseiMood } from '../../types';

interface Props {
  nodes: CanvasNode[];
  connections: Connection[];
  selectedNode: string | null;
  connectingFrom: string | null;
  senseiMood: SenseiMood;
  onAddNode: (type: ComponentType, position: Position) => CanvasNode;
  onUpdateNodePosition: (id: string, position: Position) => void;
  onSelectNode: (id: string | null) => void;
  onDeleteNode: (id: string) => void;
  onUpdateNodeLabel: (id: string, label: string) => void;
  onSetConnectingFrom: (id: string | null) => void;
  onAddConnection: (from: string, to: string) => void;
  onDeleteConnection: (id: string) => void;
}

export default function Workspace({
  nodes, connections, selectedNode, connectingFrom, senseiMood,
  onAddNode, onUpdateNodePosition, onSelectNode,
  onDeleteNode, onUpdateNodeLabel,
  onSetConnectingFrom, onAddConnection, onDeleteConnection,
}: Props) {

  const handleConnectionStart = useCallback((id: string) => {
    onSetConnectingFrom(id);
  }, [onSetConnectingFrom]);

  const handleConnectionEnd = useCallback((id: string) => {
    if (connectingFrom && connectingFrom !== id) {
      onAddConnection(connectingFrom, id);
    }
    onSetConnectingFrom(null);
  }, [connectingFrom, onAddConnection, onSetConnectingFrom]);

  // ESC to cancel connecting
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onSetConnectingFrom(null);
        onSelectNode(null);
      }
      if (e.key === 'Delete' && selectedNode) {
        onDeleteNode(selectedNode);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onSetConnectingFrom, onSelectNode, selectedNode, onDeleteNode]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-primary)',
        overflow: 'hidden',
      }}
    >
      <TopBar nodeCount={nodes.length} connectionCount={connections.length} />

      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <Sidebar onDragStart={() => {}} />

        <div style={{ flex: 1, position: 'relative' }}>
          <DesignCanvas
            nodes={nodes}
            connections={connections}
            selectedNode={selectedNode}
            connectingFrom={connectingFrom}
            onAddNode={(type, pos) => onAddNode(type, pos)}
            onUpdateNodePosition={(id, pos) => onUpdateNodePosition(id, pos)}
            onSelectNode={onSelectNode}
            onDeleteNode={onDeleteNode}
            onUpdateNodeLabel={onUpdateNodeLabel}
            onConnectionStart={handleConnectionStart}
            onConnectionEnd={handleConnectionEnd}
            onSetConnectingFrom={onSetConnectingFrom}
            onDeleteConnection={onDeleteConnection}
          />

          <SenseiGuide
            mood={senseiMood}
            nodeCount={nodes.length}
            connectionCount={connections.length}
          />
        </div>
      </div>
    </motion.div>
  );
}
