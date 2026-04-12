import type { CanvasNode, Connection, DesignScore, ValidationIssue } from '../types';

export function validateDesign(nodes: CanvasNode[], connections: Connection[]): DesignScore {
  const issues: ValidationIssue[] = [];

  if (nodes.length === 0) {
    return {
      overall: 0,
      categories: { scalability: 0, reliability: 0, performance: 0, security: 0 },
      issues: [{ severity: 'info', message: 'Canvas is empty', suggestion: 'Start by adding some components!' }],
    };
  }

  const outgoing = new Map<string, Connection[]>();
  const incoming = new Map<string, Connection[]>();

  for (const c of connections) {
    outgoing.set(c.from, [...(outgoing.get(c.from) || []), c]);
    incoming.set(c.to, [...(incoming.get(c.to) || []), c]);
  }

  let scalability = 50;
  let reliability = 50;
  let performance = 50;
  let security = 50;

  // Check for clients
  const clients = nodes.filter(n => n.type === 'client');
  if (clients.length === 0) {
    issues.push({ severity: 'warning', message: 'No client component found', suggestion: 'Add a Client to represent users interacting with your system.' });
  }

  // Check for disconnected nodes
  for (const node of nodes) {
    const hasIn = incoming.has(node.id);
    const hasOut = outgoing.has(node.id);
    if (!hasIn && !hasOut) {
      issues.push({ severity: 'warning', message: `"${node.label}" is disconnected`, nodeId: node.id, suggestion: 'Connect it to other components or remove it.' });
      reliability -= 5;
    }
  }

  // Check for single points of failure
  const servers = nodes.filter(n => n.type === 'server' || n.type === 'microservice');
  const serverTypeGroups = new Map<string, CanvasNode[]>();
  for (const s of servers) {
    const key = s.label.replace(/\s*\d+$/, '');
    serverTypeGroups.set(key, [...(serverTypeGroups.get(key) || []), s]);
  }
  for (const [name, group] of serverTypeGroups) {
    if (group.length === 1) {
      issues.push({ severity: 'warning', message: `"${name}" has no redundancy`, nodeId: group[0].id, suggestion: 'Add a second instance for high availability.' });
      reliability -= 10;
    }
  }

  // Check for load balancer
  const hasLB = nodes.some(n => n.type === 'loadbalancer');
  if (servers.length > 1 && !hasLB) {
    issues.push({ severity: 'warning', message: 'Multiple servers but no Load Balancer', suggestion: 'Add a Load Balancer to distribute traffic across servers.' });
    scalability -= 15;
  }
  if (hasLB) scalability += 15;

  // Check for caching
  const hasCache = nodes.some(n => n.type === 'cache');
  const hasDB = nodes.some(n => n.type === 'database');
  if (hasDB && !hasCache) {
    issues.push({ severity: 'info', message: 'No caching layer between servers and database', suggestion: 'Add a Cache (Redis/Memcached) to reduce database load.' });
    performance -= 15;
  }
  if (hasCache) performance += 15;

  // Check for CDN
  const hasCDN = nodes.some(n => n.type === 'cdn');
  if (clients.length > 0 && !hasCDN) {
    issues.push({ severity: 'info', message: 'No CDN for static content delivery', suggestion: 'A CDN reduces latency for static assets.' });
    performance -= 10;
  }
  if (hasCDN) performance += 10;

  // Check for API Gateway
  const hasGateway = nodes.some(n => n.type === 'api-gateway');
  if (servers.length >= 2 && !hasGateway) {
    issues.push({ severity: 'info', message: 'No API Gateway for service routing', suggestion: 'An API Gateway centralizes auth, rate limiting, and routing.' });
    security -= 10;
  }
  if (hasGateway) security += 15;

  // Check for firewall
  const hasFirewall = nodes.some(n => n.type === 'firewall');
  if (!hasFirewall && clients.length > 0) {
    issues.push({ severity: 'info', message: 'No Firewall/WAF protecting the system', suggestion: 'Add a Firewall to filter malicious traffic.' });
    security -= 10;
  }
  if (hasFirewall) security += 20;

  // Check for message queue (async)
  const hasQueue = nodes.some(n => n.type === 'queue');
  if (hasQueue) {
    scalability += 10;
    reliability += 10;
  }

  // Check for DNS
  const hasDNS = nodes.some(n => n.type === 'dns');
  if (hasDNS) reliability += 5;

  // Bonus for size/complexity
  if (nodes.length >= 8) scalability += 5;
  if (connections.length >= 10) performance += 5;

  // Clamp
  scalability = Math.max(0, Math.min(100, scalability));
  reliability = Math.max(0, Math.min(100, reliability));
  performance = Math.max(0, Math.min(100, performance));
  security = Math.max(0, Math.min(100, security));

  const overall = Math.round((scalability + reliability + performance + security) / 4);

  // Add positive notes
  if (issues.length === 0) {
    issues.push({ severity: 'info', message: 'Design looks solid!', suggestion: 'Keep refining and add more detail.' });
  }

  return {
    overall,
    categories: { scalability, reliability, performance, security },
    issues,
  };
}
