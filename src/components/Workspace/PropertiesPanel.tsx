import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CanvasNode, Connection, ConnectionProtocol } from '../../types';
import { getComponentMeta } from '../../utils/componentMeta';
import ComponentIcon from '../SystemComponents/ComponentIcon';

const SYSTEM_DESIGN_INFO: Record<string, { tips: string[]; realWorld: string[] }> = {
  client: {
    tips: [
      'Clients should be as thin as possible — push logic to the server.',
      'Consider offline-first design with local caching.',
      'Use lazy loading to reduce initial bundle size.',
    ],
    realWorld: ['React SPA', 'iOS/Android App', 'Desktop (Electron)', 'CLI Tool'],
  },
  server: {
    tips: [
      'Keep servers stateless for easy horizontal scaling.',
      'Use health checks and graceful shutdown.',
      'Implement rate limiting to prevent abuse.',
    ],
    realWorld: ['Node.js / Express', 'Go / Gin', 'Java / Spring Boot', 'Python / FastAPI'],
  },
  database: {
    tips: [
      'Choose SQL for structured data with relationships, NoSQL for flexible schemas.',
      'Always plan your indexing strategy upfront.',
      'Consider read replicas for read-heavy workloads.',
    ],
    realWorld: ['PostgreSQL', 'MySQL', 'MongoDB', 'DynamoDB', 'Cassandra'],
  },
  loadbalancer: {
    tips: [
      'Round-robin is simple but least-connections handles uneven loads better.',
      'Use health checks to route away from unhealthy instances.',
      'Consider Layer 7 (application) vs Layer 4 (transport) load balancing.',
    ],
    realWorld: ['Nginx', 'HAProxy', 'AWS ALB/NLB', 'Cloudflare'],
  },
  cache: {
    tips: [
      'Cache invalidation is one of the two hard problems in CS.',
      'Use TTL-based expiry for most cases.',
      'Consider cache-aside, write-through, or write-behind patterns.',
    ],
    realWorld: ['Redis', 'Memcached', 'Varnish', 'CDN Edge Cache'],
  },
  queue: {
    tips: [
      'Queues decouple producers from consumers, enabling async processing.',
      'Design for at-least-once delivery and make consumers idempotent.',
      'Use dead letter queues for failed messages.',
    ],
    realWorld: ['Apache Kafka', 'RabbitMQ', 'AWS SQS', 'Redis Streams'],
  },
  'api-gateway': {
    tips: [
      'Centralize cross-cutting concerns: auth, rate limiting, logging.',
      'Use API versioning from day one.',
      'Consider request/response transformation at the gateway level.',
    ],
    realWorld: ['Kong', 'AWS API Gateway', 'Nginx', 'Envoy'],
  },
  cdn: {
    tips: [
      'CDNs reduce latency by serving content from edge locations near users.',
      'Set proper cache headers (Cache-Control, ETag).',
      'Use cache busting (hashed filenames) for deployments.',
    ],
    realWorld: ['Cloudflare', 'AWS CloudFront', 'Akamai', 'Fastly'],
  },
  storage: {
    tips: [
      'Use object storage for unstructured data (images, videos, backups).',
      'Enable versioning to protect against accidental deletes.',
      'Use pre-signed URLs for secure direct uploads.',
    ],
    realWorld: ['AWS S3', 'Google Cloud Storage', 'Azure Blob', 'MinIO'],
  },
  microservice: {
    tips: [
      'Each microservice should own its data — no shared databases.',
      'Define clear API contracts between services.',
      'Use circuit breakers for resilience against cascading failures.',
    ],
    realWorld: ['Auth Service', 'Payment Service', 'Notification Service', 'Search Service'],
  },
  dns: {
    tips: [
      'DNS resolution adds latency — consider DNS caching and TTL optimization.',
      'Use GeoDNS for routing users to the nearest data center.',
      'DNS failover enables automatic traffic redirection during outages.',
    ],
    realWorld: ['Route 53', 'Cloudflare DNS', 'Google Cloud DNS', 'Dyn'],
  },
  firewall: {
    tips: [
      'WAFs protect against OWASP Top 10 attacks (SQL injection, XSS, etc.).',
      'Layer security: network firewall + WAF + application-level checks.',
      'Rate limiting at the firewall prevents DDoS attacks.',
    ],
    realWorld: ['AWS WAF', 'Cloudflare WAF', 'ModSecurity', 'Palo Alto'],
  },
  'search-engine': {
    tips: [
      'Inverted indexes enable fast full-text search across millions of documents.',
      'Separate search indexes from primary databases — eventual consistency is fine.',
      'Use analyzers and tokenizers to handle different languages and formats.',
    ],
    realWorld: ['Elasticsearch', 'Apache Solr', 'Algolia', 'Meilisearch'],
  },
  notification: {
    tips: [
      'Design notifications as async — never block the main flow for delivery.',
      'Support multiple channels: email, SMS, push, in-app.',
      'Implement user preferences to avoid notification fatigue.',
    ],
    realWorld: ['SendGrid', 'Twilio', 'Firebase FCM', 'Amazon SNS'],
  },
  scheduler: {
    tips: [
      'Use distributed scheduling to avoid single points of failure.',
      'Ensure jobs are idempotent — they may run more than once.',
      'Monitor job execution time and set up alerts for failures.',
    ],
    realWorld: ['Apache Airflow', 'Celery Beat', 'Kubernetes CronJob', 'AWS EventBridge'],
  },
};

