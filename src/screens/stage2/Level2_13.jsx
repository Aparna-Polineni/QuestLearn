// src/screens/stage2/Level2_13.jsx
import { useState } from 'react';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import DebugEditor from './DebugEditor';

const SUPPORT = {
  intro: {
    concept: "Interfaces — implements & contracts",
    tagline: "An interface is a pure contract. Any class that implements it promises to have those methods.",
    whatYouWillDo: "Debug a broken payment processor interface — a class using extends instead of implements, missing method implementations, and interface fields that should be constants.",
    whyItMatters: "Spring Boot is built entirely on interfaces. @Repository, @Service, @Controller — all interfaces. Dependency injection works because Spring does not care what class you use, only that it implements the right interface. This is the most important pattern in all of Java.",
  },
  hints: [
    "Classes implement interfaces (not extend). A class can implement multiple interfaces separated by commas: class Foo implements Bar, Baz. A class can only extend one class.",
    "All interface methods are implicitly public and abstract. All interface fields are implicitly public static final (constants). You cannot have instance fields in an interface.",
    "A class implementing an interface must implement ALL its methods, or declare itself abstract. If you miss one, the compiler tells you exactly which method is missing.",
  ],
  reveal: {
    concept: "Interfaces & the implements Keyword",
    whatYouLearned: "interface defines a contract — method signatures with no implementation. Classes implement interfaces using implements. A class can implement multiple interfaces. Interface fields are constants (public static final). Interface methods are public and abstract unless marked default or static.",
    realWorldUse: "Spring's JpaRepository<T, ID> is an interface. Extend it and Spring auto-generates the implementation at runtime using a proxy. You never write the SQL — the interface contract (findById, findAll, save, delete) tells Spring what to generate. That is interface-driven programming at its best.",
    developerSays: "Program to interfaces, not implementations. Instead of ArrayList<String> list = new ArrayList<>(), write List<String> list = new ArrayList<>(). Now you can swap ArrayList for LinkedList without changing any other code. This is the single most important habit in Java.",
  },
};

const BROKEN = `public class Main {

    interface Payable {
        double TAX_RATE = 0.2; // implicitly public static final

        double calculateTotal(double amount);
        String getPaymentMethod();
    }

    // BUG 1: Should use 'implements' not 'extends' for interface
    static class CreditCard extends Payable {
        private String cardNumber;

        CreditCard(String cardNumber) {
            this.cardNumber = cardNumber;
        }

        @Override
        public double calculateTotal(double amount) {
            return amount * (1 + TAX_RATE);
        }

        // BUG 2: Missing implementation of getPaymentMethod()
    }

    static class BankTransfer implements Payable {
        // BUG 3: Method signature wrong — must match interface exactly (double, not float)
        @Override
        public double calculateTotal(float amount) {
            return amount * (1 + TAX_RATE);
        }

        @Override
        public String getPaymentMethod() { return "Bank Transfer"; }
    }

    public static void main(String[] args) {
        Payable p1 = new CreditCard("4111-1111");
        Payable p2 = new BankTransfer();
        System.out.println(p1.getPaymentMethod() + ": £" + p1.calculateTotal(100));
        System.out.println(p2.getPaymentMethod() + ": £" + p2.calculateTotal(100));
    }
}`;

const SOLUTION = `public class Main {

    interface Payable {
        double TAX_RATE = 0.2;

        double calculateTotal(double amount);
        String getPaymentMethod();
    }

    static class CreditCard implements Payable {
        private String cardNumber;

        CreditCard(String cardNumber) {
            this.cardNumber = cardNumber;
        }

        @Override
        public double calculateTotal(double amount) {
            return amount * (1 + TAX_RATE);
        }

        @Override
        public String getPaymentMethod() { return "Credit Card"; }
    }

    static class BankTransfer implements Payable {
        @Override
        public double calculateTotal(double amount) {
            return amount * (1 + TAX_RATE);
        }

        @Override
        public String getPaymentMethod() { return "Bank Transfer"; }
    }

    public static void main(String[] args) {
        Payable p1 = new CreditCard("4111-1111");
        Payable p2 = new BankTransfer();
        System.out.println(p1.getPaymentMethod() + ": £" + p1.calculateTotal(100));
        System.out.println(p2.getPaymentMethod() + ": £" + p2.calculateTotal(100));
    }
}`;

const BUGS = [
  {
    id: 'extends-not-implements',
    description: 'Bug 1: CreditCard uses "extends Payable" — should use "implements"',
    check: code => /class\s+CreditCard\s+implements\s+Payable/.test(code),
  },
  {
    id: 'missing-method',
    description: 'Bug 2: CreditCard missing getPaymentMethod() implementation',
    check: code => /class\s+CreditCard[\s\S]*?getPaymentMethod\(\)/.test(code),
  },
  {
    id: 'wrong-param-type',
    description: 'Bug 3: BankTransfer.calculateTotal() takes float — interface requires double',
    check: code => /class\s+BankTransfer[\s\S]*?calculateTotal\(double/.test(code),
  },
];

const simulate = code => {
  const ok = /implements\s+Payable/.test(code) &&
    /class\s+CreditCard[\s\S]*?getPaymentMethod/.test(code) &&
    /BankTransfer[\s\S]*?calculateTotal\(double/.test(code);
  return ok ? 'Credit Card: £120.0\nBank Transfer: £120.0' : '[Fix all bugs to see output]';
};

export default function Level2_13() {
  const [ok, setOk] = useState(false);
  return (
    <Stage2Shell levelId={13} canProceed={ok} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={ok}>
        <div style={{ display:'flex', flexDirection:'column', gap:24, paddingBottom:32 }}>
          <div style={{ background:'#0d1117', border:'1px solid #1e293b', borderRadius:16, padding:24 }}>
            <div style={{ fontFamily:'DM Mono,monospace', fontSize:11, color:'#f97316', letterSpacing:3, marginBottom:10 }}>// Debug Mission</div>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:800, color:'#f1f5f9', marginBottom:8 }}>Fix the payment processor interface.</h2>
            <p style={{ fontSize:14, color:'#64748b', lineHeight:1.6 }}>3 bugs break the Payable contract. Fix them — when all three pass, any class can be treated as a Payable without knowing its type.</p>
          </div>
          <DebugEditor
            brokenCode={BROKEN} bugs={BUGS} solution={SOLUTION}
            expectedOutput={"Credit Card: £120.0\nBank Transfer: £120.0"}
            simulateOutput={simulate} onAllFixed={() => setOk(true)}
          />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}