// src/screens/stage2/Level2_3.jsx
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from './FillEditor';
import './Level2_3.css';

// ── What this level teaches ───────────────────────────────────────────────
// Operators & Arithmetic — division, modulo, compound assignment, increment
// Fill mode: student fills in the OPERATOR symbols only
// Comments explain WHY each operator exists and what its quirks are
// ─────────────────────────────────────────────────────────────────────────

const SUPPORT = {
  intro: {
    concept: "Operators & Arithmetic",
    tagline: "Java uses the same maths operators you know — plus % (remainder) and shortcuts like +=.",
    whatYouWillDo: "Fill in 5 operator symbols. The variables and println statements are already written. Pay attention to integer division — one calculation gives a different result than you might expect.",
    whyItMatters: "Every backend system does arithmetic — calculating totals, discounts, remainders, averages. Understanding integer division prevents a whole class of bugs where you expect 2.5 but silently get 2.",
  },
  hints: [
    "Integer division truncates — 7 / 2 gives 2, not 2.5. If you need the decimal result, at least one side must be a double: (double) 7 / 2 gives 3.5. The (double) is called a cast.",
    "The % operator gives the REMAINDER after division. 10 % 3 gives 1 because 10 = 3×3 + 1. Use it to check if a number is even (n % 2 == 0) or to wrap numbers around a range.",
    "Compound assignment shortcuts: += adds to a variable (x += 5 means x = x + 5). ++ increments by 1. -- decrements by 1. These are everywhere in loop counters and running totals.",
  ],
  reveal: {
    concept: "Arithmetic & Integer Division",
    whatYouLearned: "Java has five arithmetic operators: + - * / %. Division between two ints truncates the decimal — no rounding, just chopped. Modulo (%) returns the remainder. Compound operators (+=, -=, *=, /=, ++, --) modify variables in place without rewriting the variable name.",
    realWorldUse: "In a hospital billing system: integer division calculates how many full doses fit in a vial. Modulo checks if a ward number is even or odd for bed assignments. Floating point division gives the exact cost per patient. Getting the type wrong causes billing errors worth thousands of dollars.",
    developerSays: "The most common arithmetic bug I see in code reviews: dividing two ints and expecting a decimal answer. 100 / 3 is 33, not 33.33. Cast one side to double first. This trips up developers at every experience level.",
  },
};

// ── Operator reference shown above editor ─────────────────────────────────
const OPS = [
  { op: '+',  desc: 'Addition' },
  { op: '-',  desc: 'Subtraction' },
  { op: '*',  desc: 'Multiplication' },
  { op: '/',  desc: 'Division — truncates for int/int' },
  { op: '%',  desc: 'Modulo — remainder after division' },
  { op: '+=', desc: 'Add and assign (x += 5 → x = x + 5)' },
  { op: '++', desc: 'Increment by 1' },
  { op: '--', desc: 'Decrement by 1' },
];

// ── Template: comments explain the WHY of each operator ───────────────────
const TEMPLATE = `public class Main {
    public static void main(String[] args) {

        int totalBill = 1500;
        int patients  = 4;

        // int / int gives int — the decimal is silently dropped
        // 1500 / 4 = 375.0 but stored as 375 (int truncates)
        int billPerPatient = totalBill ___DIV___ patients;

        // % gives the REMAINDER — what's left over after splitting evenly
        // 1500 % 4 = 0 because 1500 divides exactly by 4
        int remainder = totalBill ___MOD___ patients;

        // Cast to double FIRST to get a decimal result
        // Without the cast: 1500 / 4 = 375 (int). With cast: 375.0 (double)
        double exactPerPatient = (double) totalBill ___FDIV___ patients;

        // Compound assignment — adds surcharge to existing total
        // Same as: totalBill = totalBill + surcharge
        int surcharge = 200;
        totalBill ___PLUS_EQ___ surcharge;

        // Increment — adds 1 to the variable
        // Same as: nextPatient = nextPatient + 1
        int nextPatient = 100;
        ___INC___nextPatient;

        System.out.println("Per patient (int): " + billPerPatient);
        System.out.println("Remainder: " + remainder);
        System.out.println("Per patient (exact): " + exactPerPatient);
        System.out.println("Total with surcharge: " + totalBill);
        System.out.println("Next patient number: " + nextPatient);
    }
}`;

const BLANKS = [
  { id: 'DIV',     answer: '/',  placeholder: 'op', hint: 'Division. Between two ints, drops the decimal silently.' },
  { id: 'MOD',     answer: '%',  placeholder: 'op', hint: 'Modulo — gives the remainder. 1500 % 4 = 0.' },
  { id: 'FDIV',    answer: '/',  placeholder: 'op', hint: 'Same division — the (double) cast before it changes the result to decimal.' },
  { id: 'PLUS_EQ', answer: '+=', placeholder: 'op', hint: 'Compound addition. x += 200 is the same as x = x + 200.' },
  { id: 'INC',     answer: '++', placeholder: 'op', hint: 'Increment. ++x adds 1 before using the value. Goes BEFORE the variable name here.' },
];

export default function Level2_3() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage2Shell levelId={3} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l23-container">

          <div className="l23-brief">
            <div className="l23-brief-tag">// Mission Brief</div>
            <h2>Calculate billing for your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.</h2>
            <p>
              Fill in 5 operator symbols. The variables and structure are already written.
              Trace through the logic first — what does each calculation actually produce?
            </p>
            <div className="l23-ops">
              {OPS.map(o => (
                <div key={o.op} className="l23-op-chip">
                  <span className="l23-op-sym">{o.op}</span>
                  <span className="l23-op-desc">{o.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <FillEditor
            template={TEMPLATE}
            blanks={BLANKS}
            onAllCorrect={() => setIsCorrect(true)}
            expectedOutput="Per patient (int): 375\nRemainder: 0\nPer patient (exact): 375.0\nTotal with surcharge: 1700\nNext patient number: 101"
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}