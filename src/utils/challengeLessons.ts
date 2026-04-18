import type { ComponentType } from '../types';

export interface LessonSection {
  heading: string;
  body: string;
}

export interface LessonDiagramNode {
  id: string;
  type: ComponentType;
  label: string;
  x: number;
  y: number;
}

export interface LessonDiagramEdge {
  from: string;
  to: string;
  label?: string;
}

export interface LessonDiagram {
  nodes: LessonDiagramNode[];
  edges: LessonDiagramEdge[];
  caption: string;
}

export interface NextStepHint {
  forObjectiveId: string;
  line: string;
  targetType?: ComponentType;
  miniNodes?: { type: ComponentType; label: string; x: number; y: number; highlight?: boolean }[];
  miniEdges?: { fromIdx: number; toIdx: number }[];
}

export interface Lesson {
  kanji: string;
  accent: string;
  conceptTitle: string;
  conceptSections: LessonSection[];
  example: LessonDiagram;
  nextStepHints: NextStepHint[];
}

export const CHALLENGE_LESSONS: Record<string, Lesson> = {
  'ch-basic-webapp': {
    kanji: '基',
    accent: '#00ff88',
    conceptTitle: 'The Three Pillars of a Web Application',
    conceptSections: [
      {
        heading: 'What you are building',
        body: 'Every web application starts with the same three roles: someone asks for data (Client), something decides what to return (Server), and something remembers it (Database). Master this shape and every harder system becomes a variation of it.',
      },
      {
        heading: 'Client',
        body: 'The user interface — a browser page, mobile app, or desktop program. It never touches the database directly. It only speaks to the server over the network, usually via HTTP.',
      },
      {
        heading: 'Server',
        body: 'The brain. It validates requests, applies business rules (who can see what, how to compute things), and reads or writes to the database. One server can serve many clients at once.',
      },
      {
        heading: 'Database',
        body: 'The long-term memory. When the server restarts, the database keeps its rows. Never expose it to the public internet — always access it through the server.',
      },
      {
        heading: 'Request flow',
        body: 'Client → Server → Database → Server → Client. Every user action is a round-trip through this chain. Your job in this challenge: build that chain.',
      },
    ],
    example: {
      nodes: [
        { id: 'c', type: 'client', label: 'Browser', x: 80, y: 100 },
        { id: 's', type: 'server', label: 'App Server', x: 240, y: 100 },
        { id: 'd', type: 'database', label: 'Postgres', x: 400, y: 100 },
      ],
      edges: [
        { from: 'c', to: 's', label: 'HTTP' },
        { from: 's', to: 'd', label: 'SQL' },
      ],
      caption: 'A single linear chain. Data flows left to right on request, right to left on response.',
    },
    nextStepHints: [
      {
        forObjectiveId: 'has-client',
        line: 'Start by dragging a Client component from the sidebar onto the left side of the canvas. This is your user\u2019s entry point.',
        targetType: 'client',
      },
      {
        forObjectiveId: 'has-server',
        line: 'Now add a Server to the right of the Client. It will receive requests and talk to your database.',
        targetType: 'server',
      },
      {
        forObjectiveId: 'has-database',
        line: 'Add a Database at the far right. This holds your persistent data \u2014 never connect it directly to the Client.',
        targetType: 'database',
      },
      {
        forObjectiveId: 'connected',
        line: 'Link them in order: hover a node, click the glowing dot, click the next node\u2019s dot. Connect Client\u2192Server and Server\u2192Database. You need 3+ connections total.',
      },
    ],
  },

  'ch-scalable-api': {
    kanji: '拡',
    accent: '#ffd700',
    conceptTitle: 'Scaling Horizontally: Load Balancers and Caches',
    conceptSections: [
      {
        heading: 'The problem',
        body: 'A single server has a ceiling. When traffic grows past what one box can handle, you have two choices: buy a bigger box (vertical scaling, fragile and expensive) or add more boxes (horizontal scaling, the industry default).',
      },
      {
        heading: 'Load Balancer',
        body: 'A traffic cop at the front. Clients send their requests to the Load Balancer, which picks one of many identical servers to handle each one (round-robin, least-connections, hash by user id, etc). If a server dies, the LB stops sending it traffic \u2014 that\u2019s your failover.',
      },
      {
        heading: 'Why multiple servers',
        body: 'Three servers each handling 300 req/s is cheaper and more reliable than one server struggling with 900 req/s. Servers must be *stateless* for this to work \u2014 any request should land on any box, so store session data in a shared cache/DB, not in memory.',
      },
      {
        heading: 'Cache',
        body: 'A read-heavy workload hammers the database. A cache (Redis, Memcached) sits between server and DB. First read fetches from DB and fills the cache; next 1000 reads hit the cache and return in microseconds instead of milliseconds. Rule of thumb: 10\u20131000x speed up, at the cost of staleness.',
      },
      {
        heading: 'Your target shape',
        body: 'Client \u2192 Load Balancer \u2192 (Server, Server, ...) \u2192 Cache \u2192 Database.',
      },
    ],
    example: {
      nodes: [
        { id: 'c', type: 'client', label: 'Client', x: 60, y: 120 },
        { id: 'lb', type: 'loadbalancer', label: 'Load Balancer', x: 200, y: 120 },
        { id: 's1', type: 'server', label: 'Server A', x: 360, y: 60 },
        { id: 's2', type: 'server', label: 'Server B', x: 360, y: 180 },
        { id: 'cache', type: 'cache', label: 'Redis', x: 520, y: 60 },
        { id: 'db', type: 'database', label: 'Database', x: 520, y: 180 },
      ],
      edges: [
        { from: 'c', to: 'lb' },
        { from: 'lb', to: 's1' },
        { from: 'lb', to: 's2' },
        { from: 's1', to: 'cache' },
        { from: 's2', to: 'cache' },
        { from: 's1', to: 'db' },
        { from: 's2', to: 'db' },
      ],
      caption: 'Two stateless servers behind a Load Balancer, both sharing a cache and database.',
    },
    nextStepHints: [
      {
        forObjectiveId: 'has-lb',
        line: 'Drop a Load Balancer onto the canvas first. It will be the single entry point clients talk to.',
        targetType: 'loadbalancer',
      },
      {
        forObjectiveId: 'multi-server',
        line: 'Add at least two Server components behind the Load Balancer. Both servers run the same code \u2014 that\u2019s how they share the load.',
        targetType: 'server',
      },
      {
        forObjectiveId: 'has-cache',
        line: 'Place a Cache between the servers and the database. It will absorb repeated reads and save your DB from burning.',
        targetType: 'cache',
      },
      {
        forObjectiveId: 'lb-connected',
        line: 'Connect the Load Balancer to each Server (click LB\u2019s dot, then each Server\u2019s dot). That wiring is what lets the LB spread traffic.',
      },
    ],
  },

  'ch-realtime-chat': {
    kanji: '通',
    accent: '#ff00e5',
    conceptTitle: 'Real-Time Messaging at Scale',
    conceptSections: [
      {
        heading: 'Why chat is hard',
        body: 'A normal web app only reacts when the client asks. Chat has to *push* \u2014 when Alice types, Bob\u2019s screen must update within milliseconds, even though Bob never asked just now. That changes the whole architecture.',
      },
      {
        heading: 'WebSockets over HTTP',
        body: 'HTTP is one-shot: request, response, done. WebSocket is a persistent connection \u2014 once opened, either side can send at any time. Chat clients keep a WebSocket open to the server for the whole session.',
      },
      {
        heading: 'API Gateway at the edge',
        body: 'The Gateway is the doorway: it does authentication, rate-limiting, and routing. For chat, it also upgrades incoming connections from HTTP to WebSocket and keeps them alive.',
      },
      {
        heading: 'Message Queue for delivery',
        body: 'When Alice sends a message, you don\u2019t want the server to block while it writes to the DB, pushes to Bob, and sends a mobile notification. Drop the message onto a Queue (Kafka, RabbitMQ). Workers pick it up asynchronously. Delivery is decoupled from send.',
      },
      {
        heading: 'Storage and notifications',
        body: 'The database keeps the chat history so Alice\u2019s phone can reload it. A Notification service pushes alerts (APNS, FCM, email) to users who are offline.',
      },
    ],
    example: {
      nodes: [
        { id: 'c1', type: 'client', label: 'Alice', x: 60, y: 60 },
        { id: 'c2', type: 'client', label: 'Bob', x: 60, y: 180 },
        { id: 'gw', type: 'api-gateway', label: 'Gateway', x: 220, y: 120 },
        { id: 'q', type: 'queue', label: 'Kafka', x: 380, y: 60 },
        { id: 's', type: 'server', label: 'Chat Svc', x: 540, y: 120 },
        { id: 'db', type: 'database', label: 'Messages', x: 380, y: 220 },
      ],
      edges: [
        { from: 'c1', to: 'gw', label: 'WS' },
        { from: 'c2', to: 'gw', label: 'WS' },
        { from: 'gw', to: 'q' },
        { from: 'q', to: 's' },
        { from: 's', to: 'db' },
        { from: 'gw', to: 'db' },
      ],
      caption: 'Clients hold WebSockets to the Gateway. Messages flow through a queue so delivery is async.',
    },
    nextStepHints: [
      {
        forObjectiveId: 'has-clients',
        line: 'Drop in at least two Client components \u2014 chat needs a sender and a receiver.',
        targetType: 'client',
      },
      {
        forObjectiveId: 'has-gateway',
        line: 'Add an API Gateway in the middle. It will hold the WebSocket connections for all clients.',
        targetType: 'api-gateway',
      },
      {
        forObjectiveId: 'has-queue',
        line: 'Add a Message Queue behind the Gateway. This is what makes message fan-out and notifications asynchronous.',
        targetType: 'queue',
      },
      {
        forObjectiveId: 'has-db',
        line: 'Drop in a Database. It stores chat history so users can scroll back.',
        targetType: 'database',
      },
      {
        forObjectiveId: 'min-connections',
        line: 'Wire everything up: Clients\u2192Gateway, Gateway\u2192Queue, Queue\u2192processing server, and server\u2192Database. You need at least 6 connections.',
      },
    ],
  },

  'ch-secure-system': {
    kanji: '盾',
    accent: '#ef4444',
    conceptTitle: 'Defense in Depth',
    conceptSections: [
      {
        heading: 'No single wall',
        body: 'Security is not one lock on the front door \u2014 it is layers. An attacker who breaks one layer should still be stopped by the next. This is called *defense in depth*.',
      },
      {
        heading: 'Firewall / WAF at the edge',
        body: 'A Web Application Firewall inspects every incoming request. It blocks obvious attacks: SQL injection patterns, XSS payloads, known-bad IPs, floods. Requests that look sane are forwarded inward.',
      },
      {
        heading: 'API Gateway for auth and policy',
        body: 'The Gateway handles authentication (who are you?), authorization (what can you do?), rate limiting, and schema validation. No request reaches your business logic until the Gateway approves it.',
      },
      {
        heading: 'Servers and data tiers',
        body: 'Your application servers live in a private network \u2014 they have no public IP. They talk to the database over an internal network. The database is two hops from the public internet, minimum.',
      },
      {
        heading: 'Your target shape',
        body: 'Client \u2192 Firewall \u2192 API Gateway \u2192 Server(s) \u2192 Database. Each arrow is another layer of enforcement.',
      },
    ],
    example: {
      nodes: [
        { id: 'c', type: 'client', label: 'Client', x: 60, y: 120 },
        { id: 'fw', type: 'firewall', label: 'WAF', x: 200, y: 120 },
        { id: 'gw', type: 'api-gateway', label: 'Gateway', x: 340, y: 120 },
        { id: 's', type: 'server', label: 'App Server', x: 480, y: 120 },
        { id: 'db', type: 'database', label: 'Database', x: 620, y: 120 },
      ],
      edges: [
        { from: 'c', to: 'fw' },
        { from: 'fw', to: 'gw' },
        { from: 'gw', to: 's' },
        { from: 's', to: 'db' },
      ],
      caption: 'Every request must pass through four layers before it can touch the database.',
    },
    nextStepHints: [
      {
        forObjectiveId: 'has-firewall',
        line: 'Start with a Firewall / WAF right after the Client. It is your outermost wall.',
        targetType: 'firewall',
      },
      {
        forObjectiveId: 'has-gateway',
        line: 'Now place an API Gateway inside the firewall. It handles auth and rate limits.',
        targetType: 'api-gateway',
      },
      {
        forObjectiveId: 'has-db',
        line: 'Add a Database deep in the back. It should never be reachable directly from the internet.',
        targetType: 'database',
      },
      {
        forObjectiveId: 'firewall-first',
        line: 'Draw a connection from Client to Firewall. This is the first layer attackers hit.',
      },
      {
        forObjectiveId: 'layers',
        line: 'Add one more intermediate component (a Server, or a second Gateway). The challenge needs at least 5 components on the canvas.',
      },
    ],
  },

  'ch-microservices': {
    kanji: '分',
    accent: '#c084fc',
    conceptTitle: 'From Monolith to Microservices',
    conceptSections: [
      {
        heading: 'What a monolith is',
        body: 'One codebase, one deploy, one database. Simple to start, but eventually every team shares the same release pipeline and the same tables \u2014 shipping slows to a crawl and one team\u2019s bug becomes everyone\u2019s outage.',
      },
      {
        heading: 'One domain, one service',
        body: 'Split by business capability, not by technical layer. A `UserService` owns user data end-to-end. An `OrderService` owns orders. Each can be deployed, scaled, and rewritten independently.',
      },
      {
        heading: 'One service, one database',
        body: 'Each microservice has its own data store. If another service needs that data, it asks through an API \u2014 it does not reach into the table. This is the rule that actually enforces the boundary.',
      },
      {
        heading: 'API Gateway as the front door',
        body: 'Clients do not need to know which service owns what. They talk to a single Gateway that routes `/users/*` to UserService, `/orders/*` to OrderService, and so on.',
      },
      {
        heading: 'Async with queues',
        body: 'When a service needs to tell another something happened (order placed \u2192 send email), it should publish to a Message Queue instead of calling the other service directly. That way, one service being slow or down does not cascade into the whole system.',
      },
    ],
    example: {
      nodes: [
        { id: 'c', type: 'client', label: 'Client', x: 60, y: 120 },
        { id: 'gw', type: 'api-gateway', label: 'Gateway', x: 200, y: 120 },
        { id: 'm1', type: 'microservice', label: 'Users', x: 360, y: 40 },
        { id: 'm2', type: 'microservice', label: 'Orders', x: 360, y: 140 },
        { id: 'm3', type: 'microservice', label: 'Billing', x: 360, y: 240 },
        { id: 'q', type: 'queue', label: 'Events', x: 500, y: 140 },
        { id: 'd1', type: 'database', label: 'Users DB', x: 640, y: 40 },
        { id: 'd2', type: 'database', label: 'Orders DB', x: 640, y: 240 },
      ],
      edges: [
        { from: 'c', to: 'gw' },
        { from: 'gw', to: 'm1' },
        { from: 'gw', to: 'm2' },
        { from: 'gw', to: 'm3' },
        { from: 'm1', to: 'd1' },
        { from: 'm2', to: 'd2' },
        { from: 'm2', to: 'q' },
        { from: 'q', to: 'm3' },
      ],
      caption: 'Three services, each with its own database, communicating through gateway and a queue.',
    },
    nextStepHints: [
      {
        forObjectiveId: 'multi-services',
        line: 'Add at least three Microservice components. Each one represents an independent domain team.',
        targetType: 'microservice',
      },
      {
        forObjectiveId: 'has-gateway',
        line: 'Add an API Gateway in front of the services. Clients will hit only the gateway and it routes inward.',
        targetType: 'api-gateway',
      },
      {
        forObjectiveId: 'has-queue',
        line: 'Add a Message Queue between services. Use it when one service needs to notify another without a synchronous call.',
        targetType: 'queue',
      },
      {
        forObjectiveId: 'multi-db',
        line: 'Add a second Database. Each microservice should own its data \u2014 no shared tables across services.',
        targetType: 'database',
      },
      {
        forObjectiveId: 'many-connections',
        line: 'Wire Gateway\u2192each service, each service\u2192its own DB, and service\u2192queue\u2192service for async events. Aim for 8+ connections.',
      },
    ],
  },

  'ch-event-driven': {
    kanji: '流',
    accent: '#fb923c',
    conceptTitle: 'Event-Driven Pipelines',
    conceptSections: [
      {
        heading: 'Reactive, not request-driven',
        body: 'In a classic web app, someone asks and something happens. In an event-driven system, *things happen* \u2014 a payment clears, a file uploads, a sensor reports \u2014 and multiple services react. Producers don\u2019t know (or care) who is listening.',
      },
      {
        heading: 'Queues as the backbone',
        body: 'Events live on queues (Kafka, RabbitMQ, SQS). Producers drop events in; consumers pull them out. Queues absorb bursts so a 10x spike in events becomes a slightly-longer queue, not a crash.',
      },
      {
        heading: 'Workers scale out',
        body: 'If one worker processes 100 events per second and you need 1000 per second, run 10 workers reading from the same queue. They each grab a different batch. This is horizontal scaling for back-end work.',
      },
      {
        heading: 'Schedulers for time-based events',
        body: 'Not every event comes from the outside world. Nightly reports, weekly cleanups, hourly syncs \u2014 a Task Scheduler (Airflow, Cron, Celery Beat) fires those on a clock and drops them onto the same queue.',
      },
      {
        heading: 'Downstream: DB + search',
        body: 'Processed events land somewhere: structured data goes to a Database, searchable text goes to a Search Engine (Elasticsearch). One raw event often fans out into multiple writes.',
      },
    ],
    example: {
      nodes: [
        { id: 'c', type: 'client', label: 'Producer', x: 60, y: 60 },
        { id: 'sch', type: 'scheduler', label: 'Cron', x: 60, y: 200 },
        { id: 'q1', type: 'queue', label: 'Events', x: 220, y: 120 },
        { id: 'w1', type: 'server', label: 'Worker 1', x: 380, y: 40 },
        { id: 'w2', type: 'server', label: 'Worker 2', x: 380, y: 120 },
        { id: 'w3', type: 'server', label: 'Worker 3', x: 380, y: 200 },
        { id: 'q2', type: 'queue', label: 'Indexing', x: 540, y: 140 },
        { id: 'db', type: 'database', label: 'Events DB', x: 700, y: 60 },
        { id: 'se', type: 'search-engine', label: 'ES', x: 700, y: 220 },
      ],
      edges: [
        { from: 'c', to: 'q1' },
        { from: 'sch', to: 'q1' },
        { from: 'q1', to: 'w1' },
        { from: 'q1', to: 'w2' },
        { from: 'q1', to: 'w3' },
        { from: 'w1', to: 'db' },
        { from: 'w2', to: 'q2' },
        { from: 'q2', to: 'se' },
        { from: 'w3', to: 'db' },
      ],
      caption: 'Producers and a scheduler feed a queue; multiple workers fan out into DB and search.',
    },
    nextStepHints: [
      {
        forObjectiveId: 'has-queue',
        line: 'Drop at least two Message Queues onto the canvas. One for incoming events, one for downstream processing.',
        targetType: 'queue',
      },
      {
        forObjectiveId: 'has-workers',
        line: 'Add at least three Servers or Microservices to act as workers. They will pull from the first queue in parallel.',
        targetType: 'microservice',
      },
      {
        forObjectiveId: 'has-scheduler',
        line: 'Add a Task Scheduler. It fires periodic events onto the queue (nightly jobs, hourly syncs).',
        targetType: 'scheduler',
      },
      {
        forObjectiveId: 'has-search',
        line: 'Add a Search Engine. Workers will write indexable data into it for full-text search.',
        targetType: 'search-engine',
      },
      {
        forObjectiveId: 'has-db',
        line: 'Add a Database for structured event history and audit logs.',
        targetType: 'database',
      },
      {
        forObjectiveId: 'complex',
        line: 'Wire the whole pipeline: producers\u2192queue\u2192workers\u2192(db + search). You need 10+ connections overall.',
      },
    ],
  },
};

export function getLesson(challengeId: string): Lesson | null {
  return CHALLENGE_LESSONS[challengeId] || null;
}
