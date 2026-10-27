import { Link } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import "./LandingPage.css";

import { FEATURES, STEPS } from "../data/landingData";

const LandingPage = () => {
  return (
    <>
      <div className="land">
        <PublicNavbar />

        {/* ══════════════ HERO ══════════════ */}
        <section className="hero" id="hero">

          {/* Background decoration */}
          <div className="hero-bg-grid" />
          <div className="hero-bg-blob hero-bg-blob--1" />
          <div className="hero-bg-blob hero-bg-blob--2" />

          <div className="hero-inner">


            <h1 className="hero-h1">
              Take a stance on{" "}
              <span className="hero-h1-underline">the debate.</span>
            </h1>

            <p className="hero-sub">
              SaySo is where real people debate meaningful questions. Choose For,
              Against, or Neutral, write your response, and explore perspectives anytime.
            </p>

            <div className="hero-cta-row">
              <Link to="/auth" className="hero-btn-primary">
                Join the Debate
                <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            {/* Stats strip */}
            <div className="hero-stats-strip">
              <div className="hss-item">
                <span className="hss-num">1</span>
                <span className="hss-lbl">Active topic</span>
              </div>
              <div className="hss-sep" />
              <div className="hss-item">
                <span className="hss-num">3</span>
                <span className="hss-lbl">Stances</span>
              </div>
              <div className="hss-sep" />
              <div className="hss-item">
                <span className="hss-num">10</span>
                <span className="hss-lbl">Categories</span>
              </div>
            </div>

          </div>{/* /hero-inner */}
        </section>

        {/* ══════════════ FEATURES ══════════════ */}
        <section className="features" id="features">
          <div className="sec-inner">
            <h2 className="sec-h2">Meaningful topics.<br />Honest stances.</h2>

            <div className="features-grid">
              {FEATURES.map((f, i) => (
                <div className="feat-card" key={i}>
                  <div className="feat-icon">{f.icon}</div>
                  <h3 className="feat-title">{f.title}</h3>
                  <p className="feat-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ HOW IT WORKS ══════════════ */}
        <section className="how" id="how">
          <div className="sec-inner how-inner">
            <div className="how-left">
              <h2 className="sec-h2">Three steps<br />to your first debate.</h2>
              <Link to="/auth" className="how-cta">Create an Account</Link>
            </div>
            <div className="how-steps">
              {STEPS.map((s, i) => (
                <div className="step" key={i}>
                  <div className="step-num">{s.num}</div>
                  <div className="step-body">
                    <h4 className="step-title">{s.title}</h4>
                    <p className="step-desc">{s.desc}</p>
                  </div>
                  {i < STEPS.length - 1 && <div className="step-line" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ CTA BANNER ══════════════ */}
        <section className="cta-banner">
          <div className="cta-inner">
            <div className="cta-rings">
              <div className="cta-ring r1" /><div className="cta-ring r2" /><div className="cta-ring r3" />
            </div>
            <div className="cta-content">
              <h2 className="cta-h2">
                Share your stance on<br />
                <em className="cta-em">the active debate.</em>
              </h2>
              <p className="cta-sub">
                Pick your side, write your response, and explore perspectives across For, Against, and Neutral.
              </p>
              <Link to="/auth" className="cta-btn">Login / Sign Up</Link>
            </div>
          </div>
        </section>

        {/* ══════════════ FOOTER ══════════════ */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-logo">
              <span style={{ color: "rgba(255,255,255,0.9)" }}>Say</span>
              <span style={{ color: "var(--color-accent)" }}>So</span>
            </div>
            <p className="footer-copy">© 2026 SaySo · Debate platform</p>
          </div>
        </footer>
      </div>

          </>
  );
};

export default LandingPage;