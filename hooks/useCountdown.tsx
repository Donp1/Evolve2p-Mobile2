import { useEffect, useState } from "react";

export function useCountdown(
  expiration: string | Date,
  minutesToWait?: number // optional
) {
  // Convert expiration time
  const baseTime = new Date(expiration).getTime();

  // If minutesToWait exists, add it to expiration time
  const targetTime = minutesToWait
    ? baseTime + minutesToWait * 60 * 1000
    : baseTime;

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
  }, [expiration, minutesToWait]);

  const minutes = Math.floor(timeLeft / 1000 / 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return { minutes, seconds, isExpired: timeLeft <= 0 };
}
