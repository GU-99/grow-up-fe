import { useState, useEffect } from 'react';

export default function Timer({ time, onTimeout }: { time: number; onTimeout: () => void }) {
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
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return <p className="text-sm font-regular text-error">{formatTime(timeLeft)}</p>;
}
