// src/screens/Roadmap.jsx
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import './Roadmap.css';

// ── Stage route map — keyed by STRING id ─────────────────────────────────────
// Paths that use the old /stage/{n}/level/ URL pattern
const LEGACY_PATH_IDS = new Set(['java-fullstack', 'frontend-react', 'math-student']);

// Build stage routes dynamically based on the active career path
function buildStageRoutes(path) {
  if (!path) return {};
  const routes = {};
  const isLegacy = LEGACY_PATH_IDS.has(path.id);
  (path.stages || []).forEach(s => {
    const sid = String(s.id);
    const base = isLegacy
      ? `/stage/${sid}/level/`
      : `/path/${path.id}/stage/${sid}/level/`;
    routes[sid] = { base, levels: s.levels || 8 };
  });
  // Always include 2.5 for java-fullstack legacy path
  if (isLegacy && !routes['2.5']) {
    routes['2.5'] = { base: '/stage/2.5/level/', levels: 20 };
  }
  return routes;
}

// Level key prefix per path — new paths use prefixed keys (e.g. 'de-1-0')
function getLevelKey(pathId, stageId, levelIdx) {
  const prefixMap = {
    'data-engineer':  'de',
    'ml-ai-engineer': 'ml',
    'cyber-security': 'cy',
    'ux-ui-designer': 'ux',
  };
  const prefix = prefixMap[pathId];
  if (prefix) return `${prefix}-${stageId}-${levelIdx}`;
  return `${stageId}-${levelIdx}`; // legacy format
}

// Explicit stage order — no arithmetic, handles '2.5' cleanly
const STAGE_ORDER = ['1', '2', '2.5', '3', '4', '5', '6', '7', '8'];

// ── Level dot ────────────────────────────────────────────────────────────────
function LevelDot({ stageId, levelNum, isComplete, isCurrent, isLocked, onClick }) {
  return (
    <button
      className={[
        'level-dot',
        isComplete ? 'dot-complete' : '',
        isCurrent  ? 'dot-current'  : '',
        isLocked   ? 'dot-locked'   : '',
        !isLocked && !isComplete && !isCurrent ? 'dot-available' : '',
      ].join(' ')}
      onClick={!isLocked ? onClick : undefined}
      disabled={isLocked}
      title={`Level ${stageId}.${levelNum}`}
    >
      {isComplete ? '✓' : levelNum}
    </button>
  );
}

