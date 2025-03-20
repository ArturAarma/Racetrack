import "./LapLineTracker.css";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";

function LapLineTracker() {
  const socket = useContext(SocketContext);
  const [currentSession, setCurrentSession] = useState(null);

  useEffect(() => {
    if (!socket) return;

    // get updated currentSession from server on connection
    socket.on("getCurrentSession", (updatedCurrentSession) => {
      setCurrentSession(updatedCurrentSession);
    });

    // get currentSession updates whenever Race-Control updates currentSession
    socket.on("currentSessionUpdated", (updatedCurrentSession) => {
      setCurrentSession(updatedCurrentSession);
    });

    return () => {
      socket.off("currentSessionUpdated");
      socket.off("getCurrentSession");
    };
  }, [socket]);

  // for testing
  useEffect(() => {
    console.log(currentSession);
  }, [currentSession]);

  // ---------------------------------------------------- //
  // Handle crossing the finish line button
  const handleCrossingLine = (index) => {
    let lapTime;
    // if it's the first lap, use currentSession.startTime
    if (currentSession.drivers[index].laps.length === 0) {
      lapTime = ((Date.now() - currentSession.startTime) * 0.001).toFixed(2);
    } else {
      // if not the first lap, use specific drivers lapStartTime
      lapTime = ((Date.now() - currentSession.drivers[index].lapStartTime) * 0.001).toFixed(2);
    }

    setCurrentSession((prevCurrentSession) => {
      // make a copy of current session and drivers
      const updatedSession = {
        ...prevCurrentSession,
        lapStartTime: Date.now(),
        drivers: [...prevCurrentSession.drivers],
      };

      // set the bestLap time if current lapTime is faster than bestLap
      // or it's the first lap
      if (updatedSession.drivers[index].bestLap === null || updatedSession.drivers[index].bestLap > lapTime) {
        updatedSession.drivers[index] = {
          ...updatedSession.drivers[index],
          bestLap: lapTime,
        };
      }

      // add current laptime to laps and update lapStartTime
      updatedSession.drivers[index] = {
        ...updatedSession.drivers[index],
        laps: [...updatedSession.drivers[index].laps, lapTime],
        lapStartTime: Date.now(),
      };

      // sort leaderBoard array by fastest lap here

      // update currentSession on server when lap is added
      socket.emit("lapAdded", updatedSession);
      return updatedSession;
    });
  };

  return (
    <div className="ll-container">
      Lap Line Tracker
      {currentSession ? (
        !currentSession.startTime ? (
          <div className="not-active">Preparing session: {currentSession.name}</div>
        ) : (
          <div className="lap-line-container">
            {currentSession?.drivers.map((driver, index) => (
              <div className="car-button" key={driver.name} disabled={true} onClick={() => handleCrossingLine(index)}>
                Car #{driver.car}
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="not-active">No confirmed sessions.</div>
      )}
      <Link reloadDocument to="/" className="bbutton">
        Back to the main page
      </Link>
    </div>
  );
}

export default LapLineTracker;
