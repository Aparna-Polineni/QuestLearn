// src/context/GameContext.js
// Updated to support Stage 2.5 (JavaScript Fundamentals) inserted between Stage 2 and Stage 3
// Changes from previous version:
//   1. STAGE_ORDER defines the explicit stage sequence (handles non-integer stage IDs)
//   2. STAGE_LEVEL_COUNTS updated with '2.5': 20
//   3. completeLevel() uses STAGE_ORDER to find next stage — no more stage + 1 arithmetic
//   4. getResumeRoute() iterates STAGE_ORDER so 2.5 is never skipped
//   5. isStageComplete() helper — used by Roadmap to unlock subsequent stages
//   6. Auto-unlock: existing users who completed Stage 2 get Stage 2.5 shown as AVAILABLE
//      (not force-completed — they should still go through it, but it's accessible)

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import careerPaths from '../data/careerPaths';

const GameContext = createContext(null);
const STORAGE_KEY = 'ql_game_v2';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

// ── Stage sequence — explicit order so 2.5 sits correctly ────────────────────
// Use strings for all IDs to avoid floating-point issues (2.5 is safe but 2.50 !== 2.5 etc.)
const STAGE_ORDER = ['1', '2', '2.5', '3', '4', '5', '6', '7', '8'];

// New career path stage orders (keyed by path id)
const PATH_STAGE_ORDERS = {
  'data-engineer':  ['1','2','3','4','5','6','7'],
  'ml-ai-engineer': ['1','2','3','4','5','6','7','8'],
  'cyber-security': ['1','2','3','4','5','6','7'],
  'ux-ui-designer': ['1','2','3','4','5','6','7'],
};

// New path level counts per stage
const PATH_LEVEL_COUNTS = {
  'data-engineer':  { '1':8,  '2':14, '3':14, '4':12, '5':12, '6':12, '7':12 },
  'ml-ai-engineer': { '1':8,  '2':14, '3':16, '4':16, '5':18, '6':16, '7':12, '8':12 },
  'cyber-security': { '1':8,  '2':14, '3':12, '4':14, '5':12, '6':12, '7':12 },
  'ux-ui-designer': { '1':8,  '2':10, '3':10, '4':10, '5':10, '6':10, '7':12 },
};

// ── Route URL helpers ────────────────────────────────────────────────────────
// Legacy paths use /stage/{n}/level/{l}
// New paths use /path/{pathId}/stage/{n}/level/{l}
const LEGACY_PATH_IDS = new Set(['java-fullstack', 'frontend-react', 'math-student']);

function makeRouteUrl(pathId, stageId, levelIdx) {
  if (!pathId || LEGACY_PATH_IDS.has(pathId)) {
    return `/stage/${stageId}/level/${levelIdx}`;
  }
  return `/path/${pathId}/stage/${stageId}/level/${levelIdx}`;
}

// Level key prefix for new paths — keeps progress isolated per path
const PATH_KEY_PREFIXES = {
  'data-engineer':  'de',
  'ml-ai-engineer': 'ml',
  'cyber-security': 'cy',
  'ux-ui-designer': 'ux',
};

// Level key prefix per path (new paths use path-prefixed keys)
const PATH_KEY_PREFIX = {
  'data-engineer':  'de',
  'ml-ai-engineer': 'ml',
  'cyber-security': 'cy',
  'ux-ui-designer': 'ux',
};

const STAGE_LEVEL_COUNTS = {
  '1':   8,
  '2':   20,
  '2.5': 20,   // ← Stage 2.5 JavaScript (20 levels, JS.0 – JS.19)
  '3':   16,
  '4':   16,
  '5':   22,
  '6':   14,
  '7':   12,
  '8':   10,
};

// ── Helper: get the next stage ID in the sequence ────────────────────────────
function getNextStageId(currentStageId) {
  const key = String(currentStageId);
  const idx = STAGE_ORDER.indexOf(key);
  if (idx === -1 || idx === STAGE_ORDER.length - 1) return null;
  return STAGE_ORDER[idx + 1];
}

