"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const WARNING_TIME_MS: number = 9 * 60 * 1000;
const LOGOUT_TIME_MS: number = 10 * 60 * 1000;
export const ACTIVITY_EVENTS: string[] = ["keyup", "click", "scroll"];

const useInactivityTimer = (warningTimeMs: number = WARNING_TIME_MS, logoutTimeMs: number = LOGOUT_TIME_MS) => {
  const [isIdle, setIsIdle] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    clearTimeout(timerRef?.current ?? undefined);
    clearTimeout(warningRef?.current ?? undefined);
    setIsIdle(false);

    warningRef.current = setTimeout(() => {
      setIsIdle(true);
    }, warningTimeMs);

    timerRef.current = setTimeout(async () => {
      setIsTimedOut(true);
    }, logoutTimeMs);
  }, [warningTimeMs, logoutTimeMs]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // Start timer on component mount

    // Stop timer on component unmount
    return () => {
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(timerRef?.current ?? undefined);
      clearTimeout(warningRef?.current ?? undefined);
    };
  }, [resetTimer]);

  return { isIdle, isTimedOut };
};

export default useInactivityTimer;
