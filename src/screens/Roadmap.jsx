// src/screens/Roadmap.jsx
// Full page roadmap — shows all stages, all levels, current position, XP
// Accessible from home dashboard via /roadmap

import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import './Roadmap.css';

// Stage-to-route mapping for Java Full Stack
const STAGE_ROUTES = {
  1: { base: '/stage/1/level/', levels: 8  },
  2: { base: '/stage/2/level/', levels: 20 },
  3: { base: '/stage/3/level/', levels: 15 },
  4: { base: '/stage/4/level/', levels: 18 },
  5: { base: '/stage/5/level/', levels: 22 },
  6: { base: '/stage/6/level/', levels: 14 },
  7: { base: '/stage/7/level/', levels: 12 },
  8: { base: '/stage/8/level/', levels: 10 },
};

function LevelDot({ stageId, levelNum, isComplete, isCurrent, isLocked, onClick }) {
  return (
    <button
      className={`level-dot
        ${isComplete ? 'dot-complete' : ''}
        ${isCurrent  ? 'dot-current'  : ''}
        ${isLocked   ? 'dot-locked'   : ''}
        ${!isLocked && !isComplete && !isCurrent ? 'dot-available' : ''}
      `}
      onClick={!isLocked ? onClick : undefined}
      disabled={isLocked}
      title={`Level ${stageId}.${levelNum}`}
    >
      {isComplete ? '✓' : levelNum}
    </button>
  );
}

function StageCard({ stage, stageRoute, completedLevels, isLevelComplete, navigate, currentStage, currentLevel }) {
  const totalLevels    = stageRoute?.levels || stage.levels;
  const completedCount = Array.from({ length: totalLevels }, (_, i) =>
    isLevelComplete(`${stage.id}-${i + 1}`)
  ).filter(Boolean).length;

  const progressPct = Math.round((completedCount / totalLevels) * 100);
  const isStageComplete = completedCount === totalLevels;
  const isStageStarted  = completedCount > 0;
  const isFirstStage    = stage.id === 1;

  // Stage is locked if previous stage isn't at least 50% done
  const prevComplete = stage.id === 1 ? totalLevels : Array.from(
    { length: STAGE_ROUTES[stage.id - 1]?.levels || 0 }, (_, i) =>
    isLevelComplete(`${stage.id - 1}-${i + 1}`)
  ).filter(Boolean).length;
  const isStageLocked = stage.id > 1 && prevComplete < Math.ceil((STAGE_ROUTES[stage.id - 1]?.levels || 1) * 0.5);

  return (
    <div
      className={`stage-card
        ${isStageComplete ? 'stage-complete' : ''}
        ${isStageStarted  ? 'stage-started'  : ''}
        ${isStageLocked   ? 'stage-locked'   : ''}
        ${currentStage === stage.id ? 'stage-current' : ''}
      `}
      style={{ '--stage-color': stage.color }}
    >
      {/* Stage header */}
      <div className="stage-card-header">
        <div className="stage-card-left">
          <span className="stage-card-emoji">{stage.emoji}</span>
          <div>
            <div className="stage-card-num">Stage {stage.id}</div>
            <div className="stage-card-title">{stage.title}</div>
          </div>
        </div>
        <div className="stage-card-right">
          {isStageComplete && <span className="stage-complete-badge">✓ Done</span>}
          {isStageLocked    && <span className="stage-locked-badge">🔒</span>}
          {!isStageLocked && !isStageComplete && (
            <span className="stage-progress-pct">{progressPct}%</span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="stage-progress-bar">
        <div
          className="stage-progress-fill"
          style={{ width: `${progressPct}%`, background: stage.color }}
        />
      </div>

      <div className="stage-desc">{stage.description}</div>

      {/* Level dots */}
      {!isStageLocked && (
        <div className="stage-level-dots">
          {Array.from({ length: totalLevels }, (_, i) => {
            const lvl        = i + 1;
            const isComplete = isLevelComplete(`${stage.id}-${lvl}`);
            const isCurrent  = currentStage === stage.id && currentLevel === lvl;
            // Locked if previous level not done (except level 1 of each stage)
            const isLocked   = lvl > 1 && !isLevelComplete(`${stage.id}-${lvl - 1}`) && !isComplete;

            return (
              <LevelDot
                key={lvl}
                stageId={stage.id}
                levelNum={lvl}
                isComplete={isComplete}
                isCurrent={isCurrent}
                isLocked={isLocked}
                onClick={() => stageRoute && navigate(`${stageRoute.base}${lvl}`)}
              />
            );
          })}
        </div>
      )}

      {isStageLocked && (
        <div className="stage-locked-msg">
          Complete 50% of Stage {stage.id - 1} to unlock
        </div>
      )}

      <div className="stage-count">
        {completedCount}/{totalLevels} levels complete
      </div>
    </div>
  );
}

export default function Roadmap() {
  const navigate = useNavigate();
  const { selectedCareerPath, selectedDomain, completedLevels, xp, streak, isLevelComplete } = useGame();
  const { user, signOut } = useAuth();

  const path   = selectedCareerPath;
  const stages = path?.stages || [];

  // Determine current stage/level
  const totalCompleted = Object.keys(completedLevels).length;
  let currentStage = 1;
  let currentLevel = 1;
  for (const key of Object.keys(completedLevels).sort()) {
    const [s, l] = key.split('-').map(Number);
    if (s > currentStage || (s === currentStage && l >= currentLevel)) {
      currentStage = s;
      currentLevel = l + 1;
      if (currentLevel > (STAGE_ROUTES[s]?.levels || 8)) {
        currentStage = s + 1;
        currentLevel = 1;
      }
    }
  }

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

          {/* Stats */}
          <div className="roadmap-stats">
            <div className="roadmap-stat">
              <span className="stat-num" style={{ color: '#f97316' }}>{totalCompleted}</span>
              <span className="stat-label">levels done</span>
            </div>
            <div className="roadmap-stat">
              <span className="stat-num" style={{ color: '#38bdf8' }}>{path?.totalLevels || 119}</span>
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

          {/* Overall progress bar */}
          <div className="roadmap-overall-bar">
            <div className="roadmap-overall-label">
              Overall Progress — {Math.round((totalCompleted / (path?.totalLevels || 119)) * 100)}%
            </div>
            <div className="roadmap-bar-track">
              <div
                className="roadmap-bar-fill"
                style={{ width: `${(totalCompleted / (path?.totalLevels || 119)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stage cards */}
        <div className="roadmap-stages">
          {stages.map(stage => (
            <StageCard
              key={stage.id}
              stage={stage}
              stageRoute={STAGE_ROUTES[stage.id]}
              completedLevels={completedLevels}
              isLevelComplete={isLevelComplete}
              navigate={navigate}
              currentStage={currentStage}
              currentLevel={currentLevel}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="roadmap-cta">
          <button
            className="roadmap-continue-btn"
            onClick={() => {
              const route = STAGE_ROUTES[currentStage];
              if (route) navigate(`${route.base}${currentLevel}`);
              else navigate('/stage/1/level/1');
            }}
          >
            Continue Learning → Stage {currentStage}, Level {currentLevel}
          </button>
        </div>

      </div>
    </div>
  );
}