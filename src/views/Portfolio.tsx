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

      {/* PORTFOLIO INTRO */}

      <div className="portfolio-content-wrapper">
        <a className="project-link portfolio-header-container" href="http://www.cardswithfriendsgame.com" target="_blank" rel="noreferrer">
          <h1 className="portfolio-header">
              Cards with Friends
          </h1>
          <CWFLogo className="cwf-logo-portfolio"/>
        </a>

        <p className="portfolio-content">
          <a className="project-link" href="http://www.cardswithfriendsgame.com" target="_blank" rel="noreferrer"><b>Cards with Friends </b></a>is a multi-player Cards Against Humanity web app.  It is also the largest product I have had the opportunity to design, build, and deploy.
        </p>
        <p className="portfolio-content">
          Below is a full break-down of the process divided into 3 major versions.  I have detailed my journey from ideation, through numerous features, to its current (and likely final) state.  Just keep scrolling to see my journey!
        </p>

        {/* VERSION 1 */}
        <h2 className="version-header" id="version-1">
          Version 1: MVP (Single-Client)
        </h2>

        <p className="portfolio-content">
          Yayaya
        </p>

        <h3 className="section-header" id="version-1-tools">
          Tools Used
        </h3>
        <h3 className="section-header" id="version-1-version-goals">
          Version Goals
        </h3>
        <p className="portfolio-content">
          Yayaya
        </p>
        <h3 className="section-header" id="version-1-identifying-problems">
          Tools Used
        </h3>
        <h3 className="section-header" id="version-1-understanding-problems">
          Tools Used
        </h3>
        <h3 className="section-header" id="version-1-ux-mockup">
          UX Mockup
        </h3>
        <h3 className="section-header" id="version-1-engineering-the-solution">
          Tools Used
        </h3>
        <h3 className="section-header" id="version-1-finished-state">
          Tools Used
        </h3>

        <h4 className="section-header-2">
          Additional Tools
        </h4>

        <h5 className="section-header-3">
        Additional
        </h5>


        {/* VERSION 2 */}

        {/* VERSION 3 */}

      </div>


      <Footer/>
    </div>
  );
}