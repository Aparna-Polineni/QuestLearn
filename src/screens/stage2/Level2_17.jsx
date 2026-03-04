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

// ── Starter: findPatient method is pre-written and locked ─────────────────
// Student writes try/catch/finally blocks around the two calls
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