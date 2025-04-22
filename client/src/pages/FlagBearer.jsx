import "./FlagBearer.css";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ssback from "../img/ssback.png";
import { SocketContext } from "../context/SocketContext";

function FlagBearer() {
  const socket = useContext(SocketContext);

  const handleFlagChange = (newFlag) => {
    socket.emit("changeFlag", newFlag);
  };

  return (
    <div className="container">
      <div className="flagheader">Here you can change flags!</div>
      <div id="flagdiv">
        <button id="green" onClick={() => handleFlagChange("safe")}></button>
        <button id="yellow" onClick={() => handleFlagChange("hazard")}></button>
        <button id="red" onClick={() => handleFlagChange("danger")}></button>
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
