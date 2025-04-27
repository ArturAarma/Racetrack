import { useContext, useEffect, useState } from "react";
import "./race-flags.css";
import { SocketContext } from "../context/SocketContext";
import { ReactComponent as FullScreenIcon } from "./../icons/fullscreen.svg";
import { ReactComponent as ExitFullScreenIcon } from "./../icons/fullscreen-exit.svg";

function RaceFlags() {
  const socket = useContext(SocketContext);
  const [flag, setFlag] = useState("danger");
  const [isFullScreen, setIsFullScreen] = useState(false);
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
    <div className="race-flags-container">
      
      <div className="flag" id={flag}>
      <button className="fullscreen-buttonrf" onClick={toggleFullScreen}>
        {!isFullScreen ? (
          <FullScreenIcon style={{ width: "30px", height: "30px" }} />
        ) : (
          <ExitFullScreenIcon style={{ width: "30px", height: "30px" }} />
        )}
      </button>  
      </div>;
      
    </div>
  );
}

export default RaceFlags;
