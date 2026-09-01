import React, { useState } from "react";
import { Link } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import "./LandingPage.css";
import DebateCard from "../components/DebateCard";

import { FEATURED_DEBATE, SIDE_DEBATES, FEATURES, STEPS } from "../data/landingData";

const LandingPage = () => {
  return (
    <>
      <div className="land">
        <PublicNavbar />

        {/* ══════════════ HERO ══════════════ */}
        <section className="hero">

          {/* Background decoration */}
          <div className="hero-bg-grid" />
          <div className="hero-bg-blob hero-bg-blob--1" />
          <div className="hero-bg-blob hero-bg-blob--2" />

          <div className="hero-inner">


            <h1 className="hero-h1">
              Your opinion on{" "}
              <span className="hero-h1-underline">every issue.</span>
            </h1>

            <p className="hero-sub">
              SaySo is where real people — not journalists, not politicians —
              debate the issues that shape our world. Write your For or Against,
              read others, and see where opinion truly stands.
            </p>

            <div className="hero-cta-row">
              <Link to="/auth" className="hero-btn-primary">
                Join the Conversation
                <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            {/* Stats strip */}
            <div className="hero-stats-strip">
              <div className="hss-item">
                <span className="hss-num">12K+</span>
                <span className="hss-lbl">Debates</span>
              </div>
              <div className="hss-sep" />
              <div className="hss-item">
                <span className="hss-num">84K+</span>
                <span className="hss-lbl">Opinions written</span>
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
            <h2 className="sec-h2">Built for opinion.<br />Not entertainment.</h2>

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

        {/* ══════════════ TRENDING TOPICS ══════════════ */}
        <section className="debates-strip" id="topics">
          <div className="sec-inner">
            <h2 className="sec-h2">Real issues.<br />Real opinions.</h2>

            <div className="debates-grid">
              {[FEATURED_DEBATE, ...SIDE_DEBATES].map((d, i) => (
                <div key={i} className="debate-strip-card">
                  <DebateCard debate={d} size="full" />
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
                Make your voice<br />
                <em className="cta-em">actually heard.</em>
              </h2>
              <p className="cta-sub">
                Join thousands already debating the issues that shape our world.
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
            <p className="footer-copy">© 2024 SaySo · A platform for public opinion</p>
          </div>
        </footer>
      </div>

          </>
  );
};

export default LandingPage;