import { useEffect, useState } from "react";

export function useCountdown(expiration: string | Date) {
  const targetTime = new Date(expiration).getTime();

  const calculateTimeLeft = () => {
    const diff = targetTime - Date.now();
    return diff > 0 ? diff : 0; // never negative
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [expiration]);

  const minutes = Math.floor(timeLeft / 1000 / 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return { minutes, seconds, isExpired: timeLeft <= 0 };
}
