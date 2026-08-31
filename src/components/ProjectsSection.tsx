import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { CWFLogo } from "../assets/CWFLogo";
import { ProjectCard } from "./ProjectCard";
import resume from "../assets/AndyPrattResume.pdf";

export const ProjectsSection = () => {
  return (
    <section id="projects" className="projects-section">
      <h2 className="projects-section-header">Explore</h2>

      <div className="projects-section-list">
        <ProjectCard
          title="Cards with Friends"
          oneLiner="Multi-player Cards Against Humanity web app."
          summary="The earliest end-to-end product I have designed, built, and deployed. How I did it from MVP through multi-device socket gameplay to a single-player bot mode."
          techChips={["React", "Node.js", "Socket.io", "AWS"]}
          logo={<CWFLogo className="cwf-logo-project" />}
          href="/projects"
          cta="Deep dive"
        />

        <ProjectCard
          title="The Library"
          oneLiner="Browse the books I've read scored out of ten."
          summary="You can learn a lot about someone based on what they've read. Get to know me through reading history, my rating, and my take on each one."
          logo={<AutoStoriesIcon className="project-card-icon" />}
          href="/library"
          cta="Browse the shelf"
        />

        <ProjectCard
          title="Resume"
          oneLiner="The one-page version of the last several years."
          summary="Roles, stack, and the work behind them. Opens the PDF in a new tab."
          logo={<DescriptionOutlinedIcon className="project-card-icon" />}
          externalHref={resume}
          cta="Open the résumé"
        />
      </div>
    </section>
  );
};
