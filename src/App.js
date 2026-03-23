// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import AuthScreen       from './screens/AuthScreen';
import LandingPage      from './screens/LandingPage';
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
import Level2_0  from './screens/stage2/Level2_0';
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

// Stage 2.5 — JavaScript Fundamentals (20 levels, JS.0–JS.19)
import LevelJS_0 from './screens/stage2_5/LevelJS_0';
import LevelJS_1 from './screens/stage2_5/LevelJS_1';
import LevelJS_2 from './screens/stage2_5/LevelJS_2';
import LevelJS_3 from './screens/stage2_5/LevelJS_3';
import LevelJS_4 from './screens/stage2_5/LevelJS_4';
import LevelJS_5 from './screens/stage2_5/LevelJS_5';
import LevelJS_6 from './screens/stage2_5/LevelJS_6';
import LevelJS_7 from './screens/stage2_5/LevelJS_7';
import LevelJS_8 from './screens/stage2_5/LevelJS_8';
import LevelJS_9 from './screens/stage2_5/LevelJS_9';
import LevelJS_10 from './screens/stage2_5/LevelJS_10';
import LevelJS_11 from './screens/stage2_5/LevelJS_11';
import LevelJS_12 from './screens/stage2_5/LevelJS_12';
import LevelJS_13 from './screens/stage2_5/LevelJS_13';
import LevelJS_14 from './screens/stage2_5/LevelJS_14';
import LevelJS_15 from './screens/stage2_5/LevelJS_15';
import LevelJS_16 from './screens/stage2_5/LevelJS_16';
import LevelJS_17 from './screens/stage2_5/LevelJS_17';
import LevelJS_18 from './screens/stage2_5/LevelJS_18';
import LevelJS_19 from './screens/stage2_5/LevelJS_19';

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

// Stage 4 — all 16 levels
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
import Level5_0  from './screens/stage5/Level5_0';
import Level5_1  from './screens/stage5/Level5_1';
import Level5_2  from './screens/stage5/Level5_2';
import Level5_3  from './screens/stage5/Level5_3';
import Level5_4  from './screens/stage5/Level5_4';
import Level5_5  from './screens/stage5/Level5_5';
import Level5_6  from './screens/stage5/Level5_6';
import Level5_7  from './screens/stage5/Level5_7';
import Level5_8  from './screens/stage5/Level5_8';
import Level5_9  from './screens/stage5/Level5_9';
import Level5_10 from './screens/stage5/Level5_10';
import Level5_11 from './screens/stage5/Level5_11';
import Level5_12 from './screens/stage5/Level5_12';
import Level5_13 from './screens/stage5/Level5_13';
import Level5_14 from './screens/stage5/Level5_14';
import Level5_15 from './screens/stage5/Level5_15';
import Level5_16 from './screens/stage5/Level5_16';
import Level5_17 from './screens/stage5/Level5_17';
import Level5_18 from './screens/stage5/Level5_18';
import Level5_19 from './screens/stage5/Level5_19';
import Level5_20 from './screens/stage5/Level5_20';
import Level5_21 from './screens/stage5/Level5_21';
import Level6_0  from './screens/stage6/Level6_0';
import Level6_1  from './screens/stage6/Level6_1';
import Level6_2  from './screens/stage6/Level6_2';
import Level6_3  from './screens/stage6/Level6_3';
import Level6_4  from './screens/stage6/Level6_4';
import Level6_5  from './screens/stage6/Level6_5';
import Level6_6  from './screens/stage6/Level6_6';
import Level6_7  from './screens/stage6/Level6_7';
import Level6_8  from './screens/stage6/Level6_8';
import Level6_9  from './screens/stage6/Level6_9';
import Level6_10 from './screens/stage6/Level6_10';
import Level6_11 from './screens/stage6/Level6_11';
import Level6_12 from './screens/stage6/Level6_12';
import Level6_13 from './screens/stage6/Level6_13';
import Level7_0  from './screens/stage7/Level7_0';
import Level7_1  from './screens/stage7/Level7_1';
import Level7_2  from './screens/stage7/Level7_2';
import Level7_3  from './screens/stage7/Level7_3';
import Level7_4  from './screens/stage7/Level7_4';
import Level7_5  from './screens/stage7/Level7_5';
import Level7_6  from './screens/stage7/Level7_6';
import Level7_7  from './screens/stage7/Level7_7';
import Level7_8  from './screens/stage7/Level7_8';
import Level7_9  from './screens/stage7/Level7_9';
import Level7_10 from './screens/stage7/Level7_10';
import Level7_11 from './screens/stage7/Level7_11';

