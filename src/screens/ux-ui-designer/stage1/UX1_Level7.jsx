// src/screens/ux-ui-designer/stage1/UX1_Level7.jsx — Capstone: Design Challenge (BUILD)
import { useState } from 'react';
import UX1Shell from './UX1Shell';

const REQS = [
  { id:'r1', label:'Empathy: identify user, context, and 2 pain points from research' },
  { id:'r2', label:'Define: write a POV statement (user + need + insight)' },
  { id:'r3', label:'Define: write an HMW question' },
  { id:'r4', label:'Ideate: generate at least 5 solutions' },
  { id:'r5', label:'Prototype: describe the prototype type (paper/wireframe/interactive) and what screens it covers' },
  { id:'r6', label:'Test: write 2 usability test tasks and success criteria' },
];

const CHECK = {
  r1: c => c.includes('USER') && (c.includes('PAIN') || c.includes('FRUSTRAT') || c.includes('PROBLEM') || c.includes('STRUGGLE')) ,
  r2: c => c.includes('NEEDS') && c.includes('BECAUSE') && (c.includes('POV') || c.includes('POINT OF VIEW')),
  r3: c => c.includes('HOW MIGHT WE') || c.includes('HMW'),
  r4: c => {
    const count = (c.match(/\d\.|IDEA|SOLUTION|OPTION/g) || []).length;
    return count >= 5;
  },
  r5: c => (c.includes('PAPER') || c.includes('WIREFRAME') || c.includes('INTERACTIVE') || c.includes('PROTOTYPE')) && (c.includes('SCREEN') || c.includes('FRAME') || c.includes('PAGE')),
  r6: c => (c.includes('TASK') || c.includes('TEST')) && c.includes('SUCCESS'),
};

const SOLUTION = `Design Challenge: Redesign the hospital appointment booking flow

## Empathy
User: Maria, 58, retired teacher, books appointments for her elderly mother
Context: Uses phone at home, low digital confidence, anxious about making mistakes
Pain point 1: Can't tell if an appointment was successfully booked (no clear confirmation)
Pain point 2: Has to start over if she picks the wrong doctor — no "back" button

## Define — POV Statement
Maria needs a way to book medical appointments with confidence because she fears
making mistakes and currently has no way to verify her booking was successful.

## HMW Question
How might we give Maria immediate, reassuring confirmation at every step of the booking?

## Ideate — Solutions
1. Persistent booking summary sidebar — shows current selections at all times
2. SMS + email confirmation with "Cancel if wrong" link
3. Simplified 3-step flow: Choose Doctor → Pick Time → Confirm (no more steps)
4. Large, obvious "Back" button that preserves all previous selections
5. "Review booking" screen before final submission with plain-language summary
6. Progress indicator: "Step 2 of 3" so Maria knows how much is left
7. Voice confirmation: "Press 1 to confirm your appointment" (for very low digital users)

## Prototype
Interactive Figma prototype covering:
- Screen 1: Doctor selection with clear availability indicators
- Screen 2: Time slot picker with large touch targets
- Screen 3: Booking summary (plain language, no jargon)
- Screen 4: Confirmation page + email/SMS confirmation copy

## Test Tasks & Success Criteria
Task 1: "Book an appointment with Dr. Chen for next Thursday at 2pm"
Success: User completes without asking for help, takes < 3 minutes

Task 2: "You accidentally picked the wrong doctor — fix it"
Success: User finds back button within 10 seconds, no data loss`;

export default function UX1_Level7() {
  const [code, setCode] = useState('');
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState({});
  const [showSolution, setShowSolution] = useState(false);

  function check() {
    const c = code.toUpperCase();
    const r = {};
    Object.entries(CHECK).forEach(([id,fn]) => { r[id]=fn(c); });
    setResults(r); setChecked(true);
  }

  const passCount = Object.values(results).filter(Boolean).length;
  const allPass = checked && passCount === REQS.length;

  return (
    <UX1Shell levelId={7} canProceed={allPass}
      conceptReveal={[
        { label:'Stage 1 Complete', detail:'You\'ve completed the full Design Thinking process: Empathise, Define, Ideate, Prototype, Test. Stage 2 dives into Figma — learning the tool that brings all of this to life. You\'ll build real wireframes, components, and interactive prototypes.' },
      ]}
      prevLevelContext="You have empathised, defined, ideated, prototyped, and tested. This capstone asks you to deliver the complete UX project: persona, wireframes, IA, and a tested prototype."
      cumulativeSkills={[
        "Defined UX vs UI and mapped the five phases of Design Thinking",
        "Applied Design Thinking: empathised and defined the booking problem",
        "Conducted user research: interview guide, synthesis, and patient persona",
        "Sketched three wireframes for the mobile patient booking flow",
        "Restructured the information architecture: clear hierarchy, two-click navigation",
        "Applied visual hierarchy: size, weight, and colour to direct patient attention",
        "Planned and conducted a five-user usability test with documented findings",
        "Delivered complete UX project: persona → wireframes → tested prototype",
      ]}
    >
      <div className="ux1-intro">
        <h1>Capstone — Design Challenge</h1>
        <p className="ux1-tagline">🏆 Apply all 5 stages of Design Thinking to a real problem.</p>
        <p className="ux1-why">Apply the full Design Thinking process to a hospital booking flow redesign. Cover all six requirements — this is what a junior UX designer produces in their first week on a project.</p>
      </div>

      <div style={{marginBottom:14}}>
        {REQS.map(r => (
          <div className="ux1-req" key={r.id}>
            <span style={{color:!checked?'#475569':results[r.id]?'#4ade80':'#f87171',fontSize:14,width:18}}>
              {!checked?'○':results[r.id]?'✓':'✗'}
            </span>
            <span style={{color:'#cbd5e1',fontSize:13}}>{r.label}</span>
          </div>
        ))}
      </div>

      <textarea className="ux1-editor" value={code} onChange={e => setCode(e.target.value)}
        placeholder="## Empathy&#10;User: ...&#10;&#10;## Define — POV Statement&#10;[User] needs a way to ... because ...&#10;&#10;## HMW Question&#10;How Might We ...&#10;&#10;## Ideate&#10;1. ..." style={{minHeight:320}} />

      <div style={{display:'flex',gap:10,marginTop:10}}>
        <button className="ux1-check-btn" onClick={check}>Check Design</button>
        <button className="ux1-check-btn" style={{background:'#334155',color:'#94a3b8'}} onClick={() => setShowSolution(s=>!s)}>
          {showSolution?'Hide':'Show'} Example Solution
        </button>
      </div>

      {showSolution && (
        <div className="ux1-panel" style={{marginTop:12}}>
          <div className="ux1-panel-hdr">✅ Example Solution</div>
          <pre className="ux1-panel-body" style={{color:'#94a3b8',overflowX:'auto',margin:0,fontSize:12}}>{SOLUTION}</pre>
        </div>
      )}

      {checked && (
        <div className={`ux1-feedback ${allPass?'success':'error'}`}>
          {allPass?'🎓 Stage 1 Complete! You think like a UX designer.':`❌ ${passCount}/${REQS.length} requirements met.`}
        </div>
      )}
    </UX1Shell>
  );
}
