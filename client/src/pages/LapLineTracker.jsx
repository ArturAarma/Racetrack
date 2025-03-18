import "./LapLineTracker.css";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";

const LapLineTracker = () => {
  const socket = useContext(SocketContext);
  const [currentSession, setCurrentSession] = useState(null);

  // get currentSession updates whenever Race-Control updates currentSession
  useEffect(() => {
    if (!socket) return;

    socket.on("currentSessionUpdated", (updatedCurrentSession) => {
      setCurrentSession(updatedCurrentSession);
    });

    return () => {
      socket.off("currentSessionUpdated");
    };
  }, [socket]);

  return (
    <div className="ll-container">
      Lap Line Tracker
      <div className="lap-line-container">
        {currentSession?.drivers.map((driver, index) => (
          <div className="car-button" key={driver.name}>
            Car #{driver.car}
          </div>
        ))}
      </div>
      <Link to="/" className="bbutton">
        Back to the main page
      </Link>
    </div>
  );
};

export default LapLineTracker;
