import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import codingLevels from '../paths/coding/levels';
import './Level.css';

function Level() {
  const { path, number } = useParams();
  const navigate = useNavigate();
  const levelNum = parseInt(number);

  // Get the right level data
  const levels = path === 'coding' ? codingLevels : [];
  const level = levels.find(l => l.id === levelNum);

  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('idle'); // idle | running | success | error
  const [message, setMessage] = useState('> waiting for your command...');
  const [robotPos, setRobotPos] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Reset state when level changes
  useEffect(() => {
    setInputValue('');
    setStatus('idle');
    setMessage('> waiting for your command...');
    setRobotPos(0);
    setShowCelebration(false);
  }, [levelNum]);

  if (!level) {
    return (
      <div style={{ color: 'white', padding: 40 }}>
        Level {levelNum} not found yet — coming soon!
      </div>
    );
  }

  const totalCells = level.grid.cols;
  const robotStartCol = level.grid.robotStart.col;
  const goalCol = level.grid.goalPosition.col;
  const correctAnswer = level.code.answer;

  function runCode() {
    const val = parseInt(inputValue);

    if (!inputValue || isNaN(val)) {
      setStatus('error');
      setMessage('> error: missing value — what goes inside the ( ) ?');
      return;
    }

    setStatus('running');
    setMessage('> running...');

    // Animate robot
    const moveAmount = Math.min(val, goalCol - robotStartCol);
    setRobotPos(moveAmount);

    setTimeout(() => {
      if (val === correctAnswer) {
        setStatus('success');
        setMessage(`> ${level.code.prefix}${val}${level.code.suffix.split('\n')[0]} ✓ — robot reached the star!`);
        setTimeout(() => setShowCelebration(true), 600);
      } else if (val < correctAnswer) {
        setStatus('error');
        setMessage(`> robot stopped ${correctAnswer - val} steps short. Try again!`);
        setTimeout(() => {
          setRobotPos(0);
          setStatus('idle');
        }, 1200);
      } else {
        setStatus('error');
        setMessage(`> robot overshot by ${val - correctAnswer} steps! Too many.`);
        setTimeout(() => {
          setRobotPos(0);
          setStatus('idle');
        }, 1200);
      }
    }, 800);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') runCode();
  }

  function nextLevel() {
    if (level.nextLevel) {
      navigate(`/level/${path}/${level.nextLevel}`);
    } else {
      navigate('/');
    }
  }

  // Build the grid cells
  const gridCells = [];
  for (let col = 0; col < totalCells; col++) {
    const isRobot = col === robotStartCol + robotPos && status !== 'idle' ? false : col === robotStartCol;
    const isGoal = col === goalCol;
    const isTrail = col > robotStartCol && col < robotStartCol + robotPos && status === 'success';
    gridCells.push({ col, isGoal, isTrail });
  }

  return (
    <div className="level-screen">

      {/* Top HUD */}
      <div className="hud">
        <div className="hud-left">
          <span className="hud-logo">◈ QuestLearn</span>
          <span className="hud-divider">·</span>
          <span className="hud-path">{path === 'coding' ? '💻 Coding Path' : '🔢 Math Path'}</span>
        </div>
        <div className="hud-center">
          World {level.world} — {level.worldName}
        </div>
        <div className="hud-right">
          Level {level.id} · {level.concept}
        </div>
      </div>

      {/* Main layout */}
      <div className="level-main">

        {/* Game scene */}
        <div className="scene">
          <div className="scene-objective">🎯 {level.objective}</div>

          {/* Robot grid */}
          <div className="robot-grid">
            {gridCells.map(({ col, isGoal, isTrail }) => (
              <div key={col} className={`grid-cell ${isTrail ? 'cell-trail' : ''}`}>
                {col === robotStartCol + robotPos ? (
                  <div className={`robot ${status === 'success' ? 'robot-success' : ''}`}>
                    <div className="robot-body">
                      <div className="robot-eyes">
                        <div className="eye" />
                        <div className="eye" />
                      </div>
                    </div>
                  </div>
                ) : isGoal && status !== 'success' ? (
                  <span className="goal-star">⭐</span>
                ) : isGoal && status === 'success' ? (
                  <span className="goal-star celebrating">🎉</span>
                ) : null}
              </div>
            ))}
          </div>

          <div className="scene-hint-arrow">
            move forward →
          </div>
        </div>

        {/* Right panel */}
        <div className="panel">

          {/* Mission */}
          <div className="mission">
            <div className="mission-label">// Mission Brief</div>
            <div className="mission-text">{level.instruction}</div>
          </div>

          {/* Code editor */}
          <div className="editor-section">
            <div className="editor-label">// Your Code</div>

            <div className="code-block">
              <div className="code-comment">// fill in the blank</div>
              <div className="code-line">
                <span className="code-prefix">{level.code.prefix}</span>
                <input
                  className="code-input"
                  type="number"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={level.code.placeholder}
                  autoFocus
                  disabled={status === 'running' || status === 'success'}
                />
                <span className="code-suffix">
                  {level.code.suffix.split('\n')[0]}
                </span>
              </div>
              {level.code.suffix.includes('\n') && (
                <div className="code-line">
                  <span className="code-extra">
                    {level.code.suffix.split('\n')[1]}
                  </span>
                </div>
              )}
            </div>

            <div className="hint-box">
              <strong>💡 HINT</strong>
              <span>{level.hint}</span>
            </div>
          </div>

          {/* Console output */}
          <div className={`console-output ${status === 'success' ? 'console-success' : status === 'error' ? 'console-error' : ''}`}>
            {message}
          </div>

          {/* Run button */}
          <button
            className="run-btn"
            onClick={runCode}
            disabled={status === 'running' || status === 'success'}
          >
            {status === 'running' ? '⏳  Running...' : '▶  Run Code'}
          </button>

        </div>
      </div>

      {/* Celebration overlay */}
      {showCelebration && (
        <div className="celebration">
          <div className="celebration-content">
            <div className="celebration-emoji">🎉</div>
            <h2 className="celebration-title">Level Complete!</h2>
            <p className="celebration-message">{level.successMessage}</p>
            <div className="concept-reveal">
              <span className="concept-label">💡 Concept Unlocked</span>
              <span className="concept-name">{level.concept}</span>
              <p className="concept-text">{level.conceptReveal}</p>
            </div>
            <button className="next-btn" onClick={nextLevel}>
              Next Level →
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Level;