// ── Data Engineer Path ─────────────────────────────────────────────────────
import DE1_Level0 from './screens/data-engineer/stage1/DE1_Level0';
import DE1_Level1 from './screens/data-engineer/stage1/DE1_Level1';
import DE1_Level2 from './screens/data-engineer/stage1/DE1_Level2';
import DE1_Level3 from './screens/data-engineer/stage1/DE1_Level3';
import DE1_Level4 from './screens/data-engineer/stage1/DE1_Level4';
import DE1_Level5 from './screens/data-engineer/stage1/DE1_Level5';
import DE1_Level6 from './screens/data-engineer/stage1/DE1_Level6';
import DE1_Level7 from './screens/data-engineer/stage1/DE1_Level7';

// ── ML/AI Engineer Path ────────────────────────────────────────────────────
import ML1_Level0 from './screens/ml-ai-engineer/stage1/ML1_Level0';
import ML1_Level1 from './screens/ml-ai-engineer/stage1/ML1_Level1';
import ML1_Level2 from './screens/ml-ai-engineer/stage1/ML1_Level2';
import ML1_Level3 from './screens/ml-ai-engineer/stage1/ML1_Level3';
import ML1_Level4 from './screens/ml-ai-engineer/stage1/ML1_Level4';
import ML1_Level5 from './screens/ml-ai-engineer/stage1/ML1_Level5';
import ML1_Level6 from './screens/ml-ai-engineer/stage1/ML1_Level6';
import ML1_Level7 from './screens/ml-ai-engineer/stage1/ML1_Level7';

// ── Cyber Security Path ────────────────────────────────────────────────────
import CY1_Level0 from './screens/cyber-security/stage1/CY1_Level0';
import CY1_Level1 from './screens/cyber-security/stage1/CY1_Level1';
import CY1_Level2 from './screens/cyber-security/stage1/CY1_Level2';
import CY1_Level3 from './screens/cyber-security/stage1/CY1_Level3';
import CY1_Level4 from './screens/cyber-security/stage1/CY1_Level4';
import CY1_Level5 from './screens/cyber-security/stage1/CY1_Level5';
import CY1_Level6 from './screens/cyber-security/stage1/CY1_Level6';
import CY1_Level7 from './screens/cyber-security/stage1/CY1_Level7';

// ── UX/UI Designer Path ────────────────────────────────────────────────────
import UX1_Level0 from './screens/ux-ui-designer/stage1/UX1_Level0';
import UX1_Level1 from './screens/ux-ui-designer/stage1/UX1_Level1';
import UX1_Level2 from './screens/ux-ui-designer/stage1/UX1_Level2';
import UX1_Level3 from './screens/ux-ui-designer/stage1/UX1_Level3';
import UX1_Level4 from './screens/ux-ui-designer/stage1/UX1_Level4';
import UX1_Level5 from './screens/ux-ui-designer/stage1/UX1_Level5';
import UX1_Level6 from './screens/ux-ui-designer/stage1/UX1_Level6';
import UX1_Level7 from './screens/ux-ui-designer/stage1/UX1_Level7';

