import "./Mainpage.css";
import React from "react";
import { Link } from "react-router-dom";

const Mainpage = () => {
  return (
    <div className="main-container">
      <div id="hpdiv">
        <div id="wtext">Welcome to the racetrack</div>
      </div>
      <Link reloadDocument to="/next-race" className="button">
        Next race
      </Link>
      <Link reloadDocument to="/race-control" className="button">
        Race Control
      </Link>
      <Link reloadDocument to="/front-desk" className="button">
        Front Desk
      </Link>
      <Link reloadDocument to="/lap-line-tracker" className="button">
        Lap-Line Tracker
      </Link>
      <Link reloadDocument to="/leader-board" className="button">
        Leaderboard
      </Link>
      <Link reloadDocument to="/race-flags" className="button">
        Flags
      </Link>
      <Link reloadDocument to="/race-countdown" className="button">
        Race Countdown
      </Link>
    </div>
  );
};

export default Mainpage;
