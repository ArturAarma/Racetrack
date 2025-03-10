import "./Racer.css";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom/client";
import React, { useContext, useState, useEffect } from "react";
import RacerList from "../components/RacerList.ts";
import { SocketContext } from "../context/SocketContext";

const Frontdesk = () => {
  const socket = useContext(SocketContext);
  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.emit("makeDriverActive", selectedDriver);
    }
  }, [socket, selectedDriver]);

  return (
    <div>
      <div>You are on the Racer homepage</div>
      <Link to="/" className="bbutton">
        Back to the main page
      </Link>
      <div className="RacerSelection">
        {RacerList.map((driver) => (
          <div key={driver.id} className="drivers" id={driver.id}>
            <div>{driver.name}</div>
            <button
              className="removebutton"
              onClick={() => setSelectedDriver(driver)}
            >
              +
            </button>
          </div>
        ))}
      </div>
      <div className="ActiveRacers">
        {selectedDriver ? (
          <div>Active Driver: {selectedDriver.name}</div>
        ) : (
          "No driver selected"
        )}
      </div>
    </div>
  );
};

export default Frontdesk;
