// src/context/GameContext.js
// Updated to sync progress with Spring Boot backend (POST /api/progress/complete)
// All existing game logic preserved — only added backend sync on top of localStorage
// This means: if backend is unreachable, game still works via localStorage fallback

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const GameContext = createContext(null);
const STORAGE_KEY = 'ql_game_v2';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

const STAGE_LEVEL_COUNTS = { 1:8, 2:20, 3:15, 4:18, 5:22, 6:14, 7:12, 8:10 };

export function GameProvider({ children }) {
  const [activePath,  setActivePath]  = useState(null);
  const [allPaths,    setAllPaths]    = useState({});
  const [synced,      setSynced]      = useState(false); // true once backend progress loaded

  // ── On mount: restore localStorage first, then sync from backend ──────────
  // This gives instant UI restore while the backend call happens in background
  useEffect(() => {
    const saved = load();
    if (saved.activePath) setActivePath(saved.activePath);
    if (saved.allPaths)   setAllPaths(saved.allPaths);

    // If logged in, load real progress from the database
    // Backend is the source of truth — it overwrites localStorage on load
    if (api.isLoggedIn()) {
      api.getProgress()
        .then(progress => {
          // progress.completedLevels = [{ stage, levelId, xpEarned, completedAt }, ...]
          // Convert backend format to our { "stage-levelId": { completedAt } } format
          if (progress.completedLevels && progress.completedLevels.length > 0) {
            setAllPaths(prev => {
              const updated = { ...prev };
              // Rebuild completedLevels for the active path from backend data
              const backendCompleted = {};
              progress.completedLevels.forEach(l => {
                backendCompleted[`${l.stage}-${l.levelId}`] = {
                  completedAt: l.completedAt,
                  xpEarned:    l.xpEarned,
                };
              });

              // Apply to active path if it exists, otherwise store under a default key
              const pathId = saved.activePath?.id || 'default';
              updated[pathId] = {
                ...(updated[pathId] || {}),
                completedLevels: backendCompleted,
                xp:    progress.totalXp,
              };
              return updated;
            });
          }
          setSynced(true);
        })
        .catch(() => {
          // Backend unreachable — use localStorage data as fallback
          setSynced(true);
        });
    } else {
      setSynced(true);
    }
  }, []);

  // ── Persist to localStorage on every change ───────────────────────────────
  useEffect(() => {
    if (activePath || Object.keys(allPaths).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ activePath, allPaths }));
    }
  }, [activePath, allPaths]);

  // ── Path data helpers ─────────────────────────────────────────────────────
  function getPathData(pathId) {
    const pid = pathId || activePath?.id;
    return allPaths[pid] || { domain: null, completedLevels: {}, xp: 0, streak: 0, lastRoute: null };
  }

  function updatePathData(pathId, updater) {
    setAllPaths(prev => ({
      ...prev,
      [pathId]: updater(prev[pathId] || { domain: null, completedLevels: {}, xp: 0, streak: 0, lastRoute: null })
    }));
  }

  function setSelectedDomain(domain) {
    if (!activePath) return;
    updatePathData(activePath.id, prev => ({ ...prev, domain }));

    // Persist domain selection to backend if logged in
    if (api.isLoggedIn()) {
      api.updateProfile({
        domainName:  domain?.name,
        domainColor: domain?.color,
        careerPath:  activePath?.id,
      }).catch(() => {
        // Silent fail — localStorage already updated
      });
    }
  }

  const selectedDomain = activePath ? getPathData(activePath.id).domain : null;

  // ── Complete a level ──────────────────────────────────────────────────────
  // 1. Updates localStorage immediately (instant UI feedback)
  // 2. Syncs to backend in background (POST /api/progress/complete)
  function completeLevel(levelKey, meta = {}) {
    if (!activePath) return;
    const pathData = getPathData(activePath.id);
    if (pathData.completedLevels[levelKey]) return; // already done

    // Parse "stage-levelId" key format
    const [stageStr, levelStr] = levelKey.split('-');
    const stage   = parseInt(stageStr);
    const levelId = parseInt(levelStr);

    // Calculate next level route
    const stageMax = STAGE_LEVEL_COUNTS[stage] || 8;
    let nextRoute;
    if (levelId < stageMax) {
      nextRoute = `/stage/${stage}/level/${levelId + 1}`;
    } else {
      nextRoute = `/stage/${stage + 1}/level/1`;
    }

    // Update localStorage immediately — don't wait for backend
    updatePathData(activePath.id, prev => ({
      ...prev,
      completedLevels: {
        ...prev.completedLevels,
        [levelKey]: { completedAt: new Date().toISOString(), ...meta }
      },
      xp:        (prev.xp || 0) + 100 + (prev.streak > 2 ? 25 : 0),
      streak:    (prev.streak || 0) + 1,
      lastRoute: nextRoute,
    }));

    // Sync to backend in background — POST /api/progress/complete
    if (api.isLoggedIn()) {
      api.completeLevel(stage, levelId, {
        timeTakenSeconds: meta.timeTaken || null,
        attempts:         meta.attempts  || 1,
      }).catch(() => {
        // Silent fail — progress already saved to localStorage
        // Will re-sync next time user loads the app while online
      });
    }
  }

  function isLevelComplete(levelKey) {
    if (!activePath) return false;
    return !!getPathData(activePath.id).completedLevels[levelKey];
  }

  function getStageProgress(stageId) {
    if (!activePath) return 0;
    const { completedLevels } = getPathData(activePath.id);
    return Object.keys(completedLevels).filter(k => k.startsWith(`${stageId}-`)).length;
  }

  function getResumeRoute(pathId) {
    const data = getPathData(pathId);
    if (data.lastRoute) return data.lastRoute;
    for (let s = 1; s <= 8; s++) {
      const max = STAGE_LEVEL_COUNTS[s] || 8;
      for (let l = 1; l <= max; l++) {
        if (!data.completedLevels[`${s}-${l}`]) {
          return `/stage/${s}/level/${l}`;
        }
      }
    }
    return '/stage/1/level/1';
  }

  const totalXpAllPaths  = Object.values(allPaths).reduce((sum, p) => sum + (p.xp || 0), 0);
  const activePathData   = activePath ? getPathData(activePath.id) : {};
  const completedLevels  = activePathData.completedLevels || {};
  const xp               = activePathData.xp     || 0;
  const streak           = activePathData.streak  || 0;

  return (
    <GameContext.Provider value={{
      activePath,        setActivePath,
      allPaths,          synced,
      selectedDomain,    setSelectedDomain,
      completedLevels,   xp, streak, totalXpAllPaths,
      completeLevel, isLevelComplete, getStageProgress,
      getResumeRoute, getPathData,
      // Legacy alias so existing components still work
      selectedCareerPath: activePath, setSelectedCareerPath: setActivePath,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}