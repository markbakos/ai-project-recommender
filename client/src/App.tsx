import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Home} from "./pages/Home.tsx";
import {Dashboard} from "./pages/Dashboard.tsx";
import {Recommender} from "./pages/Recommender.tsx";

function App() {
  return (
      <Router>
        <div>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/recommender" element={<Recommender />} />
          </Routes>
        </div>
      </Router>
  )
}

export default App
