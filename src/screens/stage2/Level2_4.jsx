// src/screens/stage2/Level2_4.jsx
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from './FillEditor';
import './Level2_4.css';

const SUPPORT = {
  intro: {
    concept: "Conditionals — if / else if / else",
    tagline: "Code that makes decisions. The foundation of all program logic.",
    whatYouWillDo: "You will write an if/else if/else chain that categorises a patient's priority level based on their vitals. You will use comparison operators and boolean conditions.",
    whyItMatters: "Every real system makes decisions — is this user authorised? Is this payment valid? Is this stock level low? Conditionals are how code branches. Every if statement you write in this level maps directly to business logic in a real application.",
  },
  hints: [
    "Comparison operators: == (equal), != (not equal), > (greater than), < (less than), >= (greater or equal), <= (less or equal). Note: == compares values, not object identity — for Strings, use .equals().",
    "The if/else if/else chain executes the FIRST matching branch and skips the rest. Order matters — put the most specific conditions first.",
    "Boolean logic: && means AND (both must be true), || means OR (either can be true), ! means NOT (flips true to false). Use parentheses to make complex conditions clear.",
  ],
  reveal: {
    concept: "Conditional Logic & Branching",
    whatYouLearned: "if/else if/else creates decision branches in code. Java evaluates conditions top to bottom and executes the first true branch. Comparison operators (==, !=, <, >, <=, >=) produce boolean results. Logical operators (&&, ||, !) combine conditions.",
    realWorldUse: "In a hospital triage system, conditionals decide which patients get seen first. In a banking app, they check if a transfer amount exceeds the balance. In an e-commerce checkout, they apply the right discount tier. Every piece of business logic is ultimately a chain of conditionals.",
    developerSays: "I once saw a production bug where someone used = instead of == inside an if condition. In Java that is a compile error (you cannot assign to a non-boolean inside an if). That is one reason to prefer Java over C — the compiler catches the mistake.",
  },
};

const TEMPLATE = `public class Main {
    public static void main(String[] args) {

        int heartRate = 115;
        int systolic  = 145;

        String priority;

        ___IF___ (heartRate > 130 || systolic > 180) {
            // Critical — both conditions dangerous
            priority = "CRITICAL";
        } ___ELIF___ (heartRate > 100 || systolic > 140) {
            // High — one condition borderline
            priority = "HIGH";
        } ___ELIF___ (heartRate >= 60 && systolic <= 120) {
            // Normal — within healthy range
            priority = "NORMAL";
        } ___ELSE___ {
            // Elevated but not high — monitor
            priority = "ELEVATED";
        }

        System.out.println("Heart rate: " + heartRate);
        System.out.println("Systolic: " + systolic);
        System.out.println("Priority: " + priority);
    }
}`;

const BLANKS = [
  { id: 'IF',   answer: 'if',      placeholder: 'keyword', hint: 'The opening keyword of a conditional block.' },
  { id: 'ELIF', answer: 'else if', placeholder: 'keyword', hint: 'Second condition — only checked if the first was false.' },
  { id: 'ELIF2',answer: 'else if', placeholder: 'keyword', hint: 'Third condition — checked only if both above were false.' },
  { id: 'ELSE', answer: 'else',    placeholder: 'keyword', hint: 'The catch-all — runs when no condition above was true.' },
];

// Remap — template uses ELIF twice, blanks need unique IDs
const TEMPLATE_FIXED = `public class Main {
    public static void main(String[] args) {

        int heartRate = 115;
        int systolic  = 145;

        String priority;

        ___IF___ (heartRate > 130 || systolic > 180) {
            priority = "CRITICAL";
        } ___ELIF1___ (heartRate > 100 || systolic > 140) {
            priority = "HIGH";
        } ___ELIF2___ (heartRate >= 60 && systolic <= 120) {
            priority = "NORMAL";
        } ___ELSE___ {
            priority = "ELEVATED";
        }

        System.out.println("Heart rate: " + heartRate);
        System.out.println("Systolic: " + systolic);
        System.out.println("Priority: " + priority);
    }
}`;

const BLANKS_FIXED = [
  { id: 'IF',    answer: 'if',      placeholder: 'keyword', hint: 'Opening conditional keyword.' },
  { id: 'ELIF1', answer: 'else if', placeholder: 'keyword', hint: 'Second branch — only checked if first was false.' },
  { id: 'ELIF2', answer: 'else if', placeholder: 'keyword', hint: 'Third branch — only checked if first two were false.' },
  { id: 'ELSE',  answer: 'else',    placeholder: 'keyword', hint: 'Default branch — runs when no condition matched.' },
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
            <p>Fill in the 4 conditional keywords to build a triage decision chain. The output is determined by a heart rate of 115 and systolic of 145 — trace through the logic to predict which branch runs.</p>

            <div className="l24-logic-hint">
              <div className="l24-logic-row"><span className="l24-logic-op">{'||'}</span><span>OR — either condition must be true</span></div>
              <div className="l24-logic-row"><span className="l24-logic-op">{'&&'}</span><span>AND — both conditions must be true</span></div>
              <div className="l24-logic-row"><span className="l24-logic-op">{'>'}</span><span>Greater than (strictly)</span></div>
              <div className="l24-logic-row"><span className="l24-logic-op">{'>='}</span><span>Greater than or equal to</span></div>
            </div>
          </div>

          <FillEditor
            template={TEMPLATE_FIXED}
            blanks={BLANKS_FIXED}
            onAllCorrect={() => setIsCorrect(true)}
            expectedOutput={`Heart rate: 115\nSystolic: 145\nPriority: HIGH`}
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}