// ── Stage 2 New Paths ──────────────────────────────────────────────────────
// Data Engineer Stage 2
import DE2_Level0 from './screens/data-engineer/stage2/DE2_Level0';
import DE2_Level1 from './screens/data-engineer/stage2/DE2_Level1';
import DE2_Level2 from './screens/data-engineer/stage2/DE2_Level2';
import DE2_Level3 from './screens/data-engineer/stage2/DE2_Level3';
import DE2_Level4 from './screens/data-engineer/stage2/DE2_Level4';
import DE2_Level5 from './screens/data-engineer/stage2/DE2_Level5';
import DE2_Level6 from './screens/data-engineer/stage2/DE2_Level6';
import DE2_Level7 from './screens/data-engineer/stage2/DE2_Level7';
import DE2_Level8 from './screens/data-engineer/stage2/DE2_Level8';
import DE2_Level9 from './screens/data-engineer/stage2/DE2_Level9';
import DE2_Level10 from './screens/data-engineer/stage2/DE2_Level10';
import DE2_Level11 from './screens/data-engineer/stage2/DE2_Level11';
import DE2_Level12 from './screens/data-engineer/stage2/DE2_Level12';
import DE2_Level13 from './screens/data-engineer/stage2/DE2_Level13';
// ML/AI Engineer Stage 2
import ML2_Level0 from './screens/ml-ai-engineer/stage2/ML2_Level0';
import ML2_Level1 from './screens/ml-ai-engineer/stage2/ML2_Level1';
import ML2_Level2 from './screens/ml-ai-engineer/stage2/ML2_Level2';
import ML2_Level3 from './screens/ml-ai-engineer/stage2/ML2_Level3';
import ML2_Level4 from './screens/ml-ai-engineer/stage2/ML2_Level4';
import ML2_Level5 from './screens/ml-ai-engineer/stage2/ML2_Level5';
import ML2_Level6 from './screens/ml-ai-engineer/stage2/ML2_Level6';
import ML2_Level7 from './screens/ml-ai-engineer/stage2/ML2_Level7';
import ML2_Level8 from './screens/ml-ai-engineer/stage2/ML2_Level8';
import ML2_Level9 from './screens/ml-ai-engineer/stage2/ML2_Level9';
import ML2_Level10 from './screens/ml-ai-engineer/stage2/ML2_Level10';
import ML2_Level11 from './screens/ml-ai-engineer/stage2/ML2_Level11';
import ML2_Level12 from './screens/ml-ai-engineer/stage2/ML2_Level12';
import ML2_Level13 from './screens/ml-ai-engineer/stage2/ML2_Level13';
// Cyber Security Stage 2
import CY2_Level0 from './screens/cyber-security/stage2/CY2_Level0';
import CY2_Level1 from './screens/cyber-security/stage2/CY2_Level1';
import CY2_Level2 from './screens/cyber-security/stage2/CY2_Level2';
import CY2_Level3 from './screens/cyber-security/stage2/CY2_Level3';
import CY2_Level4 from './screens/cyber-security/stage2/CY2_Level4';
import CY2_Level5 from './screens/cyber-security/stage2/CY2_Level5';
import CY2_Level6 from './screens/cyber-security/stage2/CY2_Level6';
import CY2_Level7 from './screens/cyber-security/stage2/CY2_Level7';
import CY2_Level8 from './screens/cyber-security/stage2/CY2_Level8';
import CY2_Level9 from './screens/cyber-security/stage2/CY2_Level9';
import CY2_Level10 from './screens/cyber-security/stage2/CY2_Level10';
import CY2_Level11 from './screens/cyber-security/stage2/CY2_Level11';
import CY2_Level12 from './screens/cyber-security/stage2/CY2_Level12';
import CY2_Level13 from './screens/cyber-security/stage2/CY2_Level13';
// UX/UI Designer Stage 2
import UX2_Level0 from './screens/ux-ui-designer/stage2/UX2_Level0';
import UX2_Level1 from './screens/ux-ui-designer/stage2/UX2_Level1';
import UX2_Level2 from './screens/ux-ui-designer/stage2/UX2_Level2';
import UX2_Level3 from './screens/ux-ui-designer/stage2/UX2_Level3';
import UX2_Level4 from './screens/ux-ui-designer/stage2/UX2_Level4';
import UX2_Level5 from './screens/ux-ui-designer/stage2/UX2_Level5';
import UX2_Level6 from './screens/ux-ui-designer/stage2/UX2_Level6';
import UX2_Level7 from './screens/ux-ui-designer/stage2/UX2_Level7';
import UX2_Level8 from './screens/ux-ui-designer/stage2/UX2_Level8';
import UX2_Level9 from './screens/ux-ui-designer/stage2/UX2_Level9';

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
  if (!user) {
    const next = window.location.pathname + window.location.search;
    return <Navigate to={`/auth?next=${encodeURIComponent(next)}`} replace />;
  }
  return children;
}

