import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationMenu from "./Pages/NavigationMenu/NavigationMenu";
import Comments from "./Pages/Comments/Comments";
import CalculateSelary from "./Pages/Comments/CalculateSelary/CalculateSelary";
import Timetable from "./Pages/Comments/Timetable/Timetable";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NavigationMenu />} />
        <Route path="/comments " element={<Comments />} />
        <Route path="/calculate-selary" element={<CalculateSelary />} />
        <Route path="/timetable" element={<Timetable />} />
      </Routes>
    </Router>
  )
}

export default App
