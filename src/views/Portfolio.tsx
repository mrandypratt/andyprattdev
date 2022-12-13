import { Link } from "react-router-dom";
import { CWFLogo } from "../assets/CWFLogo";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import "../styles/Portfolio.css"


export const Portfolio = () => {
  return (
    <div className="portfolio-container">

      <Navbar/>

      <Sidebar/>

      <div className="portfolio-content-wrapper">
        <a className="project-link portfolio-header-container" href="http://www.cardswithfriendsgame.com" target="_blank" rel="noreferrer">
          <h1 className="portfolio-header">
              Cards with Friends
          </h1>
          <CWFLogo className="cwf-logo-portfolio"/>
        </a>

        <div className="portfolio-summary-container">
          <p className="portfolio-summary">
            <a className="project-link" href="http://www.cardswithfriendsgame.com" target="_blank" rel="noreferrer"><b>Cards with Friends </b></a>is a multi-player Cards Against Humanity web app.
          </p>
          <p className="portfolio-summary">
            It also happens to be my first product to design, build, and deploy!
          </p>
        </div>

        <div className="portfolio-cta-container">
          <h2 className="portfolio-cta">
            Please check out my journey below!
          </h2>
        </div>

        <Link to="project-v1" className="portfolio-project-card" id="project1">
          <h3 className="portfolio-project-card-header">
            Version 1:
          </h3>
          <h4 className="portfolio-project-card-subtitle">
            Single-Device Gameplay (MVP)
          </h4>
        </Link>

        <Link to="project-v2" className="portfolio-project-card" id="project2">
          <h3 className="portfolio-project-card-header">
            Version 2:
          </h3>
          <h4 className="portfolio-project-card-subtitle">
            Multi-Device Gameplay
          </h4>
        </Link>

        <Link to="project-v3" className="portfolio-project-card" id="project3">
          <h3 className="portfolio-project-card-header">
            Version 3
          </h3>
          <h4 className="portfolio-project-card-subtitle">
            Single-Player: Online Simulation
          </h4>
        </Link>
      </div>

      <Footer/>
    </div>
  );
}