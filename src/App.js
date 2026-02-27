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
import Level1_6 from './screens/stage1/Level1_6';
import Level1_7 from './screens/stage1/Level1_7';
import Level1_8 from './screens/stage1/Level1_8';
import Level2_1 from './screens/stage2/Level2_1';

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
          <Route path="/stage/1/level/6" element={<Level1_6 />} />
          <Route path="/stage/1/level/7" element={<Level1_7 />} />
          <Route path="/stage/1/level/8" element={<Level1_8 />} />

          {/* Stage 2 levels */}
          <Route path="/stage/2/intro" element={<Navigate to="/stage/2/level/1" />} />
          <Route path="/stage/2/level/1" element={<Level2_1 />} />
          <Route path="/stage/2/level/2" element={<ComingSoon label="Stage 2 — Java Core" />} />
          <Route path="/stage/2/level/3" element={<ComingSoon label="Stage 2 — Java Core" />} />
          <Route path="/stage/2/level/4" element={<ComingSoon label="Stage 2 — Java Core" />} />
          <Route path="/stage/2/level/5" element={<ComingSoon label="Stage 2 — Java Core" />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;