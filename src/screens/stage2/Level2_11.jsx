// src/screens/stage2/Level2_11.jsx — Polymorphism
import { useState } from 'react';
import Stage2Shell from './Stage2Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import DebugEditor from './DebugEditor';

const S = {
  intro: { concept:"Polymorphism", tagline:"One reference type, many implementations. The same method call does different things depending on the actual object.", whatYouWillDo:"Debug a broken polymorphism demo — a Shape reference holding different subclasses, broken method overriding, and wrong casting.", whyItMatters:"Polymorphism is why Spring Boot can accept any class that implements an interface. Your service accepts a PaymentProcessor interface — whether it is PayPalProcessor or StripeProcessor, the same method call works." },
  hints: ["Polymorphism: a parent-type reference variable can hold a child-type object. Shape s = new Circle() is valid if Circle extends Shape.", "@Override in child classes is required for true polymorphism. Without it, Java might call the parent's method instead of the child's.", "When iterating a list of parent-type objects, Java calls the actual object's overridden method — this is runtime polymorphism (dynamic dispatch)."],
  reveal: { concept:"Runtime Polymorphism & Dynamic Dispatch", whatYouLearned:"A parent reference can point to any child object. When you call a method on it, Java runs the actual object's version at runtime. This is dynamic dispatch. It enables writing code that works with any subtype without knowing the exact type.", realWorldUse:"Spring's @Repository interface is implemented by JpaRepository, MongoRepository, and others. Your service just declares @Autowired UserRepository — which implementation it gets is decided at runtime by Spring's dependency injection. Polymorphism makes this possible.", developerSays:"Polymorphism is the reason your code stays clean as requirements change. Add a new payment method? Implement the interface. The rest of the code does not change. That is open/closed principle — open for extension, closed for modification." },
};

const BROKEN = `public class Main {

    static class Shape {
        public String getArea() { return "unknown"; }
    }

    static class Circle extends Shape {
        double radius;
        Circle(double r) { this.radius = r; }

        // BUG 1: Missing @Override — this shadowing instead of overriding
        public String getArea() {
            return "Circle area: " + (3.14 * radius * radius);
        }
    }

    static class Rectangle extends Shape {
        double w, h;
        Rectangle(double w, double h) { this.w = w; this.h = h; }

        @Override
        // BUG 2: Wrong return type — must match parent (String, not double)
        public double getArea() {
            return w * h;
        }
    }

    public static void main(String[] args) {
        // BUG 3: Array type should be Shape[] to enable polymorphism
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
  { id: 'missing-override', description: 'Bug 1: @Override missing on Circle.getArea()', check: c => /@Override[\s\S]{0,30}public\s+String\s+getArea[\s\S]*?Circle/.test(c) || (c.match(/@Override/g)||[]).length >= 2 },
  { id: 'wrong-return',     description: 'Bug 2: Rectangle.getArea() returns double — must return String', check: c => /class\s+Rectangle[\s\S]*?public\s+String\s+getArea/.test(c) },
  { id: 'wrong-array',      description: 'Bug 3: Array type is Object[] — should be Shape[]', check: c => /Shape\[\]\s+shapes/.test(c) },
];
const simulate = c => /Shape\[\]/.test(c) && /String\s+getArea/.test(c) ? 'Circle area: 78.5\nRectangle area: 24.0' : '[Fix all bugs to see output]';

export default function Level2_11() {
  const [ok, setOk] = useState(false);
  return (
    <Stage2Shell levelId={11} canProceed={ok} conceptReveal={S.reveal}>
      <LevelSupportWrapper conceptIntro={S.intro} hints={S.hints} levelComplete={ok}>
        <div style={{display:'flex',flexDirection:'column',gap:24,paddingBottom:32}}>
          <div style={{background:'#0d1117',border:'1px solid #1e293b',borderRadius:16,padding:24}}>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:11,color:'#f97316',letterSpacing:3,marginBottom:10}}>// Debug Mission</div>
            <h2 style={{fontFamily:'Syne,sans-serif',fontSize:22,fontWeight:800,color:'#f1f5f9',marginBottom:8}}>Fix the polymorphic Shape hierarchy.</h2>
            <p style={{fontSize:14,color:'#64748b',lineHeight:1.6}}>3 bugs prevent polymorphism from working. Fix them to make one loop handle any shape type.</p>
          </div>
          <DebugEditor brokenCode={BROKEN} bugs={BUGS} solution={SOLUTION} expectedOutput={"Circle area: 78.5\nRectangle area: 24.0"} simulateOutput={simulate} onAllFixed={() => setOk(true)} />
        </div>
      </LevelSupportWrapper>
    </Stage2Shell>
  );
}