// src/screens/stage2/Level2_18.jsx — String Manipulation
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import CodeEditor from './CodeEditor';
import './Level2_18.css';

const SUPPORT = {
  intro: {
    concept: "String Manipulation",
    tagline: "Strings are immutable. Every method returns a NEW string — the original never changes.",
    whatYouWillDo: "Write the TODO sections — clean a patient name using trim(), split a CSV medication string, and check/transform a patient code string.",
    whyItMatters: "APIs send raw strings — names with spaces, CSV data to split, codes to format. Every backend developer processes string data constantly. Understanding immutability prevents bugs where you call trim() but forget to assign the result.",
  },
  hints: [
    "Strings are IMMUTABLE — methods return new strings, they do not change the original. Always assign: String cleaned = raw.trim(); Just calling raw.trim() alone does NOTHING — the result is thrown away.",
    "split(\",\") returns a String array. String[] parts = csv.split(\",\"); Then loop: for (String part : parts) { ... }. parts.length gives the count.",
    "contains(\"text\") returns boolean. replace(\"old\", \"new\") returns a new String with replacements. Chain methods: code.replace(\"pat-\", \"PATIENT-\").toUpperCase() — each call returns a new String.",
  ],
  reveal: {
    concept: "String Immutability & Key Methods",
    whatYouLearned: "Strings are immutable — every transformation returns a new String. Key methods: trim(), split(), toUpperCase(), toLowerCase(), contains(), replace(), substring(), length(), equals(). Always assign the result. For building strings in a loop use StringBuilder — concatenating with + in a loop is O(n²).",
    realWorldUse: "In Spring Boot you constantly process String inputs — trimming user form fields, splitting comma-separated tags, formatting output. @RequestParam String name comes in as raw text. Your service layer cleans and validates it using these exact String methods.",
    developerSays: "Production bug I have seen: someone calls name.trim() in a service method and wonders why the database still has trailing spaces. Always assign: name = name.trim(). If you build strings in a loop, use StringBuilder — string concatenation in a loop is O(n²) due to immutability.",
  },
};

const INITIAL_CODE = `public class Main {
    public static void main(String[] args) {

        // ── TASK 1: Clean a patient name ─────────────────────────────
        // rawName has leading and trailing spaces
        // Step 1: trim() the whitespace
        // Step 2: make it title case — first letter upper, rest lower
        // Expected: "Name: Alice smith"
        String rawName = "  alice smith  ";

        // TODO: trim rawName, then use substring(0,1).toUpperCase() + substring(1).toLowerCase()
        // Print: "Name: " + your result

        // ── TASK 2: Split a CSV string ───────────────────────────────
        // Split by "," to get individual medication names
        // Print: "Medications: " + count
        // Then print each one on its own line
        String medications = "Aspirin,Metformin,Lisinopril";

        // TODO: split by "," into String[], print count, then for-each print each drug

        // ── TASK 3: Check and transform a code string ────────────────
        // Check if code contains "00042" and print the boolean
        // Replace "pat-" with "PATIENT-" then toUpperCase and print
        String code = "pat-00042";

        // TODO: print code.contains("00042"), then print code.replace(...).toUpperCase()

    }
}`;

const EXPECTED = `Name: Alice smith\nMedications: 3\nAspirin\nMetformin\nLisinopril\nContains 00042: true\nPATIENT-00042`;

