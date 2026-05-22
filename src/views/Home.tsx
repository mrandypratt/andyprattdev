import { AboutSection } from "../components/AboutSection";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { ProjectsSection } from "../components/ProjectsSection";
import "../styles/Home.css"

export const Home = () => {
  return (
    <div className="home-container">
      <Navbar/>
      <AboutSection/>
      <ProjectsSection/>
      <Footer/>
    </div>
  );
}
