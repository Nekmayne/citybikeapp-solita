import React from "react";
import "./Navbar.css";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = (props) => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <a href="/journeylist" className="navbar-link">
            Journeys
          </a>
        </li>
        <li className="navbar-item">
          <a href="/stationlist" className="navbar-link">
            Stations
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
