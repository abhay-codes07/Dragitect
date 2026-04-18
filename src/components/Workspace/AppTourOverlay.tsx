import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TourStep {
  id: string;
  target?: string; // data-tour selector; omit for centered "info" step
  title: string;
  body: string;
  kanji: string;
  accent: string;
  illustration?: 'drag' | 'connect';
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to the Dojo',
    body: 'Dragitect is a system-design dojo. You build architectures visually, learn the patterns, then get graded on them. This tour will show you the full interface in under a minute.',
    kanji: '\u59CB',
    accent: '#00f5ff',
    placement: 'center',
  },
  {
    id: 'sidebar',
    target: 'sidebar',
    title: 'The Component Palette',
    body: 'Every system piece lives here \u2014 35 components across 8 categories. Scroll, expand a category, and grab whatever you need. Press-and-hold a component to start dragging.',
    kanji: '\u5EAB',
    accent: '#ff00e5',
    placement: 'right',
  },
  {
    id: 'drag-demo',
    title: 'How to Drag a Component',
    body: 'Press and HOLD the component tile in the sidebar, drag across to the canvas, release. If it just highlights but doesn\u2019t move with your cursor, you released too early \u2014 keep holding until the cursor is over the canvas.',
    kanji: '\u99C6',
    accent: '#ffd700',
    illustration: 'drag',
    placement: 'center',
  },
  {
    id: 'canvas',
    target: 'canvas',
    title: 'The Canvas',
    body: 'Drop components here to place them. Alt+drag to pan, mouse-wheel to zoom, single-click to select, double-click to rename, press N to drop a note.',
    kanji: '\u753B',
    accent: '#00ff88',
    placement: 'top',
  },
  {
    id: 'connect-demo',
    title: 'How to Connect Two Components',
    body: 'Hover a placed component and two small glowing dots appear at its top and bottom. CLICK a dot (do not drag) \u2014 the cursor becomes a crosshair and a banner appears at the top. Then click a dot on the second component. Press ESC to cancel.',
    kanji: '\u7D50',
    accent: '#ff00e5',
    illustration: 'connect',
    placement: 'center',
  },
  {
    id: 'toolbar',
    target: 'toolbar',
    title: 'Canvas Toolbar',
    body: 'Save, load templates, undo, run a flow simulation, and open Challenges from here. Hover any button to see the keyboard shortcut.',
    kanji: '\u5177',
    accent: '#8b5cf6',
    placement: 'top',
  },
  {
    id: 'challenges',
    target: 'challenges-btn',
    title: 'Training Challenges',
    body: 'This is the Sensei button. Pick a challenge and a lesson opens first (concept \u2192 example \u2192 objectives). Once you start, the Sensei Guide panel reveals the next step one hint at a time, so you learn by trying.',
    kanji: '\u6311',
    accent: '#ff6b00',
    placement: 'top',
  },
  {
    id: 'sensei',
    target: 'sensei',
    title: 'Sensei Watches',
    body: 'Sensei reacts to what you do. Eyes glow different colors by mood, and tips rotate over time. Click Sensei to toggle the speech bubble.',
    kanji: '\u5E2B',
    accent: '#c084fc',
    placement: 'left',
  },
  {
    id: 'help',
    target: 'help-btn',
    title: 'Reopen Anytime',
    body: 'You can relaunch this tour any time from the Help button in the top bar. Good luck, architect.',
    kanji: '\u5B8C',
    accent: '#00f5ff',
    placement: 'bottom',
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface Rect { x: number; y: number; w: number; h: number; }

export default function AppTourOverlay({ isOpen, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight });

  const current = STEPS[step];

  const computeRect = useCallback(() => {
    if (!current.target) {
      setRect(null);
      return;
    }
    const el = document.querySelector(`[data-tour="${current.target}"]`);
    if (!el) {
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setRect({ x: r.left, y: r.top, w: r.width, h: r.height });
  }, [current.target]);

  useEffect(() => {
    if (!isOpen) return;
    computeRect();
    const handleResize = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
      computeRect();
    };
    window.addEventListener('resize', handleResize);
    const timer = setInterval(computeRect, 200);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(timer);
    };
  }, [isOpen, computeRect]);

  useEffect(() => {
    if (isOpen) setStep(0);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setStep(s => Math.min(s + 1, STEPS.length - 1));
      if (e.key === 'ArrowLeft') setStep(s => Math.max(s - 1, 0));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Pad the spotlight outward
  const pad = 8;
  const spot = rect ? {
    x: rect.x - pad,
    y: rect.y - pad,
    w: rect.w + pad * 2,
    h: rect.h + pad * 2,
  } : null;

  // Tooltip position
  const tooltipPos = computeTooltipPos(spot, viewport, current.placement);

  return (
    <AnimatePresence>
      <motion.div
        key="tour-root"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 500,
          pointerEvents: 'none',
        }}
      >
        {/* SVG mask overlay with cutout */}
        <svg
          width={viewport.w}
          height={viewport.h}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}
          onClick={onClose}
        >
          <defs>
            <mask id="spot-mask">
              <rect width={viewport.w} height={viewport.h} fill="white" />
              {spot && (
                <motion.rect
                  initial={false}
                  animate={{ x: spot.x, y: spot.y, width: spot.w, height: spot.h }}
                  transition={{ type: 'spring', stiffness: 180, damping: 24 }}
                  rx={12}
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            width={viewport.w}
            height={viewport.h}
            fill="rgba(0,0,0,0.78)"
            mask={spot ? 'url(#spot-mask)' : undefined}
          />
          {spot && (
            <motion.rect
              initial={false}
              animate={{ x: spot.x, y: spot.y, width: spot.w, height: spot.h }}
              transition={{ type: 'spring', stiffness: 180, damping: 24 }}
              rx={12}
              fill="none"
              stroke={current.accent}
              strokeWidth={2}
              style={{ filter: `drop-shadow(0 0 14px ${current.accent})` }}
            />
          )}
        </svg>

        {/* Pulsing halo on spotlight */}
        {spot && (
          <motion.div
            initial={false}
            animate={{
              left: spot.x,
              top: spot.y,
              width: spot.w,
              height: spot.h,
            }}
            transition={{ type: 'spring', stiffness: 180, damping: 24 }}
            style={{
              position: 'absolute',
              borderRadius: 12,
              pointerEvents: 'none',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.04, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                inset: -4,
                borderRadius: 16,
                border: `1px solid ${current.accent}`,
                boxShadow: `0 0 24px ${current.accent}`,
              }}
            />
          </motion.div>
        )}

        {/* Tooltip card */}
        <motion.div
          key={`tip-${step}`}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          style={{
            position: 'absolute',
            left: tooltipPos.x,
            top: tooltipPos.y,
            width: 360,
            maxWidth: 'calc(100vw - 40px)',
            background: 'linear-gradient(135deg, rgba(14,14,38,0.98), rgba(8,8,28,0.98))',
            border: `1px solid ${current.accent}55`,
            borderRadius: 14,
            padding: 20,
            boxShadow: `0 0 50px ${current.accent}33, 0 20px 50px rgba(0,0,0,0.6)`,
            pointerEvents: 'auto',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `${current.accent}15`,
                border: `1px solid ${current.accent}55`,
                fontFamily: "'Noto Sans JP', 'Orbitron', sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: current.accent,
                textShadow: `0 0 10px ${current.accent}`,
              }}
            >
              {current.kanji}
            </motion.div>
            <div>
              <div style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.25em',
                color: '#555577',
              }}>
                STEP {step + 1} / {STEPS.length}
              </div>
              <div style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: current.accent,
                marginTop: 2,
              }}>
                {current.title}
              </div>
            </div>
          </div>

          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 13,
            color: '#c8c8e4',
            lineHeight: 1.55,
            margin: '0 0 14px 0',
          }}>
            {current.body}
          </p>

          {current.illustration === 'drag' && <DragIllustration accent={current.accent} />}
          {current.illustration === 'connect' && <ConnectIllustration accent={current.accent} />}

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 5, marginTop: 14, marginBottom: 12 }}>
            {STEPS.map((_, i) => (
              <motion.div
                key={i}
                onClick={() => setStep(i)}
                animate={{
                  background: i === step ? current.accent : i < step ? `${current.accent}60` : 'rgba(255,255,255,0.1)',
                  width: i === step ? 20 : 6,
                }}
                style={{
                  height: 6,
                  borderRadius: 3,
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onClose}
              style={{
                padding: '8px 14px',
                background: 'transparent',
                border: 'none',
                color: '#555577',
                fontFamily: "'Exo 2', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.1em',
                cursor: 'pointer',
              }}
            >
              SKIP
            </motion.button>
            <div style={{ display: 'flex', gap: 8 }}>
              {step > 0 && (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setStep(s => Math.max(s - 1, 0))}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    color: '#8888aa',
                    fontFamily: "'Exo 2', sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                  }}
                >
                  BACK
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: `0 0 18px ${current.accent}66` }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (step === STEPS.length - 1) onClose();
                  else setStep(s => s + 1);
                }}
                style={{
                  padding: '8px 20px',
                  background: `${current.accent}1a`,
                  border: `1px solid ${current.accent}`,
                  borderRadius: 8,
                  color: current.accent,
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  cursor: 'pointer',
                }}
              >
                {step === STEPS.length - 1 ? 'DONE' : 'NEXT \u2192'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function computeTooltipPos(
  spot: Rect | null,
  viewport: { w: number; h: number },
  placement?: TourStep['placement']
): { x: number; y: number } {
  const tipW = 360;
  const tipH = 260;
  const margin = 24;

  if (!spot || placement === 'center') {
    return {
      x: (viewport.w - tipW) / 2,
      y: (viewport.h - tipH) / 2,
    };
  }

  let x = 0, y = 0;
  switch (placement) {
    case 'right':
      x = spot.x + spot.w + margin;
      y = spot.y + spot.h / 2 - tipH / 2;
      break;
    case 'left':
      x = spot.x - tipW - margin;
      y = spot.y + spot.h / 2 - tipH / 2;
      break;
    case 'bottom':
      x = spot.x + spot.w / 2 - tipW / 2;
      y = spot.y + spot.h + margin;
      break;
    case 'top':
    default:
      x = spot.x + spot.w / 2 - tipW / 2;
      y = spot.y - tipH - margin;
      break;
  }

  // Clamp to viewport
  x = Math.max(12, Math.min(x, viewport.w - tipW - 12));
  y = Math.max(12, Math.min(y, viewport.h - tipH - 12));
  return { x, y };
}

function DragIllustration({ accent }: { accent: string }) {
  return (
    <div style={{
      padding: 12,
      borderRadius: 8,
      background: 'rgba(0,0,0,0.3)',
      border: `1px solid ${accent}22`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    }}>
      <div style={{
        width: 50, height: 50,
        borderRadius: 8,
        background: `${accent}20`,
        border: `1px solid ${accent}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Orbitron', sans-serif", fontSize: 9, color: accent, fontWeight: 700,
      }}>
        ITEM
      </div>
      <div style={{ flex: 1, position: 'relative', height: 4 }}>
        <motion.div
          animate={{ x: [0, 120, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: -8,
            width: 18, height: 18,
            borderRadius: '50%',
            border: `2px solid ${accent}`,
            boxShadow: `0 0 12px ${accent}`,
          }}
        />
        <div style={{
          height: 2,
          background: `linear-gradient(90deg, ${accent}, transparent)`,
          opacity: 0.4,
        }} />
      </div>
      <div style={{
        width: 90, height: 50,
        borderRadius: 8,
        border: `2px dashed ${accent}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Orbitron', sans-serif", fontSize: 9, color: `${accent}aa`, fontWeight: 700,
      }}>
        CANVAS
      </div>
    </div>
  );
}

function ConnectIllustration({ accent }: { accent: string }) {
  return (
    <div style={{
      padding: 14,
      borderRadius: 8,
      background: 'rgba(0,0,0,0.3)',
      border: `1px solid ${accent}22`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      gap: 12,
      position: 'relative',
      minHeight: 70,
    }}>
      <NodeMini label="A" accent={accent} showHandle />
      <svg viewBox="0 0 100 20" style={{ flex: 1, height: 20 }} preserveAspectRatio="none">
        <motion.path
          d="M 0 10 Q 50 0, 100 10"
          stroke={accent}
          strokeWidth={1.5}
          fill="none"
          strokeDasharray="5 3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, times: [0, 0.4, 0.7, 1] }}
        />
      </svg>
      <NodeMini label="B" accent={accent} />
    </div>
  );
}

function NodeMini({ label, accent, showHandle }: { label: string; accent: string; showHandle?: boolean }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        width: 50, height: 50,
        borderRadius: 8,
        background: `${accent}15`,
        border: `1px solid ${accent}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Orbitron', sans-serif", fontSize: 14, color: accent, fontWeight: 700,
      }}>
        {label}
      </div>
      {showHandle && (
        <>
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: -6, left: '50%', marginLeft: -6,
              width: 12, height: 12, borderRadius: '50%',
              background: accent,
              boxShadow: `0 0 12px ${accent}`,
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: 0.2 }}
            style={{
              position: 'absolute',
              bottom: -6, left: '50%', marginLeft: -6,
              width: 12, height: 12, borderRadius: '50%',
              background: accent,
              boxShadow: `0 0 12px ${accent}`,
            }}
          />
        </>
      )}
    </div>
  );
}
