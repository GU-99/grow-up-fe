import { useState, useEffect } from 'react';

type TimerProps = {
  time: number;
  onTimeout: () => void;
};

export default function Timer({ time, onTimeout }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(time);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeout();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeout]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  };

  return <p className="text-sm font-regular text-error">{formatTime(timeLeft)}</p>;
}
