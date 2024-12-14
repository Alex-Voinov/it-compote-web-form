import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationMenu from "./Pages/NavigationMenu/NavigationMenu";
import Comments from "./Pages/Comments/Comments";
import CalculateSelary from "./Pages/Comments/CalculateSelary/CalculateSelary";
import Timetable from "./Pages/Comments/Timetable/Timetable";
import StartPage from "./Pages/StartPage/StartPage";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<NavigationMenu />} />
        <Route path="/comments" element={<Comments />} />
        <Route path="/calculate-selary" element={<CalculateSelary />} />
        <Route path="/timetable" element={<Timetable />} />
      </Routes>
    </Router>
  )
}

export default App
