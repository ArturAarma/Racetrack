import React, { useContext, useEffect, useState } from "react";
import "./LeaderBoard.css";
import { SocketContext } from "../context/SocketContext";
import RaceTimer from "../components/RaceTimer";
import { ReactComponent as FullScreenIcon } from "./../icons/fullscreen.svg";
import { ReactComponent as ExitFullScreenIcon } from "./../icons/fullscreen-exit.svg";
import { Link } from "react-router-dom";

function LeaderBoard() {
  const [enableUpdateSession, setEnableUpdateSession] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;
    // get updated currentSession from server on connection
    socket.on("getCurrentSession", (updatedCurrentSession) => {
      setCurrentSession(updatedCurrentSession);
    });
    // get updated enableUpdateSession from server on connection
    socket.on("getEnableUpdateSession", (updatedEnableUpdateSession) => {
      setEnableUpdateSession(updatedEnableUpdateSession);
    });
    // update leaderboard when lap is added
    socket.on("addedLap", (updatedCurrentSession) => {
      setCurrentSession(updatedCurrentSession);
    });

    // disable fetching new session until next race has started
    socket.on("startedRaceAlert", () => {
      setEnableUpdateSession(true);
      socket.emit("requestCurrentSession");
    });
    socket.on("sessionHasEnded", () => {
      setEnableUpdateSession(false);
    });

    socket.on("currentSessionUpdated", (updatedCurrentSession) => {
      if (enableUpdateSession) {
        setCurrentSession(updatedCurrentSession);
      }
    });

    return () => {
      socket.off("getCurrentSession");
      socket.off("getEnableUpdateSession");
      socket.off("addedLap");
      socket.off("startedRacelert");
      socket.off("sessionHasEnded");
      socket.off("currentSessionUpdated");
    };
  }, [socket, enableUpdateSession]);

  // for testing
  useEffect(() => {
    console.log(enableUpdateSession);
  }, [enableUpdateSession]);
  
  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
      } else {
        setIsFullScreen(true);
      }
    };

    document.addEventListener("fullscreenchange", (e) => handleFullScreenChange());

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange());
    };
  }, []);

  const toggleFullScreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="lb-container">
      Leader Board
      {!currentSession?.isFinished && (
        <div className="lb-sessions-box">
          <div className="info-box">Race timer:</div>
          <div className="info-box" id="timer">
            <RaceTimer timerIsActive={currentSession?.isActive} startTime={currentSession?.startTime} />
          </div>
        </div>
      )}
      <div className="lb-sessions-box">
        <div className="info-box">Current race mode:</div>
        {currentSession?.raceMode === "safe" && currentSession?.isFinished === false && (
          <div className="info-box" id="safe">
            Safe
          </div>
        )}
        {currentSession?.raceMode === "hazard" && currentSession?.isFinished === false && (
          <div className="info-box" id="hazard">
            Hazard
          </div>
        )}
        {currentSession?.raceMode === "danger" && currentSession?.isFinished === false && (
          <div className="info-box" id="danger">
            Danger
          </div>
        )}
        {currentSession?.isFinished === true && (
          <div className="info-box" id="finish">
            Finished
          </div>
        )}
      </div>
      <div className="bottom-area">
        <div className="leader-board-container">
          {!currentSession && "No active sessions."}
          {currentSession && (
            <div className="leaderboard-active">
              <div className="leaderboard-row leaderboard-header">
                <div>Position</div>
                <div>Car Nr</div>
                <div>Driver Name</div>
                <div>Current Lap</div>
                <div>Best Lap</div>
              </div>
              {currentSession.leaderBoard.map((driver, index) => (
                <div key={driver.car} className="leaderboard-row">
                  <div>{index + 1}</div>
                  <div>{driver.car}</div>
                  <div>{driver.name}</div>
                  <div>{driver.laps.length}</div>
                  <div>{driver.bestLap}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <Link reloadDocument to="/" className="bbutton" id="linkback">
            Back to the main page
          </Link>
        </div>
      </div>
      <button className="fullscreen-buttonrf" onClick={toggleFullScreen}>
        {!isFullScreen ? (
          <FullScreenIcon style={{ width: "30px", height: "30px" }} />
        ) : (
          <ExitFullScreenIcon style={{ width: "30px", height: "30px" }} />
        )}
      </button>  
    </div>
  );
}

export default LeaderBoard;
