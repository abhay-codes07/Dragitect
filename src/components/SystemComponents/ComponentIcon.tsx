import type { ComponentType } from '../../types';

interface Props {
  type: ComponentType;
  size?: number;
  color?: string;
}

export default function ComponentIcon({ type, size = 24, color = '#00f5ff' }: Props) {
  const s = size;
  const half = s / 2;

  switch (type) {
    case 'client':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="13" rx="2" stroke={color} strokeWidth="1.5" />
          <line x1="8" y1="19" x2="16" y2="19" stroke={color} strokeWidth="1.5" />
          <line x1="12" y1="16" x2="12" y2="19" stroke={color} strokeWidth="1.5" />
          <circle cx="12" cy="9" r="1" fill={color}>
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      );

    case 'server':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect x="4" y="2" width="16" height="7" rx="1.5" stroke={color} strokeWidth="1.5" />
          <rect x="4" y="11" width="16" height="7" rx="1.5" stroke={color} strokeWidth="1.5" />
          <circle cx="7" cy="5.5" r="1" fill={color}>
            <animate attributeName="fill-opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="7" cy="14.5" r="1" fill={color}>
            <animate attributeName="fill-opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
          </circle>
          <line x1="10" y1="5.5" x2="17" y2="5.5" stroke={color} strokeWidth="1" opacity="0.5" />
          <line x1="10" y1="14.5" x2="17" y2="14.5" stroke={color} strokeWidth="1" opacity="0.5" />
          <line x1="12" y1="20" x2="12" y2="22" stroke={color} strokeWidth="1.5" />
          <line x1="9" y1="22" x2="15" y2="22" stroke={color} strokeWidth="1.5" />
        </svg>
      );

    case 'database':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <ellipse cx="12" cy="6" rx="8" ry="3" stroke={color} strokeWidth="1.5" />
          <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" stroke={color} strokeWidth="1.5" />
          <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" stroke={color} strokeWidth="1.5" opacity="0.5" />
          <ellipse cx="12" cy="6" rx="4" ry="1.5" fill={color} opacity="0.15">
            <animate attributeName="opacity" values="0.1;0.25;0.1" dur="2s" repeatCount="indefinite" />
          </ellipse>
        </svg>
      );

    case 'loadbalancer':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="5" r="3" stroke={color} strokeWidth="1.5" />
          <line x1="12" y1="8" x2="12" y2="12" stroke={color} strokeWidth="1.5" />
          <line x1="12" y1="12" x2="5" y2="18" stroke={color} strokeWidth="1.5" />
          <line x1="12" y1="12" x2="12" y2="18" stroke={color} strokeWidth="1.5" />
          <line x1="12" y1="12" x2="19" y2="18" stroke={color} strokeWidth="1.5" />
          <circle cx="5" cy="19" r="2" stroke={color} strokeWidth="1.5" />
          <circle cx="12" cy="19" r="2" stroke={color} strokeWidth="1.5" />
          <circle cx="19" cy="19" r="2" stroke={color} strokeWidth="1.5" />
          <circle cx="12" cy="5" r="1" fill={color}>
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" repeatCount="indefinite" />
          </circle>
        </svg>
      );

    case 'cache':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke={color} strokeWidth="1.5" />
          <path d="M12 8L16 10.5V15.5L12 18L8 15.5V10.5L12 8Z" stroke={color} strokeWidth="1" opacity="0.5" />
          <circle cx="12" cy="13" r="2" fill={color} opacity="0.3">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <path d="M12 2L12 8" stroke={color} strokeWidth="0.5" opacity="0.3" />
          <path d="M20 7L16 10.5" stroke={color} strokeWidth="0.5" opacity="0.3" />
          <path d="M4 7L8 10.5" stroke={color} strokeWidth="0.5" opacity="0.3" />
        </svg>
      );

    case 'queue':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="8" width="5" height="8" rx="1" stroke={color} strokeWidth="1.5" />
          <rect x="9.5" y="8" width="5" height="8" rx="1" stroke={color} strokeWidth="1.5" />
          <rect x="17" y="8" width="5" height="8" rx="1" stroke={color} strokeWidth="1.5" />
          <path d="M7 12h2.5" stroke={color} strokeWidth="1">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
          </path>
          <path d="M14.5 12h2.5" stroke={color} strokeWidth="1">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin="0.3s" />
          </path>
          <circle cx="4.5" cy="12" r="1" fill={color} opacity="0.5" />
          <circle cx="12" cy="12" r="1" fill={color} opacity="0.5" />
          <circle cx="19.5" cy="12" r="1" fill={color} opacity="0.5" />
        </svg>
      );

    case 'api-gateway':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M4 4h16v16H4z" stroke={color} strokeWidth="1.5" rx="2" />
          <path d="M4 9h16" stroke={color} strokeWidth="1" opacity="0.3" />
          <path d="M9 4v16" stroke={color} strokeWidth="1" opacity="0.3" />
          <circle cx="6.5" cy="6.5" r="1" fill={color}>
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
          <path d="M12 13l3-1.5v3L12 16l-3-1.5v-3L12 13z" stroke={color} strokeWidth="1" fill={color} fillOpacity="0.15" />
        </svg>
      );

    case 'cdn':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
          <ellipse cx="12" cy="12" rx="4" ry="9" stroke={color} strokeWidth="1" opacity="0.5" />
          <line x1="3" y1="9" x2="21" y2="9" stroke={color} strokeWidth="1" opacity="0.3" />
          <line x1="3" y1="15" x2="21" y2="15" stroke={color} strokeWidth="1" opacity="0.3" />
          <circle cx="12" cy="12" r="2" fill={color} opacity="0.2">
            <animate attributeName="r" values="1.5;2.5;1.5" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      );

    case 'storage':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M4 6l8-4 8 4v2l-8 4-8-4V6z" stroke={color} strokeWidth="1.5" />
          <path d="M4 10l8 4 8-4v4l-8 4-8-4v-4z" stroke={color} strokeWidth="1.5" opacity="0.7" />
          <path d="M4 16l8 4 8-4" stroke={color} strokeWidth="1.5" opacity="0.4" />
          <path d="M12 12v8" stroke={color} strokeWidth="0.5" opacity="0.3" />
        </svg>
      );

    case 'microservice':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect x="6" y="6" width="12" height="12" rx="2" stroke={color} strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1" />
          <circle cx="12" cy="12" r="1" fill={color}>
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <line x1="12" y1="2" x2="12" y2="6" stroke={color} strokeWidth="1" opacity="0.4" />
          <line x1="12" y1="18" x2="12" y2="22" stroke={color} strokeWidth="1" opacity="0.4" />
          <line x1="2" y1="12" x2="6" y2="12" stroke={color} strokeWidth="1" opacity="0.4" />
          <line x1="18" y1="12" x2="22" y2="12" stroke={color} strokeWidth="1" opacity="0.4" />
        </svg>
      );

    case 'dns':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
          <text x="12" y="13" textAnchor="middle" fill={color} fontSize="7" fontWeight="bold" fontFamily="monospace" dominantBaseline="middle">
            DNS
          </text>
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="0.5" opacity="0.3" strokeDasharray="3 2">
            <animate attributeName="stroke-dashoffset" values="0;20" dur="3s" repeatCount="indefinite" />
          </circle>
        </svg>
      );

    case 'firewall':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7L12 2z" stroke={color} strokeWidth="1.5" />
          <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7L12 2z" fill={color} opacity="0.08" />
          <line x1="8" y1="10" x2="16" y2="10" stroke={color} strokeWidth="1" opacity="0.5" />
          <line x1="8" y1="13" x2="16" y2="13" stroke={color} strokeWidth="1" opacity="0.5" />
          <circle cx="12" cy="16" r="1" fill={color}>
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      );

    case 'search-engine':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <circle cx="10" cy="10" r="6" stroke={color} strokeWidth="1.5" />
          <line x1="14.5" y1="14.5" x2="20" y2="20" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="10" cy="10" r="3" stroke={color} strokeWidth="0.5" opacity="0.3" />
          <circle cx="10" cy="10" r="1" fill={color} opacity="0.4">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      );

    case 'notification':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M12 3c-3.5 0-6 2.5-6 6v4l-2 2v1h16v-1l-2-2v-4c0-3.5-2.5-6-6-6z" stroke={color} strokeWidth="1.5" />
          <path d="M10 19h4c0 1.1-.9 2-2 2s-2-.9-2-2z" stroke={color} strokeWidth="1.5" />
          <circle cx="18" cy="5" r="3" fill={color} opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1s" repeatCount="indefinite" />
          </circle>
        </svg>
      );

    case 'scheduler':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
          <line x1="12" y1="6" x2="12" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="12" x2="16" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="12" r="1.5" fill={color} opacity="0.5" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
            <line
              key={deg}
              x1={12 + 7.5 * Math.cos((deg * Math.PI) / 180)}
              y1={12 + 7.5 * Math.sin((deg * Math.PI) / 180)}
              x2={12 + 8.5 * Math.cos((deg * Math.PI) / 180)}
              y2={12 + 8.5 * Math.sin((deg * Math.PI) / 180)}
              stroke={color}
              strokeWidth="0.8"
              opacity="0.4"
            />
          ))}
        </svg>
      );

    case 'auth-service':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M6 10V7a6 6 0 0 1 12 0v3" stroke={color} strokeWidth="1.5" />
          <rect x="4" y="10" width="16" height="11" rx="2" stroke={color} strokeWidth="1.5" />
          <circle cx="12" cy="15" r="1.5" fill={color}>
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.4s" repeatCount="indefinite" />
          </circle>
          <line x1="12" y1="16.5" x2="12" y2="18.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'payment-gateway':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="6" width="20" height="13" rx="2" stroke={color} strokeWidth="1.5" />
          <line x1="2" y1="10.5" x2="22" y2="10.5" stroke={color} strokeWidth="1.5" />
          <rect x="5" y="13.5" width="5" height="2" fill={color} opacity="0.4" />
          <circle cx="17.5" cy="15.5" r="1.5" fill={color}>
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <text x="12" y="9.5" textAnchor="middle" fill={color} fontSize="4" fontFamily="monospace" fontWeight="bold" opacity="0.6">$$$</text>
        </svg>
      );

    case 'ml-service':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <circle cx="6" cy="6" r="2" stroke={color} strokeWidth="1.2" />
          <circle cx="6" cy="12" r="2" stroke={color} strokeWidth="1.2" />
          <circle cx="6" cy="18" r="2" stroke={color} strokeWidth="1.2" />
          <circle cx="18" cy="9" r="2" stroke={color} strokeWidth="1.2" />
          <circle cx="18" cy="15" r="2" stroke={color} strokeWidth="1.2" />
          <line x1="8" y1="6" x2="16" y2="9" stroke={color} strokeWidth="0.8" opacity="0.6" />
          <line x1="8" y1="12" x2="16" y2="9" stroke={color} strokeWidth="0.8" opacity="0.6" />
          <line x1="8" y1="12" x2="16" y2="15" stroke={color} strokeWidth="0.8" opacity="0.6" />
          <line x1="8" y1="18" x2="16" y2="15" stroke={color} strokeWidth="0.8" opacity="0.6" />
          <circle cx="18" cy="9" r="0.8" fill={color}>
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="18" cy="15" r="0.8" fill={color}>
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin="0.5s" />
          </circle>
        </svg>
      );

    case 'websocket':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <circle cx="5" cy="12" r="2" stroke={color} strokeWidth="1.5" />
          <circle cx="19" cy="12" r="2" stroke={color} strokeWidth="1.5" />
          <path d="M7 10l10 4M7 14l10-4" stroke={color} strokeWidth="1.5" />
          <circle cx="12" cy="12" r="1" fill={color}>
            <animateMotion dur="1.4s" repeatCount="indefinite" path="M -5 0 L 5 0 L -5 0" />
          </circle>
          <circle cx="12" cy="12" r="1" fill={color} opacity="0.6">
            <animateMotion dur="1.4s" repeatCount="indefinite" path="M 5 0 L -5 0 L 5 0" begin="0.3s" />
          </circle>
        </svg>
      );

    case 'rate-limiter':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M12 3A9 9 0 1 0 21 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="12" x2="17" y2="7" stroke={color} strokeWidth="1.5" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="4s" repeatCount="indefinite" />
          </line>
          <circle cx="12" cy="12" r="1.5" fill={color} />
          <text x="19" y="6" fill={color} fontSize="4" fontFamily="monospace" fontWeight="bold">!</text>
        </svg>
      );

    case 'kubernetes':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L21 7v10l-9 5-9-5V7z" stroke={color} strokeWidth="1.5" />
          <circle cx="12" cy="12" r="2" fill={color} opacity="0.3">
            <animate attributeName="r" values="1.5;2.5;1.5" dur="2s" repeatCount="indefinite" />
          </circle>
          <line x1="12" y1="4" x2="12" y2="10" stroke={color} strokeWidth="1" opacity="0.6" />
          <line x1="5" y1="10" x2="10.5" y2="12" stroke={color} strokeWidth="1" opacity="0.6" />
          <line x1="19" y1="10" x2="13.5" y2="12" stroke={color} strokeWidth="1" opacity="0.6" />
          <line x1="8" y1="18.5" x2="11" y2="14" stroke={color} strokeWidth="1" opacity="0.6" />
          <line x1="16" y1="18.5" x2="13" y2="14" stroke={color} strokeWidth="1" opacity="0.6" />
        </svg>
      );

    case 'monitoring':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="14" rx="1.5" stroke={color} strokeWidth="1.5" />
          <polyline points="5,14 8,10 11,12 14,7 17,11 19,9" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <animate attributeName="stroke-dashoffset" values="40;0" dur="2s" repeatCount="indefinite" />
            <animate attributeName="stroke-dasharray" values="40;40" dur="2s" repeatCount="indefinite" />
          </polyline>
          <circle cx="17" cy="11" r="1.2" fill={color}>
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <line x1="9" y1="21" x2="15" y2="21" stroke={color} strokeWidth="1.5" />
          <line x1="12" y1="18" x2="12" y2="21" stroke={color} strokeWidth="1.5" />
        </svg>
      );

    case 'log-aggregator':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="3" rx="0.5" stroke={color} strokeWidth="1.2" />
          <rect x="3" y="7.5" width="18" height="3" rx="0.5" stroke={color} strokeWidth="1.2" />
          <rect x="3" y="12" width="18" height="3" rx="0.5" stroke={color} strokeWidth="1.2" />
          <rect x="3" y="16.5" width="18" height="3" rx="0.5" stroke={color} strokeWidth="1.2" />
          <line x1="5" y1="4.5" x2="10" y2="4.5" stroke={color} strokeWidth="0.8" opacity="0.6" />
          <line x1="5" y1="9" x2="13" y2="9" stroke={color} strokeWidth="0.8" opacity="0.6" />
          <line x1="5" y1="13.5" x2="8" y2="13.5" stroke={color} strokeWidth="0.8" opacity="0.6" />
          <line x1="5" y1="18" x2="14" y2="18" stroke={color} strokeWidth="0.8" opacity="0.6" />
          <circle cx="18" cy="4.5" r="0.8" fill={color}>
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="18" cy="13.5" r="0.8" fill={color}>
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin="0.5s" />
          </circle>
        </svg>
      );

    case 'data-warehouse':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M3 6L12 2L21 6V18L12 22L3 18Z" stroke={color} strokeWidth="1.5" />
          <line x1="3" y1="6" x2="12" y2="10" stroke={color} strokeWidth="1" />
          <line x1="21" y1="6" x2="12" y2="10" stroke={color} strokeWidth="1" />
          <line x1="12" y1="10" x2="12" y2="22" stroke={color} strokeWidth="1" />
          <rect x="7" y="12" width="1.5" height="5" fill={color} opacity="0.5">
            <animate attributeName="height" values="3;5;3" dur="2s" repeatCount="indefinite" />
          </rect>
          <rect x="10" y="11" width="1.5" height="6" fill={color} opacity="0.5">
            <animate attributeName="height" values="4;6;4" dur="2s" repeatCount="indefinite" begin="0.3s" />
          </rect>
          <rect x="13" y="13" width="1.5" height="4" fill={color} opacity="0.5">
            <animate attributeName="height" values="2;4;2" dur="2s" repeatCount="indefinite" begin="0.6s" />
          </rect>
        </svg>
      );

    case 'event-bus':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="2" />
          <circle cx="5" cy="12" r="1.5" fill={color} />
          <circle cx="12" cy="12" r="1.5" fill={color} />
          <circle cx="19" cy="12" r="1.5" fill={color} />
          <line x1="5" y1="12" x2="5" y2="5" stroke={color} strokeWidth="1.2" opacity="0.7" />
          <line x1="12" y1="12" x2="12" y2="5" stroke={color} strokeWidth="1.2" opacity="0.7" />
          <line x1="19" y1="12" x2="19" y2="5" stroke={color} strokeWidth="1.2" opacity="0.7" />
          <line x1="8.5" y1="12" x2="8.5" y2="19" stroke={color} strokeWidth="1.2" opacity="0.7" />
          <line x1="15.5" y1="12" x2="15.5" y2="19" stroke={color} strokeWidth="1.2" opacity="0.7" />
          <circle cx="3" cy="12" r="1" fill={color}>
            <animateMotion dur="2s" repeatCount="indefinite" path="M 0 0 L 18 0 L 0 0" />
          </circle>
        </svg>
      );

    case 'graphql':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <polygon points="12,3 21,8 21,16 12,21 3,16 3,8" stroke={color} strokeWidth="1.5" />
          <line x1="12" y1="3" x2="12" y2="21" stroke={color} strokeWidth="0.8" opacity="0.5" />
          <line x1="3" y1="8" x2="21" y2="16" stroke={color} strokeWidth="0.8" opacity="0.5" />
          <line x1="21" y1="8" x2="3" y2="16" stroke={color} strokeWidth="0.8" opacity="0.5" />
          <circle cx="12" cy="3" r="1.5" fill={color} />
          <circle cx="21" cy="8" r="1.5" fill={color} />
          <circle cx="21" cy="16" r="1.5" fill={color} />
          <circle cx="12" cy="21" r="1.5" fill={color} />
          <circle cx="3" cy="16" r="1.5" fill={color} />
          <circle cx="3" cy="8" r="1.5" fill={color} />
          <circle cx="12" cy="12" r="1.8" fill={color}>
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </svg>
      );

    case 'session-store':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect x="4" y="6" width="16" height="12" rx="2" stroke={color} strokeWidth="1.5" />
          <line x1="4" y1="10" x2="20" y2="10" stroke={color} strokeWidth="1" opacity="0.5" />
          <circle cx="7" cy="13.5" r="1" fill={color} opacity="0.7" />
          <line x1="9.5" y1="13.5" x2="18" y2="13.5" stroke={color} strokeWidth="0.8" opacity="0.5" />
          <circle cx="7" cy="16" r="1" fill={color} opacity="0.7" />
          <line x1="9.5" y1="16" x2="15" y2="16" stroke={color} strokeWidth="0.8" opacity="0.5" />
          <circle cx="6" cy="8" r="0.8" fill={color}>
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      );

    case 'vector-db':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.2" opacity="0.3" />
          <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.2" opacity="0.5" />
          <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.2" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
            <circle
              key={deg}
              cx={12 + 8 * Math.cos((deg * Math.PI) / 180)}
              cy={12 + 8 * Math.sin((deg * Math.PI) / 180)}
              r="1.2"
              fill={color}
            >
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
            </circle>
          ))}
          <circle cx="12" cy="12" r="1" fill={color} />
        </svg>
      );

    case 'stream-processor':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M2 8c2 0 2 3 4 3s2-3 4-3 2 3 4 3 2-3 4-3 2 3 4 3" stroke={color} strokeWidth="1.5" fill="none" />
          <path d="M2 14c2 0 2 3 4 3s2-3 4-3 2 3 4 3 2-3 4-3 2 3 4 3" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6" />
          <circle r="1.2" fill={color}>
            <animateMotion dur="2s" repeatCount="indefinite" path="M 2 8 C 4 8 4 11 6 11 S 8 8 10 8 S 12 11 14 11 S 16 8 18 8 S 20 11 22 11" />
          </circle>
          <circle r="1" fill={color} opacity="0.6">
            <animateMotion dur="2s" repeatCount="indefinite" path="M 22 14 C 20 14 20 17 18 17 S 16 14 14 14 S 12 17 10 17 S 8 14 6 14 S 4 17 2 17" />
          </circle>
        </svg>
      );

    case 'edge-worker':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.2" opacity="0.3" />
          <path d="M13 3L7 13h4l-1 8 6-10h-4z" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.2">
            <animate attributeName="fill-opacity" values="0.1;0.4;0.1" dur="1.5s" repeatCount="indefinite" />
          </path>
          <circle cx="4" cy="8" r="1" fill={color} opacity="0.6" />
          <circle cx="20" cy="16" r="1" fill={color} opacity="0.6" />
          <circle cx="19" cy="5" r="0.8" fill={color} opacity="0.5" />
        </svg>
      );

    case 'analytics':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <line x1="3" y1="21" x2="21" y2="21" stroke={color} strokeWidth="1.5" />
          <line x1="3" y1="21" x2="3" y2="3" stroke={color} strokeWidth="1.5" />
          <rect x="6" y="13" width="3" height="8" fill={color} opacity="0.5">
            <animate attributeName="height" values="4;8;4" dur="2s" repeatCount="indefinite" />
            <animate attributeName="y" values="17;13;17" dur="2s" repeatCount="indefinite" />
          </rect>
          <rect x="10.5" y="9" width="3" height="12" fill={color} opacity="0.7">
            <animate attributeName="height" values="6;12;6" dur="2s" repeatCount="indefinite" begin="0.3s" />
            <animate attributeName="y" values="15;9;15" dur="2s" repeatCount="indefinite" begin="0.3s" />
          </rect>
          <rect x="15" y="6" width="3" height="15" fill={color}>
            <animate attributeName="height" values="9;15;9" dur="2s" repeatCount="indefinite" begin="0.6s" />
            <animate attributeName="y" values="12;6;12" dur="2s" repeatCount="indefinite" begin="0.6s" />
          </rect>
        </svg>
      );

    case 'service-mesh':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="4" r="2" stroke={color} strokeWidth="1.2" />
          <circle cx="4" cy="12" r="2" stroke={color} strokeWidth="1.2" />
          <circle cx="20" cy="12" r="2" stroke={color} strokeWidth="1.2" />
          <circle cx="12" cy="20" r="2" stroke={color} strokeWidth="1.2" />
          <circle cx="12" cy="12" r="2.5" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.15" />
          <line x1="12" y1="6" x2="12" y2="9.5" stroke={color} strokeWidth="1" opacity="0.6" />
          <line x1="6" y1="12" x2="9.5" y2="12" stroke={color} strokeWidth="1" opacity="0.6" />
          <line x1="14.5" y1="12" x2="18" y2="12" stroke={color} strokeWidth="1" opacity="0.6" />
          <line x1="12" y1="14.5" x2="12" y2="18" stroke={color} strokeWidth="1" opacity="0.6" />
          <circle cx="12" cy="12" r="0.8" fill={color}>
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      );

    case 'blob-cdn':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M4 17a4 4 0 0 1 1-7.9A6 6 0 0 1 17 7a5 5 0 0 1 3 9.5" stroke={color} strokeWidth="1.5" />
          <path d="M10 14l4 3-4 3v-6z" fill={color} opacity="0.7">
            <animate attributeName="fill-opacity" values="0.4;0.9;0.4" dur="1.5s" repeatCount="indefinite" />
          </path>
          <rect x="7" y="13" width="10" height="8" rx="1" stroke={color} strokeWidth="1.2" fill="none" />
        </svg>
      );

    case 'reverse-proxy':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect x="10" y="4" width="4" height="16" stroke={color} strokeWidth="1.5" rx="1" />
          <path d="M10 8L4 8" stroke={color} strokeWidth="1.5" />
          <path d="M10 12L4 12" stroke={color} strokeWidth="1.5" />
          <path d="M10 16L4 16" stroke={color} strokeWidth="1.5" />
          <path d="M14 12L20 12" stroke={color} strokeWidth="1.5" />
          <path d="M17 9L20 12L17 15" stroke={color} strokeWidth="1.5" fill="none" />
          <circle cx="12" cy="8" r="0.8" fill={color}>
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="12" cy="12" r="0.8" fill={color}>
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin="0.3s" />
          </circle>
          <circle cx="12" cy="16" r="0.8" fill={color}>
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin="0.6s" />
          </circle>
        </svg>
      );

    case 'secret-vault':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="15" rx="2" stroke={color} strokeWidth="1.5" />
          <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.5" />
          <circle cx="12" cy="12" r="1.5" fill={color} />
          <line x1="12" y1="8" x2="12" y2="6.5" stroke={color} strokeWidth="1" />
          <line x1="12" y1="16" x2="12" y2="17.5" stroke={color} strokeWidth="1" />
          <line x1="8" y1="12" x2="6.5" y2="12" stroke={color} strokeWidth="1" />
          <line x1="16" y1="12" x2="17.5" y2="12" stroke={color} strokeWidth="1" />
          <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="0.5" opacity="0.3" strokeDasharray="2 2">
            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="6s" repeatCount="indefinite" />
          </circle>
        </svg>
      );

    default:
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <circle cx={half} cy={half} r={half - 2} stroke={color} strokeWidth="1.5" fill="none" />
        </svg>
      );
  }
}
