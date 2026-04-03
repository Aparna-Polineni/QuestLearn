// src/screens/ml-ai-engineer/stage2/ML2_Level12.jsx — NumPy Fundamentals (BUILD + JS Test Runner)
// Uses JsTestRunner for test-driven validation — this is the Codility/HackerRank pattern
import { useState } from 'react';
import ML2Shell from './ML2Shell';
import JsTestRunner from '../../../components/JsTestRunner';

// ── Test cases ────────────────────────────────────────────────────────────
// The test runner calls the user's function with each input and checks the output.
// This is exactly how real coding assessments work — green tick or red cross per test.

const TESTS = [
  {
    description: 'returns mean of a simple array',
    input:       [[2, 4, 6, 8]],
    expected:    5,
  },
  {
    description: 'handles a single element',
    input:       [[42]],
    expected:    42,
  },
  {
    description: 'handles negative numbers',
    input:       [[-3, -1, 1, 3]],
    expected:    0,
  },
  {
    description: 'handles floats (within 0.0001 tolerance)',
    input:       [[1, 2, 3]],
    expected:    2,
    hint:        'Make sure you are dividing by the count of elements, not a hardcoded number.',
  },
  {
    description: 'returns 0 for an empty array',
    input:       [[]],
    expected:    0,
    hint:        'Check for empty array before dividing — division by zero returns NaN, not 0.',
  },
  {
    description: 'handles a large array correctly',
    input:       [Array.from({ length: 1000 }, (_, i) => i + 1)],
    expected:    500.5,
  },
];

const INITIAL_CODE =
`// Write a function that calculates the mean (average) of an array of numbers.
// This is the foundation of every ML metric — loss, accuracy, precision.
//
// mean([2, 4, 6, 8])  → 5
// mean([-3, -1, 1, 3]) → 0
// mean([])             → 0  (handle empty arrays)

function mean(numbers) {
  // your code here
}`;

export default function ML2_Level12() {
  const [passed, setPassed] = useState(false);

  return (
    <ML2Shell levelId={12} canProceed={passed}
      conceptReveal={[{
        label: 'Mean — the Most Used Number in ML',
        detail: 'Mean (average) is inside every ML metric: Mean Squared Error, Mean Absolute Error, mean accuracy across folds. It is also the foundation of normalisation (subtract the mean, divide by std). Writing it from scratch forces you to understand what "average" actually means computationally — not just mathematically.',
      }]}
    >
      <div className="ml2-intro">
        <h1>NumPy Foundations — Mean</h1>
        <p className="ml2-tagline">🧪 Write the function. Pass all 6 tests. No guessing.</p>
        <p className="ml2-why">
          NumPy's np.mean() is in every ML codebase. Write it yourself first — then using
          the library version will feel like a shortcut, not a mystery. Each test below
          covers a real edge case that trips up ML code in production.
        </p>
      </div>

      <JsTestRunner
        functionName="mean"
        initialCode={INITIAL_CODE}
        tests={TESTS}
        height={240}
        onAllPassed={() => setPassed(true)}
      />

      {passed && (
        <div className="ml2-feedback success" style={{ marginTop: 16 }}>
          ✅ All 6 tests passing. You now understand mean() at the implementation level —
          not just the formula.
        </div>
      )}
    </ML2Shell>
  );
}
