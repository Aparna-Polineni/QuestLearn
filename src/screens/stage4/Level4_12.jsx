// src/screens/stage4/Level4_12.jsx — Spring Security Basics (DEBUG)
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import Stage4Shell from './Stage4Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import FillEditor from '../stage2/FillEditor';
import './Level4_12.css';

const SUPPORT = {
  intro: {
    concept: 'Spring Security — Locking Down Your API',
    tagline: 'By default, Spring Security locks everything. You configure what to allow.',
    whatYouWillDo: 'Fix a broken SecurityConfig. The bugs mean the security rules are wrong — public endpoints require auth and the password encoder is misconfigured. Fix 3 bugs.',
    whyItMatters: 'Without security, anyone can call your API, admit fake patients, delete records, or read private data. Spring Security intercepts every request and checks authorisation before it reaches your controller.',
  },
  hints: [
    '@EnableWebSecurity activates Spring Security. Without it, the security configuration is ignored.',
    'requestMatchers("/api/auth/**").permitAll() allows requests to auth endpoints without login. .anyRequest().authenticated() requires auth for everything else.',
    'BCryptPasswordEncoder is the standard Spring Security password encoder. It hashes passwords with bcrypt — never store plain-text passwords.',
    'csrf().disable() is needed for REST APIs — CSRF protection is for browser-based form submissions, not API calls with JWT tokens.',
  ],
  reveal: {
    concept: 'SecurityConfig, BCrypt, and Request Authorization',
    whatYouLearned: '@EnableWebSecurity activates security. SecurityFilterChain configures rules. permitAll() for public endpoints (login, register). authenticated() for protected endpoints. BCryptPasswordEncoder hashes passwords. csrf().disable() for stateless REST APIs.',
    realWorldUse: 'Hospital API security: /api/auth/** public (login, register). /api/patients/** requires authentication. /api/admin/** requires ADMIN role. Spring Security checks every request against these rules before it reaches your controller.',
    developerSays: 'Spring Security has a steep learning curve but a simple mental model: everything is a filter. Requests pass through a chain of filters. Each filter can allow, deny, or modify the request. SecurityFilterChain configures those filters.',
  },
};

const TEMPLATE = `import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.context.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

// BUG 1: Missing annotation to activate Spring Security configuration
___ENABLEWEBSECURITY___
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // disable CSRF for REST APIs
            .authorizeHttpRequests(auth -> auth
                // BUG 2: Auth endpoints should be PUBLIC — change authenticated() to permitAll()
                .requestMatchers("/api/auth/**").___PERMITALL___()
                .anyRequest().authenticated()
            );
        return http.build();
    }

    @Bean
    // BUG 3: Wrong encoder — must use BCryptPasswordEncoder, not PlainTextPasswordEncoder
    public ___BCRYPT___PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}`;

const BLANKS = [
  { id: 'ENABLEWEBSECURITY', answer: '@EnableWebSecurity', placeholder: 'annotation', hint: 'Activates Spring Security. Without it, your SecurityConfig class is ignored.' },
  { id: 'PERMITALL',         answer: 'permitAll',          placeholder: 'method',     hint: 'Allows the request without authentication. The opposite of authenticated().' },
  { id: 'BCRYPT',            answer: 'BCrypt',             placeholder: 'type',       hint: 'The standard Spring Security password encoder. Hashes with bcrypt — never stores plain text.' },
];

const ANATOMY = [
  { label: '@EnableWebSecurity',           desc: 'activates Spring Security' },
  { label: '.permitAll()',                  desc: 'no authentication required' },
  { label: '.authenticated()',              desc: 'must be logged in' },
  { label: '.hasRole("ADMIN")',             desc: 'must have ADMIN role' },
  { label: 'BCryptPasswordEncoder',        desc: 'bcrypt password hashing' },
  { label: 'csrf().disable()',             desc: 'disable CSRF for REST APIs' },
];

export default function Level4_12() {
  const { selectedDomain } = useGame();
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage4Shell levelId={12} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <LevelSupportWrapper conceptIntro={SUPPORT.intro} hints={SUPPORT.hints} levelComplete={isCorrect}>
        <div className="l412-container">
          <div className="l412-brief">
            <div className="l412-brief-tag">// Debug Mission — Spring Security</div>
            <h2>Fix the security config to protect your <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name || 'hospital'}</span> API correctly.</h2>
            <p>3 bugs. The security annotation is missing, an endpoint has the wrong access rule, and the password encoder type is wrong.</p>
          </div>
          <div className="l412-anatomy">
            <div className="l412-anatomy-title">// Spring Security Reference</div>
            <div className="l412-anatomy-rows">
              {ANATOMY.map(a => (
                <div key={a.label} className="l412-anat-row">
                  <span className="l412-anat-annotation">{a.label}</span>
                  <span className="l412-anat-desc">— {a.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <FillEditor template={TEMPLATE} blanks={BLANKS} onAllCorrect={() => setIsCorrect(true)} />
        </div>
      </LevelSupportWrapper>
    </Stage4Shell>
  );
}