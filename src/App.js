// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import AuthScreen       from './screens/AuthScreen';
import Home             from './screens/Home';
import CareerPathSelect from './screens/CareerPathSelect';
import DomainSelect     from './screens/DomainSelect';
import Roadmap          from './screens/Roadmap';

// Stage 1
import Level1_1 from './screens/stage1/Level1_1';
import Level1_2 from './screens/stage1/Level1_2';
import Level1_3 from './screens/stage1/Level1_3';
import Level1_4 from './screens/stage1/Level1_4';
import Level1_5 from './screens/stage1/Level1_5';
import Level1_6 from './screens/stage1/Level1_6';
import Level1_7 from './screens/stage1/Level1_7';
import Level1_8 from './screens/stage1/Level1_8';

// Stage 2 — all 20 levels
import Level2_0 from './screens/stage2/Level2_0';
import Level2_1  from './screens/stage2/Level2_1';
import Level2_2  from './screens/stage2/Level2_2';
import Level2_3  from './screens/stage2/Level2_3';
import Level2_4  from './screens/stage2/Level2_4';
import Level2_5  from './screens/stage2/Level2_5';
import Level2_6  from './screens/stage2/Level2_6';
import Level2_7  from './screens/stage2/Level2_7';
import Level2_8  from './screens/stage2/Level2_8';
import Level2_9  from './screens/stage2/Level2_9';
import Level2_10 from './screens/stage2/Level2_10';
import Level2_11 from './screens/stage2/Level2_11';
import Level2_12 from './screens/stage2/Level2_12';
import Level2_13 from './screens/stage2/Level2_13';
import Level2_14 from './screens/stage2/Level2_14';
import Level2_15 from './screens/stage2/Level2_15';
import Level2_16 from './screens/stage2/Level2_16';
import Level2_17 from './screens/stage2/Level2_17';
import Level2_18 from './screens/stage2/Level2_18';
import Level2_19 from './screens/stage2/Level2_19';
import Level2_20 from './screens/stage2/Level2_20';

// Stage 3 — all 16 levels

import Level3_0  from './screens/stage3/Level3_0';
import Level3_1  from './screens/stage3/Level3_1';
import Level3_2  from './screens/stage3/Level3_2';
import Level3_3  from './screens/stage3/Level3_3';
import Level3_4  from './screens/stage3/Level3_4';
import Level3_5  from './screens/stage3/Level3_5';
import Level3_6  from './screens/stage3/Level3_6';
import Level3_7  from './screens/stage3/Level3_7';
import Level3_8  from './screens/stage3/Level3_8';
import Level3_9  from './screens/stage3/Level3_9';
import Level3_10 from './screens/stage3/Level3_10';
import Level3_11 from './screens/stage3/Level3_11';
import Level3_12 from './screens/stage3/Level3_12';
import Level3_13 from './screens/stage3/Level3_13';
import Level3_14 from './screens/stage3/Level3_14';
import Level3_15 from './screens/stage3/Level3_15';

//stage 4 - all 15 levels

import Level4_0  from './screens/stage4/Level4_0';
import Level4_1  from './screens/stage4/Level4_1';
import Level4_2  from './screens/stage4/Level4_2';
import Level4_3  from './screens/stage4/Level4_3';
import Level4_4  from './screens/stage4/Level4_4';
import Level4_5  from './screens/stage4/Level4_5';
import Level4_6  from './screens/stage4/Level4_6';
import Level4_7  from './screens/stage4/Level4_7';
import Level4_8  from './screens/stage4/Level4_8';
import Level4_9  from './screens/stage4/Level4_9';
import Level4_10 from './screens/stage4/Level4_10';
import Level4_11 from './screens/stage4/Level4_11';
import Level4_12 from './screens/stage4/Level4_12';
import Level4_13 from './screens/stage4/Level4_13';
import Level4_14 from './screens/stage4/Level4_14';
import Level4_15 from './screens/stage4/Level4_15';

