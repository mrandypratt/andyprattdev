import { CWFLogo } from "../assets/CWFLogo";
import { ProjectCard } from "./ProjectCard";

export const ProjectsSection = () => {
  return (
    <section id="projects" className="projects-section">
      <h2 className="projects-section-header">Projects</h2>

      <div className="projects-section-list">
        <ProjectCard
          title="Cards with Friends"
          oneLiner="Multi-player Cards Against Humanity web app."
          summary="The largest end-to-end product I have designed, built, and deployed — from MVP through multi-device socket gameplay to a single-player bot mode."
          techChips={["React", "Node.js", "Socket.io", "AWS"]}
          logo={<CWFLogo className="cwf-logo-project" />}
          href="/projects/cards-with-friends"
        />

        <ProjectCard
          title="Game Set Book"
          oneLiner="Tennis scheduling app for coordinating group play."
        />

        <ProjectCard
          title="AI Assistant"
          oneLiner="A personal AI assistant exploring AI-enabled workflows and tooling."
        />
      </div>
    </section>
  );
};
