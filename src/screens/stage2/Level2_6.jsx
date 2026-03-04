// src/screens/stage2/Level2_6.jsx
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from './FillEditor';
import './Level2_6.css';

// ── What this level teaches ───────────────────────────────────────────────
// Methods — static modifier, return keyword, parameter types, void
// Fill mode: student fills 4 blanks covering the anatomy of a method
// Comments annotate each part of each method declaration
// ─────────────────────────────────────────────────────────────────────────

const SUPPORT = {
  intro: {
    concept: "Methods — Parameters, Return Types, void",
    tagline: "A method is named, reusable logic. Write once, call many times.",
    whatYouWillDo: "Fill in 4 keywords that complete the method declarations. The method bodies are already written. Your job is to fill in: the static modifier, the return keyword, a parameter type, and void.",
    whyItMatters: "Every Spring Boot controller, service, and repository is made of methods. Understanding the anatomy — modifier, return type, name, parameters — is the foundation of writing any non-trivial Java code.",
  },
  hints: [
    "Method signature format: modifier returnType methodName(paramType paramName). Example: static double calculateBMI(double weight, double height). The modifier comes first, then what it returns, then its name.",
    "static means the method belongs to the CLASS, not to an object. Required when calling from main() because main is also static — static methods can only directly call other static methods.",
    "void means the method returns NOTHING. Use it when a method just does something (prints, saves) but does not need to send a value back to the caller.",
  ],
  reveal: {
    concept: "Methods, Parameters & Return Types",
    whatYouLearned: "Methods encapsulate logic behind a name. static methods belong to the class. Return type declares what value comes back — or void if nothing. The return keyword sends the value back and exits the method immediately. Parameters are the inputs — typed and named.",
    realWorldUse: "In Spring Boot every API endpoint is a controller method, every database query is a repository method, every calculation is a service method. Well-designed methods do one thing, have clear names, and return typed values. That makes the codebase readable six months later.",
    developerSays: "If a method is longer than 20 lines, it is doing too many things. Extract smaller methods with clear names. I would rather read calculateMonthlyInterest(principal, rate, months) than 50 lines of undocumented arithmetic.",
  },
};

const TEMPLATE = `public class Main {

    // Method 1: Returns a double — calculates BMI from weight and height
    // 'static' = belongs to class, can be called without creating an object
    // 'double' = this method sends back a decimal number
    ___STATIC___ double calculateBMI(double weightKg, double heightM) {
        double bmi = weightKg / (heightM * heightM);
        // 'return' sends the value back to whoever called this method
        ___RETURN___ bmi;
    }

    // Method 2: Returns a String — decides patient category by age
    // The parameter type tells Java what kind of value 'age' accepts
    static String getStatus(___INT_PARAM___ age) {
        if (age < 18)  return "Paediatric";
        if (age >= 65) return "Senior";
        return "Adult";
    }

    // Method 3: Returns nothing — just prints a separator line
    // 'void' means the caller gets nothing back, the method just runs
    static ___VOID___ printSeparator() {
        System.out.println("-------------------");
    }

    public static void main(String[] args) {
        double bmi    = calculateBMI(70, 1.75);   // calls method, stores result
        String status = getStatus(72);             // calls method, stores result

        printSeparator();                          // calls method, no return value
        System.out.println("BMI: " + bmi);
        System.out.println("Status: " + status);
        printSeparator();
    }
}`;

const BLANKS = [
  { id: 'STATIC',    answer: 'static', placeholder: 'modifier', hint: 'Makes the method callable without an object. Required to call it from main.' },
  { id: 'RETURN',    answer: 'return', placeholder: 'keyword',  hint: 'Sends a value back to the caller and exits the method immediately.' },
  { id: 'INT_PARAM', answer: 'int',    placeholder: 'type',     hint: 'The parameter type for age — a whole number (not decimal).' },
  { id: 'VOID',      answer: 'void',   placeholder: 'type',     hint: 'Return type meaning "this method gives nothing back to the caller".' },
];

export default function Level2_6() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage2Shell levelId={6} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l26-container">

          <div className="l26-brief">
            <div className="l26-brief-tag">// Mission Brief</div>
            <h2>Build reusable methods for your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.</h2>
            <p>
              Fill in 4 keywords — each one teaches a different part of method anatomy.
              Read the comments above each method to understand what each blank does before filling it in.
            </p>
            <div className="l26-anatomy">
              <div className="l26-anatomy-label">Method anatomy:</div>
              <div className="l26-anatomy-code">
                <span className="tok-keyword">static</span>{' '}
                <span className="tok-type">String</span>{' '}
                <span className="tok-method">methodName</span>
                {'('}
                <span className="tok-type">int</span>{' age) {'}
                <br />{'    '}
                <span className="tok-keyword">return</span>{' "value";'}
                <br />{'}'}
              </div>
              <div className="l26-anatomy-parts">
                <span className="l26-ap l26-ap-mod">static = no object needed</span>
                <span className="l26-ap l26-ap-ret">String = return type</span>
                <span className="l26-ap l26-ap-par">int age = parameter</span>
                <span className="l26-ap l26-ap-key">return = sends value back</span>
              </div>
            </div>
          </div>

          <FillEditor
            template={TEMPLATE}
            blanks={BLANKS}
            onAllCorrect={() => setIsCorrect(true)}
            expectedOutput="-------------------\nBMI: 22.857142857142858\nStatus: Senior\n-------------------"
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}