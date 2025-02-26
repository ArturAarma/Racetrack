import { useContext, useEffect, useState } from "react";
import "./race-flags.css";
import { SocketContext } from "../context/SocketContext";

function RaceFlags() {
  const socket = useContext(SocketContext);
  const [flag, setFlag] = useState("safe");

  useEffect(() => {
    if (!socket) return;

    const handleFlagChange = (flagType) => {
      setFlag(flagType);
    };

    socket.on("getFlag", handleFlagChange);

    return () => {
      socket.off("getFlag", handleFlagChange);
    };
  }, [socket]);

  return (
    <div className="race-flags-container">
      <div className="flag" id={flag}></div>;
    </div>
  );
}

export default RaceFlags;
