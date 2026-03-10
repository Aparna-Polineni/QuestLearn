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

          {/* ── Anatomy ─────────────────────────────────────────────── */}
          <div className="l215-anatomy">

            {/* Side-by-side: Array vs ArrayList */}
            <div className="l215-anatomy-header">// Array vs ArrayList — side by side</div>
            <div className="l215-compare">

              <div className="l215-compare-col array-col">
                <div className="l215-compare-title">
                  <span className="l215-col-badge array-badge">FIXED</span>
                  String[] — Fixed Array
                </div>
                <div className="l215-code-block">
                  <div className="l215-code-line">
                    <span className="l215-tok-type">String</span>
                    <span className="l215-tok-plain">[] wards = </span>
                    <span className="l215-tok-string">{"{"}"Cardiology", "Oncology"{"}"}</span>
                    <span className="l215-tok-plain">;</span>
                  </div>
                  <div className="l215-code-comment">// ← curly braces, size fixed forever</div>
                  <div className="l215-code-line l215-indent">
                    <span className="l215-tok-keyword">for </span>
                    <span className="l215-tok-plain">(</span>
                    <span className="l215-tok-type">String </span>
                    <span className="l215-tok-plain">w : wards) {"{"}</span>
                  </div>
                  <div className="l215-code-comment l215-indent">// ← loop variable is 'w'</div>
                  <div className="l215-code-line l215-indent2">
                    <span className="l215-tok-plain">System.out.println(</span>
                    <span className="l215-tok-name">w</span>
                    <span className="l215-tok-plain">);</span>
                  </div>
                  <div className="l215-code-line l215-indent">{"}"}</div>
                </div>
                <div className="l215-compare-facts">
                  <div className="l215-fact good"><span>✓</span> Syntax: <code>Type[] name = {"{ v1, v2 }"}</code></div>
                  <div className="l215-fact good"><span>✓</span> Fast access: <code>wards[0]</code></div>
                  <div className="l215-fact good"><span>✓</span> <code>.length</code> gives the size</div>
                  <div className="l215-fact bad"><span>✗</span> Size locked — no <code>.add()</code> or <code>.remove()</code></div>
                </div>
              </div>

              <div className="l215-vs-divider">VS</div>

              <div className="l215-compare-col list-col">
                <div className="l215-compare-title">
                  <span className="l215-col-badge list-badge">DYNAMIC</span>
                  ArrayList&lt;String&gt; — Grows &amp; Shrinks
                </div>
                <div className="l215-code-block">
                  <div className="l215-code-line">
                    <span className="l215-tok-type">ArrayList</span>
                    <span className="l215-tok-plain">&lt;</span>
                    <span className="l215-tok-type">String</span>
                    <span className="l215-tok-plain">&gt; queue = </span>
                    <span className="l215-tok-keyword">new </span>
                    <span className="l215-tok-type">ArrayList</span>
                    <span className="l215-tok-plain">&lt;&gt;();</span>
                  </div>
                  <div className="l215-code-comment">// ← empty list, grows as you add</div>
                  <div className="l215-code-line l215-indent">
                    <span className="l215-tok-plain">queue.add(</span>
                    <span className="l215-tok-string">"Alice"</span>
                    <span className="l215-tok-plain">);</span>
                    <span className="l215-code-inline-comment">  // adds to end</span>
                  </div>
                  <div className="l215-code-line l215-indent">
                    <span className="l215-tok-plain">queue.remove(</span>
                    <span className="l215-tok-string">"Bob"</span>
                    <span className="l215-tok-plain">);</span>
                    <span className="l215-code-inline-comment">  // removes by value</span>
                  </div>
                  <div className="l215-code-line l215-indent">
                    <span className="l215-tok-keyword">for </span>
                    <span className="l215-tok-plain">(</span>
                    <span className="l215-tok-type">String </span>
                    <span className="l215-tok-name">name</span>
                    <span className="l215-tok-plain"> : queue) {"{"}</span>
                  </div>
                  <div className="l215-code-line l215-indent2">
                    <span className="l215-tok-plain">System.out.println(</span>
                    <span className="l215-tok-name">name</span>
                    <span className="l215-tok-plain">);</span>
                    <span className="l215-code-inline-comment">  // ← name not queue!</span>
                  </div>
                  <div className="l215-code-line l215-indent">{"}"}</div>
                </div>
                <div className="l215-compare-facts">
                  <div className="l215-fact good"><span>✓</span> <code>add()</code> <code>remove()</code> <code>size()</code> <code>get(i)</code></div>
                  <div className="l215-fact good"><span>✓</span> Must import: <code>java.util.ArrayList</code></div>
                  <div className="l215-fact good"><span>✓</span> <code>&lt;String&gt;</code> means it holds Strings only</div>
                  <div className="l215-fact bad"><span>✗</span> <code>remove("Bob")</code> removes first match only</div>
                </div>
              </div>
            </div>

            {/* ArrayList method quick ref */}
            <div className="l215-anatomy-header" style={{marginTop:'18px'}}>// ArrayList methods you need for this level</div>
            <div className="l215-method-grid">
              {[
                { sig: 'queue.add("Alice")',      ret: 'void',    desc: 'appends "Alice" to the end' },
                { sig: 'queue.remove("Bob")',     ret: 'boolean', desc: 'removes first element matching "Bob"' },
                { sig: 'queue.size()',            ret: 'int',     desc: 'returns number of elements (2 after removing Bob)' },
                { sig: 'queue.get(0)',            ret: 'String',  desc: 'returns element at index 0 — "Alice"' },
                { sig: 'queue.contains("Alice")', ret: 'boolean', desc: 'true if "Alice" is in the list' },
                { sig: 'wards.length',            ret: 'int',     desc: 'for arrays — NOT .length() — no parentheses' },
              ].map(m => (
                <div key={m.sig} className="l215-method-row">
                  <code className="l215-method-sig">{m.sig}</code>
                  <span className="l215-method-ret">→ {m.ret}</span>
                  <span className="l215-method-desc">{m.desc}</span>
                </div>
              ))}
            </div>

            {/* Common mistake */}
            <div className="l215-mistake">
              <div className="l215-mistake-label">⚠ The #1 mistake on this level</div>
              <div className="l215-mistake-rows">
                <div className="l215-mistake-row bad">
                  <span className="l215-mistake-tag bad-tag">✗ Wrong</span>
                  <code>for (String name : queue) {'{ System.out.println(queue); }'}</code>
                  <span className="l215-mistake-note">prints <em>[Alice, Charlie]</em> three times — you used <code>queue</code> not <code>name</code></span>
                </div>
                <div className="l215-mistake-row good">
                  <span className="l215-mistake-tag good-tag">✓ Correct</span>
                  <code>for (String name : queue) {'{ System.out.println(name); }'}</code>
                  <span className="l215-mistake-note">prints each element one per line using the loop variable</span>
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