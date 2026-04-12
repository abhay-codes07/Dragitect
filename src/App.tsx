import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/Landing/LandingPage';
import Workspace from './components/Workspace/Workspace';
import { useAppStore } from './store/useStore';
import { autoLayout } from './utils/autoLayout';
import './App.css';

function App() {
  const store = useAppStore();

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        {store.view === 'landing' ? (
          <LandingPage
            key="landing"
            onEnter={() => store.setView('workspace')}
          />
        ) : (
          <Workspace
            key="workspace"
            nodes={store.nodes}
            connections={store.connections}
            selectedNode={store.selectedNode}
            selectedConnection={store.selectedConnection}
            connectingFrom={store.connectingFrom}
            senseiMood={store.senseiMood}
            transform={store.transform}
            canUndo={store.canUndo}
            canRedo={store.canRedo}
            gridSnap={store.gridSnap}
            notes={store.notes}
            progress={store.progress}
            newAchievement={store.newAchievement}
            challengeState={store.challengeState}
            simulation={store.simulation}
            showTutorial={store.showTutorial}
            onAddNode={store.addNode}
            onUpdateNodePosition={store.updateNodePosition}
            onSelectNode={store.setSelectedNode}
            onSelectConnection={store.setSelectedConnection}
            onDeleteNode={store.removeNode}
            onUpdateNodeLabel={store.updateNodeLabel}
            onSetConnectingFrom={store.setConnectingFrom}
            onAddConnection={store.addConnection}
            onDeleteConnection={store.removeConnection}
            onUpdateConnectionLabel={store.updateConnectionLabel}
            onUpdateConnectionProtocol={store.updateConnectionProtocol}
            onSetTransform={store.setTransform}
            onZoomIn={store.zoomIn}
            onZoomOut={store.zoomOut}
            onResetZoom={store.resetZoom}
            onSave={store.saveDesign}
            onLoad={store.loadDesign}
            onGetSaves={store.getSavedDesigns}
            onDeleteSave={store.deleteSavedDesign}
            onClear={store.clearCanvas}
            onUndo={store.undo}
            onRedo={store.redo}
            onLoadTemplate={store.loadTemplate}
            onToggleGridSnap={() => store.setGridSnap(!store.gridSnap)}
            onAutoLayout={() => store.applyAutoLayout(autoLayout)}
            onExportJSON={store.exportJSON}
            onImportJSON={store.importJSON}
            onStartChallenge={store.startChallenge}
            onCompleteChallenge={store.completeChallenge}
            onAbandonChallenge={store.abandonChallenge}
            onStartSimulation={store.startSimulation}
            onStopSimulation={store.stopSimulation}
            onAdvanceSimulation={store.advanceSimulation}
            onDismissTutorial={store.dismissTutorial}
            onAddNote={store.addNote}
            onUpdateNote={store.updateNote}
            onRemoveNote={store.removeNote}
            onUpdateNotePosition={store.updateNotePosition}
            questState={store.questState}
            questCelebration={store.questCelebration}
            onStartQuest={store.startQuest}
            onAdvanceQuestStep={store.advanceQuestStep}
            onCompleteQuest={store.completeQuest}
            onAbandonQuest={store.abandonQuest}
            onUseQuestHint={store.useQuestHint}
            musicEnabled={store.musicEnabled}
            onToggleMusic={store.toggleMusic}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
