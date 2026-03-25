
◈ QuestLearn
Project README — Complete Technical Reference
March 2026  ·  All builds documented

React 18  ·  Spring Boot 3  ·  MySQL  ·  JWT Auth

1.  System Overview

QuestLearn is a career discovery and learning platform. Users explore tech careers through interactive role demonstrations, then complete structured curriculum paths from beginner to job-ready.

Layer	Detail
Frontend	React 18, port 3000, React Router v6
Backend	Spring Boot 3, port 8080, REST API
Database	MySQL — users, progress, completions
Auth	JWT stored in localStorage via api.js
Routing	React Router — RequireAuth guard for protected routes

2.  Career Paths

Seven active paths. Five coming soon. Each path has numbered stages, each stage has numbered levels. Two URL formats exist based on when the path was built.

Path	Levels	Status	URL Format
Java Full Stack	139	Active	/stage/{n}/level/{n}  (legacy)
Frontend React	89	Active	/stage/{n}/level/{n}  (legacy)
Data Engineer	84	Active	/path/data-engineer/stage/{n}/level/{n}
ML / AI Engineer	112	Active	/path/ml-ai-engineer/stage/{n}/level/{n}
Cyber Security	84	Active	/path/cyber-security/stage/{n}/level/{n}
UX / UI Designer	70	Active	/path/ux-ui-designer/stage/{n}/level/{n}
Math Student	84	Active	/stage/math/level/{n}  (legacy)

Level Key Format
Every completed level is stored with a unique key used by GameContext to track progress.

Path Type	Key Format
Legacy (java-fullstack)	{stageId}-{levelId}  e.g.  2-7
New paths (data-engineer etc)	{prefix}-{stageId}-{levelId}  e.g.  de-1-3

Prefixes: de = data-engineer, ml = ml-ai-engineer, cy = cyber-security, ux = ux-ui-designer.

3.  Landing Page  (LandingPage.jsx + LandingPage.css)

The public marketing homepage at route /. Visible to all visitors with no account required. The previous behaviour was a cold redirect to /auth — replaced with a career discovery experience.

Design Philosophy
•	Show the job before asking for anything — context before tasks removes beginner anxiety
•	Human stakes over corporate stakes — patient safety scenarios not CEO board meetings
•	One small win in under 2 minutes — two questions, not a full task
•	Confidence layer before path selection — user is told what they demonstrated before being asked to choose
•	Comparison memory — users who try multiple roles see a side-by-side panel with trait tags and a "feels like" description per role

Page Sections
Section	Description
Nav	Sticky. Opaque on scroll. Sign in + Get started free buttons.
Hero	Full viewport. Headline: "I don't know where to start" → "I've already started." One CTA scrolls to Explore.
Explore	Two-column: 5 job tabs left, detail panel right. Shows situation, task, feeling, who enjoys it per role.
TryIt widget	Two questions inside the panel. Step progress bar. Confidence layer. Reflection question. Compare loop.
Choose Path	Six path cards. After completing TryIt, matched path gets "Matches what you just did" badge.
How it works	Four cards: Pick, Do, Unlock, Build.
Final CTA	One headline, one button.

TryIt Widget — State Machine
The TryIt widget inside the Explore panel runs five sequential phases:
Phase	What happens
q1	Main reasoning question. 4 options. Wrong answer shows explanation + retry guidance. Correct auto-advances to q2.
q2	Prevention question ("What stops this happening again?"). 3 options. Slightly harder framing.
confidence	Large bordered box: "You just thought like a [Role]." + one supporting sentence. Button: "One quick question →"
reflection	"Did you enjoy solving this kind of problem?" — three buttons: Yes / Not sure / Not really. Each gives a personalised response before showing path CTA.
(choice)	Two buttons: "Start [role] path →" and "Compare with another role". Compare resets to browse and scrolls up.

Jobs in the Explore Tabs
Five jobs: Data Engineer, ML/AI Engineer, Cyber Security Analyst, UX/UI Designer, Full Stack Developer. Each has: id, emoji, role, tagline, day (scenario), task (what you do), feeling, who (personality match), tags[], feels (one-line comparison descriptor), color, pathId.

Comparison Panel
Appears above the path grid after two or more roles are explored. Shows: "You are getting closer to a decision." + role cards with trait tags and feels line side by side. Driven by completedJobs[] state in LandingPage.

