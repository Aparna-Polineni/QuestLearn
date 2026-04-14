// src/hooks/useDraftAnswers.js
// Persists fill-blank answers to localStorage so a page refresh
// doesn't lose 30 minutes of typed work.
//
// Usage in any FILL level:
//
//   import useDraftAnswers from '../../../hooks/useDraftAnswers';
//
//   // Replace: const [vals, setVals] = useState({});
//   // With:
//   const [vals, setVals] = useDraftAnswers('de-1-2', {}); // levelKey, initialState
//
//   // When the level is completed, clear the draft:
//   function handleComplete() {
//     clearDraft(); // removes localStorage entry
//     completeLevel(`de-1-${levelId}`);
//     navigate(nextUrl);
//   }
//   const [vals, setVals, clearDraft] = useDraftAnswers('de-1-2', {});

import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export default function useDraftAnswers(levelKey, initialState = {}) {
  // Initialise from localStorage draft if one exists
  const [vals, setValsInternal] = useState(() => {
    const draft = api.loadDraft(levelKey);
    return draft || initialState;
  });

  // Persist to localStorage on every change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only save if there is something typed
      if (Object.keys(vals).length > 0 && Object.values(vals).some(v => v.trim?.() !== '')) {
        api.saveDraft(levelKey, vals);
      }
    }, 500); // 500ms debounce — don't hammer localStorage on every keystroke
    return () => clearTimeout(timer);
  }, [vals, levelKey]);

  // Wrapped setter — same signature as useState setter
  const setVals = useCallback((updater) => {
    setValsInternal(updater);
  }, []);

  // Clear draft when level is completed
  const clearDraft = useCallback(() => {
    api.clearDraft(levelKey);
  }, [levelKey]);

  return [vals, setVals, clearDraft];
}
