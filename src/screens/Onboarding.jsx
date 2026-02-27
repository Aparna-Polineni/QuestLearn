// src/screens/Onboarding.jsx
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';

function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="onboarding">
      <div className="onboarding-content">

        <div className="logo">◈ QuestLearn</div>

        <h1 className="headline">
          First things first —<br />
          <span className="gradient-text">who are you?</span>
        </h1>

        <p className="subline">
          Your answer shapes everything. Pick the path built for you.
        </p>

        <div className="cards">

          <div
            className="card card-teen"
            onClick={() => navigate('/level/math/1')}
          >
            <div className="card-badge">🎒 For teens · Ages 13–19</div>
            <span className="card-emoji">🔢</span>
            <h2>I'm a Student</h2>
            <p>Math feels confusing and school doesn't explain the why. I want it to actually make sense.</p>
            <button className="card-btn btn-teen">
              Start Math Path →
            </button>
          </div>

          <div
            className="card card-adult"
            onClick={() => navigate('/domain-select')}
          >
            <div className="card-badge">💼 For adults · Career changers</div>
            <span className="card-emoji">💻</span>
            <h2>I'm a Career Changer</h2>
            <p>I want to break into tech as a Full Stack Developer. Starting from zero, doing this properly.</p>
            <button className="card-btn btn-adult">
              Start Full Stack Path →
            </button>
          </div>

        </div>

        <p className="footer-note">
          You can always switch paths later. <span>Both paths live in the same app.</span>
        </p>

      </div>
    </div>
  );
}

export default Onboarding;