const PROTOCOLS: { value: ConnectionProtocol; label: string; color: string }[] = [
  { value: 'http', label: 'HTTP/REST', color: '#3b82f6' },
  { value: 'websocket', label: 'WebSocket', color: '#00ff88' },
  { value: 'grpc', label: 'gRPC', color: '#ff6b00' },
  { value: 'tcp', label: 'TCP/IP', color: '#8b5cf6' },
  { value: 'amqp', label: 'AMQP', color: '#ffd700' },
  { value: 'custom', label: 'Custom', color: '#888888' },
];

interface Props {
  selectedNode: CanvasNode | null;
  selectedConnection: Connection | null;
  connections: Connection[];
  nodes: CanvasNode[];
  onUpdateLabel: (id: string, label: string) => void;
  onDeleteNode: (id: string) => void;
  onUpdateConnectionLabel: (id: string, label: string) => void;
  onUpdateConnectionProtocol: (id: string, protocol: ConnectionProtocol) => void;
  onDeleteConnection: (id: string) => void;
}

export default function PropertiesPanel({
  selectedNode, selectedConnection, connections, nodes,
  onUpdateLabel, onDeleteNode,
  onUpdateConnectionLabel, onUpdateConnectionProtocol, onDeleteConnection,
}: Props) {
  const [editingLabel, setEditingLabel] = useState(false);
  const [editingConnLabel, setEditingConnLabel] = useState(false);

  const hasSelection = selectedNode || selectedConnection;

  // Get connections for selected node
  const nodeConnections = selectedNode
    ? connections.filter(c => c.from === selectedNode.id || c.to === selectedNode.id)
    : [];

  return (
    <motion.aside
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      style={{
        width: 260,
        height: '100%',
        background: 'linear-gradient(180deg, #0f0f2a 0%, #0a0a1f 100%)',
        borderLeft: '1px solid rgba(0, 245, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Border glow */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1,
          height: '100%',
          background: 'linear-gradient(180deg, transparent, #ff00e5, transparent)',
          opacity: 0.3,
        }}
        animate={{ opacity: [0.1, 0.4, 0.1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Header */}
      <div style={{
        padding: '20px 16px 12px',
        borderBottom: '1px solid rgba(255, 0, 229, 0.08)',
      }}>
        <motion.h2
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: '#ff00e5',
            marginBottom: 4,
          }}
          animate={{ textShadow: ['0 0 10px rgba(255,0,229,0.3)', '0 0 20px rgba(255,0,229,0.6)', '0 0 10px rgba(255,0,229,0.3)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          PROPERTIES
        </motion.h2>
        <p style={{
          fontFamily: "'Exo 2', sans-serif",
          fontSize: 11,
          color: '#555577',
          letterSpacing: '0.1em',
        }}>
          {hasSelection ? 'Inspect & configure' : 'Select a component'}
        </p>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
        <AnimatePresence mode="wait">
          {selectedNode ? (
            <NodeProperties
              key={`node-${selectedNode.id}`}
              node={selectedNode}
              nodeConnections={nodeConnections}
              nodes={nodes}
              editingLabel={editingLabel}
              setEditingLabel={setEditingLabel}
              onUpdateLabel={onUpdateLabel}
              onDeleteNode={onDeleteNode}
            />
          ) : selectedConnection ? (
            <ConnectionProperties
              key={`conn-${selectedConnection.id}`}
              connection={selectedConnection}
              nodes={nodes}
              editingLabel={editingConnLabel}
              setEditingLabel={setEditingConnLabel}
              onUpdateLabel={onUpdateConnectionLabel}
              onUpdateProtocol={onUpdateConnectionProtocol}
              onDelete={onDeleteConnection}
            />
          ) : (
            <EmptyState key="empty" />
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}

function NodeProperties({
  node, nodeConnections, nodes, editingLabel, setEditingLabel, onUpdateLabel, onDeleteNode,
}: {
  node: CanvasNode;
  nodeConnections: Connection[];
  nodes: CanvasNode[];
  editingLabel: boolean;
  setEditingLabel: (v: boolean) => void;
  onUpdateLabel: (id: string, label: string) => void;
  onDeleteNode: (id: string) => void;
}) {
  const meta = getComponentMeta(node.type);
  const info = SYSTEM_DESIGN_INFO[node.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {/* Component header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 8,
        background: `rgba(${hexToRgb(meta.color)}, 0.08)`,
        border: `1px solid rgba(${hexToRgb(meta.color)}, 0.2)`,
      }}>
        <div style={{
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
          background: `rgba(${hexToRgb(meta.color)}, 0.15)`,
        }}>
          <ComponentIcon type={node.type} size={22} color={meta.color} />
        </div>
        <div>
          {editingLabel ? (
            <input
              autoFocus
              defaultValue={node.label}
              onBlur={(e) => {
                onUpdateLabel(node.id, e.target.value || meta.label);
                setEditingLabel(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onUpdateLabel(node.id, (e.target as HTMLInputElement).value || meta.label);
                  setEditingLabel(false);
                }
              }}
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: `1px solid ${meta.color}`,
                borderRadius: 4,
                color: '#fff',
                fontFamily: "'Exo 2', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                padding: '2px 6px',
                outline: 'none',
                width: '100%',
              }}
            />
          ) : (
            <div
              onClick={() => setEditingLabel(true)}
              style={{
                fontFamily: "'Exo 2', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: meta.color,
                cursor: 'pointer',
              }}
            >
              {node.label}
            </div>
          )}
          <div style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 10,
            color: '#555577',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            {meta.type}
          </div>
        </div>
      </div>

      {/* Description */}
      <Section title="ABOUT">
        <p style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 12,
          color: '#8888aa',
          lineHeight: 1.5,
        }}>
          {meta.description}
        </p>
      </Section>

      {/* System Design Tips */}
      {info && (
        <Section title="SENSEI TIPS">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {info.tips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 11,
                  color: '#9999bb',
                  lineHeight: 1.4,
                  padding: '6px 8px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 4,
                  borderLeft: `2px solid ${meta.color}33`,
                }}
              >
                {tip}
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Real-world examples */}
      {info && (
        <Section title="REAL WORLD">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {info.realWorld.map((ex) => (
              <span key={ex} style={{
                fontFamily: "'Exo 2', sans-serif",
                fontSize: 10,
                color: meta.color,
                padding: '3px 8px',
                borderRadius: 10,
                background: `rgba(${hexToRgb(meta.color)}, 0.1)`,
                border: `1px solid rgba(${hexToRgb(meta.color)}, 0.15)`,
              }}>
                {ex}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Connections */}
      {nodeConnections.length > 0 && (
        <Section title={`CONNECTIONS (${nodeConnections.length})`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {nodeConnections.map(c => {
              const isOutgoing = c.from === node.id;
              const otherNode = nodes.find(n => n.id === (isOutgoing ? c.to : c.from));
              return (
                <div key={c.id} style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: 10,
                  color: '#7777aa',
                  padding: '4px 8px',
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <span style={{ color: isOutgoing ? '#00ff88' : '#ff6b00' }}>
                    {isOutgoing ? '→' : '←'}
                  </span>
                  <span>{otherNode?.label || 'Unknown'}</span>
                  {c.label && (
                    <span style={{ color: '#555566', marginLeft: 'auto' }}>{c.label}</span>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Position info */}
      <Section title="POSITION">
        <div style={{
          display: 'flex',
          gap: 12,
          fontFamily: "'Exo 2', sans-serif",
          fontSize: 11,
          color: '#555577',
        }}>
          <span>X: <span style={{ color: '#00f5ff' }}>{Math.round(node.position.x)}</span></span>
          <span>Y: <span style={{ color: '#ff00e5' }}>{Math.round(node.position.y)}</span></span>
        </div>
      </Section>

      {/* Delete */}
      <motion.button
        whileHover={{ scale: 1.02, background: 'rgba(255,51,102,0.15)' }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onDeleteNode(node.id)}
        style={{
          padding: '8px 12px',
          background: 'rgba(255,51,102,0.08)',
          border: '1px solid rgba(255,51,102,0.2)',
          borderRadius: 6,
          color: '#ff3366',
          fontFamily: "'Exo 2', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.1em',
          cursor: 'pointer',
          textAlign: 'center',
        }}
      >
        DELETE COMPONENT
      </motion.button>
    </motion.div>
  );
}

function ConnectionProperties({
  connection, nodes, editingLabel, setEditingLabel, onUpdateLabel, onUpdateProtocol, onDelete,
}: {
  connection: Connection;
  nodes: CanvasNode[];
  editingLabel: boolean;
  setEditingLabel: (v: boolean) => void;
  onUpdateLabel: (id: string, label: string) => void;
  onUpdateProtocol: (id: string, protocol: ConnectionProtocol) => void;
  onDelete: (id: string) => void;
}) {
  const fromNode = nodes.find(n => n.id === connection.from);
  const toNode = nodes.find(n => n.id === connection.to);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {/* Connection header */}
      <div style={{
        padding: '10px 12px',
        borderRadius: 8,
        background: 'rgba(139, 92, 246, 0.08)',
        border: '1px solid rgba(139, 92, 246, 0.2)',
      }}>
        <div style={{
          fontFamily: "'Exo 2', sans-serif",
          fontSize: 12,
          color: '#8b5cf6',
          fontWeight: 600,
          marginBottom: 6,
        }}>
          CONNECTION
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 13,
          color: '#c0c0e0',
        }}>
          <span>{fromNode?.label || '?'}</span>
          <span style={{ color: '#8b5cf6' }}>→</span>
          <span>{toNode?.label || '?'}</span>
        </div>
      </div>

      {/* Label */}
      <Section title="LABEL">
        {editingLabel ? (
          <input
            autoFocus
            defaultValue={connection.label || ''}
            placeholder="e.g. REST API, WebSocket..."
            onBlur={(e) => {
              onUpdateLabel(connection.id, e.target.value);
              setEditingLabel(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onUpdateLabel(connection.id, (e.target as HTMLInputElement).value);
                setEditingLabel(false);
              }
            }}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid #8b5cf6',
              borderRadius: 4,
              color: '#fff',
              fontFamily: "'Exo 2', sans-serif",
              fontSize: 12,
              padding: '6px 8px',
              outline: 'none',
            }}
          />
        ) : (
          <div
            onClick={() => setEditingLabel(true)}
            style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: 12,
              color: connection.label ? '#c0c0e0' : '#555577',
              cursor: 'pointer',
              padding: '6px 8px',
              borderRadius: 4,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {connection.label || 'Click to add label...'}
          </div>
        )}
      </Section>

      {/* Protocol */}
      <Section title="PROTOCOL">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {PROTOCOLS.map(p => (
            <motion.button
              key={p.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onUpdateProtocol(connection.id, p.value)}
              style={{
                padding: '4px 10px',
                borderRadius: 10,
                fontSize: 10,
                fontFamily: "'Exo 2', sans-serif",
                fontWeight: 600,
                cursor: 'pointer',
                background: connection.protocol === p.value ? `rgba(${hexToRgb(p.color)}, 0.2)` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${connection.protocol === p.value ? p.color : 'rgba(255,255,255,0.08)'}`,
                color: connection.protocol === p.value ? p.color : '#555577',
              }}
            >
              {p.label}
            </motion.button>
          ))}
        </div>
      </Section>

      {/* Delete */}
      <motion.button
        whileHover={{ scale: 1.02, background: 'rgba(255,51,102,0.15)' }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onDelete(connection.id)}
        style={{
          padding: '8px 12px',
          background: 'rgba(255,51,102,0.08)',
          border: '1px solid rgba(255,51,102,0.2)',
          borderRadius: 6,
          color: '#ff3366',
          fontFamily: "'Exo 2', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.1em',
          cursor: 'pointer',
          textAlign: 'center',
        }}
      >
        DELETE CONNECTION
      </motion.button>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        padding: 20,
      }}
    >
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: 32,
          color: '#222244',
          marginBottom: 12,
        }}
      >
        ⬡
      </motion.div>
      <div style={{
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: 13,
        color: '#444466',
        lineHeight: 1.5,
      }}>
        Select a component or connection to view its properties
      </div>
    </motion.div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.15em',
        color: '#444466',
        marginBottom: 8,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}
