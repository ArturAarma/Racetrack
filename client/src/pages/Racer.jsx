import "./Racer.css";
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import React, { useContext, useState, useEffect } from "react";
import RacerList from "../components/RacerList.ts";
import { SocketContext } from "../context/SocketContext";



const Racer = () => {

    const socket = useContext(SocketContext);
    const [driver, setDriver] = useState(null);
  
    useEffect(() => {
      if (!socket) return;
  
      const handleActiveDriver = (selectedDriver) => {
        setDriver(selectedDriver);
      };
  
      socket.on("getDriver", handleActiveDriver);
  
      return () => {
        socket.off("getDriver", handleActiveDriver);
      };
    }, [socket]);
  
    return (
        <div className="RacerSelection">
        {driver ? ( 
            <div className="driverInfo">
                <div>Active driver: {driver.name}</div>
                
            </div>
        ) : (
            <div>No active driver selected.</div>
        )}
    </div>
);
};

export default Racer;