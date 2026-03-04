// src/screens/stage2/Level2_11.jsx — Polymorphism
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import DebugEditor from './DebugEditor';
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

        // BUG 1: Missing @Override — without it Java does not verify this overrides Shape.getArea()
        // If you misspell getArea as getArae, Java creates a NEW method instead of overriding
        // The parent's "unknown" version would run instead of this one
        // Fix: add @Override on the line above 'public String getArea()'
        public String getArea() {
            return "Circle area: " + (3.14 * radius * radius);
        }
    }

    static class Rectangle extends Shape {
        double w, h;
        Rectangle(double w, double h) { this.w = w; this.h = h; }

        @Override
        // BUG 2: Return type is 'double' but the parent declares 'String'
        // This breaks the polymorphism contract — all overrides must match the parent's return type
        // Trying to call getArea() on a Shape reference would be ambiguous
        // Fix: change 'double' to 'String' and return a formatted string
        public double getArea() {
            return w * h;
        }
    }

    public static void main(String[] args) {
        // BUG 3: Array typed as Object[] — too broad, loses the Shape contract
        // With Object[], you cannot call .getArea() without an unsafe cast
        // Fix: change Object[] to Shape[] and the loop variable from Object to Shape
        Object[] shapes = { new Circle(5), new Rectangle(4, 6) };
        for (Object s : shapes) {
            System.out.println(((Shape)s).getArea());
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
  { id: 1, line: 15, description: "Missing @Override — Java cannot verify this correctly overrides Shape.getArea()", fix: "Add @Override on the line above 'public String getArea()'" },
  { id: 2, line: 27, description: "Return type 'double' breaks the parent contract — must match 'String'", fix: "Change 'double' to 'String' and return a formatted String" },
  { id: 3, line: 34, description: "Array typed as Object[] — too broad, loses the Shape contract and method access", fix: "Change Object[] to Shape[] and loop variable from Object to Shape" },
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
          <DebugEditor
            brokenCode={BROKEN_CODE}
            solution={SOLUTION}
            bugs={BUGS}
            expectedOutput={"Circle area: 78.5\nRectangle area: 24.0"}
            onAllFixed={() => setIsCorrect(true)}
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}