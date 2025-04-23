import "./NextRace.css";
import React from "react";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";

function NextRace() {
  const socket = useContext(SocketContext);

  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.on("getSessions", (updatedSessions) => {
      setSessions(updatedSessions);
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
      socket.off("sessionsUpdated");
      socket.off("startedRaceAlert");
      socket.off("sessionsHasEnded");
    };
  }, [socket]);

  return (
    <div className="container">
      <div className="frontdeskHeader">Next Race</div>
      <div className="racerpanel">
        <div className="nextsession">
          <h1>Next session</h1>
          <div className="sessioninfo">
            {sessions.length > 0 ? (
              <div className="sessiondetails">
                <p>Up next: {sessions[0].name}</p>

                <div className="leader-board-container">
                  {sessions &&
                    sessions[0].drivers.map((driver, index) => (
                      <div className="lb-position" key={index}>
                        {driver.name}
                      </div>
                    ))}
                  <div>
                    <p>Proceed to the paddock</p>
                  </div>
                </div>
              </div>
            ) : (
              <p>No sessions available</p>
            )}
          </div>
        </div>

        <Link to="/" className="bbutton" id="linkback">
          Back to the main page
        </Link>
      </div>
    </div>
  );
}

export default NextRace;
