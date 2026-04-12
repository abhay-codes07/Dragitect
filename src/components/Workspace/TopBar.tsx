import { motion } from 'framer-motion';
import type { UserProgress } from '../../types';
import { getXPForNextLevel } from '../../utils/challenges';

interface Props {
  nodeCount: number;
  connectionCount: number;
  progress: UserProgress;
  onOpenProfile: () => void;
  onOpenQuests: () => void;
}

const RANK_COLORS: Record<string, string> = {
  Genin: '#3b82f6',
  Chunin: '#00ff88',
  Jonin: '#ffd700',
  Anbu: '#ff00e5',
  Kage: '#ff6b00',
  Hokage: '#ff3366',
};

export default function TopBar({ nodeCount, connectionCount, progress, onOpenProfile, onOpenQuests }: Props) {
  const xpInfo = getXPForNextLevel(progress.xp);
  const xpPercent = Math.min(100, (xpInfo.current / xpInfo.needed) * 100);
  const rankColor = RANK_COLORS[progress.rank] || '#ffd700';

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
        <StatusItem label="XP" value={progress.xp} color="#ffd700" />
      </div>

      {/* Right side - Quests + Level badge */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 24px rgba(255, 215, 0, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenQuests}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 14px',
            borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.18), rgba(255, 107, 0, 0.18))',
            border: '1px solid rgba(255, 215, 0, 0.4)',
            cursor: 'pointer',
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 10,
            fontWeight: 700,
            color: '#ffd700',
            letterSpacing: '0.18em',
            boxShadow: '0 0 12px rgba(255, 215, 0, 0.2)',
          }}
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            style={{ fontSize: 14 }}
          >
            🦊
          </motion.span>
          QUESTS
        </motion.button>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenProfile}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          cursor: 'pointer',
          padding: '4px 12px',
          borderRadius: 20,
          background: `${rankColor}10`,
          border: `1px solid ${rankColor}25`,
        }}
      >
        {/* XP mini bar */}
        <div style={{ width: 40, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: `${xpPercent}%`, height: '100%', background: rankColor, borderRadius: 2 }} />
        </div>
        <span style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: 10,
          fontWeight: 700,
          color: rankColor,
          letterSpacing: '0.1em',
        }}>
          Lv.{progress.level}
        </span>
        <span style={{
          fontFamily: "'Exo 2', sans-serif",
          fontSize: 9,
          fontWeight: 600,
          color: rankColor,
          opacity: 0.7,
        }}>
          {progress.rank}
        </span>
      </motion.div>
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
