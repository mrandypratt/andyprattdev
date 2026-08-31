import {Routes, Route, Navigate} from "react-router-dom"
import { About } from "./views/About"
import { Library } from "./views/Library"
import { CardsWithFriends } from "./views/Projects/CardsWithFriends"
import { Home } from "./views/Home"

export const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/library" element={<Library/>} />

      {/* Cards with Friends is the only project write-up, so it lives at /projects
          directly. The old per-project and /portfolio paths redirect to it. */}
      <Route path="/projects" element={<CardsWithFriends/>} />
      <Route path="/projects/cards-with-friends" element={<Navigate to="/projects" replace />} />
      <Route path="/portfolio" element={<Navigate to="/projects" replace />} />
    </Routes>
  )
}
