// src/screens/stage2/Level2_13.jsx — Interfaces
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from './FillEditor';
import './Level2_13.css';

const SUPPORT = {
  intro: {
    concept: "Interfaces — implements & contracts",
    tagline: "An interface is a pure contract. Any class that implements it promises to have those methods.",
    whatYouWillDo: "Fix 3 bugs — a class using 'extends' instead of 'implements', a missing method implementation, and an overriding method with the wrong parameter type.",
    whyItMatters: "Spring Boot is built entirely on interfaces. @Repository, @Service, @Controller are all interfaces. Dependency injection works because Spring does not care what class you use — only that it implements the right interface.",
  },
  hints: [
    "Classes IMPLEMENT interfaces — they do not extend them. A class can implement multiple interfaces. A class can only extend one class. Use the 'implements' keyword, not 'extends'.",
    "A class implementing an interface must implement ALL its methods with the EXACT same signatures. Missing one method is a compile error. Java tells you exactly which method is missing.",
    "Method signatures must match exactly — same return type, same parameter types. If the interface says calculateTotal(double amount), your override must also take a double, not a float.",
  ],
  reveal: {
    concept: "Interfaces & the implements Keyword",
    whatYouLearned: "interface defines a contract — method signatures with no implementation. Classes use 'implements' not 'extends'. A class can implement multiple interfaces. Interface methods must be matched exactly — same name, same parameters, same return type.",
    realWorldUse: "Spring's JpaRepository<T, ID> is an interface. Extend it and Spring auto-generates the SQL implementation at runtime. You never write a query — the interface contract (findById, findAll, save) tells Spring what to generate. Interface-driven programming at its best.",
    developerSays: "Program to interfaces, not implementations. Instead of ArrayList<String> list = new ArrayList<>(), write List<String> list = new ArrayList<>(). Now you can swap implementations without changing any other code. This is the most important habit in Java.",
  },
};

const BROKEN_CODE = `public class Main {

    interface Payable {
        double TAX_RATE = 0.2; // implicitly public static final — a constant

        double calculateTotal(double amount);
        String getPaymentMethod();
    }

    // BUG 1: Classes use a different keyword than 'extends' for interfaces
    static class CreditCard ___IMPLEMENTS___ Payable {
        private String cardNumber;

        CreditCard(String cardNumber) {
            this.cardNumber = cardNumber;
        }

        @Override
        public double calculateTotal(double amount) {
            return amount * (1 + TAX_RATE);
        }

        // BUG 2: Missing required interface method — add it returning "Credit Card"
        @Override
        public String ___GET_PAYMENT___() { return "Credit Card"; }
    }

    static class BankTransfer implements Payable {

        // BUG 3: Parameter type must match the interface signature exactly
        @Override
        public double calculateTotal(___DOUBLE___ amount) {
            return amount * (1 + TAX_RATE);
        }

        @Override
        public String getPaymentMethod() { return "Bank Transfer"; }
    }

    public static void main(String[] args) {
        Payable p1 = new CreditCard("4111-1111");
        Payable p2 = new BankTransfer();
        System.out.println(p1.getPaymentMethod() + ": " + p1.calculateTotal(100));
        System.out.println(p2.getPaymentMethod() + ": " + p2.calculateTotal(100));
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
        System.out.println(p1.getPaymentMethod() + ": " + p1.calculateTotal(100));
        System.out.println(p2.getPaymentMethod() + ": " + p2.calculateTotal(100));
    }
}`;

const BUGS = [
  { id: 'IMPLEMENTS',   answer: 'implements',       placeholder: 'keyword', hint: "Classes use this keyword for interfaces. 'extends' is only for other classes." },
  { id: 'GET_PAYMENT',  answer: 'getPaymentMethod', placeholder: 'method',  hint: "The interface requires both methods to be implemented. This one returns the payment type." },
  { id: 'DOUBLE',       answer: 'double',           placeholder: 'type',    hint: "The interface declares double. Using float creates a different method — not an override." },
];

export default function Level2_13() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);
  return (
    <Stage2Shell levelId={13} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l213-container">
          <div className="l213-brief">
            <div className="l213-brief-tag">// Debug Mission</div>
            <h2>Fix the interface bugs for your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'system'}</span>.</h2>
            <p>3 bugs — each breaks the interface contract in a different way. Read each comment to understand why the contract is violated.</p>
          </div>
          {/* Anatomy reference */}
          <div className="l213-anatomy">
            <div className="l213-anatomy-title">// Interface Anatomy</div>
            <div className="l213-anatomy-grid">
              <div className="l213-anat-row">
                <span className="l213-anat-keyword">interface</span>
                <span className="l213-anat-name"> Payable</span>
                <span className="l213-anat-plain"> {'{'}</span>
                <span className="l213-anat-desc">← defines a contract</span>
              </div>
              <div className="l213-anat-row l213-anat-indent">
                <span className="l213-anat-type">double</span>
                <span className="l213-anat-name"> calculateTotal</span>
                <span className="l213-anat-plain">(double amount);</span>
                <span className="l213-anat-desc">← ALL methods must be implemented</span>
              </div>
              <div className="l213-anat-row">
                <span className="l213-anat-keyword">class </span>
                <span className="l213-anat-name">CreditCard</span>
                <span className="l213-anat-keyword"> implements </span>
                <span className="l213-anat-name">Payable</span>
                <span className="l213-anat-desc">← implements, not extends</span>
              </div>
              <div className="l213-anat-row l213-anat-indent">
                <span className="l213-anat-type">double</span>
                <span className="l213-anat-name"> calculateTotal</span>
                <span className="l213-anat-plain">(</span>
                <span className="l213-anat-type">double</span>
                <span className="l213-anat-plain"> amount)</span>
                <span className="l213-anat-desc">← param type must match exactly</span>
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