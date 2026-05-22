import { Link } from "react-router-dom"
import { HashLink } from "react-router-hash-link";
import { APDevLogo } from '../assets/APDevLogo';
import { useState, useEffect, useRef } from 'react';
import resume from "../assets/AndyPrattResume.pdf";
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import "../styles/Navbar.css"

const scrollToProjects = (el: HTMLElement) => {
  const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
  const yOffset = -65;
  window.scrollTo({ top: yCoordinate + yOffset, behavior: "smooth" });
};

const DesktopNavbar = (): JSX.Element => {
  const [projectsOpen, setProjectsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!projectsOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProjectsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProjectsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [projectsOpen]);

  return (
    <nav className="navbar">
      <Link to="/">
        <div className="logo">
          <APDevLogo format="desktop"/>
        </div>
      </Link>
      <div className="nav-button-container">
        <Link to="/">
          <div className="desktop-nav-button">
            HOME
          </div>
        </Link>

        <div className="nav-dropdown" ref={dropdownRef}>
          <button
            type="button"
            className="desktop-nav-button nav-dropdown-trigger"
            onClick={() => setProjectsOpen((prev) => !prev)}
            aria-expanded={projectsOpen}
            aria-haspopup="menu"
          >
            PROJECTS <span className="nav-dropdown-chevron">{projectsOpen ? '▴' : '▾'}</span>
          </button>
          {projectsOpen && (
            <div className="nav-dropdown-menu" role="menu">
              <Link
                to="/projects/cards-with-friends"
                className="nav-dropdown-item"
                role="menuitem"
                onClick={() => setProjectsOpen(false)}
              >
                Cards with Friends
              </Link>
              <div className="nav-dropdown-item nav-dropdown-item-disabled" role="menuitem" aria-disabled="true">
                Game Set Book
                <span className="nav-dropdown-item-coming"> (coming soon)</span>
              </div>
              <div className="nav-dropdown-item nav-dropdown-item-disabled" role="menuitem" aria-disabled="true">
                AI Assistant
                <span className="nav-dropdown-item-coming"> (coming soon)</span>
              </div>
            </div>
          )}
        </div>

        <a href={resume} target="_blank" rel="noreferrer noopener">
          <div className="desktop-nav-button">
            RESUME
          </div>
        </a>

        <Link to="/about">
          <div className="desktop-nav-button">
            ABOUT
          </div>
        </Link>
      </div>
    </nav>
  )
}

const MobileNavbar = (): JSX.Element => {
  const [ menuDisplay, setMenuDisplay ] = useState(false);

  const toggleMenu = () => {
    setMenuDisplay(!menuDisplay);
  }
  
  return (
    <div className="navbar">
      <Link to="/">
        <APDevLogo format="mobile"/>
      </Link>

      <div className="app-bar" onClick={toggleMenu}>
        <MenuIcon fontSize="large"/>
      </div>

      {menuDisplay && 
        <div className="app-bar-menu" onClick={toggleMenu}>

          <div className="app-bar-header">

          </div>

          <CloseRoundedIcon className="close-sidebar-icon" fontSize="large"/>
          
          <Link to="/">
            <div className="app-bar-menu-item">
                HOME
            </div>
          </Link>

          <HashLink to="/#projects" smooth scroll={(el) => scrollToProjects(el as HTMLElement)}>
            <div className="app-bar-menu-item">
              PROJECTS
            </div>
          </HashLink>

          <div className="app-bar-menu-subgroup">
            <Link to="/projects/cards-with-friends">
              <div className="app-bar-menu-item app-bar-menu-subitem">
                Cards with Friends
              </div>
            </Link>

            <div
              className="app-bar-menu-item app-bar-menu-subitem app-bar-menu-item-disabled"
              onClick={(e) => e.stopPropagation()}
            >
              Game Set Book <span className="app-bar-menu-coming">(coming soon)</span>
            </div>

            <div
              className="app-bar-menu-item app-bar-menu-subitem app-bar-menu-item-disabled"
              onClick={(e) => e.stopPropagation()}
            >
              AI Assistant <span className="app-bar-menu-coming">(coming soon)</span>
            </div>
          </div>

          <a href={resume} target="_blank" rel="noreferrer noopener">
            <div className="app-bar-menu-item">
              RESUME
            </div>
          </a>

          <Link to="/about">
            <div className="app-bar-menu-item">
              ABOUT
            </div>
          </Link>
        </div>
      }

      {menuDisplay && 
        <div className="blur-bg" onClick={toggleMenu}/>
      }
    </div>
  )
}

export const Navbar = (): JSX.Element => {
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 1000px)").matches
  )

  useEffect(() => {
    window
    .matchMedia("(min-width: 1000px)")
    .addEventListener('change', e => setMatches( e.matches ));
  }, []);

  if (matches) {
    return <DesktopNavbar/>;
  }

  return <MobileNavbar/>;
}