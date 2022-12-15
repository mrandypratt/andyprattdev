import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

export const Sidebar = () => {

  return(
    <div className="sidebar-container">

      {/* VERSION 1: Header */}
      <Link to="/portfolio#version-1">
        <div className="sidebar-version-header">
          Version 1
        </div>
      </Link>

      {/* VERSION 1: Sections */}
      <Link to="/portfolio#version-1-intro">
        <div className="sidebar-section">
            Intro
        </div>
      </Link>
      <Link to="/portfolio#version-1-tools">
        <div className="sidebar-section">
            Tools
        </div>
      </Link>
      <Link to="/portfolio#version-1-version-goals">
        <div className="sidebar-section">
            Version Goals
        </div>
      </Link>
      <Link to="/portfolio#version-1-identifying-problems">
        <div className="sidebar-section">
            Identifying Problems
        </div>
      </Link>
      <Link to="/portfolio#version-1-identifying-problems">
        <div className="sidebar-section">
            Identifying Problems
        </div>
      </Link>
      <Link to="/portfolio#version-1-understanding-problems">
        <div className="sidebar-section">
            Understanding Problems
        </div>
      </Link>
      <Link to="/portfolio#version-1-ux-mockup">
        <div className="sidebar-section">
            UX Mockup
        </div>
      </Link>
      <Link to="/portfolio#version-1-engineering-the-solution">
        <div className="sidebar-section">
            Engineering the Solution
        </div>
      </Link>
      <Link to="/portfolio#version-1-finished-state">
        <div className="sidebar-section">
            Finished State
        </div>
      </Link>


     {/* VERSION 2: Header */}
      <Link to="/portfolio#version-2">
        <div className="sidebar-version-header">
            Version 2
        </div>
      </Link>

      {/* VERSION 2: Sections */}
      <Link to="/portfolio#version-2-intro">
        <div className="sidebar-section">
            Intro
        </div>
      </Link>
      <Link to="/portfolio#version-2-tools">
        <div className="sidebar-section">
            Tools
        </div>
      </Link>
      <Link to="/portfolio#version-2-version-goals">
        <div className="sidebar-section">
            Version Goals
        </div>
      </Link>
      <Link to="/portfolio#version-2-identifying-problems">
        <div className="sidebar-section">
            Identifying Problems
        </div>
      </Link>
      <Link to="/portfolio#version-2-identifying-problems">
        <div className="sidebar-section">
            Identifying Problems
        </div>
      </Link>
      <Link to="/portfolio#version-2-understanding-problems">
        <div className="sidebar-section">
            Understanding Problems
        </div>
      </Link>
      <Link to="/portfolio#version-2-ux-mockup">
        <div className="sidebar-section">
            UX Mockup
        </div>
      </Link>
      <Link to="/portfolio#version-2-engineering-the-solution">
        <div className="sidebar-section">
            Engineering the Solution
        </div>
      </Link>
      <Link to="/portfolio#version-2-finished-state">
        <div className="sidebar-section">
            Finished State
        </div>
      </Link>


     {/* VERSION 3: Header */}
      <Link to="/portfolio#version-3">
        <div className="sidebar-version-header">
            Version 3
        </div>
      </Link>

      {/* VERSION 3: Sections */}
      <Link to="/portfolio#version-3-intro">
        <div className="sidebar-section">
            Intro
        </div>
      </Link>
      <Link to="/portfolio#version-3-tools">
        <div className="sidebar-section">
            Tools
        </div>
      </Link>
      <Link to="/portfolio#version-3-version-goals">
        <div className="sidebar-section">
            Version Goals
        </div>
      </Link>
      <Link to="/portfolio#version-3-identifying-problems">
        <div className="sidebar-section">
            Identifying Problems
        </div>
      </Link>
      <Link to="/portfolio#version-3-identifying-problems">
        <div className="sidebar-section">
            Identifying Problems
        </div>
      </Link>
      <Link to="/portfolio#version-3-understanding-problems">
        <div className="sidebar-section">
            Understanding Problems
        </div>
      </Link>
      <Link to="/portfolio#version-3-ux-mockup">
        <div className="sidebar-section">
            UX Mockup
        </div>
      </Link>
      <Link to="/portfolio#version-3-engineering-the-solution">
        <div className="sidebar-section">
            Engineering the Solution
        </div>
      </Link>
      <Link to="/portfolio#version-3-finished-state">
        <div className="sidebar-section">
            Finished State
        </div>
      </Link>

    </div>
  );
}