import type { Quest, CanvasNode, Connection, ComponentType } from '../types';

function has(nodes: CanvasNode[], t: ComponentType): boolean {
  return nodes.some(n => n.type === t);
}
function count(nodes: CanvasNode[], t: ComponentType): number {
  return nodes.filter(n => n.type === t).length;
}
function linked(nodes: CanvasNode[], conns: Connection[], a: ComponentType, b: ComponentType): boolean {
  return conns.some(c => {
    const f = nodes.find(n => n.id === c.from);
    const t = nodes.find(n => n.id === c.to);
    return (f?.type === a && t?.type === b) || (f?.type === b && t?.type === a);
  });
}

export const QUESTS: Quest[] = [
  {
    id: 'q1-url-shortener',
    level: 1,
    title: 'URL Shortener',
    realWorld: 'like bit.ly or TinyURL',
    difficulty: 'beginner',
    xpReward: 120,
    intro: 'Welcome, young apprentice! Your first quest — build a URL shortener. When a user pastes a long link, our system returns a tiny one. Simple on the surface, but a perfect lesson in the fundamentals!',
    outro: 'Magnificent! You have built your first system. Every great architect began right here. Onward to the next quest!',
    steps: [
      {
        id: 's1',
        instruction: 'Drag a Client onto the canvas',
        detail: 'Every system begins with the user. The Client is the browser or mobile app where requests originate.',
        senseiLine: 'First, summon the Client — this is our user’s gateway into the system.',
        hint: 'Open the left sidebar and drag the "Client" component to the canvas.',
        check: (n) => has(n, 'client'),
      },
      {
        id: 's2',
        instruction: 'Add a Server',
        detail: 'The Server contains our shortener logic — generating short codes and looking them up.',
        senseiLine: 'Now, a Server! This is the brain — it will shrink the URLs.',
        check: (n) => has(n, 'server'),
      },
      {
        id: 's3',
        instruction: 'Add a Database',
        detail: 'We need to persist the mapping of short codes to long URLs. Databases are our memory.',
        senseiLine: 'A shortener remembers every link forever. We need a Database!',
        check: (n) => has(n, 'database'),
      },
      {
        id: 's4',
        instruction: 'Add a Cache',
        detail: 'Popular links are requested thousands of times. A cache serves them in microseconds without hitting the DB.',
        senseiLine: 'A Cache — for the links everyone is clicking. Speed of lightning!',
        check: (n) => has(n, 'cache'),
      },
      {
        id: 's5',
        instruction: 'Connect Client → Server',
        detail: 'Click the connection handle on a node and drag to another. This is the HTTP request path.',
        senseiLine: 'Link the Client to the Server — watch the energy flow!',
        hint: 'Hover over the Client, click the colored dot, then click the Server.',
        check: (n, c) => linked(n, c, 'client', 'server'),
      },
      {
        id: 's6',
        instruction: 'Connect Server → Cache',
        detail: 'The Server checks the cache FIRST. If the short code is there, we skip the DB entirely.',
        senseiLine: 'Server to Cache — check the fast memory before the slow one.',
        check: (n, c) => linked(n, c, 'server', 'cache'),
      },
      {
        id: 's7',
        instruction: 'Connect Server → Database',
        detail: 'On a cache miss, fall back to the database. This is the classic cache-aside pattern.',
        senseiLine: 'And finally, Server to Database — our source of truth!',
        check: (n, c) => linked(n, c, 'server', 'database'),
      },
    ],
  },
  {
    id: 'q2-pastebin',
    level: 2,
    title: 'Pastebin',
    realWorld: 'like pastebin.com',
    difficulty: 'beginner',
    xpReward: 160,
    intro: 'A Pastebin stores large text snippets and returns a shareable URL. Similar to a URL shortener, but with a twist — pastes can be HUGE.',
    outro: 'You understand when to separate hot metadata from cold bulk storage. That is the mark of a growing architect!',
    steps: [
      {
        id: 's1', instruction: 'Drag a Client',
        detail: 'A user pasting text into a web form.',
        senseiLine: 'The user comes first, always!',
        check: (n) => has(n, 'client'),
      },
      {
        id: 's2', instruction: 'Add an API Gateway',
        detail: 'A single entry point handling auth, rate limits, and routing.',
        senseiLine: 'An API Gateway — the front gate of our fortress!',
        check: (n) => has(n, 'api-gateway'),
      },
      {
        id: 's3', instruction: 'Add a Server',
        detail: 'Business logic: generating paste IDs, validating input, orchestrating storage.',
        senseiLine: 'The Server will coordinate everything.',
        check: (n) => has(n, 'server'),
      },
      {
        id: 's4', instruction: 'Add a Database',
        detail: 'Store metadata: paste ID, timestamp, expiry, owner.',
        senseiLine: 'A Database — for the small, structured data.',
        check: (n) => has(n, 'database'),
      },
      {
        id: 's5', instruction: 'Add an Object Storage',
        detail: 'Pastes can be megabytes. Object storage (like S3) is cheap and scales infinitely.',
        senseiLine: 'Big data needs Big Storage — Object Storage is our answer!',
        check: (n) => has(n, 'storage'),
      },
      {
        id: 's6', instruction: 'Connect Client → API Gateway',
        detail: 'All traffic enters through the gateway.',
        senseiLine: 'The user always knocks on the front gate.',
        check: (n, c) => linked(n, c, 'client', 'api-gateway'),
      },
      {
        id: 's7', instruction: 'Connect Gateway → Server',
        detail: 'Gateway delegates to application servers.',
        senseiLine: 'Gateway passes the scroll to the Server!',
        check: (n, c) => linked(n, c, 'api-gateway', 'server'),
      },
      {
        id: 's8', instruction: 'Connect Server → Database AND Server → Storage',
        detail: 'Metadata goes to DB, bulk content goes to object storage.',
        senseiLine: 'Small data to Database, big data to Storage!',
        check: (n, c) => linked(n, c, 'server', 'database') && linked(n, c, 'server', 'storage'),
      },
    ],
  },
  {
    id: 'q3-scalable-api',
    level: 3,
    title: 'Scalable Web API',
    realWorld: 'any production REST API',
    difficulty: 'beginner',
    xpReward: 220,
    intro: 'Traffic is growing! A single server will not do. We need horizontal scaling — many servers behind a load balancer.',
    outro: 'You now wield the power of horizontal scaling. Your systems will never crumble under load!',
    steps: [
      {
        id: 's1', instruction: 'Add a Client and a DNS',
        detail: 'DNS resolves our domain name to the load balancer IP.',
        senseiLine: 'Every great journey begins with DNS — the map of the internet!',
        check: (n) => has(n, 'client') && has(n, 'dns'),
      },
      {
        id: 's2', instruction: 'Add a Load Balancer',
        detail: 'The LB distributes incoming requests across many servers.',
        senseiLine: 'The Load Balancer — the traffic cop of our kingdom!',
        check: (n) => has(n, 'loadbalancer'),
      },
      {
        id: 's3', instruction: 'Add at least 3 Servers',
        detail: 'Multiple identical servers share the load. If one dies, traffic shifts to others.',
        senseiLine: 'Three servers! Never put all your shuriken in one pouch.',
        check: (n) => count(n, 'server') >= 3,
      },
      {
        id: 's4', instruction: 'Add a Cache',
        detail: 'A shared cache (like Redis) lets any server read recent data instantly.',
        senseiLine: 'A shared Cache so all servers see the same fast data!',
        check: (n) => has(n, 'cache'),
      },
      {
        id: 's5', instruction: 'Add a Database',
        detail: 'The single source of truth behind the cache.',
        senseiLine: 'The Database — our anchor of truth.',
        check: (n) => has(n, 'database'),
      },
      {
        id: 's6', instruction: 'Connect Load Balancer to Servers',
        detail: 'The LB forwards each request to one healthy server.',
        senseiLine: 'Connect the Balancer to every Server!',
        check: (n, c) => linked(n, c, 'loadbalancer', 'server'),
      },
      {
        id: 's7', instruction: 'Build 6+ connections total',
        detail: 'Client → DNS → LB → Server → Cache/DB. Wire the full path.',
        senseiLine: 'Complete the flow — every piece must be reachable!',
        check: (_, c) => c.length >= 6,
      },
    ],
  },
  {
    id: 'q4-realtime-chat',
    level: 4,
    title: 'Real-Time Chat',
    realWorld: 'like WhatsApp or Discord',
    difficulty: 'intermediate',
    xpReward: 300,
    intro: 'Real-time messaging! Users online RIGHT NOW expect instant delivery. We need WebSockets, queues, and notifications.',
    outro: 'You can now build the nervous system of a real-time app. Messages fly at the speed of thought!',
    steps: [
      {
        id: 's1', instruction: 'Add 2 Clients',
        detail: 'Two users chatting — the minimum chat.',
        senseiLine: 'Two chatters — the dance of conversation begins!',
        check: (n) => count(n, 'client') >= 2,
      },
      {
        id: 's2', instruction: 'Add an API Gateway',
        detail: 'Handles WebSocket upgrades and routes connections.',
        senseiLine: 'The Gateway — it speaks HTTP AND WebSocket!',
        check: (n) => has(n, 'api-gateway'),
      },
      {
        id: 's3', instruction: 'Add a Server',
        detail: 'The chat server maintains active WebSocket connections.',
        senseiLine: 'A Server to hold the realtime connections.',
        check: (n) => has(n, 'server'),
      },
      {
        id: 's4', instruction: 'Add a Message Queue',
        detail: 'Messages buffer here for reliability and fan-out delivery.',
        senseiLine: 'The Queue — no message shall ever be lost!',
        check: (n) => has(n, 'queue'),
      },
      {
        id: 's5', instruction: 'Add a Database',
        detail: 'Persist chat history for replay when users reconnect.',
        senseiLine: 'Remember every word — the Database preserves history.',
        check: (n) => has(n, 'database'),
      },
      {
        id: 's6', instruction: 'Add a Notification service',
        detail: 'Push alerts to users who are offline.',
        senseiLine: 'For the sleeping users — Notifications wake them!',
        check: (n) => has(n, 'notification'),
      },
      {
        id: 's7', instruction: 'Build 7+ connections',
        detail: 'Wire Clients to Gateway, Gateway to Server, Server to Queue, Queue to DB and Notifications.',
        senseiLine: 'Every component linked — the chat is alive!',
        check: (_, c) => c.length >= 7,
      },
    ],
  },
  {
    id: 'q5-news-feed',
    level: 5,
    title: 'Social News Feed',
    realWorld: 'like Facebook or Instagram feed',
    difficulty: 'intermediate',
    xpReward: 380,
    intro: 'A feed of posts, ranked and personalized. Millions of reads per second. We need CDN caching and aggressive optimization!',
    outro: 'You have tamed the fan-out problem. Feeds of a billion users bow to your design!',
    steps: [
      {
        id: 's1', instruction: 'Add Client and CDN',
        detail: 'Images and static assets served from the edge — close to the user.',
        senseiLine: 'The CDN — photos fly from the nearest edge!',
        check: (n) => has(n, 'client') && has(n, 'cdn'),
      },
      {
        id: 's2', instruction: 'Add Load Balancer and API Gateway',
        detail: 'LB handles traffic distribution; Gateway handles auth and routing.',
        senseiLine: 'Balancer for scale, Gateway for wisdom!',
        check: (n) => has(n, 'loadbalancer') && has(n, 'api-gateway'),
      },
      {
        id: 's3', instruction: 'Add at least 2 Microservices',
        detail: 'Separate services for posts, timelines, ranking — independent scaling.',
        senseiLine: 'Split the work! Each Microservice masters one art.',
        check: (n) => count(n, 'microservice') >= 2,
      },
      {
        id: 's4', instruction: 'Add Cache and Database',
        detail: 'Cache serves hot feeds; DB stores posts and follow graph.',
        senseiLine: 'Cache for speed, Database for truth.',
        check: (n) => has(n, 'cache') && has(n, 'database'),
      },
      {
        id: 's5', instruction: 'Add Message Queue',
        detail: 'When you post, a queue fans out to all followers’ feeds asynchronously.',
        senseiLine: 'The Queue fans out your message to a million followers!',
        check: (n) => has(n, 'queue'),
      },
      {
        id: 's6', instruction: 'Build 9+ connections',
        detail: 'Complete the entire read and write path.',
        senseiLine: 'Every piece connected — the feed flows!',
        check: (_, c) => c.length >= 9,
      },
    ],
  },
  {
    id: 'q6-video-streaming',
    level: 6,
    title: 'Video Streaming',
    realWorld: 'like YouTube or Netflix',
    difficulty: 'advanced',
    xpReward: 480,
    intro: 'Videos are enormous. Encoding takes time. Users demand instant playback. CDN + object storage + search — the holy trinity of streaming!',
    outro: 'You command bandwidth at planetary scale. Welcome to the realm of streaming!',
    steps: [
      {
        id: 's1', instruction: 'Add Client, DNS, and CDN',
        detail: 'Video chunks must stream from the nearest edge. CDN is non-negotiable.',
        senseiLine: 'Without CDN, videos would crawl. With it — they fly!',
        check: (n) => has(n, 'client') && has(n, 'dns') && has(n, 'cdn'),
      },
      {
        id: 's2', instruction: 'Add API Gateway and Load Balancer',
        detail: 'Standard ingress for metadata APIs.',
        senseiLine: 'The gateway and the balancer — our first line of order!',
        check: (n) => has(n, 'api-gateway') && has(n, 'loadbalancer'),
      },
      {
        id: 's3', instruction: 'Add at least 2 Microservices',
        detail: 'Upload service, transcoder service — specialization matters.',
        senseiLine: 'Microservices for upload, transcoding, playback!',
        check: (n) => count(n, 'microservice') >= 2,
      },
      {
        id: 's4', instruction: 'Add Object Storage',
        detail: 'Raw and transcoded video files live here. Petabytes of them.',
        senseiLine: 'Object Storage — an ocean for our videos!',
        check: (n) => has(n, 'storage'),
      },
      {
        id: 's5', instruction: 'Add Message Queue',
        detail: 'Transcoding jobs are queued — a 4K video may take minutes.',
        senseiLine: 'The Queue holds transcoding jobs in patient order!',
        check: (n) => has(n, 'queue'),
      },
      {
        id: 's6', instruction: 'Add Search Engine and Database',
        detail: 'Users search titles; DB stores metadata and watch history.',
        senseiLine: 'Search so users can find — Database so the system can remember!',
        check: (n) => has(n, 'search-engine') && has(n, 'database'),
      },
      {
        id: 's7', instruction: 'Build 11+ connections',
        detail: 'Wire upload, playback, search, and delivery paths.',
        senseiLine: 'All streams must flow!',
        check: (_, c) => c.length >= 11,
      },
    ],
  },
  {
    id: 'q7-ride-sharing',
    level: 7,
    title: 'Ride Sharing',
    realWorld: 'like Uber or Lyft',
    difficulty: 'advanced',
    xpReward: 560,
    intro: 'Riders. Drivers. Real-time location. Matching. Payments. Notifications. This is where systems truly get interesting!',
    outro: 'You have mastered geo-spatial coordination and service decomposition. A city runs on your design!',
    steps: [
      {
        id: 's1', instruction: 'Add 2 Clients (rider + driver apps)',
        detail: 'Two different apps, same platform.',
        senseiLine: 'Two apps — rider and driver — two sides of one coin!',
        check: (n) => count(n, 'client') >= 2,
      },
      {
        id: 's2', instruction: 'Add API Gateway and Load Balancer',
        detail: 'Standard edge for all apps.',
        senseiLine: 'Gateway and Balancer — our unshakeable edge!',
        check: (n) => has(n, 'api-gateway') && has(n, 'loadbalancer'),
      },
      {
        id: 's3', instruction: 'Add at least 3 Microservices',
        detail: 'Matching service, trip service, payment service — each its own kingdom.',
        senseiLine: 'Three services! Matching, Trips, Payments — each a master of one art.',
        check: (n) => count(n, 'microservice') >= 3,
      },
      {
        id: 's4', instruction: 'Add Cache (for driver locations)',
        detail: 'Driver positions update every few seconds — a cache is perfect.',
        senseiLine: 'Locations change fast — a Cache keeps them fresh!',
        check: (n) => has(n, 'cache'),
      },
      {
        id: 's5', instruction: 'Add Message Queue',
        detail: 'Async events: trip completed, payment charged, receipt sent.',
        senseiLine: 'Async events flow through the Queue!',
        check: (n) => has(n, 'queue'),
      },
      {
        id: 's6', instruction: 'Add Notification service',
        detail: 'Push "Your driver is here!" alerts.',
        senseiLine: 'Notifications wake the rider when the chariot arrives!',
        check: (n) => has(n, 'notification'),
      },
      {
        id: 's7', instruction: 'Add at least 2 Databases',
        detail: 'Per-service DBs: trip DB, user/payment DB.',
        senseiLine: 'Each service with its own Database — sovereign and free!',
        check: (n) => count(n, 'database') >= 2,
      },
      {
        id: 's8', instruction: 'Build 12+ connections',
        detail: 'Full service mesh wired.',
        senseiLine: 'The city is alive — every ride flows through your design!',
        check: (_, c) => c.length >= 12,
      },
    ],
  },
  {
    id: 'q8-twitter',
    level: 8,
    title: 'Twitter / X Clone',
    realWorld: 'microblogging at scale',
    difficulty: 'advanced',
    xpReward: 680,
    intro: 'Short posts. Global fan-out. Search across billions of tweets. Trending topics. The full gauntlet of modern social!',
    outro: 'You handle the twin beasts of timeline generation and real-time search. Few architects reach this peak!',
    steps: [
      {
        id: 's1', instruction: 'Add Client, CDN, and Firewall',
        detail: 'A firewall protects against DDoS at the edge — Twitter is a big target.',
        senseiLine: 'CDN for reach, Firewall for defense!',
        check: (n) => has(n, 'client') && has(n, 'cdn') && has(n, 'firewall'),
      },
      {
        id: 's2', instruction: 'Add API Gateway and Load Balancer',
        detail: 'Massive ingress capacity.',
        senseiLine: 'Gateway and Balancer, as always!',
        check: (n) => has(n, 'api-gateway') && has(n, 'loadbalancer'),
      },
      {
        id: 's3', instruction: 'Add at least 3 Microservices',
        detail: 'Tweet service, timeline service, follow-graph service.',
        senseiLine: 'Three services for three domains!',
        check: (n) => count(n, 'microservice') >= 3,
      },
      {
        id: 's4', instruction: 'Add Cache and 2 Databases',
        detail: 'Hot timelines cached; DBs split by domain.',
        senseiLine: 'Cache for timelines, Databases for truth!',
        check: (n) => has(n, 'cache') && count(n, 'database') >= 2,
      },
      {
        id: 's5', instruction: 'Add Search Engine',
        detail: 'Search millions of tweets in milliseconds.',
        senseiLine: 'Search — the oracle of every tweet ever written!',
        check: (n) => has(n, 'search-engine'),
      },
      {
        id: 's6', instruction: 'Add Message Queue',
        detail: 'Fan-out new tweets to all follower timelines.',
        senseiLine: 'The Queue fans a tweet to a million timelines!',
        check: (n) => has(n, 'queue'),
      },
      {
        id: 's7', instruction: 'Add Notification service',
        detail: 'Likes, replies, mentions — all push notifications.',
        senseiLine: 'Notifications for every interaction!',
        check: (n) => has(n, 'notification'),
      },
      {
        id: 's8', instruction: 'Build 14+ connections',
        detail: 'A full production mesh.',
        senseiLine: 'Twitter lives — at planetary scale!',
        check: (_, c) => c.length >= 14,
      },
    ],
  },
  {
    id: 'q9-distributed-search',
    level: 9,
    title: 'Distributed Search System',
    realWorld: 'like Google or Elasticsearch',
    difficulty: 'expert',
    xpReward: 820,
    intro: 'Index the world. Query it in milliseconds. Schedule crawlers. Rank results. A true architect’s challenge!',
    outro: 'You have built a system of systems. Indexing, crawling, ranking — all bent to your will!',
    steps: [
      {
        id: 's1', instruction: 'Add Client, DNS, CDN',
        detail: 'Global ingress for billions of queries.',
        senseiLine: 'Client, DNS, CDN — the holy ingress trinity!',
        check: (n) => has(n, 'client') && has(n, 'dns') && has(n, 'cdn'),
      },
      {
        id: 's2', instruction: 'Add Firewall, Load Balancer, and API Gateway',
        detail: 'Defense and routing at the edge.',
        senseiLine: 'A fortress of three layers guards the search engine!',
        check: (n) => has(n, 'firewall') && has(n, 'loadbalancer') && has(n, 'api-gateway'),
      },
      {
        id: 's3', instruction: 'Add a Scheduler',
        detail: 'Triggers crawlers on a schedule — fresh index every hour.',
        senseiLine: 'The Scheduler awakens the crawlers on the clock!',
        check: (n) => has(n, 'scheduler'),
      },
      {
        id: 's4', instruction: 'Add at least 3 Microservices (crawler, indexer, ranker)',
        detail: 'Each pipeline stage is its own service.',
        senseiLine: 'Crawler, Indexer, Ranker — three specialist services!',
        check: (n) => count(n, 'microservice') >= 3,
      },
      {
        id: 's5', instruction: 'Add at least 2 Message Queues',
        detail: 'Between every pipeline stage — decoupling is everything.',
        senseiLine: 'Queues between stages — loose coupling, strong system!',
        check: (n) => count(n, 'queue') >= 2,
      },
      {
        id: 's6', instruction: 'Add Search Engine and Cache',
        detail: 'The inverted index + cached popular queries.',
        senseiLine: 'The Search Engine — the soul of this quest!',
        check: (n) => has(n, 'search-engine') && has(n, 'cache'),
      },
      {
        id: 's7', instruction: 'Add Object Storage and Database',
        detail: 'Raw crawled pages in storage; metadata in DB.',
        senseiLine: 'Storage for pages, Database for metadata!',
        check: (n) => has(n, 'storage') && has(n, 'database'),
      },
      {
        id: 's8', instruction: 'Build 16+ connections',
        detail: 'Every pipeline stage wired.',
        senseiLine: 'The index of the world — complete!',
        check: (_, c) => c.length >= 16,
      },
    ],
  },
  {
    id: 'q10-payment-system',
    level: 10,
    title: 'Global Payment System',
    realWorld: 'like Stripe or PayPal',
    difficulty: 'expert',
    xpReward: 1000,
    intro: 'The final quest. Money flows. Regulations crush the weak. Every transaction must be perfect. Security is absolute!',
    outro: 'HOKAGE! You have built the most demanding system in our curriculum. You are now a master system architect. The world is yours to design!',
    steps: [
      {
        id: 's1', instruction: 'Add Client, DNS, CDN, Firewall',
        detail: 'Payments are attacked constantly — defense in depth starts here.',
        senseiLine: 'Defense from the very first byte!',
        check: (n) => has(n, 'client') && has(n, 'dns') && has(n, 'cdn') && has(n, 'firewall'),
      },
      {
        id: 's2', instruction: 'Add API Gateway and Load Balancer',
        detail: 'Central auth and rate limiting at the gateway.',
        senseiLine: 'Every request authenticated at the Gateway!',
        check: (n) => has(n, 'api-gateway') && has(n, 'loadbalancer'),
      },
      {
        id: 's3', instruction: 'Add at least 4 Microservices',
        detail: 'Payment, fraud, ledger, reconciliation — isolation is mandatory.',
        senseiLine: 'Four specialists: Payment, Fraud, Ledger, Reconciliation!',
        check: (n) => count(n, 'microservice') >= 4,
      },
      {
        id: 's4', instruction: 'Add at least 2 Message Queues',
        detail: 'Payments are async — events flow through durable queues.',
        senseiLine: 'Never lose a transaction — the Queue guarantees it!',
        check: (n) => count(n, 'queue') >= 2,
      },
      {
        id: 's5', instruction: 'Add Cache and at least 2 Databases',
        detail: 'Per-service DBs for strong isolation; cache for idempotency keys.',
        senseiLine: 'Isolated Databases — one breach cannot topple all!',
        check: (n) => has(n, 'cache') && count(n, 'database') >= 2,
      },
      {
        id: 's6', instruction: 'Add Object Storage',
        detail: 'Receipts, audit logs, compliance documents — kept for years.',
        senseiLine: 'Storage for the eternal audit trail!',
        check: (n) => has(n, 'storage'),
      },
      {
        id: 's7', instruction: 'Add Scheduler and Notification',
        detail: 'Scheduled batch reconciliation + receipt notifications.',
        senseiLine: 'Scheduler for nightly reconciliation, Notifications for receipts!',
        check: (n) => has(n, 'scheduler') && has(n, 'notification'),
      },
      {
        id: 's8', instruction: 'Build 18+ connections',
        detail: 'The full enterprise-grade mesh.',
        senseiLine: 'The final system — forged in your own hands. You are HOKAGE!',
        check: (_, c) => c.length >= 18,
      },
    ],
  },
];

export function getQuestById(id: string): Quest | null {
  return QUESTS.find(q => q.id === id) || null;
}

export function getQuestByLevel(level: number): Quest | null {
  return QUESTS.find(q => q.level === level) || null;
}
