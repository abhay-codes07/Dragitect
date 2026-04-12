import { useCallback, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { CanvasNode, Connection, ComponentType, CanvasTransform, SavedDesign, SimulationState, CanvasNote } from '../../types';
import CanvasNodeComponent from '../SystemComponents/CanvasNodeComponent';
import ConnectionLayer from '../Connections/ConnectionLayer';
import CanvasToolbar from './CanvasToolbar';
import MiniMap from './MiniMap';
import AnimeAura from './AnimeAura';

interface Props {
  nodes: CanvasNode[];
  connections: Connection[];
  selectedNode: string | null;
  selectedConnection: string | null;
  connectingFrom: string | null;
  transform: CanvasTransform;
  canUndo: boolean;
  canRedo: boolean;
  gridSnap: boolean;
  simulation: SimulationState;
  notes: CanvasNote[];
  onAddNode: (type: ComponentType, pos: { x: number; y: number }) => void;
  onUpdateNodePosition: (id: string, pos: { x: number; y: number }) => void;
  onSelectNode: (id: string | null) => void;
  onSelectConnection: (id: string | null) => void;
  onDeleteNode: (id: string) => void;
  onUpdateNodeLabel: (id: string, label: string) => void;
  onConnectionStart: (id: string) => void;
  onConnectionEnd: (id: string) => void;
  onSetConnectingFrom: (id: string | null) => void;
  onDeleteConnection: (id: string) => void;
  onSetTransform: (t: CanvasTransform) => void;
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
  onOpenTemplates: () => void;
  onToggleGridSnap: () => void;
  onAutoLayout: () => void;
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
  onOpenValidation: () => void;
  onOpenChallenges: () => void;
  onToggleSimulation: () => void;
  onOpenShortcuts: () => void;
  onAddNote: (pos: { x: number; y: number }) => void;
  onUpdateNote: (id: string, text: string) => void;
  onRemoveNote: (id: string) => void;
  onUpdateNotePosition: (id: string, pos: { x: number; y: number }) => void;
}

export default function DesignCanvas({
  nodes, connections, selectedNode, selectedConnection, connectingFrom,
  transform, canUndo, canRedo, gridSnap, simulation, notes,
  onAddNode, onUpdateNodePosition, onSelectNode, onSelectConnection,
  onDeleteNode, onUpdateNodeLabel,
  onConnectionStart, onConnectionEnd, onSetConnectingFrom,
  onDeleteConnection, onSetTransform,
  onZoomIn, onZoomOut, onResetZoom,
  onSave, onLoad, onGetSaves, onDeleteSave,
  onClear, onUndo, onRedo, onOpenTemplates,
  onToggleGridSnap, onAutoLayout, onExportJSON, onImportJSON,
  onOpenValidation, onOpenChallenges, onToggleSimulation, onOpenShortcuts,
  onAddNote, onUpdateNote, onRemoveNote, onUpdateNotePosition,
}: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 600 });

  // Track canvas size
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setCanvasSize({ w: width, h: height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Wheel zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(Math.max(transform.scale * delta, 0.3), 3);
      onSetTransform({ ...transform, scale: newScale });
    };
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [transform, onSetTransform]);

  // Pan
  const handlePanStart = useCallback((e: React.PointerEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault();
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY, offsetX: transform.offsetX, offsetY: transform.offsetY };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  }, [transform]);

  const handlePanMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning) return;
    onSetTransform({
      ...transform,
      offsetX: panStart.current.offsetX + (e.clientX - panStart.current.x),
      offsetY: panStart.current.offsetY + (e.clientY - panStart.current.y),
    });
  }, [isPanning, transform, onSetTransform]);

  const handlePanEnd = useCallback((e: React.PointerEvent) => {
    if (isPanning) {
      setIsPanning(false);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  }, [isPanning]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('componentType') as ComponentType;
    if (!type || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - transform.offsetX) / transform.scale;
    const y = (e.clientY - rect.top - transform.offsetY) / transform.scale;
    onAddNode(type, { x, y });
  }, [onAddNode, transform]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).dataset.canvas) {
      onSelectNode(null);
      onSelectConnection(null);
      if (connectingFrom) onSetConnectingFrom(null);
    }
  }, [onSelectNode, onSelectConnection, connectingFrom, onSetConnectingFrom]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') { e.preventDefault(); onUndo(); }
      if (e.ctrlKey && e.key === 'y') { e.preventDefault(); onRedo(); }
      if (e.ctrlKey && e.key === 'g') { e.preventDefault(); onToggleGridSnap(); }
      if (e.ctrlKey && e.key === 'e') { e.preventDefault(); onExportJSON(); }
      if (e.ctrlKey && e.key === 's') { e.preventDefault(); /* handled by save menu */ }
      if (e.key === '?' && !e.ctrlKey) { onOpenShortcuts(); }
      if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
        onAddNote({ x: canvasSize.w / 2, y: canvasSize.h / 2 });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onUndo, onRedo, onToggleGridSnap, onExportJSON, onOpenShortcuts, onAddNote, canvasSize]);

  // Simulation step advancement
  useEffect(() => {
    if (!simulation.isRunning || simulation.currentStep < 0) return;
    const timer = setTimeout(() => {
      // This will be called from the parent via advanceSimulation
    }, simulation.speed);
    return () => clearTimeout(timer);
  }, [simulation]);

  // Get active simulation highlight
  const simStep = simulation.isRunning && simulation.currentStep >= 0 && simulation.currentStep < simulation.steps.length
    ? simulation.steps[simulation.currentStep]
    : null;

  const handleNavigate = useCallback((offsetX: number, offsetY: number) => {
    onSetTransform({ ...transform, offsetX, offsetY });
  }, [transform, onSetTransform]);

  return (
    <motion.div
      ref={canvasRef}
      data-canvas="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleCanvasClick}
      onPointerDown={handlePanStart}
      onPointerMove={handlePanMove}
      onPointerUp={handlePanEnd}
      style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        background: `
          radial-gradient(ellipse at center, rgba(0,245,255,0.03) 0%, transparent 70%),
          linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 40px 40px, 40px 40px',
        cursor: isPanning ? 'grabbing' : connectingFrom ? 'crosshair' : 'default',
      }}
    >
      {/* Ambient corner glows */}
      <div data-canvas="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, width: 300, height: 300,
          background: 'radial-gradient(circle at 0 0, rgba(0,245,255,0.04), transparent)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, right: 0, width: 300, height: 300,
          background: 'radial-gradient(circle at 100% 100%, rgba(255,0,229,0.04), transparent)',
        }} />
      </div>

      {/* Anime aura layer (drifting particles + color auras) */}
      <AnimeAura />

      {/* Grid snap indicator */}
      {gridSnap && (
        <div data-canvas="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(0,245,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: `${40 * transform.scale}px ${40 * transform.scale}px`,
          backgroundPosition: `${transform.offsetX}px ${transform.offsetY}px`,
          opacity: 0.5,
        }} />
      )}

      {/* Transformed layer (zoom & pan) */}
      <div
        data-canvas="true"
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${transform.offsetX}px, ${transform.offsetY}px) scale(${transform.scale})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Connection layer */}
        <ConnectionLayer
          nodes={nodes}
          connections={connections}
          selectedConnection={selectedConnection}
          onSelectConnection={onSelectConnection}
          onDeleteConnection={onDeleteConnection}
          simulationHighlight={simStep?.connectionId || null}
        />

        {/* Notes */}
        {notes.map(note => (
          <NoteWidget
            key={note.id}
            note={note}
            onUpdate={onUpdateNote}
            onRemove={onRemoveNote}
            onMove={onUpdateNotePosition}
          />
        ))}

        {/* Nodes */}
        {nodes.map(node => (
          <CanvasNodeComponent
            key={node.id}
            node={node}
            isSelected={selectedNode === node.id}
            isConnecting={connectingFrom !== null}
            isSimHighlight={simStep?.fromNodeId === node.id || simStep?.toNodeId === node.id}
            onSelect={(id) => { onSelectNode(id); onSelectConnection(null); }}
            onDrag={(id, x, y) => onUpdateNodePosition(id, { x, y })}
            onConnectionStart={onConnectionStart}
            onConnectionEnd={onConnectionEnd}
            onDelete={onDeleteNode}
            onLabelChange={onUpdateNodeLabel}
          />
        ))}
      </div>

      {/* Empty state */}
      {nodes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          data-canvas="true"
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center', pointerEvents: 'none',
          }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 20, fontWeight: 700,
              color: '#222244',
              letterSpacing: '0.15em',
              marginBottom: 12,
            }}
          >
            DRAG COMPONENTS HERE
          </motion.div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 14, color: '#333355', marginBottom: 6 }}>
            Build your system architecture, one component at a time
          </div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 12, color: '#2a2a44' }}>
            or try a template from the toolbar
          </div>
        </motion.div>
      )}

      {/* Connecting mode indicator */}
      {connectingFrom && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute', top: 54, left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 20px',
            background: 'rgba(255, 0, 229, 0.15)',
            border: '1px solid rgba(255, 0, 229, 0.3)',
            borderRadius: 20,
            fontFamily: "'Exo 2', sans-serif",
            fontSize: 12, color: '#ff00e5',
            letterSpacing: '0.1em',
            zIndex: 60,
          }}
        >
          Click another component to connect | ESC to cancel
        </motion.div>
      )}

      {/* Simulation status */}
      {simulation.isRunning && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute', bottom: 140, left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 24px',
            background: 'rgba(255, 107, 0, 0.15)',
            border: '1px solid rgba(255, 107, 0, 0.3)',
            borderRadius: 20,
            fontFamily: "'Exo 2', sans-serif",
            fontSize: 12, color: '#ff6b00',
            letterSpacing: '0.1em',
            zIndex: 60,
            textAlign: 'center',
          }}
        >
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            SIMULATING REQUEST FLOW
          </motion.span>
          {simStep && (
            <div style={{ fontSize: 10, color: '#ffd700', marginTop: 4 }}>
              Step {simulation.currentStep + 1}/{simulation.steps.length}: {simStep.label}
            </div>
          )}
        </motion.div>
      )}

      {/* Canvas Toolbar */}
      <CanvasToolbar
        transform={transform}
        gridSnap={gridSnap}
        simulationRunning={simulation.isRunning}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onResetZoom={onResetZoom}
        onSave={onSave}
        onLoad={onLoad}
        onGetSaves={onGetSaves}
        onDeleteSave={onDeleteSave}
        onClear={onClear}
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        onOpenTemplates={onOpenTemplates}
        onToggleGridSnap={onToggleGridSnap}
        onAutoLayout={onAutoLayout}
        onExportJSON={onExportJSON}
        onImportJSON={onImportJSON}
        onOpenValidation={onOpenValidation}
        onOpenChallenges={onOpenChallenges}
        onToggleSimulation={onToggleSimulation}
        onOpenShortcuts={onOpenShortcuts}
      />

      {/* Mini Map */}
      <MiniMap
        nodes={nodes}
        connections={connections}
        transform={transform}
        canvasWidth={canvasSize.w}
        canvasHeight={canvasSize.h}
        onNavigate={handleNavigate}
      />

      {/* Top glow line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.3), transparent)',
        pointerEvents: 'none',
      }} />
    </motion.div>
  );
}

// Inline note widget
function NoteWidget({ note, onUpdate, onRemove, onMove }: {
  note: CanvasNote;
  onUpdate: (id: string, text: string) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, pos: { x: number; y: number }) => void;
}) {
  const [editing, setEditing] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; nx: number; ny: number } | null>(null);

  return (
    <div
      style={{
        position: 'absolute',
        left: note.position.x,
        top: note.position.y,
        width: 140,
        minHeight: 50,
        background: 'rgba(255, 215, 0, 0.06)',
        border: '1px solid rgba(255, 215, 0, 0.2)',
        borderRadius: 6,
        padding: 8,
        fontSize: 11,
        fontFamily: "'Rajdhani', sans-serif",
        color: '#ffd700',
        cursor: 'move',
        zIndex: 8,
      }}
      onPointerDown={(e) => {
        if (editing) return;
        e.stopPropagation();
        dragRef.current = { startX: e.clientX, startY: e.clientY, nx: note.position.x, ny: note.position.y };
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!dragRef.current) return;
        onMove(note.id, {
          x: dragRef.current.nx + (e.clientX - dragRef.current.startX),
          y: dragRef.current.ny + (e.clientY - dragRef.current.startY),
        });
      }}
      onPointerUp={(e) => {
        if (dragRef.current) {
          dragRef.current = null;
          (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        }
      }}
      onDoubleClick={(e) => { e.stopPropagation(); setEditing(true); }}
    >
      {editing ? (
        <textarea
          autoFocus
          defaultValue={note.text}
          onBlur={(e) => { onUpdate(note.id, e.target.value); setEditing(false); }}
          style={{
            width: '100%', minHeight: 40, background: 'transparent',
            border: 'none', color: '#ffd700', fontSize: 11,
            fontFamily: "'Rajdhani', sans-serif", outline: 'none', resize: 'vertical',
          }}
        />
      ) : (
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>{note.text}</div>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(note.id); }}
        style={{
          position: 'absolute', top: 2, right: 4,
          background: 'none', border: 'none',
          color: '#ff336666', fontSize: 10, cursor: 'pointer',
        }}
      >x</button>
    </div>
  );
}
