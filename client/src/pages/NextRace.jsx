import "./NextRace.css";
import React from "react";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ReactComponent as FullScreenIcon } from "./../icons/fullscreen.svg";
import { ReactComponent as ExitFullScreenIcon } from "./../icons/fullscreen-exit.svg";
import { SocketContext } from "../context/SocketContext";

function NextRace() {
  const socket = useContext(SocketContext);

  const [sessions, setSessions] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
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

    socket.on("currentSessionUpdated", (currentSession) => {
      setCurrentSession(currentSession);
    });

    socket.on("sessionsUpdated", (updatedSessions) => {
      setSessions(updatedSessions);
    });

    socket.on("startedRaceAlert", () => {
      socket.emit("requestSessions");
    });

    socket.on("sessionHasEnded", () => {
      socket.emit("requestSessions");
    });

    return () => {
      socket.off("getSessions");
      socket.off("getCurrentSession");
      socket.off("currentSessionUpdated");
      socket.off("sessionsUpdated");
      socket.off("startedRaceAlert");
      socket.off("sessionsHasEnded");
    };
  }, [socket]);

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
    <div className="nr-container">
      Next Race
      <div className="next-race-container">
        <div className="nextsession">
          {sessions.length > 0 ? (
            <div className="sessiondetails">
              <h2>Upcoming race: {sessions[0].name}</h2>
              {!currentSession?.isActive && !currentSession?.isFinished && (
                <div className="paddock-alert">Proceed to the paddock</div>
              )}
              <div className="next-race-drivers">
                {sessions &&
                  sessions[0].drivers.map((driver, index) => (
                    <div className="nr-driver" key={index}>
                      Car {index + 1}: {driver.name}
                    </div>
                  ))}
                <div></div>
              </div>
            </div>
          ) : (
            <h1>No upcoming sessions available</h1>
          )}
        </div>

        <Link to="/" className="bbutton" id="linkback">
          Back to the main page
        </Link>
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

export default NextRace;
