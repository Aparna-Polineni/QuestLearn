// src/screens/stage2/Level2_17.jsx — Exception Handling
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import CodeEditor from './CodeEditor';
import './Level2_17.css';

const SUPPORT = {
  intro: {
    concept: "Exception Handling — try / catch / finally",
    tagline: "Exceptions break normal flow. Handle them or your server crashes.",
    whatYouWillDo: "Write two try/catch/finally blocks around the findPatient() calls that are already written. The method is already there — you just need to wrap the calls safely.",
    whyItMatters: "In production, things go wrong — database down, invalid input, file missing. Unhandled exceptions crash your server. try/catch is how you return meaningful error messages instead of a 500 Internal Server Error.",
  },
  hints: [
    "Structure: try { risky code } catch (ExceptionType e) { handle it } finally { always runs }. The finally block runs whether or not an exception was thrown — use it for cleanup.",
    "findPatient(42) succeeds — print the returned string. findPatient(-1) throws IllegalArgumentException — catch it and print: \"Bad ID: \" + e.getMessage(). Both need a finally printing \"Lookup attempt complete\".",
    "e.getMessage() returns the message that was passed to the exception when it was thrown. IllegalArgumentException was thrown with message \"Invalid patient ID: -1\" — that is what getMessage() returns.",
  ],
  reveal: {
    concept: "try/catch/finally & Exception Types",
    whatYouLearned: "try wraps risky code. catch handles specific exception types — put more specific types before general ones. finally always runs. e.getMessage() returns the exception message. Common unchecked exceptions: NullPointerException, IllegalArgumentException, ArrayIndexOutOfBoundsException.",
    realWorldUse: "Spring Boot's @ExceptionHandler and @ControllerAdvice are the framework-level version of try/catch. They catch exceptions from anywhere in your controller layer and return proper HTTP responses — 400 Bad Request, 404 Not Found, 500 Internal Server Error. Every production API needs this.",
    developerSays: "Never catch Exception as your first block — it swallows everything including bugs you did not expect. Catch the specific exception you know about. And never write catch (Exception e) {} with an empty body. That is hiding bugs.",
  },
};

const INITIAL_CODE = `public class Main {

    // This method is already written — do NOT change it
    // It throws IllegalArgumentException if id <= 0
    static String findPatient(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("Invalid patient ID: " + id);
        }
        return "Patient #" + id + ": Alice Smith";
    }

    public static void main(String[] args) {

        // ── TASK 1: Safe lookup for a valid ID ───────────────────────
        // Wrap findPatient(42) in try/catch/finally
        // try: print the result of findPatient(42)
        // catch IllegalArgumentException: print "Bad ID: " + e.getMessage()
        // finally: always print "Lookup attempt complete"

        // TODO: try { print findPatient(42) } catch (IllegalArgumentException e) { ... } finally { ... }

        // ── TASK 2: Safe lookup for an invalid ID ────────────────────
        // Same structure — but findPatient(-1) WILL throw
        // try: print the result of findPatient(-1)
        // catch IllegalArgumentException: print "Bad ID: " + e.getMessage()
        // finally: always print "Lookup attempt complete"

        // TODO: try { print findPatient(-1) } catch (IllegalArgumentException e) { ... } finally { ... }

    }
}`;

const EXPECTED = `Patient #42: Alice Smith\nLookup attempt complete\nBad ID: Invalid patient ID: -1\nLookup attempt complete`;