const R = ({ children }) => <RequireAuth>{children}</RequireAuth>;

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"              element={<LandingPage />} />
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

      {/* Stage 2.5 — JavaScript Fundamentals (level 0–19) */}
      <Route path="/stage/2.5/level/0"  element={<R><LevelJS_0  /></R>} />
      <Route path="/stage/2.5/level/1"  element={<R><LevelJS_1  /></R>} />
      <Route path="/stage/2.5/level/2"  element={<R><LevelJS_2  /></R>} />
      <Route path="/stage/2.5/level/3"  element={<R><LevelJS_3  /></R>} />
      <Route path="/stage/2.5/level/4"  element={<R><LevelJS_4  /></R>} />
      <Route path="/stage/2.5/level/5"  element={<R><LevelJS_5  /></R>} />
      <Route path="/stage/2.5/level/6"  element={<R><LevelJS_6  /></R>} />
      <Route path="/stage/2.5/level/7"  element={<R><LevelJS_7  /></R>} />
      <Route path="/stage/2.5/level/8"  element={<R><LevelJS_8  /></R>} />
      <Route path="/stage/2.5/level/9"  element={<R><LevelJS_9  /></R>} />
      <Route path="/stage/2.5/level/10" element={<R><LevelJS_10 /></R>} />
      <Route path="/stage/2.5/level/11" element={<R><LevelJS_11 /></R>} />
      <Route path="/stage/2.5/level/12" element={<R><LevelJS_12 /></R>} />
      <Route path="/stage/2.5/level/13" element={<R><LevelJS_13 /></R>} />
      <Route path="/stage/2.5/level/14" element={<R><LevelJS_14 /></R>} />
      <Route path="/stage/2.5/level/15" element={<R><LevelJS_15 /></R>} />
      <Route path="/stage/2.5/level/16" element={<R><LevelJS_16 /></R>} />
      <Route path="/stage/2.5/level/17" element={<R><LevelJS_17 /></R>} />
      <Route path="/stage/2.5/level/18" element={<R><LevelJS_18 /></R>} />
      <Route path="/stage/2.5/level/19" element={<R><LevelJS_19 /></R>} />

      {/* Stage 3 — all 16 levels */}
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

      <Route path="/stage/5/level/0"  element={<R><Level5_0  /></R>} />
      <Route path="/stage/5/level/1"  element={<R><Level5_1  /></R>} />
      <Route path="/stage/5/level/2"  element={<R><Level5_2  /></R>} />
      <Route path="/stage/5/level/3"  element={<R><Level5_3  /></R>} />
      <Route path="/stage/5/level/4"  element={<R><Level5_4  /></R>} />
      <Route path="/stage/5/level/5"  element={<R><Level5_5  /></R>} />
      <Route path="/stage/5/level/6"  element={<R><Level5_6  /></R>} />
      <Route path="/stage/5/level/7"  element={<R><Level5_7  /></R>} />
      <Route path="/stage/5/level/8"  element={<R><Level5_8  /></R>} />
      <Route path="/stage/5/level/9"  element={<R><Level5_9  /></R>} />
      <Route path="/stage/5/level/10" element={<R><Level5_10 /></R>} />
      <Route path="/stage/5/level/11" element={<R><Level5_11 /></R>} />
      <Route path="/stage/5/level/12" element={<R><Level5_12 /></R>} />
      <Route path="/stage/5/level/13" element={<R><Level5_13 /></R>} />
      <Route path="/stage/5/level/14" element={<R><Level5_14 /></R>} />
      <Route path="/stage/5/level/15" element={<R><Level5_15 /></R>} />
      <Route path="/stage/5/level/16" element={<R><Level5_16 /></R>} />
      <Route path="/stage/5/level/17" element={<R><Level5_17 /></R>} />
      <Route path="/stage/5/level/18" element={<R><Level5_18 /></R>} />
      <Route path="/stage/5/level/19" element={<R><Level5_19 /></R>} />
      <Route path="/stage/5/level/20" element={<R><Level5_20 /></R>} />
      <Route path="/stage/5/level/21" element={<R><Level5_21 /></R>} />

      <Route path="/stage/6/level/0"  element={<R><Level6_0  /></R>} />
      <Route path="/stage/6/level/1"  element={<R><Level6_1  /></R>} />
      <Route path="/stage/6/level/2"  element={<R><Level6_2  /></R>} />
      <Route path="/stage/6/level/3"  element={<R><Level6_3  /></R>} />
      <Route path="/stage/6/level/4"  element={<R><Level6_4  /></R>} />
      <Route path="/stage/6/level/5"  element={<R><Level6_5  /></R>} />
      <Route path="/stage/6/level/6"  element={<R><Level6_6  /></R>} />
      <Route path="/stage/6/level/7"  element={<R><Level6_7  /></R>} />
      <Route path="/stage/6/level/8"  element={<R><Level6_8  /></R>} />
      <Route path="/stage/6/level/9"  element={<R><Level6_9  /></R>} />
      <Route path="/stage/6/level/10" element={<R><Level6_10 /></R>} />
      <Route path="/stage/6/level/11" element={<R><Level6_11 /></R>} />
      <Route path="/stage/6/level/12" element={<R><Level6_12 /></R>} />
      <Route path="/stage/6/level/13" element={<R><Level6_13 /></R>} />

      <Route path="/stage/7/level/0"  element={<R><Level7_0  /></R>} />
      <Route path="/stage/7/level/1"  element={<R><Level7_1  /></R>} />
      <Route path="/stage/7/level/2"  element={<R><Level7_2  /></R>} />
      <Route path="/stage/7/level/3"  element={<R><Level7_3  /></R>} />
      <Route path="/stage/7/level/4"  element={<R><Level7_4  /></R>} />
      <Route path="/stage/7/level/5"  element={<R><Level7_5  /></R>} />
      <Route path="/stage/7/level/6"  element={<R><Level7_6  /></R>} />
      <Route path="/stage/7/level/7"  element={<R><Level7_7  /></R>} />
      <Route path="/stage/7/level/8"  element={<R><Level7_8  /></R>} />
      <Route path="/stage/7/level/9"  element={<R><Level7_9  /></R>} />
      <Route path="/stage/7/level/10" element={<R><Level7_10 /></R>} />
      <Route path="/stage/7/level/11" element={<R><Level7_11 /></R>} />

      {/* ── Data Engineer ── */}
      <Route path="/path/data-engineer/stage/1/level/0" element={<R><DE1_Level0 /></R>} />
      <Route path="/path/data-engineer/stage/1/level/1" element={<R><DE1_Level1 /></R>} />
      <Route path="/path/data-engineer/stage/1/level/2" element={<R><DE1_Level2 /></R>} />
      <Route path="/path/data-engineer/stage/1/level/3" element={<R><DE1_Level3 /></R>} />
      <Route path="/path/data-engineer/stage/1/level/4" element={<R><DE1_Level4 /></R>} />
      <Route path="/path/data-engineer/stage/1/level/5" element={<R><DE1_Level5 /></R>} />
      <Route path="/path/data-engineer/stage/1/level/6" element={<R><DE1_Level6 /></R>} />
      <Route path="/path/data-engineer/stage/1/level/7" element={<R><DE1_Level7 /></R>} />

      {/* ── ML/AI Engineer ── */}
      <Route path="/path/ml-ai-engineer/stage/1/level/0" element={<R><ML1_Level0 /></R>} />
      <Route path="/path/ml-ai-engineer/stage/1/level/1" element={<R><ML1_Level1 /></R>} />
      <Route path="/path/ml-ai-engineer/stage/1/level/2" element={<R><ML1_Level2 /></R>} />
      <Route path="/path/ml-ai-engineer/stage/1/level/3" element={<R><ML1_Level3 /></R>} />
      <Route path="/path/ml-ai-engineer/stage/1/level/4" element={<R><ML1_Level4 /></R>} />
      <Route path="/path/ml-ai-engineer/stage/1/level/5" element={<R><ML1_Level5 /></R>} />
      <Route path="/path/ml-ai-engineer/stage/1/level/6" element={<R><ML1_Level6 /></R>} />
      <Route path="/path/ml-ai-engineer/stage/1/level/7" element={<R><ML1_Level7 /></R>} />

      {/* ── Cyber Security ── */}
      <Route path="/path/cyber-security/stage/1/level/0" element={<R><CY1_Level0 /></R>} />
      <Route path="/path/cyber-security/stage/1/level/1" element={<R><CY1_Level1 /></R>} />
      <Route path="/path/cyber-security/stage/1/level/2" element={<R><CY1_Level2 /></R>} />
      <Route path="/path/cyber-security/stage/1/level/3" element={<R><CY1_Level3 /></R>} />
      <Route path="/path/cyber-security/stage/1/level/4" element={<R><CY1_Level4 /></R>} />
      <Route path="/path/cyber-security/stage/1/level/5" element={<R><CY1_Level5 /></R>} />
      <Route path="/path/cyber-security/stage/1/level/6" element={<R><CY1_Level6 /></R>} />
      <Route path="/path/cyber-security/stage/1/level/7" element={<R><CY1_Level7 /></R>} />

      {/* ── UX/UI Designer ── */}
      <Route path="/path/ux-ui-designer/stage/1/level/0" element={<R><UX1_Level0 /></R>} />
      <Route path="/path/ux-ui-designer/stage/1/level/1" element={<R><UX1_Level1 /></R>} />
      <Route path="/path/ux-ui-designer/stage/1/level/2" element={<R><UX1_Level2 /></R>} />
      <Route path="/path/ux-ui-designer/stage/1/level/3" element={<R><UX1_Level3 /></R>} />
      <Route path="/path/ux-ui-designer/stage/1/level/4" element={<R><UX1_Level4 /></R>} />
      <Route path="/path/ux-ui-designer/stage/1/level/5" element={<R><UX1_Level5 /></R>} />
      <Route path="/path/ux-ui-designer/stage/1/level/6" element={<R><UX1_Level6 /></R>} />
      <Route path="/path/ux-ui-designer/stage/1/level/7" element={<R><UX1_Level7 /></R>} />

      {/* ── Stage 2 New Paths ── */}
      {/* Data Engineer Stage 2 */}
      <Route path="/path/data-engineer/stage/2/level/0" element={<R><DE2_Level0 /></R>} />
      <Route path="/path/data-engineer/stage/2/level/1" element={<R><DE2_Level1 /></R>} />
      <Route path="/path/data-engineer/stage/2/level/2" element={<R><DE2_Level2 /></R>} />
      <Route path="/path/data-engineer/stage/2/level/3" element={<R><DE2_Level3 /></R>} />
      <Route path="/path/data-engineer/stage/2/level/4" element={<R><DE2_Level4 /></R>} />
      <Route path="/path/data-engineer/stage/2/level/5" element={<R><DE2_Level5 /></R>} />
      <Route path="/path/data-engineer/stage/2/level/6" element={<R><DE2_Level6 /></R>} />
      <Route path="/path/data-engineer/stage/2/level/7" element={<R><DE2_Level7 /></R>} />
      <Route path="/path/data-engineer/stage/2/level/8" element={<R><DE2_Level8 /></R>} />
      <Route path="/path/data-engineer/stage/2/level/9" element={<R><DE2_Level9 /></R>} />
      <Route path="/path/data-engineer/stage/2/level/10" element={<R><DE2_Level10 /></R>} />
      <Route path="/path/data-engineer/stage/2/level/11" element={<R><DE2_Level11 /></R>} />
      <Route path="/path/data-engineer/stage/2/level/12" element={<R><DE2_Level12 /></R>} />
      <Route path="/path/data-engineer/stage/2/level/13" element={<R><DE2_Level13 /></R>} />
      {/* ML/AI Engineer Stage 2 */}
      <Route path="/path/ml-ai-engineer/stage/2/level/0" element={<R><ML2_Level0 /></R>} />
      <Route path="/path/ml-ai-engineer/stage/2/level/1" element={<R><ML2_Level1 /></R>} />
      <Route path="/path/ml-ai-engineer/stage/2/level/2" element={<R><ML2_Level2 /></R>} />
      <Route path="/path/ml-ai-engineer/stage/2/level/3" element={<R><ML2_Level3 /></R>} />
      <Route path="/path/ml-ai-engineer/stage/2/level/4" element={<R><ML2_Level4 /></R>} />
      <Route path="/path/ml-ai-engineer/stage/2/level/5" element={<R><ML2_Level5 /></R>} />
      <Route path="/path/ml-ai-engineer/stage/2/level/6" element={<R><ML2_Level6 /></R>} />
      <Route path="/path/ml-ai-engineer/stage/2/level/7" element={<R><ML2_Level7 /></R>} />
      <Route path="/path/ml-ai-engineer/stage/2/level/8" element={<R><ML2_Level8 /></R>} />
      <Route path="/path/ml-ai-engineer/stage/2/level/9" element={<R><ML2_Level9 /></R>} />
      <Route path="/path/ml-ai-engineer/stage/2/level/10" element={<R><ML2_Level10 /></R>} />
      <Route path="/path/ml-ai-engineer/stage/2/level/11" element={<R><ML2_Level11 /></R>} />
      <Route path="/path/ml-ai-engineer/stage/2/level/12" element={<R><ML2_Level12 /></R>} />
      <Route path="/path/ml-ai-engineer/stage/2/level/13" element={<R><ML2_Level13 /></R>} />
      {/* Cyber Security Stage 2 */}
      <Route path="/path/cyber-security/stage/2/level/0" element={<R><CY2_Level0 /></R>} />
      <Route path="/path/cyber-security/stage/2/level/1" element={<R><CY2_Level1 /></R>} />
      <Route path="/path/cyber-security/stage/2/level/2" element={<R><CY2_Level2 /></R>} />
      <Route path="/path/cyber-security/stage/2/level/3" element={<R><CY2_Level3 /></R>} />
      <Route path="/path/cyber-security/stage/2/level/4" element={<R><CY2_Level4 /></R>} />
      <Route path="/path/cyber-security/stage/2/level/5" element={<R><CY2_Level5 /></R>} />
      <Route path="/path/cyber-security/stage/2/level/6" element={<R><CY2_Level6 /></R>} />
      <Route path="/path/cyber-security/stage/2/level/7" element={<R><CY2_Level7 /></R>} />
      <Route path="/path/cyber-security/stage/2/level/8" element={<R><CY2_Level8 /></R>} />
      <Route path="/path/cyber-security/stage/2/level/9" element={<R><CY2_Level9 /></R>} />
      <Route path="/path/cyber-security/stage/2/level/10" element={<R><CY2_Level10 /></R>} />
      <Route path="/path/cyber-security/stage/2/level/11" element={<R><CY2_Level11 /></R>} />
      <Route path="/path/cyber-security/stage/2/level/12" element={<R><CY2_Level12 /></R>} />
      <Route path="/path/cyber-security/stage/2/level/13" element={<R><CY2_Level13 /></R>} />
      {/* UX/UI Designer Stage 2 */}
      <Route path="/path/ux-ui-designer/stage/2/level/0" element={<R><UX2_Level0 /></R>} />
      <Route path="/path/ux-ui-designer/stage/2/level/1" element={<R><UX2_Level1 /></R>} />
      <Route path="/path/ux-ui-designer/stage/2/level/2" element={<R><UX2_Level2 /></R>} />
      <Route path="/path/ux-ui-designer/stage/2/level/3" element={<R><UX2_Level3 /></R>} />
      <Route path="/path/ux-ui-designer/stage/2/level/4" element={<R><UX2_Level4 /></R>} />
      <Route path="/path/ux-ui-designer/stage/2/level/5" element={<R><UX2_Level5 /></R>} />
      <Route path="/path/ux-ui-designer/stage/2/level/6" element={<R><UX2_Level6 /></R>} />
      <Route path="/path/ux-ui-designer/stage/2/level/7" element={<R><UX2_Level7 /></R>} />
      <Route path="/path/ux-ui-designer/stage/2/level/8" element={<R><UX2_Level8 /></R>} />
      <Route path="/path/ux-ui-designer/stage/2/level/9" element={<R><UX2_Level9 /></R>} />

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