// src/screens/ux-ui-designer/stage1/UX1_Level6.jsx — UX vs UI (CONCEPTS)
import { useState } from 'react';
import UX1Shell from './UX1Shell';

const CARDS = [
  { id:'ux',    title:'UX — User Experience',     body:'The overall experience of using a product. Is it easy? Does it meet needs? Is the flow logical? UX is invisible when done well — users accomplish goals without friction. UX work happens before any visual design: research, information architecture, flows, wireframes.' },
  { id:'ui',    title:'UI — User Interface',      body:'The visual layer users interact with. Colours, typography, spacing, buttons, icons, animations. UI makes UX real. Great UI without good UX is like a beautiful car with a broken steering wheel. Great UX with bad UI leaves users frustrated despite a good structure.' },
  { id:'ia',    title:'Information Architecture', body:'How content is organised and labelled. Navigation menus, categories, search, hierarchy. Good IA means users can predict where things are. Bad IA is the reason users can\'t find your pricing page — the structure doesn\'t match their mental model.' },
  { id:'inter', title:'Interaction Design',       body:'How users interact with specific elements. Button states (default, hover, active, disabled), form validation feedback, loading states, error messages, microinteractions. The space between UX flow and UI visual design.' },
  { id:'acc',   title:'Accessibility',            body:'Designing for all users including those with disabilities. WCAG 2.1 guidelines: colour contrast 4.5:1, keyboard navigability, screen reader support, text alternatives for images. Not optional — legally required in many jurisdictions. Usually improves usability for everyone.' },
  { id:'tools', title:'Designer\'s Tool Stack',  body:'Figma: design + prototyping (industry standard). FigJam: ideation, affinity mapping. Maze / UserTesting: remote usability testing. Hotjar: heatmaps, session recordings. Zeroheight / Storybook: design system documentation. Lottie: animations. Miro: workshops.' },
];

export default function UX1_Level6() {
  const [seen, setSeen] = useState(new Set());
  const toggle = id => setSeen(p => { const n = new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });

  return (
    <UX1Shell levelId={6} canProceed={seen.size
      prevLevelContext="In the last level you designed the visual hierarchy. Now you\'ll test it — running a five-user usability test on the booking prototype and turning observations into actionable changes."
      cumulativeSkills={[
        "Defined UX vs UI and mapped the five phases of Design Thinking",
        "Applied Design Thinking: empathised and defined the booking problem",
        "Conducted user research: interview guide, synthesis, and patient persona",
        "Sketched three wireframes for the mobile patient booking flow",
        "Restructured the information architecture: clear hierarchy, two-click navigation",
        "Applied visual hierarchy: size, weight, and colour to direct patient attention",
        "Planned and conducted a five-user usability test with documented findings",
      ]}
    >= CARDS.length}>
      <div className="ux1-intro">
        <h1>UX vs UI — What\'s the Difference?</h1>
        <p className="ux1-tagline">🎨 UX = the journey. UI = the vehicle. Both matter.</p>
        <p className="ux1-why">Hiring managers often conflate UX and UI. Understanding the distinction — and how all the related disciplines connect — makes you more effective and easier to hire.</p>
      </div>
      <div className="ux1-cards">
        {CARDS.map(c => (
          <div key={c.id} className={`ux1-card ${seen.has(c.id)?'seen':''}`} onClick={() => toggle(c.id)}>
            <div className="ux1-card-top">
              <span className="ux1-card-title">{c.title}</span>
              <span style={{color:'#ec4899',fontSize:11}}>{seen.has(c.id)?'▲':'▼'}</span>
            </div>
            {seen.has(c.id) && <p className="ux1-card-body">{c.body}</p>}
          </div>
        ))}
      </div>
      {seen.size < CARDS.length && <p style={{textAlign:'center',color:'#475569',fontSize:13}}>Explore all {CARDS.length} cards to continue →</p>}
      {seen.size >= CARDS.length && <div className="ux1-feedback success">✅ Design landscape mapped. Capstone next.</div>}
    </UX1Shell>
  );
}
