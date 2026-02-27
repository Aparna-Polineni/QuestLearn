// src/hooks/useUndo.js
// Universal undo/redo hook — wraps any piece of state with history
// Usage:
//   const [state, setState, { undo, redo, canUndo, canRedo, reset }] = useUndo(initialState);
//   Works as a drop-in replacement for useState

import { useState, useCallback } from 'react';

const MAX_HISTORY = 50; // max undo steps

function useUndo(initialState) {
  const [history, setHistory] = useState({
    past:    [],           // previous states
    present: initialState, // current state
    future:  [],           // states after undo
  });

  // Set new state — pushes current to past, clears future
  const setState = useCallback((newStateOrUpdater) => {
    setHistory(prev => {
      const newState = typeof newStateOrUpdater === 'function'
        ? newStateOrUpdater(prev.present)
        : newStateOrUpdater;

      // Don't push if state hasn't changed
      if (JSON.stringify(newState) === JSON.stringify(prev.present)) return prev;

      return {
        past:    [...prev.past.slice(-MAX_HISTORY), prev.present],
        present: newState,
        future:  [],
      };
    });
  }, []);

  // Undo — go one step back
  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.past.length === 0) return prev;
      const previous = prev.past[prev.past.length - 1];
      return {
        past:    prev.past.slice(0, -1),
        present: previous,
        future:  [prev.present, ...prev.future],
      };
    });
  }, []);

  // Redo — go one step forward
  const redo = useCallback(() => {
    setHistory(prev => {
      if (prev.future.length === 0) return prev;
      const next = prev.future[0];
      return {
        past:    [...prev.past, prev.present],
        present: next,
        future:  prev.future.slice(1),
      };
    });
  }, []);

  // Reset — go back to initial state, clear all history
  const reset = useCallback(() => {
    setHistory({
      past:    [],
      present: initialState,
      future:  [],
    });
  }, [initialState]);

  return [
    history.present,
    setState,
    {
      undo,
      redo,
      reset,
      canUndo: history.past.length > 0,
      canRedo: history.future.length > 0,
      historySize: history.past.length,
    }
  ];
}

export default useUndo;