// ── Stage card ───────────────────────────────────────────────────────────────
function StageCard({ stage, stageRoute, isLevelComplete, isStageUnlocked, navigate, currentStageId, currentLevel, levelKey, isFirstStage, totalCompleted }) {
  const sid         = String(stage.id);
  const totalLevels = stageRoute?.levels || stage.levels || 8;

  // Count completed levels (0-indexed keys: "2.5-0" through "2.5-19")
  const completedCount = Array.from({ length: totalLevels }, (_, i) =>
    isLevelComplete(levelKey(sid, i))
  ).filter(Boolean).length;

  const progressPct     = Math.round((completedCount / totalLevels) * 100);
  const isComplete      = completedCount === totalLevels;
  const isStarted       = completedCount > 0;

  // Use GameContext's single source of truth for unlock state
  const isStageLocked = !isStageUnlocked(sid);

  const isCurrent = String(currentStageId) === sid;

  return (
    <div
      className={[
        'stage-card',
        isComplete  ? 'stage-complete' : '',
        isStarted   ? 'stage-started'  : '',
        isStageLocked ? 'stage-locked' : '',
        isCurrent   ? 'stage-current'  : '',
        sid === '2.5' ? 'stage-js'    : '',
      ].join(' ')}
      style={{ '--stage-color': stage.color }}
    >
      {/* Header */}
      <div className="stage-card-header">
        <div className="stage-card-left">
          <span className="stage-card-emoji">{stage.emoji}</span>
          <div>
            <div className="stage-card-num">
              Stage {sid}
              {sid === '2.5' && <span className="stage-new-badge">NEW</span>}
            </div>
            <div className="stage-card-title">{stage.title}</div>
          </div>
        </div>
        <div className="stage-card-right">
          {isComplete   && <span className="stage-complete-badge">✓ Done</span>}
          {isStageLocked && <span className="stage-locked-badge">🔒</span>}
          {!isStageLocked && !isComplete && (
            <span className="stage-progress-pct">{progressPct}%</span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="stage-progress-bar">
        <div className="stage-progress-fill" style={{ width: `${progressPct}%`, background: stage.color }} />
      </div>

      <div className="stage-desc">{stage.description}</div>

      {/* START HERE indicator — only on Stage 1 when user has zero progress */}
      {isFirstStage && totalCompleted === 0 && (
        <div className="stage-start-here">
          <span className="stage-start-arrow">↓ Start here</span>
          <span className="stage-start-time">⏱ About 20 minutes</span>
        </div>
      )}

      {/* Time estimate for started-but-not-complete stage 1 */}
      {isFirstStage && totalCompleted > 0 && !isComplete && (
        <div className="stage-time-hint">⏱ About 20 minutes for this stage</div>
      )}

      {/* Level dots */}
      {!isStageLocked && (
        <div className="stage-level-dots">
          {Array.from({ length: totalLevels }, (_, i) => {
            const isLvlComplete = isLevelComplete(levelKey(sid, i));
            const isLvlCurrent  = isCurrent && currentLevel === i;
            const isLvlLocked   = i > 0 && !isLevelComplete(levelKey(sid, i - 1)) && !isLvlComplete;
            return (
              <LevelDot
                key={i}
                stageId={sid}
                levelNum={i}
                isComplete={isLvlComplete}
                isCurrent={isLvlCurrent}
                isLocked={isLvlLocked}
                onClick={() => stageRoute && navigate(`${stageRoute.base}${i}`)}
              />
            );
          })}
        </div>
      )}

      {isStageLocked && (
        <div className="stage-locked-msg">
          Complete the previous stage to unlock
        </div>
      )}

      {/* Start / Continue button when unlocked */}
      {!isStageLocked && (
        <button
          className="stage-go-btn"
          style={{ background: stage.color }}
          onClick={() => navigate(`${stageRoute.base}${completedCount < totalLevels ? completedCount : 0}`)}
        >
          {isComplete ? '↺ Review' : isStarted ? `Continue → Level ${completedCount}` : 'Start →'}
        </button>
      )}

      <div className="stage-count">{completedCount}/{totalLevels} levels complete</div>
    </div>
  );
}

// ── Roadmap banner for existing users who skipped 2.5 ────────────────────────
function Stage25Banner({ navigate, isLevelComplete, stage25Route }) {
  const route       = stage25Route || { base: '/stage/2.5/level/', levels: 20 };
  const totalLevels = route.levels;
  const done = Array.from({ length: totalLevels }, (_, i) =>
    isLevelComplete(`2.5-${i}`)
  ).filter(Boolean).length;

  const hasStage3Progress = Array.from({ length: 16 }, (_, i) =>
    isLevelComplete(`3-${i}`)
  ).some(Boolean);

  const isComplete = done === totalLevels;

  // Only show if user has stage 3 progress but hasn't finished 2.5
  if (isComplete || !hasStage3Progress) return null;

  const pct = Math.round((done / totalLevels) * 100);

  return (
    <div className="s25-banner">
      <div className="s25-banner-icon">⚡</div>
      <div className="s25-banner-body">
        <div className="s25-banner-title">
          New stage added: <span className="s25-banner-hl">Stage 2.5 — JavaScript Fundamentals</span>
        </div>
        <div className="s25-banner-sub">
          {done === 0
            ? "We added this between Stage 2 and Stage 3. It covers the JS that React is built on — arrow functions, array methods, async/await, closures. 20 levels, your pace."
            : `You're ${pct}% through — ${totalLevels - done} levels left.`
          }
        </div>
        {done > 0 && (
          <div className="s25-banner-progress">
            <div className="s25-banner-bar">
              <div className="s25-banner-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="s25-banner-pct">{pct}%</span>
          </div>
        )}
      </div>
      <button className="s25-banner-btn" onClick={() => navigate(`/stage/2.5/level/${done}`)}>
        {done === 0 ? 'Start JS Stage →' : 'Continue →'}
      </button>
    </div>
  );
}

// ── Main Roadmap ──────────────────────────────────────────────────────────────
export default function Roadmap() {
  const navigate = useNavigate();
  const { selectedCareerPath, selectedDomain, completedLevels, xp, streak, isLevelComplete, isStageUnlocked } = useGame();
  const { user } = useAuth();

  const path   = selectedCareerPath;

  // Build dynamic stage routes based on active path
  const STAGE_ROUTES = buildStageRoutes(path);

  // Helper: get the correct level key for this path
  const levelKey = (stageId, levelIdx) =>
    getLevelKey(path?.id || 'java-fullstack', stageId, levelIdx);

  // Build stages list — inject 2.5 between 2 and 3 if not already present
  const rawStages = path?.stages || [];
  const stages = [];
  let inserted = false;
  for (const s of rawStages) {
    stages.push(s);
    if (String(s.id) === '2' && !inserted) {
      // Check if 2.5 is already in the list
      const already = rawStages.some(x => String(x.id) === '2.5');
      if (!already) {
        stages.push({
          id: '2.5',
          title: 'JavaScript Fundamentals',
          description: 'Arrow functions, destructuring, async/await, closures, DOM, modules — the JS that powers React.',
          emoji: '⚡',
          color: '#f59e0b',
          levels: 20,
        });
      }
      inserted = true;
    }
  }
  // If path has no stages at all, use a default set
  const displayStages = stages.length > 0 ? stages : [];

  // Determine current position — iterate STAGE_ORDER so 2.5 is included
  const totalCompleted = Object.keys(completedLevels).length;
  let currentStageId = '1';
  let currentLevel   = 0;

  // Use the active path's stage list for iteration (not hardcoded STAGE_ORDER)
  const activeStageIds = displayStages.map(s => String(s.id));
  for (const sid of activeStageIds) {
    const max = STAGE_ROUTES[sid]?.levels || 8;
    let stageFullyDone = true;
    for (let l = 0; l < max; l++) {
      if (!isLevelComplete(levelKey(sid, l))) {
        currentStageId = sid;
        currentLevel   = l;
        stageFullyDone = false;
        break;
      }
    }
    if (!stageFullyDone) break;
  }

  const totalLevels = displayStages.reduce((s, stage) => s + (stage.levels || 8), 0);
  const overallPct  = Math.round((totalCompleted / totalLevels) * 100);

  return (
    <div className="roadmap-screen">
      <div className="roadmap-bg-orb orb-a" />
      <div className="roadmap-bg-orb orb-b" />

      {/* Top nav */}
      <div className="roadmap-nav">
        <button className="roadmap-back" onClick={() => navigate(-1)}>← Back</button>
        <div className="roadmap-logo">◈ QuestLearn</div>
        <div className="roadmap-nav-right">
          {user && (
            <span className="roadmap-user">
              {user.name || user.user_metadata?.name || user.email?.split('@')[0]}
            </span>
          )}
        </div>
      </div>

      <div className="roadmap-content">

        {/* Hero */}
        <div className="roadmap-hero">
          <div className="roadmap-path-tag">
            {path?.emoji} {path?.title || 'Your Learning Path'}
          </div>
          {selectedDomain && (
            <div className="roadmap-domain-tag">
              {selectedDomain.emoji} Building: {selectedDomain.name}
            </div>
          )}
          <h1 className="roadmap-title">Your Roadmap</h1>

          <div className="roadmap-stats">
            <div className="roadmap-stat">
              <span className="stat-num" style={{ color: '#f97316' }}>{totalCompleted}</span>
              <span className="stat-label">levels done</span>
            </div>
            <div className="roadmap-stat">
              <span className="stat-num" style={{ color: '#38bdf8' }}>{totalLevels}</span>
              <span className="stat-label">total levels</span>
            </div>
            <div className="roadmap-stat">
              <span className="stat-num" style={{ color: '#4ade80' }}>{xp.toLocaleString()}</span>
              <span className="stat-label">XP earned</span>
            </div>
            <div className="roadmap-stat">
              <span className="stat-num" style={{ color: '#fbbf24' }}>{streak}</span>
              <span className="stat-label">level streak</span>
            </div>
          </div>

          <div className="roadmap-overall-bar">
            <div className="roadmap-overall-label">Overall Progress — {overallPct}%</div>
            <div className="roadmap-bar-track">
              <div className="roadmap-bar-fill" style={{ width: `${overallPct}%` }} />
            </div>
          </div>
        </div>

        {/* Banner for existing users who skipped 2.5 */}
        <Stage25Banner navigate={navigate} isLevelComplete={isLevelComplete} stage25Route={STAGE_ROUTES['2.5']} />

        {/* Stage cards */}
        <div className="roadmap-stages">
          {displayStages.map((stage, stageIdx) => (
            <StageCard
              key={stage.id}
              stage={stage}
              stageRoute={STAGE_ROUTES[String(stage.id)]}
              isLevelComplete={isLevelComplete}
              isStageUnlocked={isStageUnlocked}
              navigate={navigate}
              currentStageId={currentStageId}
              currentLevel={currentLevel}
              levelKey={levelKey}
              isFirstStage={stageIdx === 0}
              totalCompleted={totalCompleted}
            />
          ))}
        </div>

        {/* Continue CTA */}
        <div className="roadmap-cta">
          <button
            className="roadmap-continue-btn"
            onClick={() => {
              const route = STAGE_ROUTES[currentStageId];
              if (route) {
                navigate(`${route.base}${currentLevel}`);
              } else {
                // Fallback: use makeRouteUrl equivalent
                const pid = path?.id;
                const isLegacy = ['java-fullstack','frontend-react','math-student'].includes(pid);
                const url = isLegacy
                  ? `/stage/${currentStageId}/level/${currentLevel}`
                  : `/path/${pid}/stage/${currentStageId}/level/${currentLevel}`;
                navigate(url);
              }
            }}
          >
            Continue Learning → Stage {currentStageId}, Level {currentLevel}
          </button>
        </div>

      </div>
    </div>
  );
}