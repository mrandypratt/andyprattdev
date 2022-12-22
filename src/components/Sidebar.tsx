import { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MenuOpenOutlinedIcon from '@mui/icons-material/MenuOpenOutlined';
import "../styles/Sidebar.css";

type SidebarType = {
  type: "desktop" | "mobile";
  toggleSidebar?: () => void;
}

const SidebarTemplate = ({type, toggleSidebar}: SidebarType) => {
  const scrollWithOffset = (el: HTMLElement) => {
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = -65; 
    window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' }); 
  }

  return (
    <div className="sidebar-container">
  
      {type === "mobile" && 
        <CloseRoundedIcon className="close-sidebar-icon" onClick={toggleSidebar}/>
      }
  
      {/* VERSION 1: Header */}
      <HashLink to="#"  smooth>
        <div className="sidebar-version-header">
          Back to Top
        </div>
      </HashLink>
  
      <HashLink to="#version-1" smooth scroll={el => scrollWithOffset(el)}>
        <div className="sidebar-version-header">
          Version 1: MVP
        </div>
      </HashLink>
  
      {/* VERSION 1: Sections */}
      <HashLink to="/portfolio/#version-1-tools" smooth scroll={el => scrollWithOffset(el)}>
        <div className="sidebar-section">
            Tools
        </div>
      </HashLink>
      <HashLink to="/portfolio/#version-1-version-goals" smooth scroll={el => scrollWithOffset(el)}>
        <div className="sidebar-section">
            Version Goals
        </div>
      </HashLink>
      <HashLink to="/portfolio/#version-1-identifying-problems" smooth scroll={el => scrollWithOffset(el)}>
        <div className="sidebar-section">
            Identifying Problems
        </div>
      </HashLink>
      <HashLink to="/portfolio/#version-1-understanding-problems" smooth scroll={el => scrollWithOffset(el)}>
        <div className="sidebar-section">
            Understanding Problems
        </div>
      </HashLink>
      <HashLink to="#version-1-ux-mockup" smooth scroll={el => scrollWithOffset(el)}>
        <div className="sidebar-section">
            UX Mockup
        </div>
      </HashLink>
      <HashLink to="/portfolio/#version-1-engineering-the-solution" smooth scroll={el => scrollWithOffset(el)}>
        <div className="sidebar-section">
            Engineering the Solution
        </div>
      </HashLink>
      <HashLink to="/portfolio/#version-1-finished-state" smooth scroll={el => scrollWithOffset(el)}>
        <div className="sidebar-section">
            Finished State
        </div>
      </HashLink>
  
  
     {/* VERSION 2: Header */}
      <HashLink to="/portfolio/#version-2" smooth scroll={el => scrollWithOffset(el)}>
        <div className="sidebar-version-header">
            Version 2: Multi-Device
        </div>
      </HashLink>
  
      {/* VERSION 2: Sections */}
      <HashLink to="/portfolio/#version-2-tools" smooth scroll={el => scrollWithOffset(el)}>
        <div className="sidebar-section">
            Tools
        </div>
      </HashLink>
      <HashLink to="/portfolio/#version-2-version-goals" smooth scroll={el => scrollWithOffset(el)}>
        <div className="sidebar-section">
            Version Goals
        </div>
      </HashLink>
      <HashLink to="/portfolio/#version-2-identifying-problems" smooth scroll={el => scrollWithOffset(el)}>
        <div className="sidebar-section">
            Identifying Problems
        </div>
      </HashLink>
      <HashLink to="/portfolio/#version-2-understanding-problems" smooth scroll={el => scrollWithOffset(el)}>
        <div className="sidebar-section">
            Understanding Problems
        </div>
      </HashLink>
      <HashLink to="/portfolio/#version-2-ux-mockup" smooth scroll={el => scrollWithOffset(el)}>
        <div className="sidebar-section">
            UX Mockup
        </div>
      </HashLink>
      <HashLink to="/portfolio/#version-2-engineering-the-solution" smooth scroll={el => scrollWithOffset(el)}>
        <div className="sidebar-section">
            Engineering the Solution
        </div>
      </HashLink>
      <HashLink to="/portfolio/#version-2-finished-state" smooth scroll={el => scrollWithOffset(el)}>
        <div className="sidebar-section">
            Finished State
        </div>
      </HashLink>
  
  
     {/* VERSION 3: Header */}
      <HashLink to="/portfolio/#version-3" smooth scroll={el => scrollWithOffset(el)}>
        <div className="sidebar-version-header">
            Version 3: Single-Player
        </div>
      </HashLink>
  
      {/* VERSION 3: Sections */}
      <HashLink to="/portfolio/#version-3-tools" smooth scroll={el => scrollWithOffset(el)}>
        <div className="sidebar-section">
            Tools
        </div>
      </HashLink>
      <HashLink to="/portfolio/#version-3-version-goals" smooth scroll={el => scrollWithOffset(el)}>
        <div className="sidebar-section">
            Version Goals
        </div>
      </HashLink>
      <HashLink to="/portfolio/#version-3-identifying-problems" smooth scroll={el => scrollWithOffset(el)}>
        <div className="sidebar-section">
            Identifying Problems
        </div>
      </HashLink>
      <HashLink to="/portfolio/#version-3-understanding-problems" smooth scroll={el => scrollWithOffset(el)}>
        <div className="sidebar-section">
            Understanding Problems
        </div>
      </HashLink>
      <HashLink to="/portfolio/#version-3-ux-mockup" smooth scroll={el => scrollWithOffset(el)}>
        <div className="sidebar-section">
            UX Mockup
        </div>
      </HashLink>
      <HashLink to="/portfolio/#version-3-engineering-the-solution" smooth scroll={el => scrollWithOffset(el)}>
        <div className="sidebar-section">
            Engineering the Solution
        </div>
      </HashLink>
      <HashLink to="/portfolio/#version-3-finished-state" smooth scroll={el => scrollWithOffset(el)}>
        <div className="sidebar-section">
            Finished State
        </div>
      </HashLink>
    </div>
  );
}

const DesktopSidebar = () => {
  return <SidebarTemplate type="desktop"/>
}

const MobileSidebar = () => {
  const [ sidebarDisplay, setSidebarDisplay ] = useState(false);

  const toggleSidebar = () => {
    setSidebarDisplay(!sidebarDisplay);
  }

  if (sidebarDisplay) {
    return (
    <div className="mobile-sidebar-container">
        <SidebarTemplate type="mobile" toggleSidebar={toggleSidebar}/> 
        <div className="blur-bg" onClick={toggleSidebar}/>
      </div>
    )
  } else {
    return (
      <div className="sidebar-button" onClick={toggleSidebar}>
        <MenuOpenOutlinedIcon fontSize='large'/>
      </div>
    )
  }
}

export const Sidebar = (): JSX.Element => {
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 1000px)").matches
  )

  useEffect(() => {
    window
    .matchMedia("(min-width: 1000px)")
    .addEventListener('change', e => setMatches( e.matches ));
  }, []);

  if (matches) {
    return <DesktopSidebar/>;
  }
  
  return <MobileSidebar/>;
}