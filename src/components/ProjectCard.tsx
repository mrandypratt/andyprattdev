import { ReactNode } from "react";
import { Link } from "react-router-dom";
import "../styles/Projects.css";

type ProjectCardProps = {
  title: string;
  oneLiner: string;
  summary?: string;
  techChips?: string[];
  logo?: ReactNode;
  href?: string;
};

export const ProjectCard = ({
  title,
  oneLiner,
  summary,
  techChips,
  logo,
  href,
}: ProjectCardProps) => {
  const isLive = Boolean(href);

  const inner = (
    <div className={`project-card${isLive ? " project-card-live" : " project-card-coming-soon"}`}>
      <div className="project-card-header">
        {logo && <div className="project-card-logo">{logo}</div>}
        <h3 className="project-card-title">
          {title}
          {!isLive && <span className="project-card-coming-label"> (Coming soon)</span>}
        </h3>
      </div>

      <p className="project-card-oneliner">{oneLiner}</p>

      {summary && <p className="project-card-summary">{summary}</p>}

      {techChips && techChips.length > 0 && (
        <div className="project-card-chips">
          {techChips.map((chip) => (
            <span key={chip} className="project-card-chip">
              {chip}
            </span>
          ))}
        </div>
      )}

      {isLive && (
        <div className="project-card-cta">
          Deep dive &rarr;
        </div>
      )}
    </div>
  );

  if (isLive) {
    return (
      <Link to={href!} className="project-card-link">
        {inner}
      </Link>
    );
  }

  return inner;
};
