// src/screens/ux-ui-designer/stage2/UX2_Level8.jsx — Accessibility in Design (DEBUG)
import { useState } from 'react';
import UX2Shell from './UX2Shell';

const BUGS = [
  {
    id:1, label:'Bug 1 — Low contrast: error message in #9CA3AF on white background (2.8:1 ratio)',
    bad:`Error text colour: #9CA3AF on white background
Contrast ratio: 2.8:1
WCAG AA minimum for normal text: 4.5:1
Result: error messages are nearly invisible to users with low vision`,
    good:`Fix: Change error text to #DC2626 on white
Contrast ratio: 5.9:1 — passes WCAG AA
Also passes WCAG AAA for large text (3:1)
Use the Figma plugin "Contrast" or "Able" to check before handoff`,
    why:'WCAG 2.1 AA requires 4.5:1 for normal text and 3:1 for large text (18pt+ or 14pt bold). Error messages are critical information — low contrast makes them invisible to users with colour vision deficiencies or in bright light conditions.',
  },
    {
    id:2, label:'Bug 2 — Icon-only buttons with no accessible label',
    bad:`Close button: × icon only, no text, no aria-label annotation
Back button: ← icon only, no text, no aria-label annotation
Screen reader reads: "Button" — the user has no idea what it does`,
    good:`Fix in design annotation:
× button → annotate: aria-label="Close booking form"
← button → annotate: aria-label="Go back to appointment selection"

Alternatively: add visible text next to the icon
"← Back" is better than just ← for all users, not just screen reader users`,
    why:'Icon-only buttons fail WCAG 1.1.1 (Non-text Content). Every interactive element needs a text alternative. In Figma Dev Mode, add an annotation. The developer then adds aria-label="Close" to the button in code. This is a design responsibility — engineers cannot infer intent from an icon.',
  },
    {
    id:3, label:'Bug 3 — Tap targets smaller than 44×44px on mobile',
    bad:`Calendar day cells: 32×32px on mobile frame
Checkbox hit area: 20×20px
WCAG 2.5.5 Target Size (AAA): 44×44px minimum
Apple HIG and Material Design both recommend 44px+ tap targets`,
    good:`Fix: Increase calendar cells to 44×44px minimum
For checkboxes: keep the 20×20px visual but add 44×44px invisible tap area

In Figma: create a transparent frame (44×44) around the visual element
Annotate: "Tap target: 44×44px — visual is 20×20px centred within"`,
    why:'Small tap targets cause mis-taps — users accidentally select the wrong date, uncheck what they wanted to check, or give up. This disproportionately affects users with motor impairments, older users, and anyone using a phone one-handed. 44px is the minimum from both Apple and Google guidelines.',
  },
];

export default function UX2_Level8() {
  const [found, setFound] = useState(new Set());
  const allDone = found.size >= BUGS.length;

  return (
    <UX2Shell levelId={8} canProceed={allDone}
      prevLevelContext="In the last level you documented the design system. Now you'll audit the hospital booking designs for accessibility issues — real problems that make the product unusable for a significant portion of patients."
      cumulativeSkills={[
        "Set up Figma and navigated Files, Pages, and Frames",
        "Created frames at correct dimensions with proper constraints",
        "Applied auto-layout: direction, spacing, padding, resize behaviour",
        "Created master components and instances across screens",
        "Defined colour, text, and effect styles for the booking system",
        "Connected screens with prototype interactions and overlays",
        "Prepared a design file for developer handoff using Dev Mode",
        "Documented a design system: tokens, components, usage guidelines",
        "Audited a design for accessibility: contrast, labels, tap targets, structure",
      ]}
      conceptReveal={[
        { label:'Accessibility is UX', detail:'Every accessibility fix improves the experience for all users. Higher contrast helps in bright sunlight. Larger tap targets help one-handed use. Clear labels help users in a hurry. There is no version of good UX that is not also accessible.' },
      ]}
    >
      <div className="ux2-intro">
        <h1>Accessibility in Design</h1>
        <p className="ux2-tagline">♿ Accessible design is better design for everyone.</p>
        <p className="ux2-why">Accessibility is not an edge case — it is a legal requirement in most countries and a quality signal for all users. A form field with a missing label is frustrating for screen reader users and confusing for sighted users in a hurry. The same fix helps both.</p>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        {BUGS.map(bug => {
          const isSolved = found.has(bug.id);
          return (
            <div key={bug.id} style={{background:'#1e293b',borderRadius:10,padding:'16px 20px',
              border:`1px solid ${isSolved?'#4ade8060':'#334155'}`,
              borderLeft:`3px solid ${isSolved?'#4ade80':'#f87171'}`}}>
              <h3 style={{color:isSolved?'#4ade80':'#f87171',margin:'0 0 10px',fontSize:14}}>{bug.label}</h3>
              <pre style={{background:'#0f172a',borderRadius:8,padding:12,fontSize:12,color:'#94a3b8',overflowX:'auto',whiteSpace:'pre-wrap',margin:'0 0 8px'}}>{bug.bad}</pre>
              {!isSolved ? (
                <button className="ux2-check-btn"
                  style={{background:'#334155',color:'#94a3b8',fontSize:13,padding:'7px 16px'}}
                  onClick={()=>setFound(prev=>{const n=new Set(prev);n.add(bug.id);return n;}))}>
                  Show Fix
                </button>
              ) : (
                <>
                  <pre style={{background:'#0f172a',borderRadius:8,padding:12,fontSize:12,color:'#4ade80',overflowX:'auto',whiteSpace:'pre-wrap',margin:'0 0 6px'}}>{bug.good}</pre>
                  <p style={{color:'#94a3b8',fontSize:13,lineHeight:1.6,margin:'6px 0'}}>{bug.why}</p>
                </>
              )}
            </div>
          );
        })}
      </div>
      {allDone && <div className="ux2-feedback success" style={{marginTop:20}}>✅ Three accessibility issues found. Every fix makes the booking app usable by more patients.</div>}
    </UX2Shell>
  );
}
