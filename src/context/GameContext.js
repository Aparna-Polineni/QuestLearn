// src/context/GameContext.js
// Multi-path progress — each career path has its own completedLevels, domain, xp
// activePath = the path currently being played
// allPaths   = { [pathId]: { domain, completedLevels, xp, streak, lastLevel } }

import { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext(null);
const STORAGE_KEY = 'ql_game_v2';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

const STAGE_LEVEL_COUNTS = { 1:8, 2:20, 3:15, 4:18, 5:22, 6:14, 7:12, 8:10 };

export function GameProvider({ children }) {
  const [activePath,  setActivePath]  = useState(null);   // careerPath object
  const [allPaths,    setAllPaths]    = useState({});      // { pathId: { domain, completedLevels, xp, streak, lastRoute } }

  // Restore on mount
  useEffect(() => {
    const saved = load();
    if (saved.activePath) setActivePath(saved.activePath);
    if (saved.allPaths)   setAllPaths(saved.allPaths);
  }, []);

  // Persist on every change
  useEffect(() => {
    if (activePath || Object.keys(allPaths).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ activePath, allPaths }));
    }
  }, [activePath, allPaths]);

  // Helpers to get current path's data
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

  // Set domain for current active path
  function setSelectedDomain(domain) {
    if (!activePath) return;
    updatePathData(activePath.id, prev => ({ ...prev, domain }));
  }

  // Get domain for active path
  const selectedDomain = activePath ? getPathData(activePath.id).domain : null;

  function completeLevel(levelKey, meta = {}) {
    if (!activePath) return;
    const pathData = getPathData(activePath.id);
    if (pathData.completedLevels[levelKey]) return;

    // Calculate next level route
    const [stageStr, levelStr] = levelKey.split('-');
    const stage = parseInt(stageStr);
    const level = parseInt(levelStr);
    const stageMax = STAGE_LEVEL_COUNTS[stage] || 8;
    let nextRoute;
    if (level < stageMax) {
      nextRoute = `/stage/${stage}/level/${level + 1}`;
    } else {
      nextRoute = `/stage/${stage + 1}/level/1`;
    }

    updatePathData(activePath.id, prev => ({
      ...prev,
      completedLevels: { ...prev.completedLevels, [levelKey]: { completedAt: new Date().toISOString(), ...meta } },
      xp:              (prev.xp || 0) + 100 + (prev.streak > 2 ? 25 : 0),
      streak:          (prev.streak || 0) + 1,
      lastRoute:       nextRoute,
    }));
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

  // Get next level to play for a given path (resume point)
  function getResumeRoute(pathId) {
    const data = getPathData(pathId);
    if (data.lastRoute) return data.lastRoute;
    // Find first incomplete level
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

  // Get total completed across all paths
  const totalXpAllPaths = Object.values(allPaths).reduce((sum, p) => sum + (p.xp || 0), 0);

  // Active path shortcut values
  const activePathData = activePath ? getPathData(activePath.id) : {};
  const completedLevels = activePathData.completedLevels || {};
  const xp     = activePathData.xp     || 0;
  const streak = activePathData.streak  || 0;

  return (
    <GameContext.Provider value={{
      activePath,        setActivePath,
      allPaths,
      selectedDomain,    setSelectedDomain,
      completedLevels,   xp, streak, totalXpAllPaths,
      completeLevel, isLevelComplete, getStageProgress,
      getResumeRoute, getPathData,
      // Legacy alias so old code still works
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