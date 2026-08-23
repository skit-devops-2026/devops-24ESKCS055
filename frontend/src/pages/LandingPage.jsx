import React from "react";
import { Link } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";

const LandingPage = () => {
  return (
    <>
      <div className="landing">
        <PublicNavbar />
        <section className="landing-hero">
          <h1>Your Voice. <span>Every Issue.</span> One Platform.</h1>
          <p>
            Sayso is where real people share honest opinions on the issues that matter —
            local, political, educational, or global. No noise, no filters. Just perspective.
          </p>
          <Link to="/auth" className="btn btn-primary landing-cta">Join the Conversation</Link>
        </section>
      </div>

      <style>{`
        .landing-hero {
          max-width: 760px;
          margin: 0 auto;
          padding: 120px 24px 80px;
          text-align: center;
        }

        .landing-hero h1 {
          font-size: 44px;
          line-height: 1.35;
        }

        .landing-hero h1 span { color: var(--color-accent); }

        .landing-hero p {
          margin: 22px 0 34px;
          color: var(--color-muted);
          font-size: 17px;
          line-height: 1.7;
        }

        .landing-cta { padding: 14px 32px; font-size: 15px; }
      `}</style>
    </>
  );
};

export default LandingPage;