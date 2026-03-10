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

          {/* ── Anatomy ───────────────────────────────────────────── */}
          <div className="l216-anatomy">

            {/* Side-by-side: HashMap vs HashSet */}
            <div className="l216-anatomy-header">// HashMap vs HashSet — side by side</div>
            <div className="l216-compare">

              <div className="l216-compare-col map-col">
                <div className="l216-compare-title">
                  <span className="l216-col-badge map-badge">KEY → VALUE</span>
                  HashMap&lt;K, V&gt;
                </div>
                <div className="l216-code-block">
                  <div className="l216-code-line">
                    <span className="l216-tok-type">HashMap</span>
                    <span className="l216-tok-plain">&lt;</span>
                    <span className="l216-tok-type">String</span>
                    <span className="l216-tok-plain">, </span>
                    <span className="l216-tok-type">String</span>
                    <span className="l216-tok-plain">&gt; map = </span>
                    <span className="l216-tok-keyword">new </span>
                    <span className="l216-tok-type">HashMap</span>
                    <span className="l216-tok-plain">&lt;&gt;();</span>
                  </div>
                  <div className="l216-code-comment">// ← first type = key, second = value</div>
                  <div className="l216-code-line l216-indent">
                    <span className="l216-tok-plain">map.put(</span>
                    <span className="l216-tok-string">"P001"</span>
                    <span className="l216-tok-plain">, </span>
                    <span className="l216-tok-string">"Cardiology"</span>
                    <span className="l216-tok-plain">);</span>
                    <span className="l216-code-inline-comment">  // add entry</span>
                  </div>
                  <div className="l216-code-line l216-indent">
                    <span className="l216-tok-type">String </span>
                    <span className="l216-tok-name">ward</span>
                    <span className="l216-tok-plain"> = map.get(</span>
                    <span className="l216-tok-string">"P001"</span>
                    <span className="l216-tok-plain">);</span>
                    <span className="l216-code-inline-comment">  // → "Cardiology"</span>
                  </div>
                  <div className="l216-code-line l216-indent">
                    <span className="l216-tok-type">boolean </span>
                    <span className="l216-tok-name">has</span>
                    <span className="l216-tok-plain"> = map.containsKey(</span>
                    <span className="l216-tok-string">"P004"</span>
                    <span className="l216-tok-plain">);</span>
                    <span className="l216-code-inline-comment">  // → false</span>
                  </div>
                </div>
                <div className="l216-compare-facts">
                  <div className="l216-fact good"><span>✓</span> <code>put(key, value)</code> — add or overwrite</div>
                  <div className="l216-fact good"><span>✓</span> <code>get(key)</code> — returns value or <code>null</code></div>
                  <div className="l216-fact good"><span>✓</span> <code>containsKey(k)</code> → boolean</div>
                  <div className="l216-fact good"><span>✓</span> O(1) lookup no matter the size</div>
                  <div className="l216-fact bad"><span>✗</span> Putting same key twice overwrites the first value</div>
                </div>
              </div>

              <div className="l216-vs-divider">VS</div>

              <div className="l216-compare-col set-col">
                <div className="l216-compare-title">
                  <span className="l216-col-badge set-badge">UNIQUE ONLY</span>
                  HashSet&lt;E&gt;
                </div>
                <div className="l216-code-block">
                  <div className="l216-code-line">
                    <span className="l216-tok-type">HashSet</span>
                    <span className="l216-tok-plain">&lt;</span>
                    <span className="l216-tok-type">String</span>
                    <span className="l216-tok-plain">&gt; set = </span>
                    <span className="l216-tok-keyword">new </span>
                    <span className="l216-tok-type">HashSet</span>
                    <span className="l216-tok-plain">&lt;&gt;();</span>
                  </div>
                  <div className="l216-code-comment">// ← one type parameter — just the element</div>
                  <div className="l216-code-line l216-indent">
                    <span className="l216-tok-plain">set.add(</span>
                    <span className="l216-tok-string">"Hypertension"</span>
                    <span className="l216-tok-plain">);</span>
                  </div>
                  <div className="l216-code-line l216-indent">
                    <span className="l216-tok-plain">set.add(</span>
                    <span className="l216-tok-string">"Hypertension"</span>
                    <span className="l216-tok-plain">);</span>
                    <span className="l216-code-inline-comment">  // ← silently ignored!</span>
                  </div>
                  <div className="l216-code-line l216-indent">
                    <span className="l216-tok-plain">set.add(</span>
                    <span className="l216-tok-string">"Diabetes"</span>
                    <span className="l216-tok-plain">);</span>
                  </div>
                  <div className="l216-code-line l216-indent">
                    <span className="l216-tok-type">int </span>
                    <span className="l216-tok-name">count</span>
                    <span className="l216-tok-plain"> = set.size();</span>
                    <span className="l216-code-inline-comment">  // → 2</span>
                  </div>
                </div>
                <div className="l216-compare-facts">
                  <div className="l216-fact good"><span>✓</span> <code>add(val)</code> — ignored if already exists</div>
                  <div className="l216-fact good"><span>✓</span> <code>contains(val)</code> → boolean</div>
                  <div className="l216-fact good"><span>✓</span> <code>size()</code> — number of unique elements</div>
                  <div className="l216-fact good"><span>✓</span> Perfect for deduplication</div>
                  <div className="l216-fact bad"><span>✗</span> No get() — no index access, no order</div>
                </div>
              </div>
            </div>

            {/* Method quick-ref */}
            <div className="l216-anatomy-header" style={{marginTop:'18px'}}>// Methods you need for this level</div>
            <div className="l216-method-grid">
              {[
                { sig: 'map.put("P001", "Cardiology")', ret: 'void',    desc: 'stores key "P001" mapped to "Cardiology"' },
                { sig: 'map.get("P002")',               ret: 'String',  desc: 'returns value for key — null if key missing' },
                { sig: 'map.containsKey("P004")',       ret: 'boolean', desc: 'true if key exists in map' },
                { sig: 'map.size()',                    ret: 'int',     desc: 'number of key-value pairs' },
                { sig: 'set.add("Hypertension")',       ret: 'boolean', desc: 'adds value; returns false if already present' },
                { sig: 'set.size()',                    ret: 'int',     desc: 'number of unique elements' },
                { sig: 'set.contains("Asthma")',        ret: 'boolean', desc: 'true if value is in the set' },
              ].map(m => (
                <div key={m.sig} className="l216-method-row">
                  <code className="l216-method-sig">{m.sig}</code>
                  <span className="l216-method-ret">→ {m.ret}</span>
                  <span className="l216-method-desc">{m.desc}</span>
                </div>
              ))}
            </div>

            {/* Visual: how HashMap stores data */}
            <div className="l216-anatomy-header" style={{marginTop:'18px'}}>// What the HashMap looks like in memory after put()</div>
            <div className="l216-visual-map">
              {[
                { key: '"P001"', val: '"Cardiology"' },
                { key: '"P002"', val: '"Oncology"' },
                { key: '"P003"', val: '"Cardiology"' },
              ].map(row => (
                <div key={row.key} className="l216-map-row">
                  <span className="l216-map-key">{row.key}</span>
                  <span className="l216-map-arrow">→</span>
                  <span className="l216-map-val">{row.val}</span>
                </div>
              ))}
              <div className="l216-map-note">map.get("P002") jumps directly to "Oncology" in O(1) — no scanning</div>
            </div>

            {/* Common mistake */}
            <div className="l216-mistake">
              <div className="l216-mistake-label">⚠ Most common mistake — get() returns null</div>
              <div className="l216-mistake-rows">
                <div className="l216-mistake-row bad">
                  <span className="l216-mistake-tag bad-tag">✗ Wrong</span>
                  <code>System.out.println(map.get("P004"));</code>
                  <span className="l216-mistake-note">prints <em>null</em> — key doesn't exist. Use containsKey() first.</span>
                </div>
                <div className="l216-mistake-row good">
                  <span className="l216-mistake-tag good-tag">✓ Correct</span>
                  <code>System.out.println("P004 found: " + map.containsKey("P004"));</code>
                  <span className="l216-mistake-note">prints <em>P004 found: false</em> — safe boolean check</span>
                </div>
              </div>
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