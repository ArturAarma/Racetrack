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
        Race control
      </Link>
      <Link reloadDocument to="/frontdesk" className="button">
        Frontdesk
      </Link>
      <Link reloadDocument to="/lap-line-tracker" className="button">
        Lap-line tracker
      </Link>
      <Link reloadDocument to="/flagbearer" className="button">
        Flagbearer
      </Link>
      <Link reloadDocument to="/race-flags" className="button">
        Flags
      </Link>
    </div>
  );
};

export default Mainpage;
