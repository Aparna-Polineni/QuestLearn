// src/screens/stage2/Level2_15.jsx — Arrays & ArrayLists
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import CodeEditor from './CodeEditor';
import './Level2_15.css';

const SUPPORT = {
  intro: {
    concept: "Arrays & ArrayLists",
    tagline: "Arrays are fixed-size. ArrayLists grow and shrink. Both store ordered sequences.",
    whatYouWillDo: "Write the two TODO sections — declare a String array and loop through it, then build an ArrayList, add items, remove one, and print the results.",
    whyItMatters: "Every API returns lists of data. Every database query returns collections. Understanding arrays vs ArrayLists is the foundation for Java's entire Collections framework.",
  },
  hints: [
    "Fixed array with values: String[] wards = {\"Cardiology\", \"Oncology\", \"Neurology\"}; — curly braces with quoted strings. Loop through it: for (String w : wards) { System.out.println(w); }",
    "ArrayList: ArrayList<String> queue = new ArrayList<>(); — note the diamond brackets. Add: queue.add(\"Alice\"). Remove by VALUE: queue.remove(\"Bob\") — this removes the first matching element.",
    "After removing Bob, queue has 2 items: Alice and Charlie. queue.size() returns 2. Loop with for-each: for (String name : queue) { System.out.println(name); }",
  ],
  reveal: {
    concept: "Arrays vs ArrayList & Collections",
    whatYouLearned: "Arrays are fixed-size and fast. ArrayLists are dynamic and flexible. ArrayList<T> is in java.util — always import it. Key methods: add(), remove(), get(), size(), contains(). for-each works on both.",
    realWorldUse: "Spring Data JPA's findAll() returns a List<T> — usually an ArrayList. Your controller returns this list as JSON. Jackson serialises it to a JSON array automatically. Arrays appear in low-level Java; in application code, List and ArrayList dominate.",
    developerSays: "Declare as List, not ArrayList: List<String> names = new ArrayList<>(). This lets you swap implementations without changing code. Always ArrayList unless you have a specific reason for something else.",
  },
};

// ── Starter code: locked structure + two TODO slots ───────────────────────
// The import, class, main signature, and comments are all locked
// Students write only inside the TODO blocks
const INITIAL_CODE = `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {

        // ── TASK 1: Fixed array ──────────────────────────────────────
        // Declare a String array called 'wards' with 3 values:
        // "Cardiology", "Oncology", "Neurology"
        // Then print each one using a for-each loop

        // TODO: declare String[] wards and loop through it with for-each

        // ── TASK 2: Dynamic ArrayList ────────────────────────────────
        // Create ArrayList<String> called 'queue'
        // Add: "Alice", "Bob", "Charlie"
        // Remove "Bob" by value
        // Print: "Queue size: " + queue.size()
        // Print each remaining patient with for-each

        // TODO: create ArrayList, add 3 names, remove Bob, print size and each name

    }
}`;

const EXPECTED = `Cardiology\nOncology\nNeurology\nQueue size: 2\nAlice\nCharlie`;

export default function Level2_15() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);
  return (
    <Stage2Shell levelId={15} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="l215-container">
          <div className="l215-brief">
            <div className="l215-brief-tag">// Build Mission</div>
            <h2>Build the data structures for your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.</h2>
            <p>
              Two tasks. The structure and comments are already written — locked and uneditable.
              Write only inside the <code style={{color:'#38bdf8'}}>// TODO</code> lines.
              Each TODO shows exactly what output to produce.
            </p>
            <div className="l215-expected-box">
              <div className="l215-expected-label">Expected output</div>
              <pre className="l215-expected-output">{EXPECTED}</pre>
            </div>
          </div>
          <CodeEditor
            initialCode={INITIAL_CODE}
            expectedOutput={EXPECTED}
            onOutputChange={(_, correct) => setOk(correct)}
            hints={SUPPORT.hints}
            height={340}
            writableMarker="// TODO"
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}