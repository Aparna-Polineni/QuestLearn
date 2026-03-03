// src/screens/stage2/Level2_5.jsx
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from './FillEditor';
import './Level2_5.css';

const SUPPORT = {
  intro: {
    concept: "Loops — for, while, for-each",
    tagline: "Do something repeatedly without writing it repeatedly. Loops are automation at the code level.",
    whatYouWillDo: "You will use a for loop to process a list of patients, a while loop to simulate a waiting room queue, and understand when to use each.",
    whyItMatters: "Without loops, processing 1000 records requires writing 1000 lines. With a loop, it takes 3. Every database query result, every list of products, every batch job — processed by a loop.",
  },
  hints: [
    "for loop structure: for (initialise; condition; update) { body }. Example: for (int i = 0; i < 5; i++) — starts i at 0, runs while i is less than 5, increments i each time. Runs 5 times (i = 0,1,2,3,4).",
    "while loop structure: while (condition) { body }. The condition is checked before each iteration. If it starts false, the body never runs. Always make sure the condition eventually becomes false or you get an infinite loop.",
    "The for-each loop: for (Type item : collection) — iterates over every element in an array or collection without needing an index. Cleaner and safer than a manual for loop when you do not need the index.",
  ],
  reveal: {
    concept: "Iteration with for and while Loops",
    whatYouLearned: "for loops are best when you know the number of iterations in advance. while loops are best when the stop condition depends on something that changes inside the loop. for-each is cleanest for iterating over collections. All three reduce repeated code to a single pattern.",
    realWorldUse: "In Spring Boot, the JPA repository returns a List<Patient>. You loop through it to build a response DTO, apply filters, calculate totals. Every time your API returns a list of data — patients, orders, products — a loop is doing the heavy lifting behind the scenes.",
    developerSays: "New developers write the same operation ten times manually. Experienced developers write a loop. The moment you find yourself copy-pasting a block of code and changing one number — stop. That is a loop waiting to be written.",
  },
};

const TEMPLATE = `public class Main {
    public static void main(String[] args) {

        // for loop — process 5 patients
        System.out.println("Processing patients:");
        ___FOR___ (int i = 1; i ___LTE___ 5; i___INC___) {
            System.out.println("  Patient #" + i + " processed");
        }

        // while loop — drain a waiting queue
        int queue = 3;
        System.out.println("Waiting room queue:");
        ___WHILE___ (queue ___GT___ 0) {
            System.out.println("  Calling patient from queue. Remaining: " + queue);
            queue___DEC___;
        }

        System.out.println("Queue empty. Done.");
    }
}`;

const BLANKS = [
  { id: 'FOR',   answer: 'for',   placeholder: 'keyword', hint: 'The for loop keyword. Followed by (init; condition; update).' },
  { id: 'LTE',   answer: '<=',    placeholder: 'op',      hint: 'Less than or equal. Loop runs while i is 1, 2, 3, 4, 5.' },
  { id: 'INC',   answer: '++',    placeholder: 'op',      hint: 'Increment. Adds 1 to i each iteration.' },
  { id: 'WHILE', answer: 'while', placeholder: 'keyword', hint: 'The while loop keyword. Condition checked before each iteration.' },
  { id: 'GT',    answer: '>',     placeholder: 'op',      hint: 'Greater than. Loop runs as long as queue has patients.' },
  { id: 'DEC',   answer: '--',    placeholder: 'op',      hint: 'Decrement. Removes one from queue each iteration.' },
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
            <p>Fill in the keywords and operators to run both loops. Trace through the logic — how many times does each loop execute?</p>

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
            expectedOutput={`Processing patients:\n  Patient #1 processed\n  Patient #2 processed\n  Patient #3 processed\n  Patient #4 processed\n  Patient #5 processed\nWaiting room queue:\n  Calling patient from queue. Remaining: 3\n  Calling patient from queue. Remaining: 2\n  Calling patient from queue. Remaining: 1\nQueue empty. Done.`}
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}