import { useEffect, useState } from "react";

function RaceTimer({ startTime, timerIsActive, onFinish }) {
  const durationInSeconds = Number(process.env.REACT_APP_RACE_TIMER);
  const finishTime = startTime ? startTime + durationInSeconds * 1000 : null;

  const [, forceRerender] = useState(0);

  // re-render component every second while the race is active
  useEffect(() => {
    if (!timerIsActive) return;

    const interval = setInterval(() => {
      forceRerender((prev) => prev + 1);
    }, 100);

    return () => clearInterval(interval); // cleanup interval
  }, [timerIsActive]);

  const currentTime = Date.now();
  let timeRemaining = startTime ? Math.max(0, Math.ceil((finishTime - currentTime) / 1000)) : durationInSeconds;
  // if race is ended manually, show 00:00
  if (!timerIsActive && startTime) {
    timeRemaining = 0;
  }

  // run callback function when timer reaches 0
  useEffect(() => {
    if (onFinish && timeRemaining === 0 && timerIsActive) {
      onFinish();
    }
  }, [timeRemaining, timerIsActive, onFinish]);

  // format with leading "0"
  const minutes = String(Math.floor(timeRemaining / 60)).padStart(2, "0");
  const seconds = String(timeRemaining % 60).padStart(2, "0");

  return (
    <div>
      {minutes} : {seconds}
    </div>
  );
}

export default RaceTimer;
