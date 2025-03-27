import { useContext, useEffect, useState } from "react";
import RaceTimer from "../components/RaceTimer";
import "./RaceCountdown.css";
import { ReactComponent as FullScreenIcon } from "./../icons/fullscreen.svg";
import { ReactComponent as ExitFullScreenIcon } from "./../icons/fullscreen-exit.svg";
import { SocketContext } from "../context/SocketContext";

function RaceCountdown() {
  const [currentSession, setCurrentSession] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const socket = useContext(SocketContext);

  // listen to events from server
  useEffect(() => {
    if (!socket) return;

    // get updated currentSession from server on connection
    socket.on("getCurrentSession", (updatedCurrentSession) => {
      setCurrentSession(updatedCurrentSession);
    });

    socket.on("currentSessionUpdated", (updatedCurrentSession) => {
      setCurrentSession(updatedCurrentSession);
    });

    socket.on("StartedRaceAlert", () => {
      socket.emit("requestCurrentSession");
    });

    return () => {
      socket.off("getCurrentSession");
      socket.off("currentSessionUpdated");
      socket.off("StartedRaceAlert");
    };
  }, [socket]);

  console.log(currentSession);

  // run the function to setIsFullScreen on mount and when page re-renders
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
    <div className="countdown-container">
      <div className="countdown-timer">
        <RaceTimer timerIsActive={currentSession?.isActive} startTime={currentSession?.startTime} />
      </div>
      <button className="fullscreen-button" onClick={toggleFullScreen}>
        {!isFullScreen ? (
          <FullScreenIcon style={{ width: "30px", height: "30px" }} />
        ) : (
          <ExitFullScreenIcon style={{ width: "30px", height: "30px" }} />
        )}
      </button>
    </div>
  );
}

export default RaceCountdown;
