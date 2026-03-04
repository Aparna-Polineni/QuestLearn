// src/screens/stage2/Level2_4.jsx
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from './FillEditor';
import './Level2_4.css';

// ── What this level teaches ───────────────────────────────────────────────
// Conditionals — if / else if / else keywords
// Fill mode: student fills in the 4 KEYWORD blanks only
// Comments explain each branch and what happens when the condition is false
// ─────────────────────────────────────────────────────────────────────────

const SUPPORT = {
  intro: {
    concept: "Conditionals — if / else if / else",
    tagline: "Code that makes decisions. The foundation of all program logic.",
    whatYouWillDo: "Fill in the 4 conditional keywords. The conditions, variable values, and print statements are already written. Read the comments to understand which branch will run given heart rate 115 and systolic 145.",
    whyItMatters: "Every real system makes decisions — is this user authorised? Is this payment valid? Is this stock level low? Conditionals are how code branches. Every if statement maps directly to a business rule.",
  },
  hints: [
    "The structure is: if (condition) { } else if (condition) { } else { }. Java evaluates top to bottom and executes ONLY the first matching branch — everything else is skipped.",
    "Order matters. Put the most specific or most dangerous condition first. In triage: check CRITICAL before HIGH so critical patients are never misclassified as high priority.",
    "Boolean operators: || means OR (either condition triggers the branch). && means AND (both must be true). With heartRate=115 and systolic=145, trace which branch triggers first.",
  ],
  reveal: {
    concept: "Conditional Logic & Branching",
    whatYouLearned: "if/else if/else creates decision branches. Java evaluates conditions top to bottom and runs only the first true branch. Comparison operators (==, !=, <, >, <=, >=) produce booleans. Logical operators (&& ||) combine conditions. The else block is the catch-all — runs when nothing above matched.",
    realWorldUse: "In a hospital triage system, conditionals decide which patients get seen first. In a banking app, they check if a transfer exceeds the balance. In an e-commerce checkout, they apply the right discount tier. Every piece of business logic is ultimately a chain of if/else if/else.",
    developerSays: "I once saw a production bug where someone used = instead of == in a condition. In Java that is a compile error — you cannot assign to a non-boolean inside an if. That is one reason to prefer Java over C — the compiler catches this immediately.",
  },
};

// ── Logic operators shown for reference ───────────────────────────────────
const LOGIC_OPS = [
  { op: '||',  meaning: 'OR — either condition triggers the branch' },
  { op: '&&',  meaning: 'AND — both conditions must be true' },
  { op: '>',   meaning: 'Greater than (strictly — does NOT include equal)' },
  { op: '>=',  meaning: 'Greater than or equal to' },
];

// ── Template: comments trace the logic for the student ────────────────────
const TEMPLATE = `public class Main {
    public static void main(String[] args) {

        int heartRate = 115;
        int systolic  = 145;

        // We will fill this in as we go through the branches
        String priority;

        // Branch 1: Check for CRITICAL — highest danger, checked first
        // Condition: heartRate > 130 OR systolic > 180
        // With our values (115, 145): 115 > 130 is false, 145 > 180 is false → SKIP
        ___IF___ (heartRate > 130 || systolic > 180) {
            priority = "CRITICAL";

        // Branch 2: Check for HIGH — one reading is borderline
        // Condition: heartRate > 100 OR systolic > 140
        // With our values: 115 > 100 is TRUE → this branch RUNS
        } ___ELIF1___ (heartRate > 100 || systolic > 140) {
            priority = "HIGH";

        // Branch 3: Check for NORMAL — both readings healthy
        // Only reached if neither CRITICAL nor HIGH matched
        } ___ELIF2___ (heartRate >= 60 && systolic <= 120) {
            priority = "NORMAL";

        // Branch 4: Catch-all — elevated but not high
        // Runs when no condition above was true
        } ___ELSE___ {
            priority = "ELEVATED";
        }

        System.out.println("Heart rate: " + heartRate);
        System.out.println("Systolic: " + systolic);
        System.out.println("Priority: " + priority);
    }
}`;

const BLANKS = [
  { id: 'IF',    answer: 'if',      placeholder: 'keyword', hint: 'Opens the conditional block. Always the first keyword.' },
  { id: 'ELIF1', answer: 'else if', placeholder: 'keyword', hint: 'Second branch — only checked if the first was false. Two words.' },
  { id: 'ELIF2', answer: 'else if', placeholder: 'keyword', hint: 'Third branch — only reached if both above were false. Same two words.' },
  { id: 'ELSE',  answer: 'else',    placeholder: 'keyword', hint: 'Catch-all — runs when no condition above matched. No condition, no brackets.' },
];

export default function Level2_4() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage2Shell levelId={4} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l24-container">

          <div className="l24-brief">
            <div className="l24-brief-tag">// Mission Brief</div>
            <h2>Triage logic for your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.</h2>
            <p>
              Fill in 4 conditional keywords. Before you do — trace through the logic yourself.
              With heartRate=115 and systolic=145, which branch runs?
            </p>
            <div className="l24-logic-hint">
              {LOGIC_OPS.map(o => (
                <div key={o.op} className="l24-logic-row">
                  <span className="l24-logic-op">{o.op}</span>
                  <span>{o.meaning}</span>
                </div>
              ))}
            </div>
          </div>

          <FillEditor
            template={TEMPLATE}
            blanks={BLANKS}
            onAllCorrect={() => setIsCorrect(true)}
            expectedOutput="Heart rate: 115\nSystolic: 145\nPriority: HIGH"
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}