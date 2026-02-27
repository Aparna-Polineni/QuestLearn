// src/components/UndoBar.jsx
// Drop this into any level's action bar to get undo/redo
// Pass the undo/redo controls from useUndo hook

import './UndoBar.css';

function UndoBar({ canUndo, canRedo, onUndo, onRedo, onReset, historySize }) {
  return (
    <div className="undo-bar">
      <button
        className={`undo-btn ${canUndo ? 'undo-enabled' : 'undo-disabled'}`}
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo last action (Ctrl+Z)"
      >
        ↩ Undo
      </button>

      {canRedo && (
        <button
          className="undo-btn undo-enabled redo-btn"
          onClick={onRedo}
          title="Redo (Ctrl+Y)"
        >
          ↪ Redo
        </button>
      )}

      {historySize > 0 && (
        <button
          className="reset-btn"
          onClick={onReset}
          title="Reset everything and start fresh"
        >
          ↺ Reset
        </button>
      )}

      {historySize > 0 && (
        <span className="undo-history-count">
          {historySize} action{historySize !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}

export default UndoBar;