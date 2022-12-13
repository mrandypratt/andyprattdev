import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

export const Sidebar = () => {
  return(
    <div className="sidebar-container">
      <Link to="/portfolio#version-1">
        <div className="desktop-sidebar-version-heading">
            Version 1
        </div>
      </Link>
      <Link to="/portfolio#version-2">
        <div className="desktop-sidebar-version-heading">
            Version 2
        </div>
      </Link>
      <Link to="/portfolio#version-3">
        <div className="desktop-sidebar-version-heading">
            Version 3
        </div>
      </Link>


    </div>
  );
}