import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../Sidebar/Sidebar';
import DesignCanvas from '../Canvas/DesignCanvas';
import SenseiGuide from '../Character/SenseiGuide';
import PropertiesPanel from './PropertiesPanel';
import TopBar from './TopBar';
import TemplatesModal from './TemplatesModal';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import ChallengePanel from './ChallengePanel';
import ValidationPanel from './ValidationPanel';
import AchievementsModal from './AchievementsModal';
import TutorialOverlay from './TutorialOverlay';
import QuestMap from './QuestMap';
import QuestGuide from './QuestGuide';
import QuestVictory from './QuestVictory';
import MusicPlayer from './MusicPlayer';
import type {
  ComponentType, Position, CanvasNode, Connection,
  SenseiMood, CanvasTransform, ConnectionProtocol, SavedDesign,
  UserProgress, ChallengeState, SimulationState, Challenge, CanvasNote,
  QuestState,
} from '../../types';

interface Props {
  nodes: CanvasNode[];
  connections: Connection[];
  selectedNode: string | null;
  selectedConnection: string | null;
  connectingFrom: string | null;
  senseiMood: SenseiMood;
  transform: CanvasTransform;
  canUndo: boolean;
  canRedo: boolean;
  gridSnap: boolean;
  notes: CanvasNote[];
  progress: UserProgress;
  newAchievement: string | null;
  challengeState: ChallengeState;
  simulation: SimulationState;
  showTutorial: boolean;
  onAddNode: (type: ComponentType, position: Position) => CanvasNode;
  onUpdateNodePosition: (id: string, position: Position) => void;
  onSelectNode: (id: string | null) => void;
  onSelectConnection: (id: string | null) => void;
  onDeleteNode: (id: string) => void;
  onUpdateNodeLabel: (id: string, label: string) => void;
  onSetConnectingFrom: (id: string | null) => void;
  onAddConnection: (from: string, to: string) => void;
  onDeleteConnection: (id: string) => void;
  onUpdateConnectionLabel: (id: string, label: string) => void;
  onUpdateConnectionProtocol: (id: string, protocol: ConnectionProtocol) => void;
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
  onLoadTemplate: (nodes: CanvasNode[], connections: Connection[]) => void;
  onToggleGridSnap: () => void;
  onAutoLayout: () => void;
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
  onStartChallenge: (challenge: Challenge) => void;
  onCompleteChallenge: (id: string, xp: number) => void;
  onAbandonChallenge: () => void;
  onStartSimulation: () => void;
  onStopSimulation: () => void;
  onAdvanceSimulation: () => void;
  onDismissTutorial: () => void;
  onAddNote: (pos: Position) => void;
  onUpdateNote: (id: string, text: string) => void;
  onRemoveNote: (id: string) => void;
  onUpdateNotePosition: (id: string, pos: Position) => void;
  questState: QuestState;
  questCelebration: string | null;
  onStartQuest: (id: string) => void;
  onAdvanceQuestStep: () => void;
  onCompleteQuest: () => void;
  onAbandonQuest: () => void;
  onUseQuestHint: () => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
}

