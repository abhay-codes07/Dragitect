export interface Position {
  x: number;
  y: number;
}

export interface CanvasNode {
  id: string;
  type: ComponentType;
  position: Position;
  label: string;
  config?: Record<string, unknown>;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  label?: string;
  protocol?: ConnectionProtocol;
  animated?: boolean;
}

export type ConnectionProtocol = 'http' | 'websocket' | 'grpc' | 'tcp' | 'amqp' | 'custom';

export type ComponentType =
  | 'client'
  | 'server'
  | 'database'
  | 'loadbalancer'
  | 'cache'
  | 'queue'
  | 'api-gateway'
  | 'cdn'
  | 'storage'
  | 'microservice'
  | 'dns'
  | 'firewall'
  | 'search-engine'
  | 'notification'
  | 'scheduler';

export interface ComponentMeta {
  type: ComponentType;
  label: string;
  description: string;
  color: string;
  glowColor: string;
}

export type AppView = 'landing' | 'workspace';

export type SenseiMood = 'idle' | 'excited' | 'thinking' | 'teaching' | 'impressed' | 'challenging';

export interface SenseiMessage {
  text: string;
  mood: SenseiMood;
}

export interface CanvasTransform {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export interface DesignTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  nodes: Omit<CanvasNode, 'id'>[];
  connections: { fromIndex: number; toIndex: number; label?: string; protocol?: ConnectionProtocol }[];
}

export interface SavedDesign {
  name: string;
  timestamp: number;
  nodes: CanvasNode[];
  connections: Connection[];
}

// Challenge mode
export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  objectives: ChallengeObjective[];
  xpReward: number;
  timeLimit?: number; // seconds, optional
  hints: string[];
}

export interface ChallengeObjective {
  id: string;
  description: string;
  check: (nodes: CanvasNode[], connections: Connection[]) => boolean;
}

export interface ChallengeState {
  active: Challenge | null;
  startTime: number | null;
  completed: string[]; // completed challenge IDs
}

// Leveling / gamification
export type NinjaRank = 'Genin' | 'Chunin' | 'Jonin' | 'Anbu' | 'Kage' | 'Hokage';

export interface UserProgress {
  xp: number;
  level: number;
  rank: NinjaRank;
  achievements: string[];
  completedChallenges: string[];
  totalNodesPlaced: number;
  totalConnectionsMade: number;
  totalDesignsSaved: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (progress: UserProgress) => boolean;
}

// Validation
export interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  message: string;
  nodeId?: string;
  suggestion: string;
}

export interface DesignScore {
  overall: number; // 0-100
  categories: {
    scalability: number;
    reliability: number;
    performance: number;
    security: number;
  };
  issues: ValidationIssue[];
}

// Canvas note / annotation
export interface CanvasNote {
  id: string;
  position: Position;
  text: string;
  color: string;
}

// Simulation
export interface SimulationStep {
  fromNodeId: string;
  toNodeId: string;
  connectionId: string;
  label: string;
}

export interface SimulationState {
  isRunning: boolean;
  steps: SimulationStep[];
  currentStep: number;
  speed: number; // ms per step
}

// Guided quests — step-by-step system design tutorials
export interface QuestStep {
  id: string;
  instruction: string;
  detail: string;
  senseiLine: string;
  hint?: string;
  check: (nodes: CanvasNode[], connections: Connection[]) => boolean;
}

export interface Quest {
  id: string;
  level: number;
  title: string;
  realWorld: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  xpReward: number;
  intro: string;
  outro: string;
  steps: QuestStep[];
}

export interface QuestState {
  activeQuestId: string | null;
  currentStep: number;
  completedQuests: string[];
  hintsUsed: number;
}
