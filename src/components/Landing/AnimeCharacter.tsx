import { motion } from 'framer-motion';

export default function AnimeCharacter({ scale = 1 }: { scale?: number }) {
  return (
    <motion.svg
      width={200 * scale}
      height={280 * scale}
      viewBox="0 0 200 280"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      {/* Aura glow */}
      <defs>
        <radialGradient id="auraGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.3">
            <animate attributeName="stopOpacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#00f5ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1a4e" />
          <stop offset="50%" stopColor="#2d1b69" />
          <stop offset="100%" stopColor="#0f0f3d" />
        </linearGradient>
        <linearGradient id="coatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a1a3e" />
          <stop offset="100%" stopColor="#0a0a2e" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Aura circle */}
      <circle cx="100" cy="140" r="90" fill="url(#auraGlow)">
        <animate attributeName="r" values="85;95;85" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* Hair - spiky anime style */}
      <motion.g animate={{ y: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity }}>
        {/* Back hair spikes */}
        <path d="M55 65 L45 20 L70 55" fill="url(#hairGrad)" />
        <path d="M70 55 L65 10 L90 45" fill="url(#hairGrad)" />
        <path d="M110 45 L135 5 L130 55" fill="url(#hairGrad)" />
        <path d="M130 55 L155 15 L145 65" fill="url(#hairGrad)" />
        <path d="M90 45 L100 0 L110 45" fill="url(#hairGrad)" />

        {/* Head */}
        <ellipse cx="100" cy="85" rx="42" ry="45" fill="#fce4d6" />

        {/* Front hair */}
        <path d="M58 75 L55 40 L75 68 L70 35 L90 60 L100 30 L110 60 L130 35 L125 68 L145 40 L142 75" fill="url(#hairGrad)" />

        {/* Eyes - large anime style */}
        <g filter="url(#glow)">
          {/* Left eye */}
          <ellipse cx="80" cy="90" rx="12" ry="14" fill="#0a0a2e" />
          <ellipse cx="80" cy="90" rx="10" ry="12" fill="#00f5ff" opacity="0.8">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="80" cy="90" rx="5" ry="7" fill="#0066ff" />
          <circle cx="76" cy="85" r="3" fill="white" opacity="0.9" />
          <circle cx="84" cy="93" r="1.5" fill="white" opacity="0.6" />

          {/* Right eye */}
          <ellipse cx="120" cy="90" rx="12" ry="14" fill="#0a0a2e" />
          <ellipse cx="120" cy="90" rx="10" ry="12" fill="#00f5ff" opacity="0.8">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="120" cy="90" rx="5" ry="7" fill="#0066ff" />
          <circle cx="116" cy="85" r="3" fill="white" opacity="0.9" />
          <circle cx="124" cy="93" r="1.5" fill="white" opacity="0.6" />
        </g>

        {/* Mouth - confident smirk */}
        <path d="M92 108 Q100 114 108 108" stroke="#c4846b" strokeWidth="1.5" fill="none" />

        {/* Facial marks - anime style */}
        <line x1="62" y1="88" x2="68" y2="90" stroke="#c4846b" strokeWidth="0.5" opacity="0.4" />
        <line x1="62" y1="91" x2="68" y2="93" stroke="#c4846b" strokeWidth="0.5" opacity="0.4" />
        <line x1="132" y1="88" x2="138" y2="90" stroke="#c4846b" strokeWidth="0.5" opacity="0.4" />
        <line x1="132" y1="91" x2="138" y2="93" stroke="#c4846b" strokeWidth="0.5" opacity="0.4" />
      </motion.g>

      {/* Body - tech coat */}
      <motion.g animate={{ y: [0, -1, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}>
        {/* Neck */}
        <rect x="90" y="125" width="20" height="15" fill="#fce4d6" />

        {/* Coat */}
        <path d="M60 140 L60 240 L85 250 L100 245 L115 250 L140 240 L140 140 Q130 130 100 130 Q70 130 60 140Z" fill="url(#coatGrad)" stroke="#00f5ff" strokeWidth="0.5" opacity="0.9" />

        {/* Coat center line */}
        <line x1="100" y1="135" x2="100" y2="245" stroke="#00f5ff" strokeWidth="0.5" opacity="0.3" />

        {/* Glowing circuit lines on coat */}
        <g filter="url(#glow)" opacity="0.6">
          <path d="M70 155 L85 155 L85 170" stroke="#00f5ff" strokeWidth="1" fill="none">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
          </path>
          <path d="M130 155 L115 155 L115 170" stroke="#ff00e5" strokeWidth="1" fill="none">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" begin="0.5s" />
          </path>
          <path d="M75 185 L90 185 L90 200 L80 200" stroke="#ffd700" strokeWidth="1" fill="none">
            <animate attributeName="opacity" values="0.2;0.7;0.2" dur="3s" repeatCount="indefinite" begin="0s" />
          </path>
          <circle cx="85" cy="155" r="2" fill="#00f5ff">
            <animate attributeName="r" values="1.5;3;1.5" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="115" cy="155" r="2" fill="#ff00e5">
            <animate attributeName="r" values="1.5;3;1.5" dur="2s" repeatCount="indefinite" begin="0.5s" />
          </circle>
        </g>

        {/* Collar */}
        <path d="M70 135 L100 145 L130 135" stroke="#00f5ff" strokeWidth="1" fill="none" opacity="0.6" />

        {/* Belt */}
        <rect x="65" y="195" width="70" height="4" rx="2" fill="#1a1a3e" stroke="#ffd700" strokeWidth="0.5" />
        <circle cx="100" cy="197" r="4" fill="#0a0a2e" stroke="#ffd700" strokeWidth="1">
          <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
      </motion.g>

      {/* Energy particles around character */}
      {[0, 1, 2, 3, 4].map(i => (
        <motion.circle
          key={i}
          cx={60 + i * 20}
          cy={60 + (i % 2) * 30}
          r="1.5"
          fill={['#00f5ff', '#ff00e5', '#ffd700', '#00ff88', '#8b5cf6'][i]}
          animate={{
            y: [-5, 5, -5],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        />
      ))}
    </motion.svg>
  );
}
