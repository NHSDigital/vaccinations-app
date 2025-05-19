"use client";

import { signOut } from 'next-auth/react';
import { useEffect, useRef, useState } from "react";

const WARNING_TIME_MS: number = 9 * 60 * 1000;
const LOGOUT_TIME_MS: number = 10 * 60 * 1000;

const useInactivityTimer = (
  warningTimeMs: number = WARNING_TIME_MS,
  logoutTimeMs: number = LOGOUT_TIME_MS,
) => {
  const [showWarning, setShowWarning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    clearTimeout(timerRef?.current ?? undefined);
    clearTimeout(warningRef?.current ?? undefined);
    setShowWarning(false);

    warningRef.current = setTimeout(() => {
      setShowWarning(true);
    }, warningTimeMs);

    timerRef.current = setTimeout(async () => {
      await signOut({
        redirect: true,
        redirectTo: '/sso-failure?error=SessionExpired'
      }); // TODO: Handle errors
    }, logoutTimeMs);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // Start timer on component mount

    // Stop timer on component unmount
    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(timerRef?.current ?? undefined);
      clearTimeout(warningRef?.current ?? undefined);
    };
  }, []);

  return { showWarning };
};

export default useInactivityTimer;