// ── Helper: level key format ─────────────────────────────────────────────────
// Stage 2.5 levels are stored as "2.5-0" through "2.5-19"
// All other stages: "1-0" through "8-10" etc.
function makeLevelKey(stageId, levelId, pathId) {
  const prefix = pathId ? PATH_KEY_PREFIXES[pathId] : null;
  if (prefix) return `${prefix}-${stageId}-${levelId}`;
  return `${stageId}-${levelId}`;
}

export function GameProvider({ children }) {
  const [activePath,  setActivePath]  = useState(null);
  const [allPaths,    setAllPaths]    = useState({});
  const [synced,      setSynced]      = useState(false);

  // ── On mount: restore localStorage, then sync backend ────────────────────
  useEffect(() => {
    const saved = load();
    if (saved.activePath) {
      const livePath = careerPaths.find(p => p.id === saved.activePath.id);
      setActivePath(livePath || saved.activePath);
    }
    if (saved.allPaths) setAllPaths(saved.allPaths);

    if (api.isLoggedIn()) {
      api.getProgress()
        .then(progress => {
          if (progress.completedLevels && progress.completedLevels.length > 0) {
            setAllPaths(prev => {
              const updated = { ...prev };
              const backendCompleted = {};
              progress.completedLevels.forEach(l => {
                backendCompleted[`${l.stage}-${l.levelId}`] = {
                  completedAt: l.completedAt,
                  xpEarned:    l.xpEarned,
                };
              });
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
        .catch(() => { setSynced(true); });
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
    if (api.isLoggedIn()) {
      api.updateProfile({
        domainName:  domain?.name,
        domainColor: domain?.color,
        careerPath:  activePath?.id,
      }).catch(() => {});
    }
  }

  const selectedDomain = activePath ? getPathData(activePath.id).domain : null;

  // ── isStageComplete ───────────────────────────────────────────────────────
  // Returns true if ALL levels in the given stage are completed
  function isStageComplete(stageId) {
    if (!activePath) return false;
    const key    = String(stageId);
    const pathId = activePath.id;
    const pathCounts = PATH_LEVEL_COUNTS[pathId] || {};
    const max    = pathCounts[key] || STAGE_LEVEL_COUNTS[key] || 0;
    const { completedLevels } = getPathData(pathId);
    for (let l = 0; l < max; l++) {
      if (!completedLevels[makeLevelKey(key, l, pathId)]) return false;
    }
    return max > 0;
  }

  // ── isStageUnlocked ───────────────────────────────────────────────────────
  // Rules (in priority order):
  //   1. Stage 1 is always unlocked.
  //   2. If the user already has ANY progress in this stage, never lock it
  //      (no regression — protects existing users after curriculum changes).
  //   3. Stage 2.5 special case: unlock if Stage 2 complete OR user has
  //      Stage 3 progress (pre-dates 2.5 insertion).
  //   4. Stage 3 special case: unlock if 2.5 complete OR Stage 2 complete
  //      OR user already started Stage 3 (legacy path).
  //   5. All other stages: unlock when previous stage reaches 80% complete.
  function isStageUnlocked(stageId) {
    const key = String(stageId);
    if (key === '1') return true;

    const idx = STAGE_ORDER.indexOf(key);
    if (idx <= 0) return true;

    // Rule 2 — retroactive: never lock a stage the user has already started
    if (getStageProgress(key) > 0) return true;

    const prevStageId = STAGE_ORDER[idx - 1];

    // Rule 3 — Stage 2.5 special case (inserted after some users completed Stage 2)
    if (key === '2.5') {
      return isStageComplete('2') || getStageProgress('3') > 0;
    }

    // Rule 4 — Stage 3 special case (legacy users who predate Stage 2.5)
    if (key === '3') {
      return isStageComplete('2.5') || isStageComplete('2') || getStageProgress('3') > 0;
    }

    // Rule 5 — general: unlock at 80% of previous stage
    const prevMax  = STAGE_LEVEL_COUNTS[prevStageId] || 0;
    const prevDone = getStageProgress(prevStageId);
    const threshold = Math.ceil(prevMax * 0.8);
    return prevDone >= threshold;
  }

  // ── completeLevel ─────────────────────────────────────────────────────────
  // levelKey format: "2.5-7" for Stage 2.5 Level 7, "3-0" for Stage 3 Level 0
  function completeLevel(levelKey, meta = {}) {
    if (!activePath) return;
    const pathData = getPathData(activePath.id);
    if (pathData.completedLevels[levelKey]) return; // already done

    // Parse the key — stage ID may contain a dot (e.g. "2.5")
    // Parse levelKey — handles both legacy ('2.5-7') and new path ('de-1-0') formats
    let parseKey = levelKey;
    const knownPrefixes = ['de-', 'ml-', 'cy-', 'ux-'];
    for (const p of knownPrefixes) {
      if (levelKey.startsWith(p)) {
        parseKey = levelKey.slice(p.length); // strip prefix: 'de-1-0' → '1-0'
        break;
      }
    }
    const dashIdx  = parseKey.indexOf('-');
    const stageId  = parseKey.substring(0, dashIdx);          // "1" or "2.5"
    const levelId  = parseInt(parseKey.substring(dashIdx + 1)); // 0

    // Find the next route using STAGE_ORDER (no arithmetic — handles "2.5" cleanly)
    const pathId  = activePath?.id;
    const stageMax = STAGE_LEVEL_COUNTS[stageId] || 8;
    let nextRoute;
    if (levelId < stageMax - 1) {
      // More levels in this stage
      nextRoute = makeRouteUrl(pathId, stageId, levelId + 1);
    } else {
      // Last level of this stage — go to first level of next stage
      const nextStageId = getNextStageId(stageId);
      nextRoute = nextStageId
        ? makeRouteUrl(pathId, nextStageId, 0)
        : '/roadmap';
    }

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

    // Sync to backend
    if (api.isLoggedIn()) {
      api.completeLevel(stageId, levelId, {
        timeTakenSeconds: meta.timeTaken || null,
        attempts:         meta.attempts  || 1,
      }).catch(() => {});
    }
  }

  function isLevelComplete(levelKey) {
    if (!activePath) return false;
    return !!getPathData(activePath.id).completedLevels[levelKey];
  }

  function getStageProgress(stageId) {
    if (!activePath) return 0;
    const key    = String(stageId);
    const pathId = activePath.id;
    const prefix = PATH_KEY_PREFIXES[pathId];
    const { completedLevels } = getPathData(pathId);
    if (prefix) {
      // New path: keys look like 'de-1-0' — match prefix + stage
      return Object.keys(completedLevels)
        .filter(k => k.startsWith(`${prefix}-${key}-`)).length;
    }
    // Legacy path: keys look like '1-0', '2.5-3'
    return Object.keys(completedLevels).filter(k => k.startsWith(`${key}-`)).length;
  }

  // ── getResumeRoute ────────────────────────────────────────────────────────
  // Iterates STAGE_ORDER so Stage 2.5 is never skipped
  function getResumeRoute(pathId) {
    const data = getPathData(pathId);
    if (data.lastRoute) return data.lastRoute;

    // Use the path's own stage order if it's a new path
    const pathStageOrder = PATH_STAGE_ORDERS[pathId] || STAGE_ORDER;
    const pathLevelCounts = PATH_LEVEL_COUNTS[pathId] || STAGE_LEVEL_COUNTS;

    for (const stageId of pathStageOrder) {
      const max = pathLevelCounts[stageId] || STAGE_LEVEL_COUNTS[stageId] || 8;
      for (let l = 0; l < max; l++) {
        if (!data.completedLevels[makeLevelKey(stageId, l)]) {
          return makeRouteUrl(pathId, stageId, l);
        }
      }
    }
    return makeRouteUrl(pathId, '1', 0);
  }

  const totalXpAllPaths = Object.values(allPaths).reduce((sum, p) => sum + (p.xp || 0), 0);
  const activePathData  = activePath ? getPathData(activePath.id) : {};
  const completedLevels = activePathData.completedLevels || {};
  const xp              = activePathData.xp     || 0;
  const streak          = activePathData.streak  || 0;

  return (
    <GameContext.Provider value={{
      activePath,        setActivePath,
      allPaths,          synced,
      selectedDomain,    setSelectedDomain,
      completedLevels,   xp, streak, totalXpAllPaths,
      completeLevel,     isLevelComplete,
      getStageProgress,  isStageComplete, isStageUnlocked,
      getResumeRoute,    getPathData,
      // Legacy alias
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