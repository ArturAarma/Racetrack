import { useEffect, useState } from "react";

function RaceTimer({ startTime, timerIsActive, onFinish }) {
  const durationInSeconds = Number(process.env.REACT_APP_RACE_TIMER);
  const finishTime = startTime ? startTime + durationInSeconds * 1000 : null;
  const [currentTime, setCurrentTime] = useState(null);

  // update currentTime immediately when startTime is added (race has started)
  useEffect(() => {
    if (startTime) {
      setCurrentTime(Date.now);
    }
  }, [startTime]);

  // set current time every second while the race is active
  useEffect(() => {
    if (!timerIsActive) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval); // cleanup interval
  }, [timerIsActive]);

  // for rendering countdown time
  let timeRemaining = startTime ? Math.max(0, Math.ceil((finishTime - currentTime) / 1000)) : durationInSeconds;

  // run callback function when timer reaches 0
  useEffect(() => {
    if (timeRemaining === 0 && timerIsActive) {
      onFinish();
    }
  }, [timeRemaining, timerIsActive, onFinish]);

  let minutes = Math.floor(timeRemaining / 60);
  let seconds = timeRemaining % 60;

  // format with leading "0"
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return (
    <div>
      {minutes} : {seconds}
    </div>
  );
}

export default RaceTimer;
