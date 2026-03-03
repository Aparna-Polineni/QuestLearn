// src/screens/stage2/Level2_6.jsx
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from './FillEditor';
import './Level2_6.css';

const SUPPORT = {
  intro: {
    concept: "Methods — Parameters, Return Types, Scope",
    tagline: "Methods turn repeated logic into reusable named operations. Write once, call many times.",
    whatYouWillDo: "You will write methods that take parameters and return values — a calculateBMI method, a getPatientStatus method, and a method that returns void. You will understand the difference between void and typed return values.",
    whyItMatters: "Every Spring Boot controller method, every service layer function, every repository query — they are all methods. Understanding parameters, return types, and scope is the foundation of writing any non-trivial Java code.",
  },
  hints: [
    "Method signature: returnType methodName(paramType paramName) { body }. If the method returns nothing, use void. If it returns a value, declare the type and use the return keyword.",
    "Parameters are local to the method. Changing a parameter inside a method does not affect the variable outside it (for primitives). This is called pass-by-value.",
    "A method must have a return statement if its return type is not void. The return type in the signature must match what you actually return — Java will not compile otherwise.",
  ],
  reveal: {
    concept: "Methods, Parameters & Return Types",
    whatYouLearned: "Methods encapsulate logic behind a name. They declare what they accept (parameters) and what they give back (return type). void means nothing is returned. static methods belong to the class, not an instance. Calling a method executes its body and returns control (and optionally a value) to the caller.",
    realWorldUse: "In Spring Boot, every API endpoint is a controller method. Every database query is a repository method. Every calculation lives in a service method. Well-designed methods do one thing, have clear parameter names, and return a typed value. That structure makes the codebase readable six months later.",
    developerSays: "If a method is longer than 20 lines, it is doing too many things. Extract smaller methods with clear names. I would rather read calculateMonthlyInterest(principal, rate, months) than a 50-line block of undocumented arithmetic.",
  },
};

const TEMPLATE = `public class Main {

    // Returns a double — calculates BMI
    ___STATIC___ double calculateBMI(double weightKg, double heightM) {
        double bmi = weightKg / (heightM * heightM);
        ___RETURN___ bmi;
    }

    // Returns a String — patient status based on age
    static String getStatus(___INT_PARAM___ age) {
        if (age < 18) return "Paediatric";
        if (age >= 65) return "Senior";
        return "Adult";
    }

    // Returns nothing — just prints
    static ___VOID___ printSeparator() {
        System.out.println("-------------------");
    }

    public static void main(String[] args) {

        double bmi    = calculateBMI(70, 1.75);
        String status = getStatus(72);

        printSeparator();
        System.out.println("BMI: " + bmi);
        System.out.println("Status: " + status);
        printSeparator();
    }
}`;

const BLANKS = [
  { id: 'STATIC',    answer: 'static', placeholder: 'modifier', hint: 'Makes the method callable without creating an object. Required to call from main.' },
  { id: 'RETURN',    answer: 'return', placeholder: 'keyword',  hint: 'Sends a value back to the caller and exits the method.' },
  { id: 'INT_PARAM', answer: 'int',    placeholder: 'type',     hint: 'The parameter type. This method accepts a whole number (patient age).' },
  { id: 'VOID',      answer: 'void',   placeholder: 'type',     hint: 'Return type that means "this method gives nothing back".' },
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
            <p>Fill in 4 keywords. Each blank teaches a different piece of method anatomy: the static modifier, the return keyword, parameter types, and void.</p>

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
                <span className="l26-ap l26-ap-mod">static = can call without object</span>
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
            expectedOutput={`-------------------\nBMI: 22.857142857142858\nStatus: Senior\n-------------------`}
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}