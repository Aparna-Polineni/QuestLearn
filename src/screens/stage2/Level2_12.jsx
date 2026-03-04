// src/screens/stage2/Level2_12.jsx — Abstract Classes
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import DebugEditor from './DebugEditor';
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

        // Abstract method — subclasses MUST implement this
        // It has no body — just a signature ending with semicolon
        abstract String sound();

        // Concrete method — shared by all animals, no override needed
        void introduce() {
            System.out.println("I am " + name + " and I go: " + sound());
        }
    }

    static class Dog extends Animal {
        Dog(String name) { super(name); }

        @Override
        public String sound() { return "Woof"; }
    }

    // BUG 1: Cat extends Animal but does NOT implement sound()
    // Java will not compile a concrete class that leaves abstract methods empty
    // Every class that is not itself abstract must implement ALL abstract methods
    // Fix: add the sound() method to Cat — it should return "Meow"
    static class Cat extends Animal {
        Cat(String name) { super(name); }
        // sound() is missing here!
    }

    public static void main(String[] args) {

        // BUG 2: Cannot create an object from an abstract class
        // Animal is abstract — it is a blueprint, not a real thing
        // You can only create objects from Dog, Cat, or other concrete subclasses
        // Fix: remove this line (or replace with a Dog or Cat)
        Animal a = new Animal("Generic");
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
  { id: 1, line: 29, description: "Cat is missing the sound() implementation — abstract methods cannot be left empty in concrete classes", fix: "Add: @Override public String sound() { return \"Meow\"; } inside Cat" },
  { id: 2, line: 36, description: "Cannot instantiate an abstract class — new Animal() is a compile error", fix: "Remove the 'Animal a = new Animal(...)' line entirely" },
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
          <DebugEditor
            brokenCode={BROKEN_CODE}
            solution={SOLUTION}
            bugs={BUGS}
            expectedOutput={"I am Rex and I go: Woof\nI am Whiskers and I go: Meow"}
            onAllFixed={() => setIsCorrect(true)}
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}