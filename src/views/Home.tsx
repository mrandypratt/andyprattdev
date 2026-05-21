import { Link } from "react-router-dom";
import resume from "../assets/AndyPrattResume.pdf";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import "../styles/Home.css"

export const Home = () => {
  
  return (
    <div className="home-container">
      <Navbar/>

      <div className="home-content-container">
        <h1 className="home-greeting">Hello! My name is </h1>
        <h2 className="orange-pop">Andy Pratt.</h2>

        <div className="home-paragraph-container">    
        <p className="home-paragraph">I'm a <b className="blue-pop blue-split-text">Software Engineer</b> who loves</p>
        
        <p className="home-paragraph">building products and solving problems.</p>
      </div>

        <div className="home-button-container">
          <Link to="/portfolio">
            <button className="home-button">
              Portfolio
            </button>
          </Link>

          <a href={resume} target="_blank" rel="noreferrer noopener">
            <button className="home-button">
              Resume
            </button>
          </a>

          <Link to="/about">
            <button className="home-button">
              About Me
            </button>
          </Link>

        </div>

      </div>
      
      <Footer/>
    </div>
  );
}