// src/screens/stage2/Level2_15.jsx
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import CodeEditor from './CodeEditor';

const SUPPORT = {
  intro: {
    concept: "Arrays & ArrayLists",
    tagline: "Arrays are fixed-size. ArrayLists grow and shrink. Both store ordered sequences of data.",
    whatYouWillDo: "Write a program that stores ward names in a fixed int array, then uses an ArrayList to manage a dynamic patient queue — adding, removing, and iterating.",
    whyItMatters: "Every API returns lists of data. Every database query returns collections. Understanding fixed arrays vs dynamic ArrayLists is the foundation for understanding Java's entire Collections framework, which is how Spring Boot handles everything from query results to request parameters.",
  },
  hints: [
    "Fixed array: int[] scores = new int[5]; or String[] names = {\"Alice\", \"Bob\"};. Access by index: names[0]. Length: names.length. Index starts at 0, so last element is names[names.length-1].",
    "ArrayList: ArrayList<String> list = new ArrayList<>();. Add: list.add(\"item\"). Remove by index: list.remove(0). Remove by value: list.remove(\"item\"). Size: list.size(). Get: list.get(0).",
    "for-each over ArrayList: for (String item : list) { ... }. This is cleaner than a manual index loop unless you need the index. Import ArrayList: import java.util.ArrayList;",
  ],
  reveal: {
    concept: "Arrays vs ArrayList & the Collections Framework",
    whatYouLearned: "Arrays are fixed-size and fast. ArrayLists are dynamic (auto-resize) and flexible. ArrayList<T> is part of java.util — always import it. Key ArrayList methods: add(), remove(), get(), size(), contains(), isEmpty(), clear(). for-each works on both arrays and ArrayLists.",
    realWorldUse: "Spring Data JPA's findAll() returns a List<T> — usually an ArrayList under the hood. Your controller receives this list and returns it as JSON. Jackson serialises the ArrayList to a JSON array automatically. Arrays are used in low-level Java; in application code, List and ArrayList dominate.",
    developerSays: "Declare as List, not ArrayList: List<String> names = new ArrayList<>(). This lets you switch implementations without changing code. ArrayList for most cases, LinkedList if you do lots of insertions at the front. In practice: always ArrayList unless you have a specific reason.",
  },
};

const INITIAL = `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {

        // TASK 1: Fixed array of 3 ward names
        // Declare a String array called 'wards' with values:
        // "Cardiology", "Oncology", "Neurology"
        // Then print each ward using a for loop



        // TASK 2: Dynamic patient queue using ArrayList
        // Create an ArrayList<String> called 'queue'
        // Add: "Alice", "Bob", "Charlie"
        // Remove "Bob" (by value)
        // Print queue size
        // Print all remaining patients using for-each


    }
}`;

const EXPECTED = `Cardiology\nOncology\nNeurology\nQueue size: 2\nAlice\nCharlie`;

export default function Level2_15() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);

  return (
    <Stage2Shell levelId={15} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div style={{ display:'flex', flexDirection:'column', gap:24, paddingBottom:32 }}>
          <div style={{ background:'#0d1117', border:'1px solid #1e293b', borderRadius:16, padding:24 }}>
            <div style={{ fontFamily:'DM Mono,monospace', fontSize:11, color:'#38bdf8', letterSpacing:3, marginBottom:10 }}>// Build Mission</div>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:800, color:'#f1f5f9', marginBottom:8 }}>
              Build the patient queue for <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'your system'}</span>.
            </h2>
            <p style={{ fontSize:14, color:'#64748b', lineHeight:1.6 }}>
              Two tasks: a fixed array of ward names, then a dynamic ArrayList patient queue. Complete both to match the expected output exactly.
            </p>
            <div style={{ background:'#080a0f', border:'1px solid #1e293b', borderRadius:10, padding:14, marginTop:12, fontFamily:'DM Mono,monospace', fontSize:12 }}>
              <div style={{ color:'#475569', marginBottom:6, letterSpacing:1 }}>EXPECTED OUTPUT:</div>
              {EXPECTED.split('\\n').map((line, i) => <div key={i} style={{ color:'#4ade80' }}>{line}</div>)}
            </div>
          </div>
          <CodeEditor
            initialCode={INITIAL}
            expectedOutput={EXPECTED}
            onOutputChange={(_, correct) => setOk(correct)}
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}