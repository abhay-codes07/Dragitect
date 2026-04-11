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

    default:
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <circle cx={half} cy={half} r={half - 2} stroke={color} strokeWidth="1.5" fill="none" />
        </svg>
      );
  }
}
