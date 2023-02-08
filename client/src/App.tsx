import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Journeys from "./components/Journeys";
import Navbar from "./components/Navbar";
import Stations from "./components/Stations";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/journeylist" element={<Journeys />} />
            <Route path="/stationlist" element={<Stations />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
