import "./Mainpage.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Link } from "react-router-dom";

const Mainpage = () => {
  return (
    <div>
      <div id="hpdiv">
        <div id="wtext">Welcome to the racetrack</div>
      </div>
      <Link reloadDocument to="/racer" className="button">
        Racer
      </Link>
      <Link reloadDocument to="/race-control" className="button">
        Race Control
      </Link>
      <Link reloadDocument to="/frontdesk" className="button">
        Front Desk
      </Link>
      <Link reloadDocument to="/lap-line-tracker" className="button">
        Lap-Line Tracker
      </Link>
      <Link reloadDocument to="/leader-board" className="button">
        Leader Board
      </Link>
      <Link reloadDocument to="/race-flags" className="button">
        Flags
      </Link>
    </div>
  );
};

export default Mainpage;
