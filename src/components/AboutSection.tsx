import { Link } from "react-router-dom";
import profilePic from "../assets/Profile.jpg";

export const AboutSection = () => (
  <section id="about-me" className="home-hero projects-section">
    <Link to="/about" className="home-hero-link" aria-label="About Andy Pratt">
      {/* Standalone photo above the card — visible on mobile only.
          On desktop this is hidden and the in-card photo (below) is shown instead. */}
      <img
        className="home-hero-photo-standalone"
        src={profilePic}
        alt="Andy Pratt"
      />

      <div className="project-card project-card-live about-card">
        {/* In-card photo — visible on desktop only. Alt is empty because the
            standalone <img> above carries the accessible label. */}
        <img
          className="about-card-photo"
          src={profilePic}
          alt=""
        />
        <div className="about-card-text">
          <p className="about-card-greeting">Hello, my name is</p>
          <h3 className="about-card-name">Andy Pratt.</h3>
          <p className="about-card-role">
            I'm a <span className="about-card-role-accent">Software Engineer</span>
          </p>
          <p className="about-card-tail">
            who loves building products and solving problems.
          </p>
          <div className="project-card-cta">My story &rarr;</div>
        </div>
      </div>
    </Link>
  </section>
);
