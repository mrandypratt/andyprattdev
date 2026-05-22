import { Link } from "react-router-dom";

export const AboutSection = () => (
  <section id="about-me" className="projects-section">
    <div className="projects-section-list">
      <Link to="/about" className="project-card-link">
        <div className="project-card project-card-live about-card">
          <p className="about-card-greeting">Hello, my name is</p>
          <h3 className="about-card-name">Andy Pratt.</h3>
          <p className="about-card-role">
            I'm a <span className="about-card-role-accent">Software Engineer</span>
          </p>
          <p className="about-card-tail">
            who loves building products and solving problems.
          </p>
          <div className="project-card-cta">Deep dive &rarr;</div>
        </div>
      </Link>
    </div>
  </section>
);
