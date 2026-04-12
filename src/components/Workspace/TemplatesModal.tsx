import { motion, AnimatePresence } from 'framer-motion';
import { TEMPLATES, instantiateTemplate } from '../../utils/templates';
import type { CanvasNode, Connection } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoadTemplate: (nodes: CanvasNode[], connections: Connection[]) => void;
}

export default function TemplatesModal({ isOpen, onClose, onLoadTemplate }: Props) {
  const handleSelect = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    if (!template) return;
    const { nodes, connections } = instantiateTemplate(template);
    onLoadTemplate(nodes, connections);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
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

          {/* Modal */}
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
              width: 600,
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
                    color: '#ffd700',
                    marginBottom: 4,
                  }}
                  animate={{ textShadow: ['0 0 10px rgba(255,215,0,0.3)', '0 0 20px rgba(255,215,0,0.5)', '0 0 10px rgba(255,215,0,0.3)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  SYSTEM TEMPLATES
                </motion.h2>
                <p style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 13,
                  color: '#555577',
                }}>
                  Start with a proven architecture pattern
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, color: '#ff3366' }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#555577',
                  fontSize: 20,
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                ✕
              </motion.button>
            </div>

            {/* Template list */}
            <div style={{
              padding: 20,
              overflowY: 'auto',
              maxHeight: 'calc(80vh - 80px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              {TEMPLATES.map((template, i) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{
                    scale: 1.02,
                    borderColor: 'rgba(255, 215, 0, 0.4)',
                    boxShadow: '0 0 30px rgba(255, 215, 0, 0.1)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(template.id)}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: 14,
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    background: 'rgba(255, 215, 0, 0.08)',
                    border: '1px solid rgba(255, 215, 0, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    flexShrink: 0,
                  }}>
                    {template.icon}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: "'Exo 2', sans-serif",
                      fontSize: 15,
                      fontWeight: 600,
                      color: '#e0e0ff',
                      marginBottom: 4,
                    }}>
                      {template.name}
                    </div>
                    <div style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: 12,
                      color: '#7777aa',
                      lineHeight: 1.4,
                      marginBottom: 8,
                    }}>
                      {template.description}
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: 12,
                      fontFamily: "'Exo 2', sans-serif",
                      fontSize: 10,
                      color: '#555577',
                      letterSpacing: '0.1em',
                    }}>
                      <span>NODES: <span style={{ color: '#00f5ff' }}>{template.nodes.length}</span></span>
                      <span>LINKS: <span style={{ color: '#ff00e5' }}>{template.connections.length}</span></span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#333355',
                    fontSize: 18,
                  }}>
                    →
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
