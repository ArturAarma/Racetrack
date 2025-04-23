import { useContext, useEffect, useState } from "react";
import "./race-flags.css";
import { SocketContext } from "../context/SocketContext";

function RaceFlags() {
  const socket = useContext(SocketContext);
  const [flag, setFlag] = useState("danger");
  const [currentSession, setCurrentSession] = useState(null);

  useEffect(() => {
    if (!socket) return;

    // get updated currentSession from server on connection
    socket.on("getCurrentSession", (updatedCurrentSession) => {
      setCurrentSession(updatedCurrentSession);
    });

    socket.on("currentSessionUpdated", (session) => {
      setCurrentSession(session);
    });

    return () => {
      socket.off("getCurrentSession");
      socket.off("currentSessionUpdated");
    };
  }, [socket]);

  useEffect(() => {
    if (currentSession != null) {
      setFlag(currentSession.raceMode);
    } else {
      setFlag("danger");
      console.log("currentsession is 0");
    }
  });

  return (
    <div className="race-flags-container">
      <div className="flag" id={flag}></div>;
    </div>
  );
}

export default RaceFlags;
