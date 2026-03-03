// src/screens/stage2/Level2_16.jsx
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import CodeEditor from './CodeEditor';

const SUPPORT = {
  intro: {
    concept: "HashMap & HashSet",
    tagline: "HashMap: key → value lookups in O(1). HashSet: unique items only, no duplicates.",
    whatYouWillDo: "Build a patient-to-ward mapping using HashMap, and a set of unique diagnoses using HashSet. Understand why these are faster than ArrayList for lookups.",
    whyItMatters: "In real systems you constantly need key→value lookups: patient ID → patient record, username → session, product ID → price. HashMap gives you O(1) access. Without it you would iterate an entire list for every lookup — catastrophically slow at scale.",
  },
  hints: [
    "HashMap: HashMap<String, String> map = new HashMap<>();. Put: map.put(key, value). Get: map.get(key). Check key: map.containsKey(key). Iterate entries: for (Map.Entry<K,V> e : map.entrySet()) { e.getKey(); e.getValue(); }",
    "HashSet: HashSet<String> set = new HashSet<>();. Add: set.add(item). Returns false if already present (no duplicate added). Check: set.contains(item). Size: set.size().",
    "Import both: import java.util.HashMap; import java.util.HashSet; import java.util.Map; — or use import java.util.*; for everything.",
  ],
  reveal: {
    concept: "HashMap, HashSet & O(1) Lookups",
    whatYouLearned: "HashMap stores key-value pairs. get(key) is O(1) — constant time regardless of map size. HashSet stores unique values — adding a duplicate is silently ignored. Both use hash codes internally. Keys in HashMap must have correct equals() and hashCode() — String and Integer do this correctly.",
    realWorldUse: "Spring Boot's application context is essentially a HashMap<String, Object> mapping bean names to bean instances. Redis (a production caching layer) is a distributed HashMap. Every session store, every cache, every lookup table in a backend system is a HashMap under the hood.",
    developerSays: "The interview question I always ask: what is the time complexity of ArrayList.contains() vs HashMap.containsKey()? ArrayList is O(n) — it scans every element. HashMap is O(1) — it computes a hash and checks one bucket. At 10 items it does not matter. At 10 million items, it is the difference between instant and unusable.",
  },
};

const INITIAL = `import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

public class Main {
    public static void main(String[] args) {

        // TASK 1: HashMap — patient ID to ward mapping
        // Create HashMap<String, String> called 'wardMap'
        // Put: "P001" -> "Cardiology", "P002" -> "Oncology", "P003" -> "Cardiology"
        // Get and print ward for "P002"
        // Check if "P004" exists and print: "P004 found: " + result



        // TASK 2: HashSet — unique diagnoses (no duplicates)
        // Create HashSet<String> called 'diagnoses'
        // Add: "Hypertension", "Diabetes", "Hypertension", "Asthma"
        // (Hypertension added twice — HashSet should only keep one)
        // Print unique count: "Unique diagnoses: " + size


    }
}`;

const EXPECTED = `P002 ward: Oncology\nP004 found: false\nUnique diagnoses: 3`;

export default function Level2_16() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);

  return (
    <Stage2Shell levelId={16} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div style={{ display:'flex', flexDirection:'column', gap:24, paddingBottom:32 }}>
          <div style={{ background:'#0d1117', border:'1px solid #1e293b', borderRadius:16, padding:24 }}>
            <div style={{ fontFamily:'DM Mono,monospace', fontSize:11, color:'#38bdf8', letterSpacing:3, marginBottom:10 }}>// Build Mission</div>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:800, color:'#f1f5f9', marginBottom:8 }}>
              Build lookup structures for <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'your system'}</span>.
            </h2>
            <p style={{ fontSize:14, color:'#64748b', lineHeight:1.6 }}>
              HashMap for patient-to-ward lookups. HashSet for unique diagnoses. Match the output exactly — pay attention to the duplicate handling.
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