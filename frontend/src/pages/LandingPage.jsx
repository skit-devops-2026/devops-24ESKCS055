import React, { useState } from "react";
import { Link } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";

/* ── Debate card data — shows user opinions, not vote tallies ── */
const FEATURED_DEBATE = {
  category: "Politics & Governance",
  catColor: "#5B6FA6",
  catBg: "rgba(91,111,166,0.12)",
  title: "Should reservation policies be based on economic status instead of caste?",
  author: "Aditi Sharma",
  forOpinion: "Economic backwardness is the real barrier today. A poor upper-caste student suffers as much as a poor lower-caste one. Shifting to income-based reservation would be more just and reduce social division.",
  againstOpinion: "Caste discrimination is not just about income — it is about centuries of systemic exclusion. Economic criteria alone cannot address the structural disadvantage that caste creates in education and employment.",
  forPct: 54,
  totalVotes: 3210,
};

const SIDE_DEBATES = [
  {
    category: "Society & Culture",
    catColor: "#8B6F47",
    catBg: "rgba(139,111,71,0.12)",
    title: "Should India conduct a nationwide caste census?",
    forOpinion: "Accurate data is the foundation of good policy. Without knowing the real population share of each caste group, welfare schemes are designed on assumptions rather than facts.",
    againstOpinion: "A caste census will deepen caste identities at the very moment we should be moving beyond them. It risks fuelling political exploitation rather than addressing genuine backwardness.",
    forPct: 61,
  },
  {
    category: "Politics & Governance",
    catColor: "#5B6FA6",
    catBg: "rgba(91,111,166,0.12)",
    title: "Should political parties be allowed to make promises that significantly increase government spending?",
    forOpinion: "In a democracy, parties must be accountable to voters through promises. Restricting what they can offer limits political freedom and ultimately disenfranchises citizens.",
    againstOpinion: "Freebies funded by debt burden future generations. An independent fiscal authority should assess whether election promises are economically viable before they are made.",
    forPct: 43,
  },
];

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    title: "Post Your Take",
    desc: "Write about any issue — local, political, global, or social. Every voice deserves to be heard.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <path d="M3 6h18M3 12h18M3 18h18"/>
        <circle cx="19" cy="6" r="2" fill="currentColor"/>
        <circle cx="5" cy="18" r="2" fill="currentColor"/>
      </svg>
    ),
    title: "Share Your Opinion",
    desc: "Don't just vote — write your For or Against reasoning. Your words shape the debate.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    ),
    title: "Discover Perspectives",
    desc: "See how people across backgrounds think about the same issue. Insight, not noise.",
  },
];

const STEPS = [
  { num: "01", title: "Create your account", desc: "Sign up in under a minute. No lengthy verification, no waiting." },
  { num: "02", title: "Browse or start a debate", desc: "Find a topic that matters to you, or raise a new one yourself." },
  { num: "03", title: "Write your For or Against", desc: "Give your actual opinion — not just a thumbs up. Make it count." },
];

