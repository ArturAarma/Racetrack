import "./FlagBearer.css";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ssback from "../img/ssback.png";
import { SocketContext } from "../context/SocketContext";

function FlagBearer() {
  const socket = useContext(SocketContext);
  const [flagType, setFlagType] = useState("safe");

  useEffect(() => {
    if (socket) {
      socket.emit("changeFlag", flagType);
    }
  }, [socket, flagType]);

  console.log(flagType);

  return (
    <div className="container">
      <div className="flagheader">Here you can change flags!</div>
      <div id="flagdiv">
        <button id="green" onClick={() => setFlagType("safe")}></button>
        <button id="yellow" onClick={() => setFlagType("hazard")}></button>
        <button id="red" onClick={() => setFlagType("danger")}></button>
      </div>
      <div>
        <Link to="/" className="bbutton" id="linkback">
          Back to the main page
        </Link>
      </div>
    </div>
  );
}

export default FlagBearer;
