// src/screens/stage3/Level3_12.jsx
// useReducer — Fill mode

import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage3Shell from './Stage3Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from '../stage2/FillEditor';
import './Level3_12.css';

const SUPPORT = {
  intro: {
    concept: "useReducer — Managing Complex State",
    tagline: "When state has multiple related pieces and many ways to change, useReducer is cleaner than multiple useState calls.",
    whatYouWillDo: "Fill in 5 blanks to complete a patient filter panel using useReducer: the reducer function, dispatching actions, and reading state.",
    whyItMatters: "A filter panel has ward, priority, sortBy, searchQuery — all related, all changing together. useReducer groups them in one state object and manages all transitions through a single reducer function. This is the pattern Redux is based on.",
  },
  hints: [
    "useReducer(reducer, initialState) returns [state, dispatch]. The reducer is a pure function: (state, action) => newState. dispatch({ type: 'SET_WARD', payload: 'ward3' }) sends an action to the reducer.",
    "The reducer switches on action.type and returns the new state. Always return a new object — never mutate the existing state: return { ...state, ward: action.payload }.",
    "dispatch replaces multiple setters. Instead of setWard('3'), setPage(1) you dispatch one action: dispatch({ type: 'SET_WARD', payload: '3' }) and the reducer handles resetting page to 1 at the same time.",
  ],
  reveal: {
    concept: "useReducer — Predictable State Transitions",
    whatYouLearned: "useReducer(reducer, initial) returns [state, dispatch]. The reducer is (state, action) => newState — pure, no side effects. dispatch(action) triggers the reducer. Actions have a type and optional payload. Spread state to preserve unchanged fields. Centralising transitions in one reducer makes complex state predictable.",
    realWorldUse: "A patient search panel: ward filter, priority filter, date range, sort order, search text, current page — 6 related pieces of state. Each filter change might reset the page. useReducer handles all of this in one place. Redux (used in large apps) is basically useReducer scaled up with a store.",
    developerSays: "The rule of thumb: use useState for independent simple values. Use useReducer when state has multiple fields that change together or when the next state depends on complex logic. Most real-world feature-level state ends up in useReducer.",
  },
};

const TEMPLATE = `import { useReducer } from 'react';

// Initial state — all filter values in one object
const initialState = {
    ward:     'all',
    priority: 'all',
    sortBy:   'name',
    search:   '',
    page:     1,
};

// Reducer: pure function (state, action) => newState
// Switch on action.type, return new state object
// NEVER mutate state directly — always return a new object
___FUNCTION___ filterReducer(state, action) {
    switch (action.type) {

        case 'SET_WARD':
            // Spread existing state, override ward, reset page to 1
            return { ...state, ward: action.payload, page: 1 };

        case 'SET_PRIORITY':
            return { ___SPREAD___, priority: action.payload, page: 1 };

        case 'SET_SEARCH':
            return { ...state, search: action.payload, page: 1 };

        case 'SET_SORT':
            return { ...state, sortBy: action.payload };

        case 'RESET':
            // Return the initial state to clear all filters
            return ___INITIAL___;

        default:
            return state;
    }
}

function PatientFilterPanel() {
    // useReducer returns [state, dispatch]
    const [___STATE___, dispatch] = useReducer(filterReducer, initialState);

    return (
        <div className="filter-panel">

            <select
                value={state.ward}
                onChange={e => ___DISPATCH___({ type: 'SET_WARD', payload: e.target.value })}
            >
                <option value="all">All Wards</option>
                <option value="1">Ward 1</option>
                <option value="2">Ward 2</option>
                <option value="3">Ward 3</option>
            </select>

            <select
                value={state.priority}
                onChange={e => dispatch({ type: 'SET_PRIORITY', payload: e.target.value })}
            >
                <option value="all">All Priorities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="NORMAL">Normal</option>
            </select>

            <input
                value={state.search}
                onChange={e => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                placeholder="Search patients..."
            />

            <button onClick={() => dispatch({ type: 'RESET' })}>
                Clear Filters
            </button>

            <p>Showing: Ward {state.ward} | Priority {state.priority} | Page {state.page}</p>
        </div>
    );
}`;

const BLANKS = [
  { id: 'FUNCTION',  answer: 'function',      placeholder: 'keyword',   hint: 'Declares the reducer as a plain JavaScript function.' },
  { id: 'SPREAD',    answer: '...state',       placeholder: 'spread',    hint: 'Copies all existing state fields before overriding priority. Without this the other fields are lost.' },
  { id: 'INITIAL',   answer: 'initialState',   placeholder: 'variable',  hint: 'The initial state object defined at the top. Return it to reset all filters.' },
  { id: 'STATE',     answer: 'state',          placeholder: 'variable',  hint: 'First value from useReducer destructuring. Contains all filter values.' },
  { id: 'DISPATCH',  answer: 'dispatch',       placeholder: 'function',  hint: 'Second value from useReducer. Call it with an action object to trigger the reducer.' },
];

export default function Level3_12() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage3Shell levelId={12} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l312-container">
          <div className="l312-brief">
            <div className="l312-tag">// Mission Brief</div>
            <h2>Build a filter panel with <span style={{ color: selectedDomain?.color }}>useReducer</span>.</h2>
            <p>Fill in 5 blanks to complete the reducer function and connect it to the filter UI. All state in one object, all transitions in one function.</p>
            <div className="l312-pattern">
              <span className="l312-box">dispatch(action)</span>
              <span className="l312-arr">→</span>
              <span className="l312-box">reducer(state, action)</span>
              <span className="l312-arr">→</span>
              <span className="l312-box">new state</span>
              <span className="l312-arr">→</span>
              <span className="l312-box">re-render</span>
            </div>
          </div>
          <FillEditor
            template={TEMPLATE}
            blanks={BLANKS}
            onAllCorrect={() => setIsCorrect(true)}
            expectedOutput="Filter panel renders with ward/priority selects and search — dispatching actions updates state"
          />
        </div>
      </LevelSupportWrapper>
    </Stage3Shell>
  );
}