import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Home} from "./pages/Home.tsx";
import {Dashboard} from "./pages/Dashboard.tsx";
import {Recommender} from "./pages/Recommender.tsx";
import {Preferences} from "./pages/Preferences.tsx";

function App() {
  return (
      <Router>
        <div>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/recommender" element={<Recommender />} />
              <Route path="/preferences" element={<Preferences />} />
          </Routes>
        </div>
      </Router>
  )
}

export default App