/* ── Mini debate card used inside hero ── */
const DebateCard = ({ debate, size = "full" }) => {
  const [tab, setTab] = useState("for");
  const againstPct = 100 - debate.forPct;

  return (
    <div className={`dc ${size === "small" ? "dc--small" : ""}`}>
      <div className="dc-top">
        <span className="dc-cat" style={{ background: debate.catBg, color: debate.catColor }}>
          {debate.category}
        </span>
        {size === "full" && (
          <span className="dc-author">by {debate.author}</span>
        )}
      </div>

      <h4 className="dc-title">{debate.title}</h4>

      {/* Opinion toggle */}
      <div className="dc-tabs">
        <button
          className={`dc-tab dc-tab--for ${tab === "for" ? "dc-tab--active-for" : ""}`}
          onClick={() => setTab("for")}
        >
          For
        </button>
        <button
          className={`dc-tab dc-tab--against ${tab === "against" ? "dc-tab--active-against" : ""}`}
          onClick={() => setTab("against")}
        >
          Against
        </button>
      </div>

      <div className={`dc-opinion ${tab === "for" ? "dc-opinion--for" : "dc-opinion--against"}`}>
        <span className="dc-opinion-quote">"</span>
        {tab === "for" ? debate.forOpinion : debate.againstOpinion}
      </div>

      {/* Vote bar */}
      <div className="dc-bar-wrap">
        <div className="dc-bar">
          <div className="dc-bar-for" style={{ width: `${debate.forPct}%` }} />
        </div>
        <div className="dc-bar-labels">
          <span className="dcbl-for">For {debate.forPct}%</span>
          <span className="dcbl-against">Against {againstPct}%</span>
        </div>
      </div>
    </div>
  );
};

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

            {/* ── Left ── */}
            <div className="hero-left">

              <div className="hero-live-badge">
                <span className="hero-live-dot" />
                Live debates happening now
              </div>

              <h1 className="hero-h1">
                Your opinion.<br />
                <span className="hero-h1-line2">
                  <span className="hero-h1-underline">Every issue.</span>
                </span>
                <br />One platform.
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
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
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
            </div>

            {/* ── Right — interactive debate preview ── */}
            <div className="hero-right">

              {/* Main featured card */}
              <div className="hero-main-card">
                <div className="hero-main-label">
                  <svg viewBox="0 0 12 12" fill="currentColor" width="8" height="8">
                    <circle cx="6" cy="6" r="6"/>
                  </svg>
                  Featured Debate
                </div>
                <DebateCard debate={FEATURED_DEBATE} size="full" />
              </div>

              {/* Two smaller side cards */}
              <div className="hero-side-cards">
                {SIDE_DEBATES.map((d, i) => (
                  <div
                    key={i}
                    className="hero-side-card"
                    style={{ animationDelay: `${0.2 + i * 0.15}s` }}
                  >
                    <DebateCard debate={d} size="small" />
                  </div>
                ))}
              </div>

              {/* Floating tag */}
              <div className="hero-float-tag">
                <svg viewBox="0 0 20 20" fill="none" width="13" height="13">
                  <path d="M10 2l2.4 5 5.6.8-4 3.9.9 5.5L10 14.5l-4.9 2.7.9-5.5L2 7.8l5.6-.8L10 2z" fill="var(--color-accent)" stroke="var(--color-accent)" strokeWidth="1"/>
                </svg>
                Write your real opinion
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ FEATURES ══════════════ */}
        <section className="features" id="features">
          <div className="sec-inner">
            <div className="sec-eyebrow">Why SaySo</div>
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
            <div className="sec-eyebrow">Trending now</div>
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
              <div className="sec-eyebrow">Getting started</div>
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

      <style>{`
        /* ── Reset & base ── */
        .land {
          min-height: 100dvh;
          background: var(--color-bg);
          overflow-x: hidden;
        }
        .sec-inner {
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .sec-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--color-accent);
          background: rgba(201,166,107,0.1);
          border: 1px solid rgba(201,166,107,0.25);
          padding: 5px 14px;
          border-radius: 20px;
          margin-bottom: 16px;
        }
        .sec-h2 {
          font-family: 'Fraunces', serif;
          font-size: clamp(26px, 3.5vw, 40px);
          font-weight: 700;
          color: var(--color-primary-dark);
          line-height: 1.2;
          margin-bottom: 48px;
          letter-spacing: -0.5px;
        }

        /* ══════ HERO ══════ */
        .hero {
          min-height: 100dvh;
          display: flex;
          align-items: center;
          padding-top: 66px;
          position: relative;
          overflow: hidden;
        }

        /* Background decorations */
        .hero-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(62,98,89,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(62,98,89,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }
        .hero-bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .hero-bg-blob--1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(62,98,89,0.08), transparent 70%);
          top: -100px; right: -100px;
        }
        .hero-bg-blob--2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(201,166,107,0.07), transparent 70%);
          bottom: 0; left: 10%;
        }

        .hero-inner {
          max-width: 1140px;
          margin: 0 auto;
          padding: 60px 40px;
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 64px;
          align-items: center;
          position: relative;
          z-index: 1;
          width: 100%;
        }

        /* Left */
        .hero-live-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          color: var(--color-primary);
          background: var(--color-primary-tint);
          border: 1px solid rgba(62,98,89,0.18);
          padding: 6px 14px;
          border-radius: 20px;
          margin-bottom: 28px;
        }
        .hero-live-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--color-for);
          animation: livePulse 2s ease-in-out infinite;
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.8); }
        }

        .hero-h1 {
          font-family: 'Fraunces', serif;
          font-size: clamp(38px, 5vw, 62px);
          font-weight: 700;
          color: var(--color-primary-dark);
          line-height: 1.12;
          letter-spacing: -1.5px;
          margin-bottom: 24px;
        }
        .hero-h1-line2 { display: inline-block; }
        .hero-h1-underline {
          position: relative;
          color: var(--color-primary);
        }
        .hero-h1-underline::after {
          content: '';
          position: absolute;
          left: 0; right: 0;
          bottom: -4px;
          height: 4px;
          border-radius: 2px;
          background: linear-gradient(90deg, var(--color-accent), rgba(201,166,107,0.3));
        }

        .hero-sub {
          font-size: 16px;
          line-height: 1.8;
          color: var(--color-muted);
          max-width: 460px;
          margin-bottom: 36px;
        }

        .hero-cta-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 48px;
          flex-wrap: wrap;
        }
        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 15px 28px;
          background: var(--color-primary);
          color: #fff;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 6px 24px rgba(62,98,89,0.32);
          transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
        }
        .hero-btn-primary:hover {
          background: var(--color-primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(62,98,89,0.4);
        }

        /* Stats strip */
        .hero-stats-strip {
          display: flex;
          align-items: center;
          gap: 0;
        }
        .hss-item {
          display: flex;
          flex-direction: column;
          padding-right: 24px;
        }
        .hss-num {
          font-family: 'Fraunces', serif;
          font-size: 28px;
          font-weight: 700;
          color: var(--color-primary-dark);
          line-height: 1;
        }
        .hss-lbl {
          font-size: 11.5px;
          color: var(--color-muted);
          font-weight: 500;
          margin-top: 3px;
        }
        .hss-sep {
          width: 1px;
          height: 38px;
          background: var(--color-border);
          margin-right: 24px;
        }

        /* ── Right side ── */
        .hero-right {
          display: flex;
          flex-direction: column;
          gap: 14px;
          position: relative;
        }

        .hero-main-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: var(--color-for);
          margin-bottom: 8px;
        }

        .hero-main-card {
          animation: slideUp 0.5s ease both;
        }
        .hero-side-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .hero-side-card {
          animation: slideUp 0.5s ease both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Floating tag */
        .hero-float-tag {
          position: absolute;
          bottom: -14px;
          right: 0;
          display: flex;
          align-items: center;
          gap: 7px;
          background: var(--color-surface);
          border: 1.5px solid var(--color-border);
          border-radius: 20px;
          padding: 7px 14px;
          font-size: 12px;
          font-weight: 600;
          color: var(--color-text);
          box-shadow: 0 4px 16px rgba(43,43,43,0.08);
        }

        /* ── Debate Card (dc) component ── */
        .dc {
          background: var(--color-surface);
          border: 1.5px solid var(--color-border);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(43,43,43,0.07);
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .dc:hover {
          box-shadow: 0 8px 32px rgba(43,43,43,0.11);
          transform: translateY(-2px);
        }
        .dc--small { padding: 14px 16px; }

        .dc-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .dc-cat {
          font-size: 10.5px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
          letter-spacing: 0.3px;
        }
        .dc-author {
          font-size: 11.5px;
          color: var(--color-muted);
          font-weight: 500;
        }
        .dc-title {
          font-family: 'Fraunces', serif;
          font-size: 15px;
          font-weight: 600;
          color: var(--color-primary-dark);
          line-height: 1.4;
          margin-bottom: 14px;
        }
        .dc--small .dc-title { font-size: 13px; margin-bottom: 10px; }

        /* Opinion tabs */
        .dc-tabs {
          display: flex;
          gap: 6px;
          margin-bottom: 12px;
        }
        .dc-tab {
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          border: 1.5px solid transparent;
          cursor: pointer;
          background: transparent;
          font-family: 'Inter', sans-serif;
          transition: all 0.15s ease;
          color: var(--color-muted);
        }
        .dc-tab--for:hover { border-color: var(--color-for); color: var(--color-for); }
        .dc-tab--against:hover { border-color: var(--color-against); color: var(--color-against); }
        .dc-tab--active-for {
          background: rgba(76,140,91,0.1);
          border-color: var(--color-for);
          color: var(--color-for);
        }
        .dc-tab--active-against {
          background: rgba(193,102,107,0.1);
          border-color: var(--color-against);
          color: var(--color-against);
        }

        /* Opinion text */
        .dc-opinion {
          font-size: 13px;
          line-height: 1.65;
          padding: 12px 14px;
          border-radius: 10px;
          margin-bottom: 14px;
          position: relative;
          transition: background 0.2s ease;
        }
        .dc-opinion--for {
          background: rgba(76,140,91,0.07);
          color: var(--color-text);
          border-left: 3px solid var(--color-for);
        }
        .dc-opinion--against {
          background: rgba(193,102,107,0.07);
          color: var(--color-text);
          border-left: 3px solid var(--color-against);
        }
        .dc-opinion-quote {
          font-family: 'Fraunces', serif;
          font-size: 22px;
          line-height: 0;
          vertical-align: -8px;
          margin-right: 4px;
          opacity: 0.25;
        }
        .dc--small .dc-opinion { font-size: 12px; padding: 10px 12px; }

        /* Vote bar */
        .dc-bar-wrap { }
        .dc-bar {
          height: 5px;
          border-radius: 5px;
          background: rgba(193,102,107,0.2);
          overflow: hidden;
          margin-bottom: 7px;
        }
        .dc-bar-for {
          height: 100%;
          background: linear-gradient(90deg, var(--color-for), #7ED89B);
          border-radius: 5px;
        }
        .dc-bar-labels {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          font-weight: 700;
        }
        .dcbl-for   { color: var(--color-for); }
        .dcbl-against { color: var(--color-against); }

        /* ══════ FEATURES ══════ */
        .features {
          padding: 100px 0;
          background: var(--color-surface);
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .feat-card {
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: 16px;
          padding: 30px 26px;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .feat-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-primary);
          box-shadow: 0 12px 40px rgba(62,98,89,0.1);
        }
        .feat-icon {
          width: 48px; height: 48px;
          background: var(--color-primary-tint);
          border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
          color: var(--color-primary);
          margin-bottom: 18px;
        }
        .feat-title {
          font-family: 'Fraunces', serif;
          font-size: 18px;
          font-weight: 600;
          color: var(--color-primary-dark);
          margin-bottom: 9px;
        }
        .feat-desc {
          font-size: 13.5px;
          line-height: 1.7;
          color: var(--color-muted);
        }

        /* ══════ DEBATES STRIP ══════ */
        .debates-strip {
          padding: 100px 0;
          background: var(--color-bg);
        }
        .debates-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .debate-strip-card { }

        /* ══════ HOW IT WORKS ══════ */
        .how {
          padding: 100px 0;
          background: var(--color-surface);
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }
        .how-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }
        .how-cta {
          display: inline-block;
          margin-top: 8px;
          padding: 13px 26px;
          background: var(--color-primary);
          color: #fff;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.15s, transform 0.15s;
        }
        .how-cta:hover { background: var(--color-primary-dark); transform: translateY(-1px); }

        .how-steps {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .step {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          position: relative;
        }
        .step-num {
          font-family: 'Fraunces', serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: var(--color-accent);
          background: rgba(201,166,107,0.12);
          border: 1.5px solid rgba(201,166,107,0.28);
          width: 42px; height: 42px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          position: relative; z-index: 1;
        }
        .step-body { padding-bottom: 38px; padding-top: 8px; }
        .step-title {
          font-family: 'Fraunces', serif;
          font-size: 18px;
          font-weight: 600;
          color: var(--color-primary-dark);
          margin-bottom: 6px;
        }
        .step-desc {
          font-size: 13.5px;
          color: var(--color-muted);
          line-height: 1.65;
        }
        .step-line {
          position: absolute;
          left: 20px; top: 42px; bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, rgba(201,166,107,0.3), transparent);
        }

        /* ══════ CTA BANNER ══════ */
        .cta-banner {
          padding: 100px 40px;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          position: relative;
          overflow: hidden;
          text-align: center;
        }
        .cta-inner {
          max-width: 620px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .cta-rings {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .cta-ring {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.08);
        }
        .r1 { width: 200px; height: 200px; }
        .r2 { width: 360px; height: 360px; }
        .r3 { width: 520px; height: 520px; }

        .cta-content { position: relative; z-index: 1; }
        .cta-h2 {
          font-family: 'Fraunces', serif;
          font-size: clamp(30px, 5vw, 50px);
          font-weight: 700;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 18px;
          letter-spacing: -0.5px;
        }
        .cta-em {
          font-style: normal;
          color: var(--color-accent);
        }
        .cta-sub {
          font-size: 15.5px;
          color: rgba(255,255,255,0.65);
          line-height: 1.65;
          margin-bottom: 36px;
        }
        .cta-btn {
          display: inline-block;
          padding: 15px 36px;
          background: #fff;
          color: var(--color-primary-dark);
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 6px 24px rgba(0,0,0,0.2);
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(0,0,0,0.25);
        }

        /* ══════ FOOTER ══════ */
        .footer {
          background: var(--color-primary-dark);
          padding: 28px 40px;
        }
        .footer-inner {
          max-width: 1140px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .footer-logo {
          font-family: 'Fraunces', serif;
          font-size: 22px;
          font-weight: 700;
        }
        .footer-copy {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
        }

        /* ══════ RESPONSIVE ══════ */
        @media (max-width: 960px) {
          .hero-inner {
            grid-template-columns: 1fr;
            padding: 60px 24px 80px;
            gap: 48px;
          }
          .hero-right { order: -1; }
          .hero-side-cards { grid-template-columns: 1fr; }
          .hero-float-tag { display: none; }
          .features-grid { grid-template-columns: 1fr; }
          .debates-grid { grid-template-columns: 1fr; }
          .how-inner { grid-template-columns: 1fr; gap: 40px; }
          .sec-h2 { margin-bottom: 30px; }
        }
        @media (max-width: 600px) {
          .sec-inner { padding: 0 20px; }
          .features, .debates-strip, .how { padding: 60px 0; }
          .cta-banner { padding: 60px 20px; }
          .footer { padding: 24px 20px; }
          .footer-inner { flex-direction: column; gap: 10px; text-align: center; }
          .hero-cta-row { flex-direction: column; }
          .hero-btn-primary { width: 100%; justify-content: center; }
        }
      `}</style>
    </>
  );
};

export default LandingPage;