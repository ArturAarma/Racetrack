import { useEffect, useState } from "react";

function RaceTimer({ durationInSeconds, timerIsActive, onFinish }) {
  const [time, setTime] = useState(durationInSeconds);

  // reset the timer when race ends (timerIsActive changes)
  useEffect(() => {
    setTime(durationInSeconds);
  }, [timerIsActive, durationInSeconds]);

  useEffect(() => {
    const customInterval = setInterval(() => {
      if (time !== 0 && timerIsActive) {
        setTime((prevTime) => prevTime - 1);
      }
    }, 1000);

    if (time === 0) {
      onFinish(); // Run the callback function when time reaches 0
    }
    return () => clearInterval(customInterval);
  }, [time, timerIsActive, onFinish]);

  let minutes = Math.floor(time / 60);
  let seconds = time % 60;

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