export default function Workspace({
  nodes, connections, selectedNode, selectedConnection, connectingFrom,
  senseiMood, transform, canUndo, canRedo, gridSnap, notes,
  progress, newAchievement, challengeState, simulation, showTutorial,
  onAddNode, onUpdateNodePosition, onSelectNode, onSelectConnection,
  onDeleteNode, onUpdateNodeLabel,
  onSetConnectingFrom, onAddConnection, onDeleteConnection,
  onUpdateConnectionLabel, onUpdateConnectionProtocol,
  onSetTransform, onZoomIn, onZoomOut, onResetZoom,
  onSave, onLoad, onGetSaves, onDeleteSave,
  onClear, onUndo, onRedo, onLoadTemplate,
  onToggleGridSnap, onAutoLayout, onExportJSON, onImportJSON,
  onStartChallenge, onCompleteChallenge, onAbandonChallenge,
  onStartSimulation, onStopSimulation, onAdvanceSimulation,
  onDismissTutorial,
  onAddNote, onUpdateNote, onRemoveNote, onUpdateNotePosition,
  questState, questCelebration,
  onStartQuest, onAdvanceQuestStep, onCompleteQuest, onAbandonQuest, onUseQuestHint,
  musicEnabled, onToggleMusic,
}: Props) {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showQuestMap, setShowQuestMap] = useState(false);

  const handleConnectionStart = useCallback((id: string) => {
    onSetConnectingFrom(id);
  }, [onSetConnectingFrom]);

  const handleConnectionEnd = useCallback((id: string) => {
    if (connectingFrom && connectingFrom !== id) {
      onAddConnection(connectingFrom, id);
    }
    onSetConnectingFrom(null);
  }, [connectingFrom, onAddConnection, onSetConnectingFrom]);

  // ESC to cancel
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onSetConnectingFrom(null);
        onSelectNode(null);
        onSelectConnection(null);
        setShowTemplates(false);
        setShowShortcuts(false);
        setShowChallenges(false);
        setShowValidation(false);
        setShowProfile(false);
      }
      if (e.key === 'Delete') {
        if (selectedNode) onDeleteNode(selectedNode);
        else if (selectedConnection) onDeleteConnection(selectedConnection);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onSetConnectingFrom, onSelectNode, onSelectConnection, selectedNode, selectedConnection, onDeleteNode, onDeleteConnection]);

  // Simulation auto-advance
  useEffect(() => {
    if (!simulation.isRunning || simulation.currentStep < 0) return;
    const timer = setInterval(() => {
      onAdvanceSimulation();
    }, simulation.speed);
    return () => clearInterval(timer);
  }, [simulation.isRunning, simulation.currentStep, simulation.speed, onAdvanceSimulation]);

  const selectedNodeObj = selectedNode ? nodes.find(n => n.id === selectedNode) || null : null;
  const selectedConnObj = selectedConnection ? connections.find(c => c.id === selectedConnection) || null : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-primary)',
        overflow: 'hidden',
      }}
    >
      <TopBar
        nodeCount={nodes.length}
        connectionCount={connections.length}
        progress={progress}
        onOpenProfile={() => setShowProfile(true)}
        onOpenQuests={() => setShowQuestMap(true)}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        <Sidebar onDragStart={() => {}} />

        <div style={{ flex: 1, position: 'relative' }}>
          <DesignCanvas
            nodes={nodes}
            connections={connections}
            selectedNode={selectedNode}
            selectedConnection={selectedConnection}
            connectingFrom={connectingFrom}
            transform={transform}
            canUndo={canUndo}
            canRedo={canRedo}
            gridSnap={gridSnap}
            simulation={simulation}
            notes={notes}
            onAddNode={(type, pos) => onAddNode(type, pos)}
            onUpdateNodePosition={(id, pos) => onUpdateNodePosition(id, pos)}
            onSelectNode={onSelectNode}
            onSelectConnection={onSelectConnection}
            onDeleteNode={onDeleteNode}
            onUpdateNodeLabel={onUpdateNodeLabel}
            onConnectionStart={handleConnectionStart}
            onConnectionEnd={handleConnectionEnd}
            onSetConnectingFrom={onSetConnectingFrom}
            onDeleteConnection={onDeleteConnection}
            onSetTransform={onSetTransform}
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
            onOpenTemplates={() => setShowTemplates(true)}
            onToggleGridSnap={onToggleGridSnap}
            onAutoLayout={onAutoLayout}
            onExportJSON={onExportJSON}
            onImportJSON={onImportJSON}
            onOpenValidation={() => setShowValidation(true)}
            onOpenChallenges={() => setShowChallenges(true)}
            onToggleSimulation={() => simulation.isRunning ? onStopSimulation() : onStartSimulation()}
            onOpenShortcuts={() => setShowShortcuts(true)}
            onAddNote={onAddNote}
            onUpdateNote={onUpdateNote}
            onRemoveNote={onRemoveNote}
            onUpdateNotePosition={onUpdateNotePosition}
          />

          <SenseiGuide
            mood={senseiMood}
            nodeCount={nodes.length}
            connectionCount={connections.length}
          />
        </div>

        <PropertiesPanel
          selectedNode={selectedNodeObj}
          selectedConnection={selectedConnObj}
          connections={connections}
          nodes={nodes}
          onUpdateLabel={onUpdateNodeLabel}
          onDeleteNode={onDeleteNode}
          onUpdateConnectionLabel={onUpdateConnectionLabel}
          onUpdateConnectionProtocol={onUpdateConnectionProtocol}
          onDeleteConnection={onDeleteConnection}
        />
      </div>

      {/* Modals */}
      <QuestMap
        isOpen={showQuestMap}
        onClose={() => setShowQuestMap(false)}
        completedQuests={questState.completedQuests}
        progress={progress}
        onStartQuest={onStartQuest}
      />
      <QuestGuide
        questState={questState}
        nodes={nodes}
        connections={connections}
        onAdvanceStep={onAdvanceQuestStep}
        onComplete={onCompleteQuest}
        onAbandon={onAbandonQuest}
        onUseHint={onUseQuestHint}
      />
      <QuestVictory questTitle={questCelebration} />
      <MusicPlayer enabled={musicEnabled} onToggle={onToggleMusic} />
      <TemplatesModal isOpen={showTemplates} onClose={() => setShowTemplates(false)} onLoadTemplate={onLoadTemplate} />
      <KeyboardShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
      <ChallengePanel
        isOpen={showChallenges}
        onClose={() => setShowChallenges(false)}
        challengeState={challengeState}
        nodes={nodes}
        connections={connections}
        onStartChallenge={onStartChallenge}
        onCompleteChallenge={onCompleteChallenge}
        onAbandonChallenge={onAbandonChallenge}
      />
      <ValidationPanel isOpen={showValidation} onClose={() => setShowValidation(false)} nodes={nodes} connections={connections} />
      <AchievementsModal isOpen={showProfile} onClose={() => setShowProfile(false)} progress={progress} />
      <TutorialOverlay isOpen={showTutorial} onClose={onDismissTutorial} />

      {/* Achievement notification */}
      <AnimatePresence>
        {newAchievement && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 60,
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '12px 28px',
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 107, 0, 0.15))',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              borderRadius: 12,
              zIndex: 999,
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 40px rgba(255, 215, 0, 0.15)',
            }}
          >
            <div style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 10,
              fontWeight: 700,
              color: '#ffd700',
              letterSpacing: '0.2em',
              marginBottom: 4,
            }}>
              ACHIEVEMENT UNLOCKED
            </div>
            <div style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: '#fff',
            }}>
              {newAchievement}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
