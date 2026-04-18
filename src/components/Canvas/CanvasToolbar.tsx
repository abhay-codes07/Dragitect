import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CanvasTransform, SavedDesign } from '../../types';

interface Props {
  transform: CanvasTransform;
  gridSnap: boolean;
  simulationRunning: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onSave: (name: string) => void;
  onLoad: (design: SavedDesign) => void;
  onGetSaves: () => SavedDesign[];
  onDeleteSave: (name: string) => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onOpenTemplates: () => void;
  onToggleGridSnap: () => void;
  onAutoLayout: () => void;
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
  onOpenValidation: () => void;
  onOpenChallenges: () => void;
  onToggleSimulation: () => void;
  onOpenShortcuts: () => void;
}

export default function CanvasToolbar({
  transform, gridSnap, simulationRunning,
  onZoomIn, onZoomOut, onResetZoom,
  onSave, onLoad, onGetSaves, onDeleteSave,
  onClear, onUndo, onRedo, canUndo, canRedo,
  onOpenTemplates, onToggleGridSnap, onAutoLayout,
  onExportJSON, onImportJSON, onOpenValidation,
  onOpenChallenges, onToggleSimulation, onOpenShortcuts,
}: Props) {
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [showLoadMenu, setShowLoadMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saves = showLoadMenu ? onGetSaves() : [];

  return (
    <motion.div
      data-tour="toolbar"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
      style={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 60,
        display: 'flex',
        gap: 4,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}
    >
      {/* Row 1: Core tools */}
      <div style={{
        display: 'flex',
        gap: 2,
        padding: 4,
        background: 'rgba(10, 10, 30, 0.9)',
        border: '1px solid rgba(0, 245, 255, 0.15)',
        borderRadius: 8,
        backdropFilter: 'blur(10px)',
      }}>
        <ToolBtn icon="↶" title="Undo (Ctrl+Z)" disabled={!canUndo} onClick={onUndo} />
        <ToolBtn icon="↷" title="Redo (Ctrl+Y)" disabled={!canRedo} onClick={onRedo} />
        <Divider />
        <ToolBtn icon="−" title="Zoom Out" onClick={onZoomOut} />
        <div style={{
          display: 'flex', alignItems: 'center', padding: '0 6px',
          fontFamily: "'Exo 2', sans-serif", fontSize: 10, color: '#00f5ff',
          minWidth: 40, justifyContent: 'center', cursor: 'pointer', userSelect: 'none',
        }} onClick={onResetZoom} title="Reset Zoom">
          {Math.round(transform.scale * 100)}%
        </div>
        <ToolBtn icon="+" title="Zoom In" onClick={onZoomIn} />
        <Divider />
        <ToolBtn icon="💾" title="Save Design" onClick={() => { setShowSaveMenu(!showSaveMenu); setShowLoadMenu(false); }} active={showSaveMenu} />
        <ToolBtn icon="📂" title="Load Design" onClick={() => { setShowLoadMenu(!showLoadMenu); setShowSaveMenu(false); }} active={showLoadMenu} />
        <Divider />
        <ToolBtn icon="⬡" title="Templates" onClick={onOpenTemplates} color="#ffd700" />
        <ToolBtn icon="#" title={`Grid Snap: ${gridSnap ? 'ON' : 'OFF'} (Ctrl+G)`} onClick={onToggleGridSnap} active={gridSnap} color={gridSnap ? '#00ff88' : undefined} />
        <ToolBtn icon="⊞" title="Auto Layout" onClick={onAutoLayout} color="#8b5cf6" />
        <Divider />
        <ToolBtn icon="↗" title="Export JSON (Ctrl+E)" onClick={onExportJSON} color="#00f5ff" />
        <ToolBtn icon="↙" title="Import JSON" onClick={() => fileInputRef.current?.click()} color="#00f5ff" />
        <Divider />
        <ToolBtn icon="◉" title="Design Analysis" onClick={onOpenValidation} color="#00ff88" />
        <span data-tour="challenges-btn" style={{ display: 'inline-flex' }}>
          <ToolBtn icon="⚔" title="Challenges" onClick={onOpenChallenges} color="#ff00e5" />
        </span>
        <ToolBtn
          icon={simulationRunning ? "⏹" : "▶"}
          title={simulationRunning ? "Stop Simulation" : "Simulate Request Flow"}
          onClick={onToggleSimulation}
          color={simulationRunning ? '#ff3366' : '#ff6b00'}
          active={simulationRunning}
        />
        <Divider />
        <ToolBtn icon="?" title="Keyboard Shortcuts" onClick={onOpenShortcuts} />
        <ToolBtn icon="✕" title="Clear Canvas" onClick={onClear} color="#ff3366" />
      </div>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) {
            onImportJSON(file);
            e.target.value = '';
          }
        }}
      />

      {/* Save dropdown */}
      <AnimatePresence>
        {showSaveMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            style={{
              position: 'absolute', top: 44, left: 0,
              padding: 12,
              background: 'rgba(10, 10, 30, 0.95)',
              border: '1px solid rgba(0, 245, 255, 0.15)',
              borderRadius: 8,
              backdropFilter: 'blur(10px)',
              width: 220,
            }}
          >
            <div style={{
              fontFamily: "'Orbitron', sans-serif", fontSize: 10, fontWeight: 700,
              color: '#00f5ff', letterSpacing: '0.15em', marginBottom: 8,
            }}>SAVE DESIGN</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                autoFocus
                value={saveName}
                onChange={e => setSaveName(e.target.value)}
                placeholder="Design name..."
                onKeyDown={e => {
                  if (e.key === 'Enter' && saveName.trim()) {
                    onSave(saveName.trim());
                    setSaveName('');
                    setShowSaveMenu(false);
                  }
                }}
                style={{
                  flex: 1, background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(0, 245, 255, 0.2)',
                  borderRadius: 4, color: '#e0e0ff',
                  fontFamily: "'Exo 2', sans-serif", fontSize: 11,
                  padding: '6px 8px', outline: 'none',
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => { if (saveName.trim()) { onSave(saveName.trim()); setSaveName(''); setShowSaveMenu(false); }}}
                style={{
                  padding: '6px 12px',
                  background: 'rgba(0, 245, 255, 0.15)',
                  border: '1px solid rgba(0, 245, 255, 0.3)',
                  borderRadius: 4, color: '#00f5ff',
                  fontFamily: "'Exo 2', sans-serif", fontSize: 10, fontWeight: 600, cursor: 'pointer',
                }}
              >SAVE</motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Load dropdown */}
      <AnimatePresence>
        {showLoadMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            style={{
              position: 'absolute', top: 44, left: 0,
              padding: 12,
              background: 'rgba(10, 10, 30, 0.95)',
              border: '1px solid rgba(0, 245, 255, 0.15)',
              borderRadius: 8,
              backdropFilter: 'blur(10px)',
              width: 250, maxHeight: 300, overflowY: 'auto',
            }}
          >
            <div style={{
              fontFamily: "'Orbitron', sans-serif", fontSize: 10, fontWeight: 700,
              color: '#00f5ff', letterSpacing: '0.15em', marginBottom: 8,
            }}>SAVED DESIGNS</div>
            {saves.length === 0 ? (
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 12, color: '#555577', padding: 8 }}>
                No saved designs yet
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {saves.map(save => (
                  <div
                    key={save.name}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '6px 8px', borderRadius: 4,
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <div onClick={() => { onLoad(save); setShowLoadMenu(false); }} style={{ cursor: 'pointer', flex: 1 }}>
                      <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 12, fontWeight: 600, color: '#c0c0e0' }}>
                        {save.name}
                      </div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 10, color: '#555577' }}>
                        {save.nodes.length} nodes · {save.connections.length} links · {new Date(save.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={(e) => { e.stopPropagation(); onDeleteSave(save.name); setShowLoadMenu(false); setTimeout(() => setShowLoadMenu(true), 50); }}
                      style={{ background: 'none', border: 'none', color: '#ff3366', fontSize: 12, cursor: 'pointer', padding: '2px 6px' }}
                    >✕</motion.button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ToolBtn({
  icon, title, onClick, disabled, active, color,
}: {
  icon: string; title: string; onClick: () => void;
  disabled?: boolean; active?: boolean; color?: string;
}) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.1, background: 'rgba(255,255,255,0.1)' }}
      whileTap={disabled ? {} : { scale: 0.9 }}
      onClick={disabled ? undefined : onClick}
      title={title}
      style={{
        width: 30, height: 30,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 4,
        background: active ? 'rgba(0, 245, 255, 0.15)' : 'transparent',
        border: 'none',
        color: disabled ? '#333355' : color || '#8888aa',
        fontSize: 14,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        fontFamily: 'system-ui',
      }}
    >{icon}</motion.button>
  );
}

function Divider() {
  return (
    <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)', margin: '5px 2px' }} />
  );
}
