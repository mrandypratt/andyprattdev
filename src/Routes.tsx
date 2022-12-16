import {Routes, Route} from "react-router-dom"
import { About } from "./views/About"
import { Portfolio } from "./views/Portfolio"
import { Home } from "./views/Home"

export const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/portfolio" element={<Portfolio/>} />
    </Routes>
  )
}