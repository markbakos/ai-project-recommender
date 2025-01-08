import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Home} from "./pages/Home.tsx";
import {Dashboard} from "./pages/Dashboard.tsx";

function App() {
  return (
      <Router>
        <div>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
  )
}

export default App
