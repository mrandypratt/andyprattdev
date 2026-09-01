import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/* Browsers only reset scroll on a real page load; a client-side route change keeps
   whatever offset the previous page was at. This puts every navigation back at the
   top, with two exceptions:
     - hash links (Sidebar's HashLink anchors) do their own scrolling
     - back/forward (POP), where the browser's restored position is the right one */
export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (hash) return;
    if (navigationType === "POP") return;
    window.scrollTo(0, 0);
  }, [pathname, hash, navigationType]);

  return null;
}
