// src/screens/stage2/Level2_1.jsx
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
      "You will write your first Java program — a Hello World that prints a personalised greeting using your domain name. You will understand why every single piece of the syntax exists before you type it.",
    whyItMatters:
      "Hello World is not trivial. It teaches you the four things every Java program needs: a class, a main method, the exact signature Java looks for, and how to send output to the console. Get this structure in your muscle memory — you will type it hundreds of times.",
  },
  hints: [
    "Every Java program needs a class with the same name as the file. Inside it, the main method must be exactly: public static void main(String[] args). Java will not run it if the signature is wrong by even one word.",
    "To print to the console use System.out.println(\"your text here\"); — the text goes inside double quotes, inside the round brackets, ending with a semicolon. Every statement in Java ends with a semicolon.",
    "The structure is: class name { public static void main(String[] args) { System.out.println(\"Hello\"); } } — three levels of curly braces. Class body, method body, and the statement inside. Count your braces.",
  ],
  reveal: {
    concept: "How Java Programs Run",
    whatYouLearned:
      "You just wrote a complete Java program from scratch. The class declaration tells Java where your code lives. The main method is the entry point — the first thing Java calls when it runs your program. System.out.println sends text to standard output.",
    realWorldUse:
      "In production Spring Boot applications you never write a main method manually — Spring Boot generates one. But understanding what it does is critical. When your Spring Boot app starts, Java calls this exact method. If it fails, nothing runs. Every Java developer knows this method cold.",
    developerSays:
      "I interview Java developers every month. The ones who cannot explain why main must be public static void — and what each word means — always struggle with Spring Boot. The fundamentals are never trivial.",
  },
};

const INITIAL_CODE = `public class Main {
    public static void main(String[] args) {
        // Write your println statement below this line
        
    }
}`;

function Level2_1() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  const expectedOutput = `Hello from ${selectedDomain?.name || 'my project'}!`;

  function handleOutputChange(output, correct) {
    setIsCorrect(correct);
  }

  return (
    <Stage2Shell levelId={1} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper
        conceptIntro={SUPPORT.intro}
        hints={SUPPORT.hints}
        levelComplete={isCorrect}
      >
        <div className="l21-container">

          {/* Task */}
          <div className="l21-task">
            <div className="l21-task-tag">// Your Task</div>
            <h2 className="l21-task-title">
              Print a greeting for your{' '}
              <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name}</span>.
            </h2>
            <p className="l21-task-desc">
              Add a <code>System.out.println</code> statement inside the <code>main</code> method
              that prints exactly:
            </p>
            <div className="l21-expected">
              <span className="l21-expected-label">Expected output</span>
              <code className="l21-expected-output">{expectedOutput}</code>
            </div>
          </div>

          {/* Anatomy breakdown — explains every keyword */}
          <div className="l21-anatomy">
            <div className="l21-anatomy-label">🔬 Anatomy of a Java Program</div>
            <div className="l21-anatomy-grid">
              {[
                { token: 'public',          color: '#f97316', meaning: 'Visible to everything — Java needs to find this class'            },
                { token: 'class Main',      color: '#38bdf8', meaning: 'Declares a class named Main — must match the filename Main.java'  },
                { token: 'public static',   color: '#f97316', meaning: 'static means Java calls this without creating an object first'     },
                { token: 'void',            color: '#38bdf8', meaning: 'This method returns nothing — it just runs and exits'             },
                { token: 'main',            color: '#fbbf24', meaning: 'The exact name Java looks for as the program entry point'         },
                { token: 'String[] args',   color: '#4ade80', meaning: 'Command line arguments — you can pass values when running the app' },
                { token: 'System.out',      color: '#818cf8', meaning: 'System is a class, out is a PrintStream object inside it'         },
                { token: 'println()',       color: '#fbbf24', meaning: 'Prints text and adds a newline at the end'                        },
              ].map(item => (
                <div key={item.token} className="anatomy-item">
                  <code className="anatomy-token" style={{ color: item.color }}>{item.token}</code>
                  <span className="anatomy-meaning">{item.meaning}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Code editor */}
          <CodeEditor
            initialCode={INITIAL_CODE}
            expectedOutput={expectedOutput}
            onOutputChange={handleOutputChange}
            hints={SUPPORT.hints}
            height={240}
          />

          {isCorrect && (
            <div className="l21-success">
              ✓ Your first Java program runs correctly.
              You just executed code on the JVM — the Java Virtual Machine.
            </div>
          )}

        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}

export default Level2_1;