function ComingSoon({ label }) {
  return (
    <div style={{ minHeight:'100vh', background:'#080a0f', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
      <div style={{ fontSize:48 }}>🚧</div>
      <div style={{ fontFamily:'Syne,sans-serif', fontSize:28, fontWeight:800, color:'#f1f5f9' }}>{label}</div>
      <div style={{ fontFamily:'DM Mono,monospace', fontSize:13, color:'#475569' }}>Coming soon — being built</div>
    </div>
  );
}

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#080a0f', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontFamily:'DM Mono,monospace', fontSize:13, color:'#475569', letterSpacing:2 }}>loading...</div>
    </div>
  );
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

const R = ({ children }) => <RequireAuth>{children}</RequireAuth>;

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"              element={<Navigate to="/auth" replace />} />
      <Route path="/auth"          element={<AuthScreen />} />
      <Route path="/home"          element={<R><Home /></R>} />
      <Route path="/career-select" element={<R><CareerPathSelect /></R>} />
      <Route path="/domain-select" element={<R><DomainSelect /></R>} />
      <Route path="/roadmap"       element={<R><Roadmap /></R>} />

      {/* Stage 1 */}
      <Route path="/stage/1/level/1" element={<R><Level1_1 /></R>} />
      <Route path="/stage/1/level/2" element={<R><Level1_2 /></R>} />
      <Route path="/stage/1/level/3" element={<R><Level1_3 /></R>} />
      <Route path="/stage/1/level/4" element={<R><Level1_4 /></R>} />
      <Route path="/stage/1/level/5" element={<R><Level1_5 /></R>} />
      <Route path="/stage/1/level/6" element={<R><Level1_6 /></R>} />
      <Route path="/stage/1/level/7" element={<R><Level1_7 /></R>} />
      <Route path="/stage/1/level/8" element={<R><Level1_8 /></R>} />

      {/* Stage 2 — all 21 (level 0 = concepts) */}
      <Route path="/stage/2/level/0"  element={<R><Level2_0  /></R>} />
      <Route path="/stage/2/level/1"  element={<R><Level2_1  /></R>} />
      <Route path="/stage/2/level/2"  element={<R><Level2_2  /></R>} />
      <Route path="/stage/2/level/3"  element={<R><Level2_3  /></R>} />
      <Route path="/stage/2/level/4"  element={<R><Level2_4  /></R>} />
      <Route path="/stage/2/level/5"  element={<R><Level2_5  /></R>} />
      <Route path="/stage/2/level/6"  element={<R><Level2_6  /></R>} />
      <Route path="/stage/2/level/7"  element={<R><Level2_7  /></R>} />
      <Route path="/stage/2/level/8"  element={<R><Level2_8  /></R>} />
      <Route path="/stage/2/level/9"  element={<R><Level2_9  /></R>} />
      <Route path="/stage/2/level/10" element={<R><Level2_10 /></R>} />
      <Route path="/stage/2/level/11" element={<R><Level2_11 /></R>} />
      <Route path="/stage/2/level/12" element={<R><Level2_12 /></R>} />
      <Route path="/stage/2/level/13" element={<R><Level2_13 /></R>} />
      <Route path="/stage/2/level/14" element={<R><Level2_14 /></R>} />
      <Route path="/stage/2/level/15" element={<R><Level2_15 /></R>} />
      <Route path="/stage/2/level/16" element={<R><Level2_16 /></R>} />
      <Route path="/stage/2/level/17" element={<R><Level2_17 /></R>} />
      <Route path="/stage/2/level/18" element={<R><Level2_18 /></R>} />
      <Route path="/stage/2/level/19" element={<R><Level2_19 /></R>} />
      <Route path="/stage/2/level/20" element={<R><Level2_20 /></R>} />

      {/* Stages 3– all 16 levels*/}
      <Route path="/stage/3/level/0"  element={<R><Level3_0  /></R>} />
      <Route path="/stage/3/level/1"  element={<R><Level3_1  /></R>} />
      <Route path="/stage/3/level/2"  element={<R><Level3_2  /></R>} />
      <Route path="/stage/3/level/3"  element={<R><Level3_3  /></R>} />
      <Route path="/stage/3/level/4"  element={<R><Level3_4  /></R>} />
      <Route path="/stage/3/level/5"  element={<R><Level3_5  /></R>} />
      <Route path="/stage/3/level/6"  element={<R><Level3_6  /></R>} />
      <Route path="/stage/3/level/7"  element={<R><Level3_7  /></R>} />
      <Route path="/stage/3/level/8"  element={<R><Level3_8  /></R>} />
      <Route path="/stage/3/level/9"  element={<R><Level3_9  /></R>} />
      <Route path="/stage/3/level/10" element={<R><Level3_10 /></R>} />
      <Route path="/stage/3/level/11" element={<R><Level3_11 /></R>} />
      <Route path="/stage/3/level/12" element={<R><Level3_12 /></R>} />
      <Route path="/stage/3/level/13" element={<R><Level3_13 /></R>} />
      <Route path="/stage/3/level/14" element={<R><Level3_14 /></R>} />
      <Route path="/stage/3/level/15" element={<R><Level3_15 /></R>} />

      {/* Stage 4 — all 16 (level 0 = concepts) */}

      <Route path="/stage/4/level/0"  element={<R><Level4_0  /></R>} />
      <Route path="/stage/4/level/1"  element={<R><Level4_1  /></R>} />
      <Route path="/stage/4/level/2"  element={<R><Level4_2  /></R>} />
      <Route path="/stage/4/level/3"  element={<R><Level4_3  /></R>} />
      <Route path="/stage/4/level/4"  element={<R><Level4_4  /></R>} />
      <Route path="/stage/4/level/5"  element={<R><Level4_5  /></R>} />
      <Route path="/stage/4/level/6"  element={<R><Level4_6  /></R>} />
      <Route path="/stage/4/level/7"  element={<R><Level4_7  /></R>} />
      <Route path="/stage/4/level/8"  element={<R><Level4_8  /></R>} />
      <Route path="/stage/4/level/9"  element={<R><Level4_9  /></R>} />
      <Route path="/stage/4/level/10" element={<R><Level4_10 /></R>} />
      <Route path="/stage/4/level/11" element={<R><Level4_11 /></R>} />
      <Route path="/stage/4/level/12" element={<R><Level4_12 /></R>} />
      <Route path="/stage/4/level/13" element={<R><Level4_13 /></R>} />
      <Route path="/stage/4/level/14" element={<R><Level4_14 /></R>} />
      <Route path="/stage/4/level/15" element={<R><Level4_15 /></R>} />

      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </GameProvider>
    </AuthProvider>
  );
}