import { motion } from 'framer-motion';

interface Props {
  nodeCount: number;
  connectionCount: number;
}

export default function TopBar({ nodeCount, connectionCount }: Props) {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      style={{
        height: 48,
        background: 'linear-gradient(90deg, #0a0a1f, #0f0f2a, #0a0a1f)',
        borderBottom: '1px solid rgba(0, 245, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated bottom border */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent, #00f5ff, #ff00e5, transparent)',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28">
            <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#00f5ff" strokeWidth="1.5" />
            <polygon points="14,6 22,10 22,18 14,22 6,18 6,10" fill="none" stroke="#ff00e5" strokeWidth="1" opacity="0.5" />
            <circle cx="14" cy="14" r="3" fill="#00f5ff" opacity="0.5">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </motion.div>

        <div>
          <span style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: '0.15em',
            background: 'linear-gradient(90deg, #00f5ff, #ff00e5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            DRAGITECT
          </span>
        </div>
      </div>

      {/* Center status */}
      <div style={{
        display: 'flex',
        gap: 24,
        fontFamily: "'Exo 2', sans-serif",
        fontSize: 11,
        letterSpacing: '0.1em',
      }}>
        <StatusItem label="NODES" value={nodeCount} color="#00f5ff" />
        <StatusItem label="LINKS" value={connectionCount} color="#ff00e5" />
        <StatusItem label="PHASE" value="1/5" color="#ffd700" />
      </div>

      {/* Right side actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <motion.div
          animate={{
            boxShadow: [
              '0 0 5px rgba(0,255,136,0.3)',
              '0 0 15px rgba(0,255,136,0.5)',
              '0 0 5px rgba(0,255,136,0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#00ff88',
          }}
        />
        <span style={{
          fontFamily: "'Exo 2', sans-serif",
          fontSize: 10,
          color: '#00ff88',
          letterSpacing: '0.1em',
        }}>
          ONLINE
        </span>
      </div>
    </motion.header>
  );
}

function StatusItem({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ color: '#555577' }}>{label}</span>
      <motion.span
        key={String(value)}
        initial={{ scale: 1.5, color: '#fff' }}
        animate={{ scale: 1, color }}
        transition={{ duration: 0.3 }}
        style={{ fontWeight: 700, color }}
      >
        {value}
      </motion.span>
    </div>
  );
}