export default function Level2_18() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);
  return (
    <Stage2Shell levelId={18} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="l218-container">
          <div className="l218-brief">
            <div className="l218-brief-tag">// Build Mission</div>
            <h2>Process string data for your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.</h2>
            <p>Three tasks. The variables are declared and locked. Write only in the <code style={{color:'#38bdf8'}}>// TODO</code> lines.</p>
            <div className="l218-expected-box">
              <div className="l218-expected-label">Expected output</div>
              <pre className="l218-expected-output">{EXPECTED}</pre>
            </div>
          </div>

          {/* ── Anatomy ───────────────────────────────────────────── */}
          <div className="l218-anatomy">

            {/* The #1 concept: immutability */}
            <div className="l218-anatomy-header">// The golden rule — strings are IMMUTABLE</div>
            <div className="l218-immutable-box">
              <div className="l218-immutable-cols">
                <div className="l218-immutable-col bad-immut">
                  <div className="l218-immutable-title bad-title">✗ The classic mistake</div>
                  <div className="l218-code-block">
                    <div className="l218-code-line">
                      <span className="l218-tok-type">String </span>
                      <span className="l218-tok-name">name</span>
                      <span className="l218-tok-plain"> = </span>
                      <span className="l218-tok-string">"  alice  "</span>
                      <span className="l218-tok-plain">;</span>
                    </div>
                    <div className="l218-code-line">
                      <span className="l218-tok-name">name</span>
                      <span className="l218-tok-plain">.trim();</span>
                      <span className="l218-code-inline-comment">  // result thrown away!</span>
                    </div>
                    <div className="l218-code-line">
                      <span className="l218-tok-plain">System.out.println(</span>
                      <span className="l218-tok-name">name</span>
                      <span className="l218-tok-plain">);</span>
                      <span className="l218-code-inline-comment">  // still "  alice  "</span>
                    </div>
                  </div>
                  <div className="l218-immutable-note">trim() created a new String but it was discarded. <code>name</code> is unchanged.</div>
                </div>
                <div className="l218-immutable-col good-immut">
                  <div className="l218-immutable-title good-title">✓ Always assign the result</div>
                  <div className="l218-code-block">
                    <div className="l218-code-line">
                      <span className="l218-tok-type">String </span>
                      <span className="l218-tok-name">name</span>
                      <span className="l218-tok-plain"> = </span>
                      <span className="l218-tok-string">"  alice  "</span>
                      <span className="l218-tok-plain">;</span>
                    </div>
                    <div className="l218-code-line">
                      <span className="l218-tok-name">name</span>
                      <span className="l218-tok-plain"> = </span>
                      <span className="l218-tok-name">name</span>
                      <span className="l218-tok-plain">.trim();</span>
                      <span className="l218-code-inline-comment">  // reassign!</span>
                    </div>
                    <div className="l218-code-line">
                      <span className="l218-tok-plain">System.out.println(</span>
                      <span className="l218-tok-name">name</span>
                      <span className="l218-tok-plain">);</span>
                      <span className="l218-code-inline-comment">  // "alice"</span>
                    </div>
                  </div>
                  <div className="l218-immutable-note">Reassign to keep the result. Or: <code>String cleaned = name.trim();</code></div>
                </div>
              </div>
            </div>

            {/* Method reference */}
            <div className="l218-anatomy-header" style={{marginTop:'18px'}}>// String methods reference — all return NEW strings</div>
            <div className="l218-method-grid">
              {[
                { sig: '"  alice  ".trim()',                      ret: '"alice"',         desc: 'removes leading and trailing whitespace' },
                { sig: '"alice".toUpperCase()',                   ret: '"ALICE"',         desc: 'all characters uppercase' },
                { sig: '"ALICE".toLowerCase()',                   ret: '"alice"',         desc: 'all characters lowercase' },
                { sig: '"alice".substring(0, 1)',                 ret: '"a"',             desc: 'chars from index 0 up to (not including) 1' },
                { sig: '"alice".substring(1)',                    ret: '"lice"',          desc: 'everything from index 1 to end' },
                { sig: '"a,b,c".split(",")',                      ret: 'String[]{"a","b","c"}', desc: 'splits on delimiter — returns array' },
                { sig: '"pat-001".replace("pat-","PATIENT-")',    ret: '"PATIENT-001"',   desc: 'replaces all occurrences of first arg' },
                { sig: '"pat-001".contains("001")',               ret: 'true',           desc: 'true if substring is found anywhere' },
                { sig: '"alice".length()',                        ret: '5',              desc: 'number of characters — note: parentheses! (unlike array.length)' },
                { sig: '"Alice".equals("alice")',                 ret: 'false',          desc: 'case-sensitive comparison — never use == for strings' },
              ].map(m => (
                <div key={m.sig} className="l218-method-row">
                  <code className="l218-method-sig">{m.sig}</code>
                  <span className="l218-method-ret">→ {m.ret}</span>
                  <span className="l218-method-desc">{m.desc}</span>
                </div>
              ))}
            </div>

            {/* Task 1 walkthrough: substring title case */}
            <div className="l218-anatomy-header" style={{marginTop:'18px'}}>// Task 1 — how substring() title-cases a string</div>
            <div className="l218-chain-demo">
              <div className="l218-chain-input">
                <span className="l218-chain-label">Start:</span>
                <code className="l218-chain-val">"  alice smith  "</code>
              </div>
              {[
                { op: '.trim()',                    result: '"alice smith"',  note: 'removes spaces' },
                { op: '.substring(0,1)',            result: '"a"',            note: 'first character' },
                { op: '.toUpperCase()',             result: '"A"',            note: 'capitalise it' },
                { op: '+ str.substring(1)',         result: '"A" + "lice smith"', note: 'join with rest' },
                { op: '→ full result',              result: '"Alice smith"',  note: 'final title case' },
              ].map((s, i) => (
                <div key={i} className="l218-chain-step">
                  <span className="l218-chain-op">{s.op}</span>
                  <span className="l218-chain-arrow">→</span>
                  <code className="l218-chain-result">{s.result}</code>
                  <span className="l218-chain-note">{s.note}</span>
                </div>
              ))}
            </div>

            {/* Common mistake: == vs equals */}
            <div className="l218-mistake">
              <div className="l218-mistake-label">⚠ Never compare strings with ==</div>
              <div className="l218-mistake-rows">
                <div className="l218-mistake-row bad">
                  <span className="l218-mistake-tag bad-tag">✗ Wrong</span>
                  <code>if (name == "Alice")</code>
                  <span className="l218-mistake-note">compares object references, not content — almost always false even when the text matches</span>
                </div>
                <div className="l218-mistake-row good">
                  <span className="l218-mistake-tag good-tag">✓ Correct</span>
                  <code>if (name.equals("Alice"))</code>
                  <span className="l218-mistake-note">compares the actual characters — always use <code>.equals()</code> for string comparison</span>
                </div>
              </div>
            </div>

          </div>

          <CodeEditor
            initialCode={INITIAL_CODE}
            expectedOutput={EXPECTED}
            onOutputChange={(_, correct) => setOk(correct)}
            hints={SUPPORT.hints}
            height={380}
            writableMarker="// TODO"
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}