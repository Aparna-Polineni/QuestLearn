// src/screens/stage2/Level2_17.jsx
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import CodeEditor from './CodeEditor';

const SUPPORT = {
  intro: {
    concept: "Exception Handling — try/catch/finally",
    tagline: "Exceptions are events that break normal program flow. Handle them gracefully or your system crashes.",
    whatYouWillDo: "Write exception handling for a patient record lookup — catching a specific exception, a fallback catch, and a finally block that always runs for cleanup.",
    whyItMatters: "In production, things go wrong: database is down, user sends invalid data, file does not exist. Unhandled exceptions crash your server. try/catch is how you handle failures gracefully and return meaningful error messages to clients instead of a 500 Internal Server Error.",
  },
  hints: [
    "try { risky code } catch (ExceptionType e) { handle it } finally { always runs }. The finally block runs whether an exception was thrown or not — use it for cleanup (closing connections, releasing resources).",
    "You can have multiple catch blocks for different exception types. Java checks them top to bottom — put specific exceptions before general ones. Catching Exception first catches everything and masks specific errors.",
    "throw new IllegalArgumentException(\"message\") manually throws an exception. This is how you signal error conditions from your own code — for example, throwing an exception when a patient ID is negative.",
  ],
  reveal: {
    concept: "try/catch/finally & Exception Types",
    whatYouLearned: "try wraps risky code. catch handles specific exception types. finally always runs (even if exception is thrown). throw manually throws an exception. throws in a method signature declares checked exceptions the caller must handle. Common unchecked exceptions: NullPointerException, IllegalArgumentException, ArrayIndexOutOfBoundsException.",
    realWorldUse: "Spring Boot's @ExceptionHandler and @ControllerAdvice are the framework-level version of try/catch. They catch exceptions thrown anywhere in your controller layer and return proper HTTP responses (400 Bad Request, 404 Not Found, 500 Internal Server Error). Every production API has this — without it every exception becomes a 500 with a stack trace exposed to the client.",
    developerSays: "Never catch Exception as your first catch block — it swallows everything including errors you did not expect. Catch the specific exception you know about. Let unexpected ones propagate up to a global handler. And never, ever write catch (Exception e) {} with an empty body — that is hiding bugs.",
  },
};

const INITIAL = `public class Main {

    // Simulates a patient lookup — throws exception if ID is invalid
    static String findPatient(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("Invalid patient ID: " + id);
        }
        if (id == 999) {
            throw new RuntimeException("Patient record corrupted");
        }
        return "Patient #" + id + ": Alice Smith";
    }

    public static void main(String[] args) {

        // TASK 1: Wrap findPatient(42) in try/catch
        // catch IllegalArgumentException — print: "Bad ID: " + e.getMessage()
        // finally — always print: "Lookup attempt complete"
        // Expected: Patient #42: Alice Smith   then   Lookup attempt complete



        // TASK 2: Wrap findPatient(-1) in try/catch
        // catch IllegalArgumentException — print: "Bad ID: " + e.getMessage()
        // finally — always print: "Lookup attempt complete"
        // Expected: Bad ID: Invalid patient ID: -1   then   Lookup attempt complete


    }
}`;

const EXPECTED = `Patient #42: Alice Smith\nLookup attempt complete\nBad ID: Invalid patient ID: -1\nLookup attempt complete`;

export default function Level2_17() {
  const { selectedDomain } = useGame();
  const [ok, setOk] = useState(false);

  return (
    <Stage2Shell levelId={17} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div style={{ display:'flex', flexDirection:'column', gap:24, paddingBottom:32 }}>
          <div style={{ background:'#0d1117', border:'1px solid #1e293b', borderRadius:16, padding:24 }}>
            <div style={{ fontFamily:'DM Mono,monospace', fontSize:11, color:'#38bdf8', letterSpacing:3, marginBottom:10 }}>// Build Mission</div>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:800, color:'#f1f5f9', marginBottom:8 }}>
              Handle errors in the <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span> patient lookup.
            </h2>
            <p style={{ fontSize:14, color:'#64748b', lineHeight:1.6 }}>
              Wrap two lookups in try/catch/finally blocks. The method already throws exceptions — your job is to handle them gracefully.
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