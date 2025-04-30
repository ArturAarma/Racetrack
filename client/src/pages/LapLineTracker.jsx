import "./LapLineTracker.css";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";

function LapLineTracker() {
  const socket = useContext(SocketContext);
  const [currentSession, setCurrentSession] = useState(null);
  const navigate = useNavigate();

  // check authentification, navigate to login if not authorized
  useEffect(() => {
    const auth = sessionStorage.getItem("auth-ll");
    if (auth !== "lapline") {
      navigate("/lap-line-tracker-login");
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    // get updated currentSession from server on connection
    socket.on("getCurrentSession", (updatedCurrentSession) => {
      setCurrentSession(updatedCurrentSession);
    });

    // get updated currentSession when session is Ended
    socket.on("sessionHasEnded", () => socket.emit("requestCurrentSession"));

    // get updated currentSession when FrontDesk confirms a session
    socket.on("sessionConfirmedbyFD", () => socket.emit("requestCurrentSession"));

    // get currentSession updates whenever Race-Control updates currentSession
    socket.on("currentSessionUpdated", (updatedCurrentSession) => {
      setCurrentSession(updatedCurrentSession);
    });

    //test
    socket.on("getConfirmedCurrentSession", (updatedCurrentSession) => {
      setCurrentSession(updatedCurrentSession);
    });

    return () => {
      socket.off("currentSessionUpdated");
      socket.off("getCurrentSession");
      socket.off("sessionHasEnded");
      socket.off("sessionConfirmedbyFD");
      //test
      socket.off("getConfirmedCurrentSession");
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
      lapTime = Number(((Date.now() - currentSession.startTime) * 0.001).toFixed(2));
    } else {
      // if not the first lap, use specific drivers lapStartTime
      lapTime = Number(((Date.now() - currentSession.drivers[index].lapStartTime) * 0.001).toFixed(2));
    }

    setCurrentSession((prevCurrentSession) => {
      // make a copy of current session and drivers
      const updatedCurrentSession = {
        ...prevCurrentSession,
        lapStartTime: Date.now(),
        drivers: [...prevCurrentSession.drivers],
      };

      // set the bestLap time if current lapTime is faster than bestLap
      // or it's the first lap
      if (updatedCurrentSession.drivers[index].bestLap === null || updatedCurrentSession.drivers[index].bestLap > lapTime) {
        updatedCurrentSession.drivers[index] = {
          ...updatedCurrentSession.drivers[index],
          bestLap: lapTime,
        };
      }

      // add current laptime to laps and update lapStartTime
      updatedCurrentSession.drivers[index] = {
        ...updatedCurrentSession.drivers[index],
        laps: [...updatedCurrentSession.drivers[index].laps, lapTime],
        lapStartTime: Date.now(),
      };

      // sort leaderBoard array by fastest lap
      const sortedLeaderboard = [...updatedCurrentSession.drivers];
      // if bestLap doesn't have a value yet, set the value to Infinity to move it to the end of the leaderBoard
      sortedLeaderboard.sort(
        (a, b) => (a.bestLap !== null ? a.bestLap : Infinity) - (b.bestLap !== null ? b.bestLap : Infinity)
      );
      updatedCurrentSession.leaderBoard = sortedLeaderboard;

      // update currentSession on server when lap is added
      socket.emit("lapAdded", updatedCurrentSession);
      return updatedCurrentSession;
    });
  };

  return (
    <div className="ll-container">
      Lap Line Tracker
      {currentSession != null ? (
        !currentSession?.startTime ? (
          <div className="not-active">Preparing session: {currentSession?.name}</div>
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
