import { CWFLogo } from "../assets/CWFLogo";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import "../styles/Portfolio.css"
import { Version1 } from "./Projects/Version1";
import { Version2 } from "./Projects/Version2";
import { Version3 } from "./Projects/Version3";


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
      
        <Version1/>
        <Version2/>
        <Version3/>

      </div>


      <Footer/>
    </div>
  );
}