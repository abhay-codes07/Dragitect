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
  animated?: boolean;
}

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
  | 'microservice';

export interface ComponentMeta {
  type: ComponentType;
  label: string;
  description: string;
  color: string;
  glowColor: string;
}

export type AppView = 'landing' | 'workspace';

export type SenseiMood = 'idle' | 'excited' | 'thinking' | 'teaching' | 'impressed';

export interface SenseiMessage {
  text: string;
  mood: SenseiMood;
}
