import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/Landing/LandingPage';
import Workspace from './components/Workspace/Workspace';
import { useAppStore } from './store/useStore';
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
            connectingFrom={store.connectingFrom}
            senseiMood={store.senseiMood}
            onAddNode={store.addNode}
            onUpdateNodePosition={store.updateNodePosition}
            onSelectNode={store.setSelectedNode}
            onDeleteNode={store.removeNode}
            onUpdateNodeLabel={store.updateNodeLabel}
            onSetConnectingFrom={store.setConnectingFrom}
            onAddConnection={store.addConnection}
            onDeleteConnection={store.removeConnection}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
