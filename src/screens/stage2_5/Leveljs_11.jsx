// LevelJS_11.jsx — Error Handling
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2_5Shell from './Stage2_5Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import JsEditor from './JsEditor';
import './LevelJS_11.css';

const SUPPORT = {
  intro:{concept:'Error Handling — try/catch/finally',tagline:"Unhandled errors crash your app. try/catch keeps it running with a useful message.",whatYouWillDo:"Write try/catch/finally blocks, throw custom errors, and handle different error types.",whyItMatters:"Every fetch() call can fail. Every JSON.parse() can throw. Every user input can be invalid. In React, unhandled errors crash the entire component tree. Error boundaries and try/catch keep the app alive."},
  hints:["try { risky() } catch (err) { console.log(err.message) } finally { cleanup() }. catch receives the Error object — err.message has the description, err.name has the type.","Throw a custom error: throw new Error('Invalid patient ID'); — the message you pass shows up in err.message.","Different error types: SyntaxError (bad JSON), TypeError (wrong type), RangeError (out of range). catch (err) catches all of them — check err.name or err instanceof TypeError to distinguish."],
  reveal:{concept:'try/catch/finally & Custom Errors',whatYouLearned:"try wraps risky code. catch(err) handles errors — err.message, err.name, err.stack. finally always runs — use for cleanup. throw new Error('msg') creates and throws an error. Error subclasses: TypeError, SyntaxError, RangeError, ReferenceError. instanceof to check type.",realWorldUse:"Every async API call: try { const data = await fetch(url).then(r=>r.json()); } catch(err) { setError(err.message); } finally { setLoading(false); }. This pattern is in every React data-fetching component. The finally block always clears the loading spinner.",developerSays:"Always put setLoading(false) in finally, not just after the await. If the fetch throws, the line after await never runs — your spinner stays forever. Finally is the guarantee."},
};

const INITIAL = `// ── TASK 1: Basic try/catch/finally ─────────────────────────
// The function parsePatient throws if data is null
// Wrap the call in try/catch/finally
// try: call parsePatient(null), print the result
// catch: print "Error: " + err.message
// finally: print "Parse attempt complete"

function parsePatient(data) {
  if (data === null) throw new Error("Patient data is null");
  return "Patient: " + data.name;
}

// TODO

// ── TASK 2: Throw a custom error ─────────────────────────────
// Write function validateAge(age)
// If age < 0 or age > 150, throw new Error("Invalid age: " + age)
// Otherwise return "Age valid: " + age
// Call validateAge(200) inside a try/catch
// catch: print "Caught: " + err.message

// TODO

// ── TASK 3: JSON.parse error ─────────────────────────────────
// Try to JSON.parse the string "not valid json"
// catch the SyntaxError and print: "JSON error: " + err.message

// TODO`;

const EXPECTED = `Error: Patient data is null\nParse attempt complete\nCaught: Invalid age: 200\nJSON error: Unexpected token 'o', "not valid json" is not valid JSON`;

// Note: JSON.parse error message varies by engine — we'll use a flexible check
const EXPECTED_PREFIX = `Error: Patient data is null\nParse attempt complete\nCaught: Invalid age: 200\nJSON error: `;

export default function LevelJS_11() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);

  function handleOutputChange(output, _correct) {
    const lines = output.split('\n');
    const isOk = lines[0] === 'Error: Patient data is null' &&
                 lines[1] === 'Parse attempt complete' &&
                 lines[2] === 'Caught: Invalid age: 200' &&
                 lines[3]?.startsWith('JSON error: ');
    setOk(isOk);
  }

  return (
    <Stage2_5Shell levelId={11} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div className="ljs11-container">
          <div className="ljs11-brief">
            <div className="ljs11-brief-tag">// Build Mission</div>
            <h2>Protect your <span style={{color:selectedDomain?.color}}>{selectedDomain?.name||'system'}</span> from runtime errors.</h2>
            <p>Three tasks. The parsePatient function is locked. Write only in the <code>// TODO</code> lines.</p>
            <div className="ljs11-expected-box">
              <div className="ljs11-expected-label">Expected output</div>
              <pre className="ljs11-expected-output">{'Error: Patient data is null\nParse attempt complete\nCaught: Invalid age: 200\nJSON error: <browser SyntaxError message>'}</pre>
            </div>
          </div>

          <div className="ljs11-anatomy">
            <div className="ljs11-anat-header">// try / catch / finally — anatomy</div>
            <div className="ljs11-structure">
              {[
                {block:'try',     col:'#4ade80', label:'TRY',     desc:'Runs the risky code. If an error is thrown, jumps to catch immediately.'},
                {block:'catch',   col:'#f87171', label:'CATCH',   desc:'Runs only if an error was thrown. err.message has the description. err.name has the type (TypeError, SyntaxError...).'},
                {block:'finally', col:'#a78bfa', label:'FINALLY', desc:'ALWAYS runs — whether try succeeded or catch caught an error. Use for cleanup: clear loading state, close connections.'},
              ].map(b => (
                <div key={b.block} className="ljs11-block" style={{borderLeftColor:b.col}}>
                  <div className="ljs11-block-label" style={{color:b.col}}>{b.label}</div>
                  <div className="ljs11-block-desc">{b.desc}</div>
                </div>
              ))}
            </div>

            <div className="ljs11-anat-header" style={{marginTop:18}}>// Common error types</div>
            <div className="ljs11-method-grid">
              {[
                {sig:'SyntaxError',     note:"JSON.parse('bad'), invalid syntax — thrown by the engine"},
                {sig:'TypeError',       note:"null.name, undefined.push() — wrong type for operation"},
                {sig:'RangeError',      note:'new Array(-1), recursion stack overflow — value out of valid range'},
                {sig:'ReferenceError',  note:"accessing a variable that doesn't exist — myVar is not defined"},
                {sig:'Error',           note:'base class — throw new Error("your message") for custom errors'},
              ].map(r => (
                <div key={r.sig} className="ljs11-method-row">
                  <code className="ljs11-msig">{r.sig}</code>
                  <span className="ljs11-mnote">{r.note}</span>
                </div>
              ))}
            </div>

            <div className="ljs11-mistake">
              <div className="ljs11-mistake-label">⚠ setLoading(false) must go in finally, not after await</div>
              <div className="ljs11-mrows">
                <div className="ljs11-mrow bad"><span className="ljs11-mtag bad-tag">✗</span><code>{'try { const d = await fetch(url); setLoading(false); } catch(e) {}'}</code><span className="ljs11-mnote">if fetch throws, setLoading(false) never runs — spinner stuck forever</span></div>
                <div className="ljs11-mrow good"><span className="ljs11-mtag good-tag">✓</span><code>{'try { const d = await fetch(url); } catch(e) {} finally { setLoading(false); }'}</code><span className="ljs11-mnote">always clears loading — guaranteed</span></div>
              </div>
            </div>
          </div>

          <JsEditor initialCode={INITIAL} expectedOutput={EXPECTED} onOutputChange={handleOutputChange} height={290} />
        </div>
      </LevelSupportWrapper>
    </Stage2_5Shell>
  );
}