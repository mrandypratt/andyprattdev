import {Routes, Route, Navigate} from "react-router-dom"
import { About } from "./views/About"
import { CardsWithFriends } from "./views/Projects/CardsWithFriends"
import { Home } from "./views/Home"

export const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/projects/cards-with-friends" element={<CardsWithFriends/>} />
      <Route path="/portfolio" element={<Navigate to="/projects/cards-with-friends" replace />} />
    </Routes>
  )
}