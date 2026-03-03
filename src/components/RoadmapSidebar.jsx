// src/components/RoadmapSidebar.jsx
// Slides in from the right on any level screen
// Shows current stage progress + mini map of all stages
// Triggered by a floating button in each shell

import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import './RoadmapSidebar.css';

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

export default function RoadmapSidebar({ isOpen, onClose, currentStageId, currentLevelId }) {
  const navigate = useNavigate();
  const { selectedCareerPath, selectedDomain, isLevelComplete, xp, streak } = useGame();

  const stages = selectedCareerPath?.stages || [];
  const totalLevels = selectedCareerPath?.totalLevels || 119;

  const totalCompleted = stages.reduce((acc, stage) => {
    const route = STAGE_ROUTES[stage.id];
    if (!route) return acc;
    return acc + Array.from({ length: route.levels }, (_, i) =>
      isLevelComplete(`${stage.id}-${i + 1}`) ? 1 : 0
    ).reduce((a, b) => a + b, 0);
  }, 0);

  function goToLevel(stageId, levelNum) {
    const route = STAGE_ROUTES[stageId];
    if (route) {
      navigate(`${route.base}${levelNum}`);
      onClose();
    }
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="rsb-backdrop" onClick={onClose} />}

      {/* Sidebar panel */}
      <div className={`rsb-panel ${isOpen ? 'rsb-open' : ''}`}>

        {/* Header */}
        <div className="rsb-header">
          <div className="rsb-header-left">
            <div className="rsb-title">◈ Roadmap</div>
            {selectedDomain && (
              <div className="rsb-domain">{selectedDomain.emoji} {selectedDomain.name}</div>
            )}
          </div>
          <button className="rsb-close" onClick={onClose}>✕</button>
        </div>

        {/* XP bar */}
        <div className="rsb-xp-bar">
          <div className="rsb-xp-row">
            <span className="rsb-xp-val">⚡ {xp.toLocaleString()} XP</span>
            <span className="rsb-streak">🔥 {streak} streak</span>
          </div>
          <div className="rsb-progress-track">
            <div
              className="rsb-progress-fill"
              style={{ width: `${Math.min((totalCompleted / totalLevels) * 100, 100)}%` }}
            />
          </div>
          <div className="rsb-progress-label">
            {totalCompleted} / {totalLevels} levels — {Math.round((totalCompleted / totalLevels) * 100)}%
          </div>
        </div>

        {/* Stage list */}
        <div className="rsb-stages">
          {stages.map(stage => {
            const route          = STAGE_ROUTES[stage.id];
            const levelCount     = route?.levels || stage.levels;
            const completedCount = Array.from({ length: levelCount }, (_, i) =>
              isLevelComplete(`${stage.id}-${i + 1}`) ? 1 : 0
            ).reduce((a, b) => a + b, 0);

            const pct          = Math.round((completedCount / levelCount) * 100);
            const isActive     = stage.id === currentStageId;
            const isComplete   = completedCount === levelCount;
            const prevComplete = stage.id === 1 ? levelCount : (() => {
              const pr = STAGE_ROUTES[stage.id - 1];
              if (!pr) return pr?.levels || 1;
              return Array.from({ length: pr.levels }, (_, i) =>
                isLevelComplete(`${stage.id - 1}-${i + 1}`) ? 1 : 0
              ).reduce((a, b) => a + b, 0);
            })();
            const isLocked = stage.id > 1 && prevComplete < Math.ceil((STAGE_ROUTES[stage.id - 1]?.levels || 1) * 0.5);

            return (
              <div
                key={stage.id}
                className={`rsb-stage
                  ${isActive   ? 'rsb-stage-active'    : ''}
                  ${isComplete ? 'rsb-stage-complete'  : ''}
                  ${isLocked   ? 'rsb-stage-locked'    : ''}
                `}
                style={{ '--s-color': stage.color }}
              >
                {/* Stage row */}
                <div className="rsb-stage-row">
                  <span className="rsb-stage-emoji">{stage.emoji}</span>
                  <div className="rsb-stage-info">
                    <div className="rsb-stage-name">{stage.title}</div>
                    <div className="rsb-stage-bar">
                      <div
                        className="rsb-stage-bar-fill"
                        style={{ width: `${pct}%`, background: stage.color }}
                      />
                    </div>
                  </div>
                  <span className="rsb-stage-count">
                    {isLocked ? '🔒' : isComplete ? '✓' : `${completedCount}/${levelCount}`}
                  </span>
                </div>

                {/* Level dots — only show for current stage */}
                {isActive && !isLocked && (
                  <div className="rsb-level-dots">
                    {Array.from({ length: levelCount }, (_, i) => {
                      const lvl        = i + 1;
                      const isDone     = isLevelComplete(`${stage.id}-${lvl}`);
                      const isCurrent  = lvl === currentLevelId;
                      const isAvail    = lvl === 1 || isLevelComplete(`${stage.id}-${lvl - 1}`);

                      return (
                        <button
                          key={lvl}
                          className={`rsb-dot
                            ${isDone    ? 'rsb-dot-done'    : ''}
                            ${isCurrent ? 'rsb-dot-current' : ''}
                            ${!isAvail && !isDone ? 'rsb-dot-locked' : ''}
                          `}
                          onClick={() => isAvail || isDone ? goToLevel(stage.id, lvl) : null}
                          disabled={!isAvail && !isDone}
                          title={`Level ${stage.id}.${lvl}`}
                        >
                          {isDone ? '✓' : lvl}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Full roadmap link */}
        <div className="rsb-footer">
          <button
            className="rsb-full-roadmap-btn"
            onClick={() => { navigate('/roadmap'); onClose(); }}
          >
            View Full Roadmap →
          </button>
        </div>

      </div>
    </>
  );
}