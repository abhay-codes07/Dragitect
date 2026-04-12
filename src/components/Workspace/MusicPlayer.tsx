import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Props {
  enabled: boolean;
  onToggle: () => void;
}

// Procedural anime-style ambient music via Web Audio API.
// No external assets, no copyright drama — just a calm pentatonic drift.
export default function MusicPlayer({ enabled, onToggle }: Props) {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (masterRef.current && ctxRef.current) {
        masterRef.current.gain.linearRampToValueAtTime(0.0001, ctxRef.current.currentTime + 0.5);
      }
      return;
    }

    const AC = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = ctxRef.current || new AC();
    ctxRef.current = ctx;
    if (ctx.state === 'suspended') ctx.resume();

    const master = masterRef.current || ctx.createGain();
    master.connect(ctx.destination);
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 1);
    masterRef.current = master;

    // Pentatonic scale in A minor — classic "anime peaceful"
    const scale = [220, 261.63, 293.66, 329.63, 392, 440, 523.25, 587.33];

    const playNote = (freq: number, duration: number, delay: number, type: OscillatorType = 'sine') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      const start = ctx.currentTime + delay;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.6, start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      osc.connect(gain);
      gain.connect(master);
      osc.start(start);
      osc.stop(start + duration + 0.1);
    };

    const playPhrase = () => {
      // Bass drone
      const bassFreq = scale[0] / 2;
      playNote(bassFreq, 4, 0, 'triangle');
      // 4 melody notes in pentatonic
      for (let i = 0; i < 4; i++) {
        const idx = Math.floor(Math.random() * scale.length);
        playNote(scale[idx], 1.5, i * 0.9 + Math.random() * 0.2, 'sine');
      }
      // Occasional chime
      if (Math.random() < 0.5) {
        playNote(scale[5 + Math.floor(Math.random() * 3)] * 2, 1.2, 2 + Math.random(), 'sine');
      }
    };

    // Start first phrase immediately, then every 4 seconds
    playPhrase();
    intervalRef.current = window.setInterval(playPhrase, 4000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      ctxRef.current?.close();
    };
  }, []);

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={onToggle}
      title={enabled ? 'Mute music' : 'Play anime ambient music'}
      style={{
        position: 'fixed',
        top: 60,
        right: 16,
        width: 38,
        height: 38,
        borderRadius: '50%',
        background: enabled
          ? 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,107,0,0.2))'
          : 'rgba(20,20,40,0.6)',
        border: enabled
          ? '1px solid rgba(255,215,0,0.5)'
          : '1px solid rgba(255,255,255,0.1)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 500,
        backdropFilter: 'blur(8px)',
        boxShadow: enabled ? '0 0 20px rgba(255,215,0,0.3)' : 'none',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        {enabled ? (
          <>
            <path d="M4 6v4h2l3 2V4L6 6H4z" fill="#ffd700" />
            <motion.path
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
              d="M11 5c1.5 1 1.5 5 0 6"
              stroke="#ffd700"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
            <motion.path
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.3, repeat: Infinity, delay: 0.3 }}
              d="M12.5 3.5c2.5 1.5 2.5 7.5 0 9"
              stroke="#ffd700"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : (
          <>
            <path d="M4 6v4h2l3 2V4L6 6H4z" fill="#888" />
            <line x1="11" y1="5" x2="14" y2="11" stroke="#888" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="14" y1="5" x2="11" y2="11" stroke="#888" strokeWidth="1.2" strokeLinecap="round" />
          </>
        )}
      </svg>
    </motion.button>
  );
}
