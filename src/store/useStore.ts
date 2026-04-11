import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { CanvasNode, Connection, ComponentType, Position, AppView, SenseiMood } from '../types';

export function useAppStore() {
  const [view, setView] = useState<AppView>('landing');
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [senseiMood, setSenseiMood] = useState<SenseiMood>('idle');

  const addNode = useCallback((type: ComponentType, position: Position) => {
    const labels: Record<ComponentType, string> = {
      client: 'Client',
      server: 'Server',
      database: 'Database',
      loadbalancer: 'Load Balancer',
      cache: 'Cache',
      queue: 'Message Queue',
      'api-gateway': 'API Gateway',
      cdn: 'CDN',
      storage: 'Object Storage',
      microservice: 'Microservice',
    };
    const node: CanvasNode = {
      id: uuidv4(),
      type,
      position,
      label: labels[type],
    };
    setNodes(prev => [...prev, node]);
    setSenseiMood('excited');
    setTimeout(() => setSenseiMood('idle'), 3000);
    return node;
  }, []);

  const updateNodePosition = useCallback((id: string, position: Position) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, position } : n));
  }, []);

  const removeNode = useCallback((id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setConnections(prev => prev.filter(c => c.from !== id && c.to !== id));
    if (selectedNode === id) setSelectedNode(null);
  }, [selectedNode]);

  const addConnection = useCallback((from: string, to: string) => {
    if (from === to) return;
    const exists = connections.some(c => c.from === from && c.to === to);
    if (exists) return;
    const conn: Connection = {
      id: uuidv4(),
      from,
      to,
      animated: true,
    };
    setConnections(prev => [...prev, conn]);
    setSenseiMood('impressed');
    setTimeout(() => setSenseiMood('idle'), 3000);
  }, [connections]);

  const removeConnection = useCallback((id: string) => {
    setConnections(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateNodeLabel = useCallback((id: string, label: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, label } : n));
  }, []);

  return {
    view, setView,
    nodes, setNodes,
    connections,
    selectedNode, setSelectedNode,
    connectingFrom, setConnectingFrom,
    senseiMood, setSenseiMood,
    addNode, updateNodePosition, removeNode, updateNodeLabel,
    addConnection, removeConnection,
  };
}
