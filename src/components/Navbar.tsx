import { Link } from "react-router-dom"
import { APDevLogo } from '../assets/APDevLogo';
import { useState, useEffect } from 'react';
import resume from "../assets/AndyPrattResume.pdf";
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import "../styles/Navbar.css"

const DesktopNavbar = (): JSX.Element => {
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

        <Link to="/projects">
          <div className="desktop-nav-button">
            PROJECTS
          </div>
        </Link>

        <Link to="/library">
          <div className="desktop-nav-button">
            LIBRARY
          </div>
        </Link>

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
          <CloseRoundedIcon className="close-sidebar-icon" fontSize="large"/>

          <Link to="/">
            <div className="app-bar-menu-item app-bar-menu-parent">
              HOME
            </div>
          </Link>

          <Link to="/projects">
            <div className="app-bar-menu-item app-bar-menu-parent">
              PROJECTS
            </div>
          </Link>

          <Link to="/library">
            <div className="app-bar-menu-item app-bar-menu-parent">
              LIBRARY
            </div>
          </Link>

          <a href={resume} target="_blank" rel="noreferrer noopener">
            <div className="app-bar-menu-item app-bar-menu-parent">
              RESUME
            </div>
          </a>

          <Link to="/about">
            <div className="app-bar-menu-item app-bar-menu-parent">
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
