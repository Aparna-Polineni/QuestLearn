// src/screens/stage2/Level2_16.jsx — HashMap & HashSet
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import CodeEditor from './CodeEditor';
import './Level2_16.css';

const SUPPORT = {
  intro: {
    concept: "HashMap & HashSet",
    tagline: "HashMap: key → value lookup in O(1). HashSet: unique items only, no duplicates.",
    whatYouWillDo: "Write the two TODO sections — build a patient-to-ward HashMap and a unique diagnoses HashSet.",
    whyItMatters: "You constantly need key→value lookups: patient ID → record, username → session. HashMap gives O(1) access. Without it you scan an entire list for every lookup — catastrophically slow at scale.",
  },
  hints: [
    "HashMap: HashMap<String, String> map = new HashMap<>(); Put: map.put(\"P001\", \"Cardiology\"); Get: map.get(\"P002\"); Check existence: map.containsKey(\"P004\") returns a boolean.",
    "HashSet: HashSet<String> set = new HashSet<>(); Add: set.add(\"item\"); Adding a duplicate is silently ignored — the set just keeps one copy. Size: set.size();",
    "Import both at the top: import java.util.HashMap; import java.util.HashSet; — the imports are already written in the locked code above your TODO.",
  ],
  reveal: {
    concept: "HashMap, HashSet & O(1) Lookups",
    whatYouLearned: "HashMap stores key-value pairs. get(key) is O(1) regardless of map size. HashSet stores unique values — duplicates silently ignored. Both use hash codes internally. Keys in HashMap need correct equals() and hashCode() — String and Integer provide this.",
    realWorldUse: "Spring Boot's application context is essentially a HashMap mapping bean names to instances. Redis (production caching) is a distributed HashMap. Every session store, every cache, every lookup table in a backend system is a HashMap under the hood.",
    developerSays: "Interview question I always ask: ArrayList.contains() vs HashMap.containsKey() — what is the time complexity? ArrayList is O(n) — scans every element. HashMap is O(1) — computes a hash and checks one bucket. At 10 items it does not matter. At 10 million it is the difference between instant and unusable.",
  },
};

const INITIAL_CODE = `import java.util.HashMap;
import java.util.HashSet;

public class Main {
    public static void main(String[] args) {

        // ── TASK 1: HashMap ──────────────────────────────────────────
        // Create HashMap<String, String> called 'wardMap'
        // Put: "P001" -> "Cardiology", "P002" -> "Oncology", "P003" -> "Cardiology"
        // Get ward for "P002" and print: "P002 ward: " + result
        // Check if "P004" exists and print: "P004 found: " + result

        // TODO: create wardMap, put 3 entries, get P002, check P004

        // ── TASK 2: HashSet ──────────────────────────────────────────
        // Create HashSet<String> called 'diagnoses'
        // Add: "Hypertension", "Diabetes", "Hypertension", "Asthma"
        // Hypertension is added twice — HashSet silently keeps only one
        // Print: "Unique diagnoses: " + diagnoses.size()

        // TODO: create diagnoses set, add 4 items (1 duplicate), print unique count

    }
}`;

const EXPECTED = `P002 ward: Oncology\nP004 found: false\nUnique diagnoses: 3`;

export default function Level2_16() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);
  return (
    <Stage2Shell levelId={16} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="l216-container">
          <div className="l216-brief">
            <div className="l216-brief-tag">// Build Mission</div>
            <h2>Build lookup structures for your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.</h2>
            <p>Two tasks. Imports are already written above. Write only in the <code style={{color:'#38bdf8'}}>// TODO</code> lines.</p>
            <div className="l216-expected-box">
              <div className="l216-expected-label">Expected output</div>
              <pre className="l216-expected-output">{EXPECTED}</pre>
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