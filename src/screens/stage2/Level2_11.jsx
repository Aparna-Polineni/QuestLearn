// src/screens/stage2/Level2_11.jsx — Polymorphism
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from './FillEditor';
import './Level2_11.css';

const SUPPORT = {
  intro: {
    concept: "Polymorphism",
    tagline: "One reference type, many implementations. The same method call behaves differently depending on the actual object.",
    whatYouWillDo: "Fix 3 bugs in a polymorphism demo — a missing @Override, a wrong return type that breaks the contract, and an array typed as Object[] instead of Shape[].",
    whyItMatters: "Polymorphism is why Spring Boot can accept any class that implements an interface. Your service accepts a PaymentProcessor — whether it is PayPalProcessor or StripeProcessor, the same method call works.",
  },
  hints: [
    "@Override annotation on the child method tells Java this intentionally overrides the parent. Without it, a typo in the method name silently creates a new method instead of overriding — the parent's version runs instead.",
    "The overriding method must have the EXACT same return type as the parent. If the parent's getArea() returns String, every override must also return String. Changing to double breaks the contract.",
    "For polymorphism to work, the array/variable must be typed as the PARENT class (Shape[]), not Object[]. With Object[], you lose the ability to call Shape methods without casting.",
  ],
  reveal: {
    concept: "Runtime Polymorphism & Dynamic Dispatch",
    whatYouLearned: "A parent reference can point to any child object. When you call a method, Java runs the actual object's overridden version at runtime — this is dynamic dispatch. @Override catches mistakes at compile time. The array type must match the parent to allow polymorphic method calls.",
    realWorldUse: "Spring's @Repository interface is implemented by JpaRepository, MongoRepository, and others. Your service just declares @Autowired UserRepository — which implementation it gets is decided at runtime by Spring's dependency injection. Polymorphism makes this possible.",
    developerSays: "Polymorphism keeps your code stable as requirements change. Add a new payment method? Implement the interface. The rest of the code does not change. That is the open/closed principle — open for extension, closed for modification.",
  },
};

const BROKEN_CODE = `public class Main {

    static class Shape {
        public String getArea() { return "unknown"; }
    }

    static class Circle extends Shape {
        double radius;
        Circle(double r) { this.radius = r; }

        // BUG 1: Add the annotation that verifies this correctly overrides getArea()
        ___OVERRIDE1___
        public String getArea() {
            return "Circle area: " + (3.14 * radius * radius);
        }
    }

    static class Rectangle extends Shape {
        double w, h;
        Rectangle(double w, double h) { this.w = w; this.h = h; }

        @Override
        // BUG 2: Return type must match parent — change 'double' to the correct type
        public ___STRING_RETURN___ getArea() {
            return "Rectangle area: " + (w * h);
        }
    }

    public static void main(String[] args) {
        // BUG 3: Change the array type from Object[] to the correct type
        ___SHAPE_ARRAY___[] shapes = { new Circle(5), new Rectangle(4, 6) };
        for (___SHAPE_VAR___ s : shapes) {
            System.out.println(s.getArea());
        }
    }
}`;

const SOLUTION = `public class Main {

    static class Shape {
        public String getArea() { return "unknown"; }
    }

    static class Circle extends Shape {
        double radius;
        Circle(double r) { this.radius = r; }

        @Override
        public String getArea() {
            return "Circle area: " + (3.14 * radius * radius);
        }
    }

    static class Rectangle extends Shape {
        double w, h;
        Rectangle(double w, double h) { this.w = w; this.h = h; }

        @Override
        public String getArea() {
            return "Rectangle area: " + (w * h);
        }
    }

    public static void main(String[] args) {
        Shape[] shapes = { new Circle(5), new Rectangle(4, 6) };
        for (Shape s : shapes) {
            System.out.println(s.getArea());
        }
    }
}`;

const BUGS = [
  { id: 'OVERRIDE1',    answer: '@Override', placeholder: 'annotation', hint: "Annotation that verifies this method correctly overrides the parent's getArea()." },
  { id: 'STRING_RETURN',answer: 'String',    placeholder: 'type',       hint: "The parent declares String getArea(). Override must match the return type exactly." },
  { id: 'SHAPE_ARRAY',  answer: 'Shape',     placeholder: 'type',       hint: "Array should hold Shape objects — not the broad Object type." },
  { id: 'SHAPE_VAR',    answer: 'Shape',     placeholder: 'type',       hint: "Loop variable type must also be Shape so you can call .getArea() without a cast." },
];

export default function Level2_11() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage2Shell levelId={11} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l211-container">
          <div className="l211-brief">
            <div className="l211-brief-tag">// Debug Mission</div>
            <h2>Fix the polymorphism bugs for your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.</h2>
            <p>3 bugs — each breaks polymorphism in a different way. Read the comment above each bug to understand exactly why it fails.</p>
          </div>
          {/* Anatomy reference */}
          <div className="l211-anatomy">
            <div className="l211-anatomy-title">// Polymorphism Rules</div>
            <div className="l211-anatomy-grid">
              <div className="l211-anat-row">
                <span className="l211-anat-annotation">@Override</span>
                <span className="l211-anat-desc">← must annotate overriding methods</span>
              </div>
              <div className="l211-anat-row">
                <span className="l211-anat-keyword">public</span>
                <span className="l211-anat-type">String</span>
                <span className="l211-anat-name"> getArea</span>
                <span className="l211-anat-plain">() {'{ ... }'}</span>
                <span className="l211-anat-desc">← return type must match parent exactly</span>
              </div>
              <div className="l211-anat-row">
                <span className="l211-anat-type">Shape</span>
                <span className="l211-anat-plain">[] shapes = {'{'} ... {'}'}</span>
                <span className="l211-anat-desc">← array type must be Shape, not Object</span>
              </div>
              <div className="l211-anat-row">
                <span className="l211-anat-keyword">for </span>
                <span className="l211-anat-plain">(</span>
                <span className="l211-anat-type">Shape</span>
                <span className="l211-anat-plain"> s : shapes)</span>
                <span className="l211-anat-desc">← loop variable type = Shape</span>
              </div>
            </div>
          </div>

          <FillEditor
            template={BROKEN_CODE}
            blanks={BUGS}
            onAllCorrect={() => setIsCorrect(true)}
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}