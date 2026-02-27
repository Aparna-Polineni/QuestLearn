// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Onboarding from './screens/Onboarding';
import DomainSelect from './screens/DomainSelect';
import Level1_1 from './screens/stage1/Level1_1';
import Level1_2 from './screens/stage1/Level1_2';
import Level1_3 from './screens/stage1/Level1_3';
import Level1_4 from './screens/stage1/Level1_4';
import Level1_5 from './screens/stage1/Level1_5';

// Placeholder for levels not built yet
function ComingSoon({ label }) {
  return (
    <div style={{
      minHeight: '100vh', background: '#080a0f',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16
    }}>
      <div style={{ fontSize: 48 }}>🚧</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: '#f1f5f9' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: '#475569' }}>
        Coming soon — being built
      </div>
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          {/* Onboarding — who are you */}
          <Route path="/" element={<Onboarding />} />

          {/* Domain selection — choose your project */}
          <Route path="/domain-select" element={<DomainSelect />} />

          {/* Stage 1 levels */}
          <Route path="/stage/1/level/1" element={<Level1_1 />} />
          <Route path="/stage/1/level/2" element={<Level1_2 />} />          
          <Route path="/stage/1/level/3" element={<Level1_3 />} />
          <Route path="/stage/1/level/4" element={<Level1_4 />} />
          <Route path="/stage/1/level/5" element={<Level1_5 />} />
          <Route path="/stage/1/level/6" element={<ComingSoon label="Level 1.6 — Choose Your Stack" />} />
          <Route path="/stage/1/level/7" element={<ComingSoon label="Level 1.7 — Set Up the Project" />} />
          <Route path="/stage/1/level/8" element={<ComingSoon label="Level 1.8 — The Roadmap" />} />

          {/* Stage 2 intro placeholder */}
          <Route path="/stage/2/intro" element={<ComingSoon label="Stage 2 — Java Core" />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;