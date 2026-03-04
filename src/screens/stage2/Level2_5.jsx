// src/screens/stage2/Level2_5.jsx
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from './FillEditor';
import './Level2_5.css';

// ── What this level teaches ───────────────────────────────────────────────
// Loops — for loop, while loop, keywords and operators
// Fill mode: student fills in loop keywords (for, while) and operators (<= > ++ --)
// Comments explain the loop structure piece by piece
// ─────────────────────────────────────────────────────────────────────────

const SUPPORT = {
  intro: {
    concept: "Loops — for and while",
    tagline: "Do something repeatedly without writing it repeatedly.",
    whatYouWillDo: "Fill in the loop keywords and operators. The body of each loop is already written. Your job is to fill in the keywords that START the loop and the operators that CONTROL how long it runs.",
    whyItMatters: "Without loops, processing 1000 records requires writing 1000 lines. With a loop, it takes 3. Every database query result, every list of products, every batch job — processed by a loop.",
  },
  hints: [
    "for loop structure: for (initialise; condition; update). Example: for (int i = 1; i <= 5; i++) — starts i at 1, runs WHILE i is less than or equal to 5, adds 1 each time. Runs 5 times.",
    "while loop structure: while (condition). The condition is checked BEFORE each run. If queue starts at 3 and we do queue-- each time, the loop runs 3 times (queue = 3, 2, 1) then stops when queue = 0.",
    "Operators: <= means 'less than or equal to'. > means 'strictly greater than'. ++ adds 1 (used in for loop update). -- subtracts 1 (used to drain the queue counter).",
  ],
  reveal: {
    concept: "Iteration with for and while Loops",
    whatYouLearned: "for loops are best when you know the number of iterations upfront. while loops are best when the stop condition changes inside the loop body. Both evaluate a condition before each run — if it starts false, the body never runs. for-each (for Type item : collection) is the cleanest way to iterate collections.",
    realWorldUse: "In Spring Boot, JPA's findAll() returns a List<Patient>. You loop through it to build a response, apply filters, calculate totals. Every time your API returns a list of data, a loop is doing the heavy lifting.",
    developerSays: "The moment you find yourself copy-pasting a block of code and changing one number — stop. That is a loop waiting to be written.",
  },
};

const TEMPLATE = `public class Main {
    public static void main(String[] args) {

        // for loop — used when you know the count upfront
        // Structure: for (start; condition; update)
        // i starts at 1, loop runs WHILE i <= 5, i increases by 1 each time
        System.out.println("Processing patients:");
        ___FOR___ (int i = 1; i ___LTE___ 5; i___INC___) {
            System.out.println("  Patient #" + i + " processed");
        }

        // while loop — used when the stop condition changes inside the loop
        // Checks queue > 0 before each run
        // queue-- inside the loop makes it eventually false
        int queue = 3;
        System.out.println("Waiting room queue:");
        ___WHILE___ (queue ___GT___ 0) {
            System.out.println("  Calling patient from queue. Remaining: " + queue);
            queue___DEC___;   // decrements queue by 1 each iteration
        }

        System.out.println("Queue empty. Done.");
    }
}`;

const BLANKS = [
  { id: 'FOR',   answer: 'for',   placeholder: 'keyword', hint: 'Opens a for loop. Followed by (init; condition; update) in brackets.' },
  { id: 'LTE',   answer: '<=',    placeholder: 'op',      hint: 'Less than or EQUAL to. Loop runs while i is 1, 2, 3, 4, 5.' },
  { id: 'INC',   answer: '++',    placeholder: 'op',      hint: 'Increment. Adds 1 to i after each run. Goes right after i.' },
  { id: 'WHILE', answer: 'while', placeholder: 'keyword', hint: 'Opens a while loop. Followed by (condition) in brackets.' },
  { id: 'GT',    answer: '>',     placeholder: 'op',      hint: 'Greater than (strictly). Loop runs while queue has any patients.' },
  { id: 'DEC',   answer: '--',    placeholder: 'op',      hint: 'Decrement. Removes one from the queue counter each iteration.' },
];

export default function Level2_5() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage2Shell levelId={5} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l25-container">

          <div className="l25-brief">
            <div className="l25-brief-tag">// Mission Brief</div>
            <h2>Process the queue for your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.</h2>
            <p>
              Fill in 6 keywords and operators. Read the comments in the code — they explain
              exactly what each loop does and how many times it runs.
            </p>
            <div className="l25-loop-compare">
              <div className="l25-loop-box">
                <div className="l25-loop-type">for loop</div>
                <div className="l25-loop-code">for (init; condition; update)</div>
                <div className="l25-loop-when">Use when: you know the count upfront</div>
              </div>
              <div className="l25-loop-box">
                <div className="l25-loop-type">while loop</div>
                <div className="l25-loop-code">while (condition)</div>
                <div className="l25-loop-when">Use when: stop condition changes inside the loop</div>
              </div>
            </div>
          </div>

          <FillEditor
            template={TEMPLATE}
            blanks={BLANKS}
            onAllCorrect={() => setIsCorrect(true)}
            expectedOutput={"Processing patients:\n  Patient #1 processed\n  Patient #2 processed\n  Patient #3 processed\n  Patient #4 processed\n  Patient #5 processed\nWaiting room queue:\n  Calling patient from queue. Remaining: 3\n  Calling patient from queue. Remaining: 2\n  Calling patient from queue. Remaining: 1\nQueue empty. Done."}
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}