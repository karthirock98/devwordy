import { useEffect, useState } from 'react';
import { dateKey, msUntilTomorrow } from '../game/dates';

/** Current local date key; updates automatically at midnight. */
export function useToday(): string {
  const [today, setToday] = useState(dateKey);
  useEffect(() => {
    const t = window.setTimeout(() => setToday(dateKey()), msUntilTomorrow() + 500);
    const onFocus = () => setToday(dateKey());
    window.addEventListener('focus', onFocus);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('focus', onFocus);
    };
  }, [today]);
  return today;
}

/** Ticks every second; used for countdowns. */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(t);
  }, [intervalMs]);
  return now;
}
