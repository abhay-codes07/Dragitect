import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SenseiMood } from '../../types';

interface Props {
  mood: SenseiMood;
  nodeCount: number;
  connectionCount: number;
}

const TIPS: string[] = [
  "Drag components from the sidebar onto the canvas to begin your design!",
  "Connect components by clicking the dots that appear when you hover over them.",
  "Double-click a component to rename it. Every system piece needs a clear name!",
  "A Load Balancer distributes traffic across multiple servers. Essential for scale!",
  "Caching reduces database load. Place a Cache between your Server and Database!",
  "Message Queues decouple services. Great for async processing!",
  "An API Gateway handles auth, rate limiting, and routing. Place it before your servers!",
  "CDNs serve static content from edge locations closest to users.",
  "Think about single points of failure. Can your system survive a component going down?",
  "Every arrow is a network call. More arrows = more latency. Design wisely!",
  "Use the Design Analysis tool to check your architecture's health score!",
  "Try the Challenges mode to test your system design skills!",
  "A Firewall/WAF protects your system from malicious traffic. Always layer your security!",
  "Elasticsearch powers full-text search. Use it for any search-heavy feature!",
  "DNS resolves domain names to IPs. It's the internet's phone book!",
  "Task Schedulers handle cron jobs. Great for batch processing and maintenance tasks!",
  "Export your design as JSON to share with others or save it locally!",
  "The mini-map in the bottom-left helps you navigate large architectures.",
];

const MOOD_TIPS: Record<SenseiMood, string[]> = {
  idle: TIPS,
  excited: [
    "Excellent! A new component joins the architecture! Let's see where it fits!",
    "Your system is growing stronger! Keep building!",
    "The architecture takes shape! I can feel the power!",
    "Great choice! Every component has its purpose!",
  ],
  thinking: [
    "Hmm, let me think about this design choice...",
    "Consider the trade-offs carefully, young architect...",
    "There are always trade-offs in distributed systems...",
  ],
  teaching: [
    "Remember: distributed systems are all about trade-offs!",
    "CAP Theorem: you can only pick two of Consistency, Availability, Partition tolerance!",
    "Study this template carefully. Notice how data flows through the system!",
    "Each layer serves a purpose. Understand why before you modify!",
  ],
  impressed: [
    "A connection! Data flows through the system like chakra through a ninja!",
    "Beautiful! The components are linked! Your architecture is becoming powerful!",
    "This design shows great promise! You are growing as an architect!",
    "The system is coming alive! Data flowing between components!",
  ],
  challenging: [
    "A challenge! Show me the power of your design skills!",
    "Think carefully about each component you place. Every choice matters!",
    "Remember your training. Start with the basics, then add complexity.",
    "I believe in you! Complete the objectives to prove your worth!",
  ],
};

export default function SenseiGuide({ mood, nodeCount, connectionCount }: Props) {
  const [currentTip, setCurrentTip] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (mood !== 'idle') {
      const tips = MOOD_TIPS[mood];
      setCurrentTip(Math.floor(Math.random() * tips.length));
    }
  }, [mood]);

  useEffect(() => {
    if (mood === 'idle') {
      const interval = setInterval(() => {
        setCurrentTip(prev => (prev + 1) % TIPS.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [mood]);

  const tips = MOOD_TIPS[mood];
  const tip = tips[currentTip % tips.length];

  const eyeColor = {
    idle: '#00f5ff',
    excited: '#ffd700',
    thinking: '#8b5cf6',
    teaching: '#00ff88',
    impressed: '#ff00e5',
    challenging: '#ff6b00',
  }[mood];

  return (
    <motion.div
      data-tour="sensei"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', delay: 0.5 }}
      style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 8,
      }}
    >
      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            key={tip}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            style={{
              maxWidth: 280,
              padding: '12px 16px',
              background: 'rgba(15, 15, 40, 0.95)',
              border: `1px solid ${eyeColor}33`,
              borderRadius: '12px 12px 4px 12px',
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 13,
              lineHeight: 1.5,
              color: '#c0c0e0',
              backdropFilter: 'blur(10px)',
              boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 15px ${eyeColor}10`,
            }}
          >
            <div style={{ marginBottom: 8 }}>{tip}</div>
            <div style={{
              display: 'flex',
              gap: 16,
              fontSize: 10,
              color: '#555577',
              fontFamily: "'Exo 2', sans-serif",
              letterSpacing: '0.1em',
            }}>
              <span>NODES: <span style={{ color: '#00f5ff' }}>{nodeCount}</span></span>
              <span>LINKS: <span style={{ color: '#ff00e5' }}>{connectionCount}</span></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sensei mini avatar */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(prev => !prev)}
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1a1a3e, #0a0a2e)',
          border: `2px solid ${eyeColor}`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 20px ${eyeColor}44`,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Mini face */}
        <svg width="40" height="40" viewBox="0 0 40 40">
          {/* Hair */}
          <path d="M8 18 L6 8 L14 16" fill="#1a1a4e" />
          <path d="M14 16 L12 5 L20 13" fill="#1a1a4e" />
          <path d="M20 13 L20 3 L28 13" fill="#1a1a4e" />
          <path d="M26 16 L28 5 L34 18" fill="#1a1a4e" />

          {/* Face */}
          <ellipse cx="20" cy="22" rx="12" ry="12" fill="#fce4d6" />

          {/* Front hair */}
          <path d="M8 18 L10 10 L15 17 L18 8 L22 17 L25 8 L30 17 L34 10 L34 20" fill="#2d1b69" />

          {/* Eyes */}
          <motion.ellipse
            cx="15" cy="23" rx="3" ry="3.5"
            fill={eyeColor}
            animate={{ scale: mood === 'excited' || mood === 'challenging' ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.5, repeat: mood === 'excited' || mood === 'challenging' ? Infinity : 0 }}
          />
          <motion.ellipse
            cx="25" cy="23" rx="3" ry="3.5"
            fill={eyeColor}
            animate={{ scale: mood === 'excited' || mood === 'challenging' ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.5, repeat: mood === 'excited' || mood === 'challenging' ? Infinity : 0, delay: 0.1 }}
          />
          <circle cx="14" cy="22" r="1.2" fill="white" opacity="0.9" />
          <circle cx="24" cy="22" r="1.2" fill="white" opacity="0.9" />

          {/* Mouth based on mood */}
          {mood === 'excited' || mood === 'impressed' || mood === 'challenging' ? (
            <path d="M16 30 Q20 34 24 30" stroke="#c4846b" strokeWidth="1" fill="none" />
          ) : mood === 'thinking' ? (
            <circle cx="20" cy="31" rx="2" ry="1.5" stroke="#c4846b" strokeWidth="1" fill="none" />
          ) : (
            <path d="M17 30 Q20 32 23 30" stroke="#c4846b" strokeWidth="1" fill="none" />
          )}
        </svg>

        {/* Mood ring pulse */}
        <motion.div
          style={{
            position: 'absolute',
            inset: -2,
            borderRadius: '50%',
            border: `2px solid ${eyeColor}`,
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
}
