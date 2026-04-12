import type { ComponentMeta } from '../types';

export const COMPONENT_META: ComponentMeta[] = [
  {
    type: 'client',
    label: 'Client',
    description: 'Browser, mobile app, or desktop application that users interact with',
    color: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.5)',
  },
  {
    type: 'server',
    label: 'Server',
    description: 'Application server that handles business logic and processes requests',
    color: '#00f5ff',
    glowColor: 'rgba(0, 245, 255, 0.5)',
  },
  {
    type: 'database',
    label: 'Database',
    description: 'Persistent storage for structured data (SQL/NoSQL)',
    color: '#ff00e5',
    glowColor: 'rgba(255, 0, 229, 0.5)',
  },
  {
    type: 'loadbalancer',
    label: 'Load Balancer',
    description: 'Distributes incoming traffic across multiple servers',
    color: '#ffd700',
    glowColor: 'rgba(255, 215, 0, 0.5)',
  },
  {
    type: 'cache',
    label: 'Cache',
    description: 'In-memory data store for fast access (Redis, Memcached)',
    color: '#00ff88',
    glowColor: 'rgba(0, 255, 136, 0.5)',
  },
  {
    type: 'queue',
    label: 'Message Queue',
    description: 'Asynchronous message broker (Kafka, RabbitMQ, SQS)',
    color: '#ff6b00',
    glowColor: 'rgba(255, 107, 0, 0.5)',
  },
  {
    type: 'api-gateway',
    label: 'API Gateway',
    description: 'Entry point that routes requests, handles auth, and rate limiting',
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.5)',
  },
  {
    type: 'cdn',
    label: 'CDN',
    description: 'Content Delivery Network for serving static assets globally',
    color: '#f472b6',
    glowColor: 'rgba(244, 114, 182, 0.5)',
  },
  {
    type: 'storage',
    label: 'Object Storage',
    description: 'Blob/file storage service (S3, GCS, Azure Blob)',
    color: '#a78bfa',
    glowColor: 'rgba(167, 139, 250, 0.5)',
  },
  {
    type: 'microservice',
    label: 'Microservice',
    description: 'Independent, deployable service handling a specific domain',
    color: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.5)',
  },
  {
    type: 'dns',
    label: 'DNS',
    description: 'Domain Name System for resolving domain names to IP addresses',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.5)',
  },
  {
    type: 'firewall',
    label: 'Firewall / WAF',
    description: 'Network security that monitors and filters incoming/outgoing traffic',
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.5)',
  },
  {
    type: 'search-engine',
    label: 'Search Engine',
    description: 'Full-text search and analytics engine (Elasticsearch, Solr)',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.5)',
  },
  {
    type: 'notification',
    label: 'Notification',
    description: 'Push notification service for emails, SMS, and mobile alerts',
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.5)',
  },
  {
    type: 'scheduler',
    label: 'Task Scheduler',
    description: 'Cron jobs and scheduled task execution (Airflow, Celery Beat)',
    color: '#14b8a6',
    glowColor: 'rgba(20, 184, 166, 0.5)',
  },
];

export function getComponentMeta(type: string): ComponentMeta {
  return COMPONENT_META.find(c => c.type === type) || COMPONENT_META[0];
}
