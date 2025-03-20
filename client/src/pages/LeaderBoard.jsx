import React, { useContext, useState } from "react";
import "./LeaderBoard.css";
import { SocketContext } from "../context/SocketContext";

function LeaderBoard() {
  const [currentSession, setCurrentSession] = useState(null);
  const socket = useContext(SocketContext);

  return (
    <div className="lb-container">
      Leader Board
      <div className="leader-board-container"></div>
    </div>
  );
}

export default LeaderBoard;
