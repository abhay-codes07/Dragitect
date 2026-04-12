import type { Challenge, CanvasNode, Connection } from '../types';

function hasNodeType(nodes: CanvasNode[], type: string): boolean {
  return nodes.some(n => n.type === type);
}

function countNodeType(nodes: CanvasNode[], type: string): number {
  return nodes.filter(n => n.type === type).length;
}

function hasConnection(nodes: CanvasNode[], connections: Connection[], fromType: string, toType: string): boolean {
  return connections.some(c => {
    const from = nodes.find(n => n.id === c.from);
    const to = nodes.find(n => n.id === c.to);
    return (from?.type === fromType && to?.type === toType) || (from?.type === toType && to?.type === fromType);
  });
}

export const CHALLENGES: Challenge[] = [
  {
    id: 'ch-basic-webapp',
    title: 'Build a Basic Web App',
    description: 'Create a simple web application architecture with a client, server, and database.',
    difficulty: 'beginner',
    xpReward: 100,
    hints: [
      'Start with a Client component for the user interface.',
      'Add a Server to handle business logic.',
      'Connect to a Database for persistent storage.',
    ],
    objectives: [
      {
        id: 'has-client',
        description: 'Add a Client component',
        check: (nodes) => hasNodeType(nodes, 'client'),
      },
      {
        id: 'has-server',
        description: 'Add a Server component',
        check: (nodes) => hasNodeType(nodes, 'server'),
      },
      {
        id: 'has-database',
        description: 'Add a Database component',
        check: (nodes) => hasNodeType(nodes, 'database'),
      },
      {
        id: 'connected',
        description: 'Connect all components (3+ connections)',
        check: (_, connections) => connections.length >= 3,
      },
    ],
  },
  {
    id: 'ch-scalable-api',
    title: 'Scale Your API',
    description: 'Design a scalable API with load balancing, caching, and multiple server instances.',
    difficulty: 'beginner',
    xpReward: 150,
    hints: [
      'You need multiple servers to distribute load.',
      'A Load Balancer sits between clients and servers.',
      'Add a Cache to reduce database queries.',
    ],
    objectives: [
      {
        id: 'has-lb',
        description: 'Add a Load Balancer',
        check: (nodes) => hasNodeType(nodes, 'loadbalancer'),
      },
      {
        id: 'multi-server',
        description: 'Add at least 2 Servers',
        check: (nodes) => countNodeType(nodes, 'server') >= 2,
      },
      {
        id: 'has-cache',
        description: 'Add a Cache layer',
        check: (nodes) => hasNodeType(nodes, 'cache'),
      },
      {
        id: 'lb-connected',
        description: 'Connect Load Balancer to Servers',
        check: (nodes, connections) => hasConnection(nodes, connections, 'loadbalancer', 'server'),
      },
    ],
  },
  {
    id: 'ch-realtime-chat',
    title: 'Real-Time Chat System',
    description: 'Build a messaging system with real-time delivery, message persistence, and notifications.',
    difficulty: 'intermediate',
    xpReward: 250,
    hints: [
      'WebSocket connections enable real-time messaging.',
      'A Message Queue helps with reliable delivery.',
      'Store messages in a Database for history.',
      'Add a Notification service for offline users.',
    ],
    objectives: [
      {
        id: 'has-clients',
        description: 'Add at least 2 Client apps',
        check: (nodes) => countNodeType(nodes, 'client') >= 2,
      },
      {
        id: 'has-gateway',
        description: 'Add an API Gateway',
        check: (nodes) => hasNodeType(nodes, 'api-gateway'),
      },
      {
        id: 'has-queue',
        description: 'Add a Message Queue',
        check: (nodes) => hasNodeType(nodes, 'queue'),
      },
      {
        id: 'has-db',
        description: 'Add a Database for message storage',
        check: (nodes) => hasNodeType(nodes, 'database'),
      },
      {
        id: 'min-connections',
        description: 'Create at least 6 connections',
        check: (_, connections) => connections.length >= 6,
      },
    ],
  },
  {
    id: 'ch-secure-system',
    title: 'Secure the Fortress',
    description: 'Design a system with proper security layers: firewall, API gateway, and secure data storage.',
    difficulty: 'intermediate',
    xpReward: 200,
    hints: [
      'A Firewall/WAF filters malicious traffic at the edge.',
      'An API Gateway handles authentication centrally.',
      'Keep the Database behind multiple layers.',
    ],
    objectives: [
      {
        id: 'has-firewall',
        description: 'Add a Firewall/WAF',
        check: (nodes) => hasNodeType(nodes, 'firewall'),
      },
      {
        id: 'has-gateway',
        description: 'Add an API Gateway',
        check: (nodes) => hasNodeType(nodes, 'api-gateway'),
      },
      {
        id: 'has-db',
        description: 'Add a Database',
        check: (nodes) => hasNodeType(nodes, 'database'),
      },
      {
        id: 'firewall-first',
        description: 'Connect Client through Firewall',
        check: (nodes, connections) => hasConnection(nodes, connections, 'client', 'firewall'),
      },
      {
        id: 'layers',
        description: 'Have at least 5 components',
        check: (nodes) => nodes.length >= 5,
      },
    ],
  },
  {
    id: 'ch-microservices',
    title: 'Microservice Architecture',
    description: 'Decompose a monolith into microservices with proper communication patterns.',
    difficulty: 'advanced',
    xpReward: 350,
    hints: [
      'Each microservice should handle one domain.',
      'Use a Message Queue for async communication between services.',
      'An API Gateway routes external requests to the right service.',
      'Each service should have its own data store.',
    ],
    objectives: [
      {
        id: 'multi-services',
        description: 'Add at least 3 Microservices',
        check: (nodes) => countNodeType(nodes, 'microservice') >= 3,
      },
      {
        id: 'has-gateway',
        description: 'Add an API Gateway',
        check: (nodes) => hasNodeType(nodes, 'api-gateway'),
      },
      {
        id: 'has-queue',
        description: 'Add a Message Queue for async communication',
        check: (nodes) => hasNodeType(nodes, 'queue'),
      },
      {
        id: 'multi-db',
        description: 'Add at least 2 Databases (one per service)',
        check: (nodes) => countNodeType(nodes, 'database') >= 2,
      },
      {
        id: 'many-connections',
        description: 'Create at least 8 connections',
        check: (_, connections) => connections.length >= 8,
      },
    ],
  },
  {
    id: 'ch-event-driven',
    title: 'Event-Driven Pipeline',
    description: 'Build an event-driven system with queues, workers, and scheduled tasks.',
    difficulty: 'advanced',
    xpReward: 400,
    hints: [
      'Events flow through Message Queues.',
      'Multiple workers process events in parallel.',
      'A Scheduler triggers periodic jobs.',
      'Search Engine indexes processed data.',
    ],
    objectives: [
      {
        id: 'has-queue',
        description: 'Add at least 2 Message Queues',
        check: (nodes) => countNodeType(nodes, 'queue') >= 2,
      },
      {
        id: 'has-workers',
        description: 'Add at least 3 worker services',
        check: (nodes) => countNodeType(nodes, 'microservice') + countNodeType(nodes, 'server') >= 3,
      },
      {
        id: 'has-scheduler',
        description: 'Add a Task Scheduler',
        check: (nodes) => hasNodeType(nodes, 'scheduler'),
      },
      {
        id: 'has-search',
        description: 'Add a Search Engine',
        check: (nodes) => hasNodeType(nodes, 'search-engine'),
      },
      {
        id: 'has-db',
        description: 'Add a Database',
        check: (nodes) => hasNodeType(nodes, 'database'),
      },
      {
        id: 'complex',
        description: 'Create at least 10 connections',
        check: (_, connections) => connections.length >= 10,
      },
    ],
  },
];

// XP thresholds for levels
export const LEVEL_THRESHOLDS = [
  0,     // Level 1: 0 XP
  100,   // Level 2
  250,   // Level 3
  450,   // Level 4
  700,   // Level 5
  1000,  // Level 6
  1400,  // Level 7
  1900,  // Level 8
  2500,  // Level 9
  3200,  // Level 10
];

export function getLevelFromXP(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getRankFromLevel(level: number): 'Genin' | 'Chunin' | 'Jonin' | 'Anbu' | 'Kage' | 'Hokage' {
  if (level <= 2) return 'Genin';
  if (level <= 4) return 'Chunin';
  if (level <= 6) return 'Jonin';
  if (level <= 8) return 'Anbu';
  if (level <= 9) return 'Kage';
  return 'Hokage';
}

export function getXPForNextLevel(xp: number): { current: number; needed: number } {
  const level = getLevelFromXP(xp);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 1000;
  return { current: xp - currentThreshold, needed: nextThreshold - currentThreshold };
}
