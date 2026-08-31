import { ReactNode } from "react";
import { Link } from "react-router-dom";
import "../styles/Projects.css";

type ProjectCardProps = {
  title: string;
  oneLiner: string;
  summary?: string;
  techChips?: string[];
  logo?: ReactNode;
  /** Internal route. */
  href?: string;
  /** External URL or bundled asset (PDF). Opens in a new tab. */
  externalHref?: string;
  /** Overrides the default call to action on a linked card. */
  cta?: string;
};

export const ProjectCard = ({
  title,
  oneLiner,
  summary,
  techChips,
  logo,
  href,
  externalHref,
  cta = "Deep dive",
}: ProjectCardProps) => {
  const isLive = Boolean(href || externalHref);

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
          {cta} &rarr;
        </div>
      )}
    </div>
  );

  if (externalHref) {
    return (
      <a
        href={externalHref}
        className="project-card-link"
        target="_blank"
        rel="noreferrer noopener"
      >
        {inner}
      </a>
    );
  }

  if (href) {
    return (
      <Link to={href} className="project-card-link">
        {inner}
      </Link>
    );
  }

  return inner;
};
