// src/screens/stage2/Level2_3.jsx
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from './FillEditor';
import './Level2_3.css';

const SUPPORT = {
  intro: {
    concept: "Operators & Arithmetic",
    tagline: "Java uses the same maths operators you know, plus a few power moves like % and ++.",
    whatYouWillDo: "You will use arithmetic operators (+, -, *, /, %) to calculate hospital billing figures. You will learn integer division, the modulo operator, and compound assignment shortcuts.",
    whyItMatters: "Every backend system does arithmetic — calculating totals, discounts, remainders, averages. Understanding integer division and modulo prevents a whole class of subtle bugs where you expect 2.5 but get 2.",
  },
  hints: [
    "Integer division truncates: 7 / 2 gives 2, not 2.5. If you want the decimal result, at least one side must be a double: 7.0 / 2 gives 3.5.",
    "The modulo operator % gives the remainder: 10 % 3 gives 1 (because 10 = 3×3 + 1). Use it to check if a number is even (n % 2 == 0) or to wrap around a range.",
    "Compound assignment shortcuts: += adds to a variable (x += 5 is the same as x = x + 5). ++ increments by 1. -- decrements by 1.",
  ],
  reveal: {
    concept: "Arithmetic & Integer Division",
    whatYouLearned: "Java has five arithmetic operators: + - * / %. Division between two ints truncates the decimal. Modulo (%) returns the remainder. Compound operators (+=, -=, *=, /=, ++, --) modify variables in place.",
    realWorldUse: "In a hospital billing system, integer division calculates how many full doses fit in a vial, modulo checks if a ward number is even or odd for bed assignments, and floating point division gives the exact cost per patient. Getting the type right prevents billing errors worth thousands of dollars.",
    developerSays: "The most common arithmetic bug I see in code reviews: dividing two ints and expecting a decimal answer. 100 / 3 is 33, not 33.33. Cast one to double first. This trips up developers at every level.",
  },
};

const TEMPLATE = `public class Main {
    public static void main(String[] args) {

        int totalBill  = 1500;
        int patients   = 4;

        // Division — how much per patient?
        // int / int gives int (truncates decimal)
        int billPerPatient = totalBill ___DIV___ patients;

        // Modulo — remaining amount after splitting evenly
        int remainder = totalBill ___MOD___ patients;

        // Floating point division — exact result
        double exactPerPatient = (double) totalBill ___FDIV___ patients;

        // Compound addition — add a surcharge
        int surcharge = 200;
        totalBill ___PLUS_EQ___ surcharge;

        // Increment — next patient number
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
  { id: 'DIV',     answer: '/',  placeholder: 'op', hint: 'Division operator. Between two ints, truncates the decimal.' },
  { id: 'MOD',     answer: '%',  placeholder: 'op', hint: 'Modulo — gives the remainder after division.' },
  { id: 'FDIV',    answer: '/',  placeholder: 'op', hint: 'Same division operator — but the cast to double makes the result decimal.' },
  { id: 'PLUS_EQ', answer: '+=', placeholder: 'op', hint: 'Compound addition. x += 5 is the same as x = x + 5.' },
  { id: 'INC',     answer: '++', placeholder: 'op', hint: 'Increment. Adds 1 to the variable. ++x increments before using the value.' },
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
            <h2>Calculate the billing for your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.</h2>
            <p>Fill in the 5 operators. Pay attention to integer division — one of these calculations gives a different result than you expect.</p>

            <div className="l23-ops">
              {[
                { op: '+', desc: 'Addition' }, { op: '-', desc: 'Subtraction' },
                { op: '*', desc: 'Multiplication' }, { op: '/', desc: 'Division (truncates for int)' },
                { op: '%', desc: 'Modulo (remainder)' }, { op: '+=', desc: 'Add and assign' },
                { op: '++', desc: 'Increment by 1' }, { op: '--', desc: 'Decrement by 1' },
              ].map(o => (
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
            expectedOutput={`Per patient (int): 375\nRemainder: 0\nPer patient (exact): 375.0\nTotal with surcharge: 1700\nNext patient number: 101`}
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}