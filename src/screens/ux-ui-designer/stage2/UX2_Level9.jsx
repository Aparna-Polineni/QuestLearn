// src/screens/ux-ui-designer/stage2/UX2_Level9.jsx — Figma Foundations Capstone (BUILD)
import { useState } from 'react';
import UX2Shell from './UX2Shell';
import { RubricValidator } from '../../../components/BuildValidator';

const RUBRIC = [
  { label:'At least 6 screens: Home, Select Type, Choose Date, Choose Time, Patient Details, Confirmation', check:(_,u)=>u.includes('HOME')||u.includes('SCREEN')||u.includes('FRAME'), hint:'Start with 6 frames in Figma, one per step in the booking flow.' },
  { label:'Auto-layout used for all repeating elements — no manual spacing', check:(_,u)=>u.includes('AUTO')||u.includes('LAYOUT')||u.includes('FLEX'), hint:'Select any list or row of items — if it does not have auto-layout, add it.' },
  { label:'Components defined: Button (3 states), Form Field (3 states), Navigation Bar', check:(_,u)=>u.includes('COMPONENT')||u.includes('BUTTON')||u.includes('VARIANT'), hint:'Create → Component (Cmd+Alt+K). Add variants for each state.' },
  { label:'Colour and text styles applied from design system tokens', check:(_,u)=>u.includes('STYLE')||u.includes('TOKEN')||u.includes('COLOUR'), hint:'Every colour value should be a style, not a one-off hex. Every text layer should use a text style.' },
  { label:'Prototype: complete booking flow is clickable from Home to Confirmation', check:(_,u)=>u.includes('PROTOTYPE')||u.includes('CONNECTION')||u.includes('INTERACT'), hint:'Prototype mode → connect each frame in order. Test in presentation mode.' },
  { label:'Accessibility: 44px tap targets, high-contrast error states annotated', check:(_,u)=>u.includes('44')||u.includes('ACCESS')||u.includes('CONTRAST'), hint:'Check all tap targets with a 44×44px frame overlay. Check error text contrast with the Able plugin.' },
  { label:'Dev Mode annotations added for at least 3 interactions or edge cases', check:(_,u)=>u.includes('ANNOT')||u.includes('DEV')||u.includes('NOTE'), hint:'Dev Mode → Add annotation on modals, form validation, loading states.' },
];

export default function UX2_Level9() {
  const [passed, setPassed] = useState(false);

  return (
    <UX2Shell levelId={9} canProceed={passed}
      prevLevelContext="You have now covered every core Figma skill: frames, auto-layout, components, styles, prototyping, handoff, design systems, and accessibility. This capstone asks you to deliver the complete booking flow using all of it."
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
        "Delivered the complete hospital booking flow: 6 screens, prototype, handoff-ready",
      ]}
      conceptReveal={[
        { label:'The Figma Professional Mindset', detail:'Professionals name every layer. They use components for everything that repeats. They apply styles rather than one-off values. They annotate every non-obvious behaviour. They test their prototype with five people before calling a design done. The skill is not knowing Figma — it is the discipline to use it properly every time.' },
      ]}
    >
      <div className="ux2-intro">
        <h1>Figma Foundations Capstone</h1>
        <p className="ux2-tagline">🎯 Design the complete patient booking flow. Apply everything.</p>
        <p className="ux2-why">Real design work is not completing exercises — it is making hundreds of small decisions under constraints. This capstone asks you to make those decisions for the hospital booking flow, using every technique from Stage 2.</p>
      </div>
      <div className="ux2-panel" style={{marginBottom:14}}>
        <div className="ux2-panel-hdr">📋 Deliverable: Hospital Patient Booking Flow in Figma</div>
        <div className="ux2-panel-body" style={{fontSize:13,color:'#64748b',lineHeight:1.7}}>
          <p>You are designing the mobile booking flow for the hospital app. The patient should be able to:</p>
          <p>1. See available appointment types → 2. Choose a date → 3. Choose a time slot → 4. Enter their details → 5. See a confirmation</p>
          <p>Document your Figma work below. Describe your component structure, style system, prototype connections, and accessibility decisions.</p>
        </div>
      </div>
      <RubricValidator language="Figma" rubric={RUBRIC} onAllPassed={()=>setPassed(true)}
        solutionCode="Open Figma → New file → Create 6 frames at 375×812 (iPhone 14 Pro) → Apply auto-layout → Create component variants → Define styles → Connect prototype → Annotate in Dev Mode" />
    </UX2Shell>
  );
}