Key State (LandingPage)
Variable	Purpose
active	Which JOBS entry is currently shown in the panel
phase	browse | tryit | done — controls what shows below the panel blocks
completedJobs[]	Array of JOBS objects the user has finished TryIt for. Drives comparison panel.
scrolled	Triggers opaque nav bar at 40px scroll

4.  Authentication & Routing

Guest Level 0 — No Auth Wall
The most important conversion change made in this session. Previously, clicking any path card on the landing page redirected to /auth before the user had done anything. Now:

•	All /path/{id}/stage/1/level/0 routes are public (no RequireAuth wrapper)
•	/domain-select is public (java-fullstack guests choose their project domain before signing up)
•	/stage/1/level/0 redirects to /stage/1/level/1 (java-fullstack has no level 0 — level 1 is the entry)
•	Level 1+ routes remain behind RequireAuth

SaveProgressModal (src/components/SaveProgressModal.jsx)
Replaces the cold auth wall. When a guest completes Level 0 and clicks "Continue to 1.1 →", the shell checks useAuth().user. If null, it renders SaveProgressModal instead of navigating.

Element	Detail
Progress bar	Shows 1/7 levels complete — makes the investment visible
Headline	"Save your progress" — not "Create an account"
Subtext	"Free. Takes 30 seconds. No credit card."
Form	Name (signup only), email, password. "Save & continue →" on submit.
After auth	Clears ql_guest_{pathId} from localStorage. Navigates to nextUrl (Level 1).
Skip link	"Continue without saving (progress will be lost)" — subtle, below the form

The modal is used in: DE1Shell, ML1Shell, CY1Shell, UX1Shell (level 0 check), and Stage1Shell (level 1 check for java-fullstack).

Destination Preservation — sessionStorage
Previous bug: after signing in, users were redirected back to /auth in a loop. Fixed with sessionStorage:

•	RequireAuth writes the intended URL to sessionStorage key "ql_redirect" before redirecting to /auth
•	AuthScreen reads sessionStorage first, then ?next= param, then falls back to /career-select
•	AuthScreen guards against /auth appearing as destination (loop prevention)
•	CareerPathSelect reads sessionStorage on mount — if a redirect is stored, honours it immediately, skipping the path picker

RequireAuth Logic
if (!user) {
  const dest = window.location.pathname + window.location.search;
  if (dest !== "/" && !dest.startsWith("/auth")) {
    sessionStorage.setItem("ql_redirect", dest);
  }
  return <Navigate to="/auth" replace />;
}

5.  Stage 1 Shell Components

Each new-path has a dedicated shell component that wraps all 8 levels of Stage 1. The shell handles: top bar, breadcrumb, mode badge, content slot, ConceptReveal, and the footer continue button. All four have been updated to support the guest flow.

Shell	Path	Color	File
DE1Shell	data-engineer	#06b6d4 cyan	src/screens/data-engineer/stage1/
ML1Shell	ml-ai-engineer	#8b5cf6 purple	src/screens/ml-ai-engineer/stage1/
CY1Shell	cyber-security	#10b981 green	src/screens/cyber-security/stage1/
UX1Shell	ux-ui-designer	#ec4899 pink	src/screens/ux-ui-designer/stage1/

Guest Flow in Each Shell
handleComplete() checks levelId === 0 && !user. If true, sets showModal(true) instead of navigate(). The SaveProgressModal receives pathId, stageId:1, levelId:0, nextUrl (level 1 URL), and onClose (which skips signup and navigates to level 1 anyway).

The back button shows "← Back" for guests (navigates to /) and "← Roadmap" for authenticated users.

Stage1Shell (Java Full Stack)
File: src/screens/stage1/Stage1Shell.jsx. Java fullstack starts at level 1 (no level 0). SaveProgressModal is shown when a guest completes level 1 and tries to continue. The modal is placed outside the root div inside a React Fragment (<>...</>) to avoid JSX sibling errors.

6.  Java Full Stack — Special Routing

Java fullstack uses legacy URL format and has domain selection. Its routing chain is different from the new paths.

Step	What happens
1. Landing page	User clicks "Start Full Stack Developer →". startPath("java-fullstack") navigates to /domain-select (not /path/java-fullstack/...).
2. Domain select	User picks their project domain (hospital, school, e-commerce etc). /domain-select is now public — no auth required.
3. Level 1	DomainSelect navigates to /stage/1/level/0, which redirects to /stage/1/level/1 (first real level).
4. Guest gate	Guest completes level 1 → Stage1Shell shows SaveProgressModal → user signs up → continues to level 2.

