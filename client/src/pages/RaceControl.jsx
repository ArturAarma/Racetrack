import "./RaceControl.css";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import RaceTimer from "../components/RaceTimer";

// RaceControl
function RaceControl() {
  const socket = useContext(SocketContext);
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);

  useEffect(() => {
    if (!socket) return;
    // get updated sessions from server on connection
    socket.on("getSessions", (updatedSessions) => {
      setSessions(updatedSessions);
    });

    // get updated currentSession from server on connection
    socket.on("getCurrentSession", (updatedCurrentSession) => {
      setCurrentSession(updatedCurrentSession);
    });

    // get updated sessions when front-desk updates sessions
    socket.on("sessionsUpdated", (updatedSessions) => {
      setSessions(updatedSessions);
    });

    // get updated currentSession when LapLineTracker adds a lap
    socket.on("addedLap", (updatedCurrentSession) => {
      setCurrentSession(updatedCurrentSession);
    });

    return () => {
      socket.off("sessionsUpdated"); // Cleanup to avoid memory leaks
      socket.off("addedLap"); // Cleanup to avoid memory leaks
      socket.off("getSessions"); // Cleanup to avoid memory leaks
      socket.off("getCurrentSession"); // Cleanup to avoid memory leaks
    };
  }, [socket]);

  // send currentSession whenever currentSession is updated
  useEffect(() => {
    if (!socket) return;
    socket.emit("updateCurrentSession", currentSession);
  }, [socket, currentSession]);

  // get first session object with isConfirmed = true (front-desk has confirmed driver names)
  useEffect(() => {
    const firstConfirmedSession = sessions?.find((session) => session.isConfirmed === true);
    // if there is an ongoing active session, don't update currentSession
    if (currentSession !== "no" && !currentSession?.isActive && !currentSession?.isFinished) {
      setCurrentSession(firstConfirmedSession);
    }
  }, [sessions, currentSession]);
  console.log(currentSession);

  return (
    <div className="session-container">
      Race Control
      {currentSession?.isActive && <FlagControls currentSession={currentSession} setCurrentSession={setCurrentSession} />}
      <SessionInfo
        currentSession={currentSession}
        setCurrentSession={setCurrentSession}
        sessions={sessions}
        setSessions={setSessions}
        socket={socket}
      />
      <Link reloadDocument to="/" className="bbutton">
        Back to the main page
      </Link>
    </div>
  );
}

// FlagControls
function FlagControls({ currentSession, setCurrentSession }) {
  // change flags
  const changeFlag = (flag) => {
    if (!currentSession.isFinished) {
      setCurrentSession((prevSession) => ({
        ...prevSession,
        raceMode: flag,
      }));
    }
  };

  // Handle finish race
  const handleFinishRace = () => {
    setCurrentSession((prevSession) => ({
      ...prevSession,
      raceMode: "finish",
      isFinished: true,
      isActive: false,
    }));
  };

  return (
    <div className="flag-controls-container">
      Flag Controls
      <div className="flags-box">
        <div onClick={() => changeFlag("safe")} id="safe">
          SAFE
        </div>
        <div onClick={() => changeFlag("hazard")} id="hazard">
          HAZARD
        </div>
        <div onClick={() => changeFlag("danger")} id="danger">
          DANGER
        </div>
        <div onClick={() => handleFinishRace()} id="finish">
          FINISH
        </div>
      </div>
    </div>
  );
}

// SessionInfo
function SessionInfo({ sessions, setSessions, currentSession, setCurrentSession, socket }) {
  // Handle clicking the "Start Race" button
  const handleStartRace = () => {
    // make a copy of drivers to set as template for leader-board
    const leaderBoardDrivers = [...currentSession.drivers];

    // change the current session flag to "safe" and isActive=true,
    // add startTime and drivers for the leaderBoard
    const updatedCurrentSession = {
      ...currentSession,
      isActive: true,
      raceMode: "safe",
      startTime: Date.now(),
      leaderBoard: leaderBoardDrivers,
    };

    setCurrentSession(updatedCurrentSession);

    // remove the current session from general sessions array when race is started
    const currentSessionRemoved = sessions.filter((session) => session.name !== currentSession.name);
    setSessions(currentSessionRemoved);

    // update new sessions data through socket
    socket.emit("raceStarted", currentSessionRemoved);
  };

  // Handle finish race
  const handleFinishRace = () => {
    setCurrentSession((prevSession) => ({
      ...prevSession,
      raceMode: "finish",
      isFinished: true,
      isActive: false,
    }));
  };

  // Handle End Session
  const handleEndSession = () => {
    socket.emit("endSession");
    // when both isFinished and isActive are set to false, then useEffect sets
    // the next session from sessions array as currentSession
    setCurrentSession((prevCurrentSession) => ({
      ...prevCurrentSession,
      isFinished: false,
    }));
  };

  return (
    <div className="flag-controls-container">
      Session Info
      <div className="sessions-box">
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
      {!currentSession?.isFinished && (
        <div className="sessions-box">
          <div className="info-box">Race timer:</div>
          <div className="info-box">
            <RaceTimer
              timerIsActive={currentSession?.isActive}
              onFinish={() => handleFinishRace()}
              startTime={currentSession?.startTime}
            />
          </div>
        </div>
      )}
      <div className="sessions-box">
        <div className="info-box">
          {currentSession?.isActive || currentSession?.isFinished ? "Current Session:" : "Next Session:"}
        </div>
        <div className="info-box">{currentSession ? currentSession?.name : "No upcoming sessions."}</div>
      </div>
      {currentSession && (
        <div className="drivers-box">
          {currentSession?.drivers.map((driver, index) => (
            <li key={driver.name}>
              <div className="car-nr">Car #{driver.car}:</div> {driver.name}
            </li>
          ))}
        </div>
      )}
      {currentSession && !currentSession?.isActive && !currentSession?.isFinished && (
        <button className="bbutton" onClick={handleStartRace}>
          Start Race
        </button>
      )}
      {currentSession && currentSession?.isFinished && (
        <button className="bbutton" onClick={() => handleEndSession()}>
          End Session
        </button>
      )}
    </div>
  );
}

export default RaceControl;
