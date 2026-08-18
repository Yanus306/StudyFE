// src/hooks/useResetTimer.js
import { useState, useEffect } from 'react';

const RESET_TIME_KEY = 'app_reset_target_time';
const SIX_HOURS = 6 * 60 * 60 * 1000;

export function useResetTimer() {
  const [timeLeft, setTimeLeft] = useState('06:00:00');

  useEffect(() => {
    let targetTime = localStorage.getItem(RESET_TIME_KEY);
    const now = Date.now();

    if (!targetTime || now >= parseInt(targetTime, 10)) {
      targetTime = now + SIX_HOURS;
      localStorage.setItem(RESET_TIME_KEY, targetTime.toString());
    }

    const timerInterval = setInterval(() => {
      const currentTime = Date.now();
      const difference = parseInt(targetTime, 10) - currentTime;

      if (difference <= 0) {
        clearInterval(timerInterval);
        localStorage.removeItem(RESET_TIME_KEY);
        window.location.reload();
        return;
      }

      const hours = String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0');
      const minutes = String(Math.floor((difference / (1000 * 60)) % 60)).padStart(2, '0');
      const seconds = String(Math.floor((difference / 1000) % 60)).padStart(2, '0');

      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  return timeLeft;
}