Previous bug: Landing page sent java-fullstack to /path/java-fullstack/stage/1/level/0 which does not exist. The catch-all route matched it and redirected to /auth, creating an infinite loop.

7.  GameContext — Progress Tracking

GameContext manages all learning progress. Key configuration:

Stage Order per Path
STAGE_ORDER = ['1','2','2.5','3','4','5','6','7','8']  // legacy
PATH_STAGE_ORDERS = {
  'data-engineer':  ['1','2','3','4','5','6','7'],
  'ml-ai-engineer': ['1','2','3','4','5','6','7','8'],
  'cyber-security': ['1','2','3','4','5','6','7'],
  'ux-ui-designer': ['1','2','3','4','5','6','7'],
}

Level Counts per Stage
Path	Stage level counts
data-engineer	Stage 1: 8,  Stage 2: 14,  Stages 3-7: 14, 12, 12, 12, 12
ml-ai-engineer	Stage 1: 8,  Stage 2: 14,  Stages 3-8: 16, 16, 18, 16, 12, 12
cyber-security	Stage 1: 8,  Stage 2: 14,  Stages 3-7: 12, 14, 12, 12, 12
ux-ui-designer	Stage 1: 8,  Stage 2: 10,  Stages 3-7: 10, 10, 10, 10, 12

Stage unlock threshold: 80%. Users must complete 80% of a stage to unlock the next. The system uses retroactive unlocking so existing users are never regressed.

8.  Stage 2 Content — Build Status

Path	Levels	Status
Data Engineer — SQL & Databases	14 (0–13)	All 14 fully built. Covers SQL basics, aggregates, JOINs, CTEs, window functions, ACID, NoSQL.
ML/AI Engineer — Python & Math	14 (0–13)	Levels 0–5 fully built. Levels 6–13 placeholder (mark-complete buttons).
Cyber Security — Linux & Networking	14 (0–13)	Levels 0–11 fully built. Levels 12–13 placeholder.
UX/UI Designer — Figma Foundations	10 (0–9)	Level 0 fully built. Levels 1–9 placeholder.

Placeholder levels display a "Mark Complete" button so users can progress without being blocked. Full content for remaining placeholders is next build priority.

9.  Files Changed — This Session

New Files
File	Purpose
src/components/SaveProgressModal.jsx	Guest-to-user conversion modal at end of Level 0
src/components/SaveProgressModal.css	Styles for the modal
src/screens/LandingPage.jsx	Full rewrite — career discovery interface
src/screens/LandingPage.css	Full rewrite — single-source clean stylesheet

Updated Files
File	Change
src/App.js	Level 0 routes unprotected. /domain-select unprotected. /stage/1/level/0 redirect added. RequireAuth uses sessionStorage.
src/screens/AuthScreen.jsx	Reads sessionStorage for redirect destination. Decodes ?next= param. Guards against /auth loop.
src/screens/CareerPathSelect.jsx	useEffect checks sessionStorage on mount and honours stored redirect immediately.
src/screens/data-engineer/stage1/DE1Shell.jsx	Guest gate at level 0 — shows SaveProgressModal
src/screens/ml-ai-engineer/stage1/ML1Shell.jsx	Guest gate at level 0 — shows SaveProgressModal
src/screens/cyber-security/stage1/CY1Shell.jsx	Guest gate at level 0 — shows SaveProgressModal
src/screens/ux-ui-designer/stage1/UX1Shell.jsx	Guest gate at level 0 — shows SaveProgressModal
src/screens/stage1/Stage1Shell.jsx	Guest gate at level 1 (java-fullstack entry). Fragment wrapper for modal.

10.  Known Issues & Next Build Priority

Pending Content
•	ML/AI Stage 2 levels 6–13: placeholders only
•	Cyber Security Stage 2 levels 12–13: placeholders only
•	UX/UI Designer Stage 2 levels 1–9: placeholders only
•	Stage 3+ for all 4 new paths: not yet built

Next Build Priority
•	Complete ML/AI Stage 2 remaining levels (gradient descent, feature engineering, EDA capstone)
•	Complete CY Stage 2 remaining levels (intrusion investigation, server hardening capstone)
•	Complete UX Stage 2 levels (Figma foundations, auto-layout, components, prototyping, capstone)
•	Stage 3 content for all 4 new paths
•	Production deployment (Docker Compose built, needs cloud host)

QuestLearn  ·  March 2026
