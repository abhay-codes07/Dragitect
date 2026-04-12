import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { category: 'CANVAS', items: [
    { keys: 'Ctrl + Z', action: 'Undo' },
    { keys: 'Ctrl + Y', action: 'Redo' },
    { keys: 'Delete', action: 'Delete selected' },
    { keys: 'Escape', action: 'Deselect all / Cancel' },
    { keys: 'Scroll', action: 'Zoom in/out' },
    { keys: 'Alt + Drag', action: 'Pan canvas' },
    { keys: 'Middle Mouse', action: 'Pan canvas' },
  ]},
  { category: 'COMPONENTS', items: [
    { keys: 'Drag from sidebar', action: 'Add component' },
    { keys: 'Double-click', action: 'Edit label' },
    { keys: 'Click handle', action: 'Start connection' },
  ]},
  { category: 'TOOLS', items: [
    { keys: 'Ctrl + S', action: 'Quick save' },
    { keys: 'Ctrl + E', action: 'Export JSON' },
    { keys: 'Ctrl + G', action: 'Toggle grid snap' },
    { keys: '?', action: 'Show shortcuts' },
  ]},
];

export default function KeyboardShortcutsModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 200,
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 480,
              maxWidth: '90vw',
              maxHeight: '80vh',
              background: 'linear-gradient(135deg, #0f0f2a, #0a0a1f)',
              border: '1px solid rgba(0, 245, 255, 0.15)',
              borderRadius: 16,
              overflow: 'hidden',
              zIndex: 201,
              boxShadow: '0 0 60px rgba(0, 245, 255, 0.1), 0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(0, 245, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <motion.h2
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    color: '#00f5ff',
                    marginBottom: 4,
                  }}
                  animate={{ textShadow: ['0 0 10px rgba(0,245,255,0.3)', '0 0 20px rgba(0,245,255,0.5)', '0 0 10px rgba(0,245,255,0.3)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  KEYBOARD SHORTCUTS
                </motion.h2>
                <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 13, color: '#555577' }}>
                  Master the way of the keyboard, young architect
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, color: '#ff3366' }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{ background: 'none', border: 'none', color: '#555577', fontSize: 20, cursor: 'pointer', padding: 4 }}
              >
                ✕
              </motion.button>
            </div>

            {/* Shortcuts list */}
            <div style={{ padding: 20, overflowY: 'auto', maxHeight: 'calc(80vh - 80px)' }}>
              {SHORTCUTS.map((group, gi) => (
                <div key={group.category} style={{ marginBottom: gi < SHORTCUTS.length - 1 ? 20 : 0 }}>
                  <div style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    color: '#444466',
                    marginBottom: 10,
                  }}>
                    {group.category}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {group.items.map((item, i) => (
                      <motion.div
                        key={item.keys}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: gi * 0.1 + i * 0.03 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 10px',
                          borderRadius: 6,
                          background: 'rgba(255,255,255,0.02)',
                        }}
                      >
                        <span style={{
                          fontFamily: "'Rajdhani', sans-serif",
                          fontSize: 13,
                          color: '#9999bb',
                        }}>
                          {item.action}
                        </span>
                        <kbd style={{
                          fontFamily: "'Exo 2', sans-serif",
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#00f5ff',
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: 'rgba(0, 245, 255, 0.08)',
                          border: '1px solid rgba(0, 245, 255, 0.15)',
                        }}>
                          {item.keys}
                        </kbd>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
