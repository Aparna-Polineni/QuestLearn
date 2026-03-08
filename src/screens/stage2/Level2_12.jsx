// src/screens/stage2/Level2_12.jsx — Abstract Classes
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from './FillEditor';
import './Level2_12.css';

const SUPPORT = {
  intro: {
    concept: "Abstract Classes",
    tagline: "A blueprint you cannot build from directly. Forces every subclass to implement specific methods.",
    whatYouWillDo: "Fix 2 bugs — a Cat class that forgets to implement the abstract method, and an attempt to instantiate an abstract class directly.",
    whyItMatters: "Abstract classes are how frameworks define skeletons. Spring's AbstractController, JPA's AbstractEntity — they define the structure, subclasses fill in the behaviour. Understanding abstract classes lets you understand how Spring itself is built.",
  },
  hints: [
    "An abstract class CANNOT be instantiated with new. You can only create objects from concrete (non-abstract) subclasses. Trying new Animal() when Animal is abstract is a compile error.",
    "Every concrete (non-abstract) subclass MUST implement every abstract method from the parent. Cat extends Animal but is missing sound() — Java refuses to compile a class that leaves abstract methods unimplemented.",
    "Abstract methods have no body — just the signature ending with a semicolon: abstract String sound(); The abstract keyword is the signal that subclasses must fill this in.",
  ],
  reveal: {
    concept: "Abstract Classes & Forced Implementation",
    whatYouLearned: "abstract classes cannot be instantiated directly. abstract methods have no body — every concrete subclass must implement them. The compiler enforces this: forget to implement sound() and the code will not compile. This is the compiler working as your teammate.",
    realWorldUse: "Spring's AbstractApplicationContext is abstract. You never create one directly. You use ClassPathXmlApplicationContext or AnnotationConfigApplicationContext — concrete subclasses. The abstract class does 95% of the shared work; concrete classes handle the 5% that differs.",
    developerSays: "Abstract class vs interface: use abstract when subclasses share implementation code. Use interface when you just want to define a contract with no shared code. In practice: abstract class for a family of related things, interface for a capability.",
  },
};

const BROKEN_CODE = `public class Main {

    static abstract class Animal {
        String name;

        Animal(String name) { this.name = name; }

        abstract String sound();

        void introduce() {
            System.out.println("I am " + name + " and I go: " + sound());
        }
    }

    static class Dog extends Animal {
        Dog(String name) { super(name); }

        @Override
        public String sound() { return "Woof"; }
    }

    // BUG 1: Cat must implement sound() — add the missing method body
    static class Cat extends Animal {
        Cat(String name) { super(name); }

        @Override
        public String sound() { return ___MEOW___; }
    }

    public static void main(String[] args) {

        // BUG 2: Cannot instantiate an abstract class — fix the type/constructor
        // Change 'Animal' to a concrete subclass like Dog
        ___CONCRETE___ a = new Dog("Generic");
        a.introduce();

        Dog d = new Dog("Rex");
        d.introduce();

        Cat c = new Cat("Whiskers");
        c.introduce();
    }
}`;

const SOLUTION = `public class Main {

    static abstract class Animal {
        String name;

        Animal(String name) { this.name = name; }

        abstract String sound();

        void introduce() {
            System.out.println("I am " + name + " and I go: " + sound());
        }
    }

    static class Dog extends Animal {
        Dog(String name) { super(name); }

        @Override
        public String sound() { return "Woof"; }
    }

    static class Cat extends Animal {
        Cat(String name) { super(name); }

        @Override
        public String sound() { return "Meow"; }
    }

    public static void main(String[] args) {
        Dog d = new Dog("Rex");
        d.introduce();

        Cat c = new Cat("Whiskers");
        c.introduce();
    }
}`;

const BUGS = [
  { id: 'MEOW',     answer: '"Meow"', placeholder: 'return value', hint: 'Cat says Meow — return it as a String literal (with quotes).' },
  { id: 'CONCRETE', answer: 'Dog',    placeholder: 'type',         hint: 'Cannot use abstract Animal. Use a concrete subclass — Dog or Cat.' },
];

export default function Level2_12() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage2Shell levelId={12} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l212-container">
          <div className="l212-brief">
            <div className="l212-brief-tag">// Debug Mission</div>
            <h2>Fix the abstract class bugs for your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.</h2>
            <p>2 bugs — one about missing method implementation, one about trying to create an abstract object. Read each comment carefully.</p>
          </div>
          {/* Anatomy reference */}
          <div className="l212-anatomy">
            <div className="l212-anatomy-title">// Abstract Class Rules</div>
            <div className="l212-anatomy-grid">
              <div className="l212-anat-row">
                <span className="l212-anat-keyword">abstract class</span>
                <span className="l212-anat-name"> Animal</span>
                <span className="l212-anat-desc">← cannot be instantiated with new</span>
              </div>
              <div className="l212-anat-row l212-anat-indent">
                <span className="l212-anat-keyword">abstract</span>
                <span className="l212-anat-type"> String</span>
                <span className="l212-anat-name"> sound</span>
                <span className="l212-anat-plain">();</span>
                <span className="l212-anat-desc">← no body, subclass MUST implement</span>
              </div>
              <div className="l212-anat-row">
                <span className="l212-anat-keyword">class</span>
                <span className="l212-anat-name"> Cat</span>
                <span className="l212-anat-keyword"> extends </span>
                <span className="l212-anat-name">Animal</span>
                <span className="l212-anat-desc">← concrete: must implement sound()</span>
              </div>
              <div className="l212-anat-row">
                <span className="l212-anat-label bad">✗</span>
                <span className="l212-anat-keyword">new </span>
                <span className="l212-anat-name">Animal</span>
                <span className="l212-anat-plain">("x")</span>
                <span className="l212-anat-desc">← compile error — abstract class</span>
              </div>
              <div className="l212-anat-row">
                <span className="l212-anat-label good">✓</span>
                <span className="l212-anat-keyword">new </span>
                <span className="l212-anat-name">Dog</span>
                <span className="l212-anat-plain">("Rex")</span>
                <span className="l212-anat-desc">← concrete subclass — allowed</span>
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