import { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  CanvasNode, Connection, ComponentType, Position, AppView,
  SenseiMood, CanvasTransform, ConnectionProtocol, SavedDesign,
  ChallengeState, UserProgress, CanvasNote, SimulationState, SimulationStep,
  Challenge, QuestState,
} from '../types';
import { getLevelFromXP, getRankFromLevel } from '../utils/challenges';
import { checkNewAchievements } from '../utils/achievements';
import { getQuestById } from '../utils/quests';

const STORAGE_KEY = 'dragitect-saves';
const PROGRESS_KEY = 'dragitect-progress';
const QUEST_KEY = 'dragitect-quest';
const MUSIC_KEY = 'dragitect-music';

function loadQuestState(): QuestState {
  try {
    const raw = localStorage.getItem(QUEST_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { activeQuestId: null, currentStep: 0, completedQuests: [], hintsUsed: 0 };
}

function saveQuestState(q: QuestState) {
  localStorage.setItem(QUEST_KEY, JSON.stringify(q));
}

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {
    xp: 0, level: 1, rank: 'Genin',
    achievements: [], completedChallenges: [],
    totalNodesPlaced: 0, totalConnectionsMade: 0, totalDesignsSaved: 0,
  };
}

function saveProgress(p: UserProgress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

const DEFAULT_LABELS: Record<ComponentType, string> = {
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
  dns: 'DNS',
  firewall: 'Firewall',
  'search-engine': 'Search Engine',
  notification: 'Notification',
  scheduler: 'Scheduler',
};

export function useAppStore() {
  const [view, setView] = useState<AppView>('landing');
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [senseiMood, setSenseiMood] = useState<SenseiMood>('idle');
  const [transform, setTransform] = useState<CanvasTransform>({ scale: 1, offsetX: 0, offsetY: 0 });
  const [gridSnap, setGridSnap] = useState(false);
  const [notes, setNotes] = useState<CanvasNote[]>([]);

  // Gamification
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [newAchievement, setNewAchievement] = useState<string | null>(null);

  // Challenge mode
  const [challengeState, setChallengeState] = useState<ChallengeState>({
    active: null, startTime: null, completed: loadProgress().completedChallenges,
  });

  // Simulation
  const [simulation, setSimulation] = useState<SimulationState>({
    isRunning: false, steps: [], currentStep: -1, speed: 800,
  });

  // Tutorial
  const [showTutorial, setShowTutorial] = useState(() => {
    return !localStorage.getItem('dragitect-tutorial-done');
  });

  // Quests
  const [questState, setQuestState] = useState<QuestState>(loadQuestState);
  const [questCelebration, setQuestCelebration] = useState<string | null>(null);

  // Music
  const [musicEnabled, setMusicEnabled] = useState<boolean>(() => {
    return localStorage.getItem(MUSIC_KEY) === '1';
  });

  // Undo/redo history
  const historyRef = useRef<{ nodes: CanvasNode[]; connections: Connection[] }[]>([]);
  const historyIndexRef = useRef(-1);

  const pushHistory = useCallback(() => {
    const snapshot = { nodes: [...nodes], connections: [...connections] };
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(snapshot);
    historyIndexRef.current = historyRef.current.length - 1;
    if (historyRef.current.length > 50) {
      historyRef.current.shift();
      historyIndexRef.current--;
    }
  }, [nodes, connections]);

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      const snapshot = historyRef.current[historyIndexRef.current];
      setNodes(snapshot.nodes);
      setConnections(snapshot.connections);
    }
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      const snapshot = historyRef.current[historyIndexRef.current];
      setNodes(snapshot.nodes);
      setConnections(snapshot.connections);
    }
  }, []);

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  // --- Progress helpers ---
  const updateProgress = useCallback((updater: (p: UserProgress) => UserProgress) => {
    setProgress(prev => {
      const next = updater(prev);
      next.level = getLevelFromXP(next.xp);
      next.rank = getRankFromLevel(next.level);
      // Check achievements
      const newAchs = checkNewAchievements(next);
      if (newAchs.length > 0) {
        next.achievements = [...next.achievements, ...newAchs.map(a => a.id)];
        setNewAchievement(newAchs[0].title);
        setTimeout(() => setNewAchievement(null), 3000);
      }
      saveProgress(next);
      return next;
    });
  }, []);

  const addXP = useCallback((amount: number) => {
    updateProgress(p => ({ ...p, xp: p.xp + amount }));
  }, [updateProgress]);

  // --- Node operations ---
  const addNode = useCallback((type: ComponentType, position: Position) => {
    pushHistory();
    const snappedPos = gridSnap
      ? { x: Math.round(position.x / 40) * 40, y: Math.round(position.y / 40) * 40 }
      : position;
    const node: CanvasNode = {
      id: uuidv4(),
      type,
      position: snappedPos,
      label: DEFAULT_LABELS[type],
    };
    setNodes(prev => [...prev, node]);
    setSenseiMood('excited');
    setTimeout(() => setSenseiMood('idle'), 3000);
    updateProgress(p => ({ ...p, totalNodesPlaced: p.totalNodesPlaced + 1 }));
    addXP(10);
    return node;
  }, [pushHistory, gridSnap, updateProgress, addXP]);

  const updateNodePosition = useCallback((id: string, position: Position) => {
    const snappedPos = gridSnap
      ? { x: Math.round(position.x / 40) * 40, y: Math.round(position.y / 40) * 40 }
      : position;
    setNodes(prev => prev.map(n => n.id === id ? { ...n, position: snappedPos } : n));
  }, [gridSnap]);

  const removeNode = useCallback((id: string) => {
    pushHistory();
    setNodes(prev => prev.filter(n => n.id !== id));
    setConnections(prev => prev.filter(c => c.from !== id && c.to !== id));
    if (selectedNode === id) setSelectedNode(null);
  }, [selectedNode, pushHistory]);

  const updateNodeLabel = useCallback((id: string, label: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, label } : n));
  }, []);

  // --- Connection operations ---
  const addConnection = useCallback((from: string, to: string) => {
    if (from === to) return;
    const exists = connections.some(c => c.from === from && c.to === to);
    if (exists) return;
    pushHistory();
    const conn: Connection = { id: uuidv4(), from, to, animated: true };
    setConnections(prev => [...prev, conn]);
    setSenseiMood('impressed');
    setTimeout(() => setSenseiMood('idle'), 3000);
    updateProgress(p => ({ ...p, totalConnectionsMade: p.totalConnectionsMade + 1 }));
    addXP(15);
  }, [connections, pushHistory, updateProgress, addXP]);

  const removeConnection = useCallback((id: string) => {
    pushHistory();
    setConnections(prev => prev.filter(c => c.id !== id));
    if (selectedConnection === id) setSelectedConnection(null);
  }, [selectedConnection, pushHistory]);

  const updateConnectionLabel = useCallback((id: string, label: string) => {
    setConnections(prev => prev.map(c => c.id === id ? { ...c, label } : c));
  }, []);

  const updateConnectionProtocol = useCallback((id: string, protocol: ConnectionProtocol) => {
    setConnections(prev => prev.map(c => c.id === id ? { ...c, protocol } : c));
  }, []);

  // --- Zoom ---
  const zoomIn = useCallback(() => {
    setTransform(prev => ({ ...prev, scale: Math.min(prev.scale * 1.2, 3) }));
  }, []);

  const zoomOut = useCallback(() => {
    setTransform(prev => ({ ...prev, scale: Math.max(prev.scale / 1.2, 0.3) }));
  }, []);

  const resetZoom = useCallback(() => {
    setTransform({ scale: 1, offsetX: 0, offsetY: 0 });
  }, []);

  // --- Save/Load ---
  const saveDesign = useCallback((name: string) => {
    const saves = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as SavedDesign[];
    const design: SavedDesign = { name, timestamp: Date.now(), nodes, connections };
    const existingIndex = saves.findIndex(s => s.name === name);
    if (existingIndex >= 0) saves[existingIndex] = design;
    else saves.push(design);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
    setSenseiMood('impressed');
    setTimeout(() => setSenseiMood('idle'), 2000);
    updateProgress(p => ({ ...p, totalDesignsSaved: p.totalDesignsSaved + 1 }));
  }, [nodes, connections, updateProgress]);

  const loadDesign = useCallback((design: SavedDesign) => {
    pushHistory();
    setNodes(design.nodes);
    setConnections(design.connections);
    setSelectedNode(null);
    setSelectedConnection(null);
    setSenseiMood('excited');
    setTimeout(() => setSenseiMood('idle'), 3000);
  }, [pushHistory]);

  const getSavedDesigns = useCallback((): SavedDesign[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }, []);

  const deleteSavedDesign = useCallback((name: string) => {
    const saves = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as SavedDesign[];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saves.filter(s => s.name !== name)));
  }, []);

  const clearCanvas = useCallback(() => {
    pushHistory();
    setNodes([]);
    setConnections([]);
    setNotes([]);
    setSelectedNode(null);
    setSelectedConnection(null);
  }, [pushHistory]);

  // --- Templates ---
  const loadTemplate = useCallback((templateNodes: CanvasNode[], templateConnections: Connection[]) => {
    pushHistory();
    setNodes(templateNodes);
    setConnections(templateConnections);
    setSelectedNode(null);
    setSenseiMood('teaching');
    setTimeout(() => setSenseiMood('idle'), 4000);
    addXP(25);
  }, [pushHistory, addXP]);

  // --- Auto-layout ---
  const applyAutoLayout = useCallback((layoutFn: (nodes: CanvasNode[], conns: Connection[]) => CanvasNode[]) => {
    pushHistory();
    setNodes(layoutFn(nodes, connections));
  }, [nodes, connections, pushHistory]);

  // --- Challenges ---
  const startChallenge = useCallback((challenge: Challenge) => {
    clearCanvas();
    setChallengeState(prev => ({ ...prev, active: challenge, startTime: Date.now() }));
    setSenseiMood('challenging');
    setTimeout(() => setSenseiMood('teaching'), 3000);
  }, [clearCanvas]);

  const completeChallenge = useCallback((challengeId: string, xpReward: number) => {
    setChallengeState(prev => ({
      ...prev,
      active: null,
      startTime: null,
      completed: [...prev.completed, challengeId],
    }));
    addXP(xpReward);
    updateProgress(p => ({
      ...p,
      completedChallenges: [...p.completedChallenges, challengeId],
    }));
    setSenseiMood('impressed');
    setTimeout(() => setSenseiMood('idle'), 4000);
  }, [addXP, updateProgress]);

  const abandonChallenge = useCallback(() => {
    setChallengeState(prev => ({ ...prev, active: null, startTime: null }));
    setSenseiMood('idle');
  }, []);

  // --- Notes ---
  const addNote = useCallback((position: Position) => {
    const note: CanvasNote = {
      id: uuidv4(),
      position,
      text: 'New note...',
      color: '#ffd700',
    };
    setNotes(prev => [...prev, note]);
    return note;
  }, []);

  const updateNote = useCallback((id: string, text: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, text } : n));
  }, []);

  const removeNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const updateNotePosition = useCallback((id: string, position: Position) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, position } : n));
  }, []);

  // --- Simulation ---
  const startSimulation = useCallback(() => {
    if (connections.length === 0) return;
    // Build a path through the graph starting from clients or first node
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const visited = new Set<string>();
    const steps: SimulationStep[] = [];

    // BFS from clients (or first node)
    const startNodes = nodes.filter(n => n.type === 'client');
    const queue = startNodes.length > 0 ? startNodes.map(n => n.id) : [nodes[0]?.id].filter(Boolean);

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);

      for (const conn of connections) {
        if (conn.from === current && !visited.has(conn.to)) {
          const fromNode = nodeMap.get(conn.from);
          const toNode = nodeMap.get(conn.to);
          steps.push({
            fromNodeId: conn.from,
            toNodeId: conn.to,
            connectionId: conn.id,
            label: conn.label || `${fromNode?.label} -> ${toNode?.label}`,
          });
          queue.push(conn.to);
        }
      }
    }

    if (steps.length === 0) return;
    setSimulation({ isRunning: true, steps, currentStep: 0, speed: 800 });
  }, [nodes, connections]);

  const stopSimulation = useCallback(() => {
    setSimulation({ isRunning: false, steps: [], currentStep: -1, speed: 800 });
  }, []);

  const advanceSimulation = useCallback(() => {
    setSimulation(prev => {
      if (!prev.isRunning) return prev;
      const next = prev.currentStep + 1;
      if (next >= prev.steps.length) {
        return { ...prev, isRunning: false, currentStep: -1 };
      }
      return { ...prev, currentStep: next };
    });
  }, []);

  // --- Tutorial ---
  const dismissTutorial = useCallback(() => {
    setShowTutorial(false);
    localStorage.setItem('dragitect-tutorial-done', '1');
  }, []);

  // --- Quests ---
  const startQuest = useCallback((questId: string) => {
    const quest = getQuestById(questId);
    if (!quest) return;
    pushHistory();
    setNodes([]);
    setConnections([]);
    setNotes([]);
    setSelectedNode(null);
    setSelectedConnection(null);
    const next: QuestState = { ...questState, activeQuestId: questId, currentStep: 0, hintsUsed: 0 };
    setQuestState(next);
    saveQuestState(next);
    setSenseiMood('teaching');
  }, [pushHistory, questState]);

  const advanceQuestStep = useCallback(() => {
    setQuestState(prev => {
      if (!prev.activeQuestId) return prev;
      const quest = getQuestById(prev.activeQuestId);
      if (!quest) return prev;
      const nextStep = prev.currentStep + 1;
      const next: QuestState = { ...prev, currentStep: nextStep };
      saveQuestState(next);
      return next;
    });
  }, []);

  const completeQuest = useCallback(() => {
    setQuestState(prev => {
      if (!prev.activeQuestId) return prev;
      const quest = getQuestById(prev.activeQuestId);
      if (!quest) return prev;
      addXP(quest.xpReward);
      setQuestCelebration(quest.title);
      setTimeout(() => setQuestCelebration(null), 5000);
      setSenseiMood('impressed');
      const next: QuestState = {
        ...prev,
        activeQuestId: null,
        currentStep: 0,
        completedQuests: prev.completedQuests.includes(quest.id) ? prev.completedQuests : [...prev.completedQuests, quest.id],
      };
      saveQuestState(next);
      return next;
    });
  }, [addXP]);

  const abandonQuest = useCallback(() => {
    const next: QuestState = { ...questState, activeQuestId: null, currentStep: 0, hintsUsed: 0 };
    setQuestState(next);
    saveQuestState(next);
    setSenseiMood('idle');
  }, [questState]);

  const useQuestHint = useCallback(() => {
    const next: QuestState = { ...questState, hintsUsed: questState.hintsUsed + 1 };
    setQuestState(next);
    saveQuestState(next);
  }, [questState]);

  // --- Music ---
  const toggleMusic = useCallback(() => {
    setMusicEnabled(prev => {
      const next = !prev;
      localStorage.setItem(MUSIC_KEY, next ? '1' : '0');
      return next;
    });
  }, []);

  // --- Export ---
  const exportJSON = useCallback(() => {
    const data = { nodes, connections, notes, exportedAt: Date.now(), version: '1.0' };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dragitect-design.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, connections, notes]);

  const importJSON = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.nodes && Array.isArray(data.nodes)) {
          pushHistory();
          setNodes(data.nodes);
          setConnections(data.connections || []);
          setNotes(data.notes || []);
          setSenseiMood('excited');
          setTimeout(() => setSenseiMood('idle'), 3000);
        }
      } catch {
        // invalid JSON
      }
    };
    reader.readAsText(file);
  }, [pushHistory]);

  return {
    // View
    view, setView,
    // Canvas data
    nodes, setNodes, connections,
    selectedNode, setSelectedNode,
    selectedConnection, setSelectedConnection,
    connectingFrom, setConnectingFrom,
    senseiMood, setSenseiMood,
    transform, setTransform,
    gridSnap, setGridSnap,
    notes, setNotes,
    // Node operations
    addNode, updateNodePosition, removeNode, updateNodeLabel,
    // Connection operations
    addConnection, removeConnection, updateConnectionLabel, updateConnectionProtocol,
    // Zoom
    zoomIn, zoomOut, resetZoom,
    // Save/Load
    saveDesign, loadDesign, getSavedDesigns, deleteSavedDesign,
    // Canvas
    clearCanvas, loadTemplate, applyAutoLayout,
    // History
    undo, redo, canUndo, canRedo, pushHistory,
    // Gamification
    progress, updateProgress, addXP, newAchievement,
    // Challenges
    challengeState, startChallenge, completeChallenge, abandonChallenge,
    // Notes
    addNote, updateNote, removeNote, updateNotePosition,
    // Simulation
    simulation, startSimulation, stopSimulation, advanceSimulation,
    // Tutorial
    showTutorial, dismissTutorial,
    // Export/Import
    exportJSON, importJSON,
    // Quests
    questState, startQuest, advanceQuestStep, completeQuest, abandonQuest, useQuestHint,
    questCelebration,
    // Music
    musicEnabled, toggleMusic,
  };
}
