// src/screens/stage2/Level2_1.jsx
// Updated to use the new CodeEditor v3 with locked lines
// The // TODO line becomes the only editable slot

import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import CodeEditor from './CodeEditor';
import './Level2_1.css';

const SUPPORT = {
  intro: {
    concept: "How Java Programs Run",
    tagline: "Every Java program starts with a single method: main.",
    whatYouWillDo:
      "You will write your first Java program — a Hello World that prints a greeting. Every single word in the starter code is explained before you touch it.",
    whyItMatters:
      "Hello World is not trivial. It teaches you the four things every Java program needs: a class, a main method, the exact signature Java looks for, and how to send output to the screen. This structure repeats in every Java file you will ever write.",
  },
  hints: [
    // These appear when the Hint button is clicked — give direction, NOT the answer
    "You need System.out.println() — that is the method Java uses to print to the console. What goes inside the brackets? Your greeting as a String in double quotes.",
    "A String in Java goes inside double quotes: \"like this\". Your println should look like: System.out.println(\"...\"); — replace ... with your actual greeting text.",
    "The expected output is shown below the editor. Your text inside the quotes must match it exactly — capital letters, punctuation, exclamation mark and all.",
  ],
  reveal: {
    concept: "How Java Programs Run",
    whatYouLearned:
      "You just ran a complete Java program. The class is the container. The main method is the entry point — the first thing the JVM calls. System.out.println sends text to the console. Every Java program ever written follows this exact same structure.",
    realWorldUse:
      "When you deploy a Spring Boot hospital app to a server, Java boots up, finds the main method, and starts listening for patient requests. If the main method has an error, nothing starts — no API, no login page, nothing. Senior developers memorise this structure because it is the heartbeat of every Java application.",
    developerSays:
      "I interview Java developers every month. The ones who cannot explain why main must be public static void — and what each word means — always struggle with Spring Boot. The fundamentals are never trivial.",
  },
};

// ── Anatomy — real-world explanations ─────────────────────────────────────
const ANATOMY = [
  { token: 'public class Main', color: '#38bdf8', icon: '🏢',
    realWorld: 'Think of a class like a building. It groups everything related together. "Main" is the building\'s name — Java requires the filename to match (Main.java). Every piece of Java code lives inside a class.' },
  { token: 'public static', color: '#f97316', icon: '⚡',
    realWorld: 'public = anyone can see this. static = Java can call it without creating an object first. When your program starts, no objects exist yet — so main must be static. It is the bootstrap that creates everything else.' },
  { token: 'void', color: '#818cf8', icon: '↩️',
    realWorld: 'Means this method gives nothing back. When main finishes, the program ends — there is nobody waiting for a return value. Contrast with calculateBMI() which would return a double.' },
  { token: 'main', color: '#fbbf24', icon: '🚪',
    realWorld: 'This exact name is hardcoded into the JVM. When you run java Main, the JVM hunts for a method named main with this exact signature. Rename it to start and nothing runs.' },
  { token: 'String[] args', color: '#4ade80', icon: '📋',
    realWorld: 'A list of text values you can pass when launching the app. Spring Boot uses this to accept configuration at startup like --port=8080. You will use it heavily in later stages.' },
  { token: 'System.out.println()', color: '#c084fc', icon: '🖨️',
    realWorld: 'System is a built-in class. out is the console output stream inside it. println is the method that prints your text and moves to the next line. In a real server app this is replaced by a logger — same concept, different destination.' },
];

// ── Initial code — only the // TODO line is editable ──────────────────────
// Everything else is locked: student reads it, understands it, cannot change it
function buildInitialCode(domainName) {
  return `// Every Java program lives inside a class.
// The class name must match the filename: Main.java
public class Main {

    // Java starts here — this method signature must be exact.
    public static void main(String[] args) {

        // TODO: use System.out.println() to print: Hello from ${domainName}!

    }

}`;
}

// ── Component ──────────────────────────────────────────────────────────────
function Level2_1() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  const domainName     = selectedDomain?.name || 'my project';
  const expectedOutput = `Hello from ${domainName}!`;

  return (
    <Stage2Shell levelId={1} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper
        conceptIntro={SUPPORT.intro}
        hints={SUPPORT.hints}
        levelComplete={isCorrect}
      >
        <div className="l21-container">

          {/* Task card */}
          <div className="l21-task">
            <div className="l21-task-tag">// Your Task</div>
            <h2 className="l21-task-title">
              Print a greeting for your{' '}
              <span style={{ color: selectedDomain?.color || '#38bdf8' }}>{domainName}</span>.
            </h2>
            <p className="l21-task-desc">
              The grey lines are already written — read them to understand the structure.
              The <span className="l21-highlight-word">blue highlighted line</span> is yours to write.
              Add a <code>System.out.println</code> statement that prints exactly:
            </p>
            <div className="l21-expected">
              <span className="l21-expected-label">Expected output</span>
              <code className="l21-expected-output">{expectedOutput}</code>
            </div>
          </div>

          {/* Anatomy section */}
          <div className="l21-anatomy">
            <div className="l21-anatomy-header">
              <span className="l21-anatomy-label">🔬 What every keyword means</span>
            </div>
            <div className="l21-anatomy-grid">
              {ANATOMY.map(item => (
                <div key={item.token} className="l21-anatomy-card">
                  <div className="l21-anatomy-card-top">
                    <span className="l21-anatomy-icon">{item.icon}</span>
                    <code className="l21-anatomy-token" style={{ color: item.color }}>{item.token}</code>
                  </div>
                  <p className="l21-anatomy-explain">{item.realWorld}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Code editor — locked lines + one writable TODO slot */}
          <div className="l21-editor-section">
            <div className="l21-editor-header">
              <span className="l21-editor-label">// Main.java</span>
              <span className="l21-editor-tip">
                Grey lines are locked. The <span style={{color:'#38bdf8'}}>highlighted line</span> is where you write.
              </span>
            </div>
            <CodeEditor
              initialCode={buildInitialCode(domainName)}
              expectedOutput={expectedOutput}
              onOutputChange={(_, correct) => setIsCorrect(correct)}
              hints={SUPPORT.hints}
              height={280}
              writableMarker="// TODO"
            />
          </div>

          {/* Success */}
          {isCorrect && (
            <div className="l21-success">
              <span className="l21-success-icon">✓</span>
              <div>
                <div className="l21-success-title">Your first Java program runs correctly.</div>
                <div className="l21-success-sub">
                  You just executed code on the JVM — the Java Virtual Machine.
                  The same machine that runs Netflix, LinkedIn, and every major hospital system.
                </div>
              </div>
            </div>
          )}

        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}

export default Level2_1;