export default function Level2_17() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);
  return (
    <Stage2Shell levelId={17} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="l217-container">
          <div className="l217-brief">
            <div className="l217-brief-tag">// Build Mission</div>
            <h2>Add exception handling to your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.</h2>
            <p>The findPatient() method is already written and locked. Write only in the <code style={{color:'#38bdf8'}}>// TODO</code> lines — two try/catch/finally blocks.</p>
            <div className="l217-expected-box">
              <div className="l217-expected-label">Expected output</div>
              <pre className="l217-expected-output">{EXPECTED}</pre>
            </div>
          </div>

          {/* ── Anatomy ───────────────────────────────────────────── */}
          <div className="l217-anatomy">

            {/* Anatomy header */}
            <div className="l217-anatomy-header">// try / catch / finally — complete anatomy</div>

            {/* Full structure diagram */}
            <div className="l217-structure">
              <div className="l217-struct-block try-block">
                <div className="l217-struct-label try-label">try</div>
                <div className="l217-struct-body">
                  <div className="l217-code-line">
                    <span className="l217-tok-keyword">try </span>
                    <span className="l217-tok-plain">{'{'}</span>
                  </div>
                  <div className="l217-code-line l217-indent">
                    <span className="l217-tok-comment">// risky code goes here</span>
                  </div>
                  <div className="l217-code-line l217-indent">
                    <span className="l217-tok-type">String </span>
                    <span className="l217-tok-name">result</span>
                    <span className="l217-tok-plain"> = findPatient(</span>
                    <span className="l217-tok-num">42</span>
                    <span className="l217-tok-plain">);</span>
                  </div>
                  <div className="l217-code-line l217-indent">
                    <span className="l217-tok-plain">System.out.println(</span>
                    <span className="l217-tok-name">result</span>
                    <span className="l217-tok-plain">);</span>
                    <span className="l217-code-inline-comment">  // runs if no exception</span>
                  </div>
                  <div className="l217-code-line">{'}'}</div>
                </div>
                <div className="l217-struct-note">Runs normally. If an exception is thrown, jumps to catch immediately — skips remaining lines.</div>
              </div>

              <div className="l217-struct-block catch-block">
                <div className="l217-struct-label catch-label">catch</div>
                <div className="l217-struct-body">
                  <div className="l217-code-line">
                    <span className="l217-tok-keyword">catch </span>
                    <span className="l217-tok-plain">(</span>
                    <span className="l217-tok-type">IllegalArgumentException </span>
                    <span className="l217-tok-name">e</span>
                    <span className="l217-tok-plain">) {'{'}</span>
                  </div>
                  <div className="l217-code-line l217-indent">
                    <span className="l217-tok-comment">// handles the specific exception</span>
                  </div>
                  <div className="l217-code-line l217-indent">
                    <span className="l217-tok-plain">System.out.println(</span>
                    <span className="l217-tok-string">"Bad ID: "</span>
                    <span className="l217-tok-plain"> + e.getMessage());</span>
                    <span className="l217-code-inline-comment">  // ← e.getMessage() = the error text</span>
                  </div>
                  <div className="l217-code-line">{'}'}</div>
                </div>
                <div className="l217-struct-note">Only runs if the exception type matches. <code>e.getMessage()</code> returns the message passed to <code>throw new ...</code>.</div>
              </div>

              <div className="l217-struct-block finally-block">
                <div className="l217-struct-label finally-label">finally</div>
                <div className="l217-struct-body">
                  <div className="l217-code-line">
                    <span className="l217-tok-keyword">finally </span>
                    <span className="l217-tok-plain">{'{'}</span>
                  </div>
                  <div className="l217-code-line l217-indent">
                    <span className="l217-tok-comment">// ALWAYS runs — success or failure</span>
                  </div>
                  <div className="l217-code-line l217-indent">
                    <span className="l217-tok-plain">System.out.println(</span>
                    <span className="l217-tok-string">"Lookup attempt complete"</span>
                    <span className="l217-tok-plain">);</span>
                  </div>
                  <div className="l217-code-line">{'}'}</div>
                </div>
                <div className="l217-struct-note">Runs whether try succeeded or catch caught an error. Use for cleanup: closing files, releasing connections.</div>
              </div>
            </div>

            {/* Flow diagram: happy path vs exception path */}
            <div className="l217-anatomy-header" style={{marginTop:'18px'}}>// Execution flow — two scenarios</div>
            <div className="l217-flow-grid">
              <div className="l217-flow-col">
                <div className="l217-flow-title good-title">✓ findPatient(42) — Valid ID</div>
                {[
                  { step: 'try block runs', note: 'findPatient(42) returns "Patient #42: Alice Smith"' },
                  { step: 'result printed', note: 'no exception thrown — catch is SKIPPED' },
                  { step: 'finally runs',   note: 'prints "Lookup attempt complete"' },
                ].map((s, i) => (
                  <div key={i} className="l217-flow-step good-step">
                    <span className="l217-flow-num">{i + 1}</span>
                    <div>
                      <div className="l217-flow-step-title">{s.step}</div>
                      <div className="l217-flow-step-note">{s.note}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="l217-flow-col">
                <div className="l217-flow-title bad-title">✗ findPatient(-1) — Throws</div>
                {[
                  { step: 'try block starts', note: 'findPatient(-1) throws IllegalArgumentException' },
                  { step: 'jumps to catch',   note: 'rest of try is skipped — exception matched' },
                  { step: 'catch prints error', note: 'e.getMessage() = "Invalid patient ID: -1"' },
                  { step: 'finally runs',      note: 'always — prints "Lookup attempt complete"' },
                ].map((s, i) => (
                  <div key={i} className="l217-flow-step bad-step">
                    <span className="l217-flow-num">{i + 1}</span>
                    <div>
                      <div className="l217-flow-step-title">{s.step}</div>
                      <div className="l217-flow-step-note">{s.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Common exception types */}
            <div className="l217-anatomy-header" style={{marginTop:'18px'}}>// Common Java exceptions you will catch in the real world</div>
            <div className="l217-method-grid">
              {[
                { sig: 'IllegalArgumentException', desc: 'invalid method argument — e.g. negative ID, null where not allowed' },
                { sig: 'NullPointerException',     desc: 'called method on a null reference — most common Java bug' },
                { sig: 'ArrayIndexOutOfBoundsException', desc: 'accessed index beyond array length' },
                { sig: 'NumberFormatException',    desc: 'Integer.parseInt("abc") — not a valid number' },
                { sig: 'IOException',              desc: 'file not found, network failure — must be caught (checked exception)' },
              ].map(m => (
                <div key={m.sig} className="l217-method-row">
                  <code className="l217-method-sig">{m.sig}</code>
                  <span className="l217-method-desc">{m.desc}</span>
                </div>
              ))}
            </div>

            {/* Common mistake */}
            <div className="l217-mistake">
              <div className="l217-mistake-label">⚠ The mistake that hides bugs forever</div>
              <div className="l217-mistake-rows">
                <div className="l217-mistake-row bad">
                  <span className="l217-mistake-tag bad-tag">✗ Wrong</span>
                  <code>{'catch (Exception e) { }'}</code>
                  <span className="l217-mistake-note">empty catch block — silently swallows ALL exceptions including bugs you didn't expect</span>
                </div>
                <div className="l217-mistake-row good">
                  <span className="l217-mistake-tag good-tag">✓ Correct</span>
                  <code>{'catch (IllegalArgumentException e) { System.out.println(e.getMessage()); }'}</code>
                  <span className="l217-mistake-note">catch specific type, always do something with it</span>
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