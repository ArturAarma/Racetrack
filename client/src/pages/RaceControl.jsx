import "./RaceControl.css";
import React from "react";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom/client";
import testSessions from "../components/front-desk/SessionObj";

function RaceControl() {
  return (
    <div className="session-container">
      Race Control
      <FlagControls />
      <SessionInfo />
      <Link to="/" className="bbutton">
        Back to the main page
      </Link>
    </div>
  );
}

function FlagControls() {
  return (
    <div className="flag-controls-container">
      Flag Controls
      <div className="flags-box">
        <div id="safe">SAFE</div>
        <div id="hazard">HAZARD</div>
        <div id="danger">DANGER</div>
        <div id="finish">FINISH</div>
      </div>
    </div>
  );
}

function SessionInfo() {
  return (
    <div className="flag-controls-container">
      Session Info
      <div className="sessions-box">
        <div className="info-box">Current race mode:</div>
        <div className="info-box" id="safe">
          Safe
        </div>
      </div>
      <div className="sessions-box">
        <div className="info-box">Race timer:</div>
        <div className="info-box">10:00:00</div>
      </div>
      <div className="sessions-box">
        <div className="info-box">Current session:</div>
        <div className="info-box">Race Session 1</div>
      </div>
      <button className="bbutton">Start Race / End Session</button>
    </div>
  );
}

export default RaceControl;
