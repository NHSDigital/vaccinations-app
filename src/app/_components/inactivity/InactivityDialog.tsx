"use client";

import { SESSION_LOGOUT_ROUTE } from "@src/app/session-logout/constants";
import { SESSION_TIMEOUT_ROUTE } from "@src/app/session-timeout/constants";
import { SSO_FAILURE_ROUTE } from "@src/app/sso-failure/constants";
import { usePathname } from "next/navigation";
import { createRef, JSX, useEffect, useRef } from "react";
import styles from "./styles.module.css";
import { userLogout } from "@src/utils/auth/user-logout";
import useInactivityTimer from "@src/utils/auth/inactivity-timer";
import { useSession } from "next-auth/react";

export const excludedUrlPaths = [
  SESSION_LOGOUT_ROUTE,
  SESSION_TIMEOUT_ROUTE,
  SSO_FAILURE_ROUTE,
];

const InactivityDialog = (): JSX.Element => {
  const { status } = useSession();
  const { isIdle, isTimedOut } = useInactivityTimer();
  const dialogRef = createRef<HTMLDialogElement>();
  useRef<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // do nothing on unprotected pages
    if (excludedUrlPaths.includes(pathname)) return;

    // do nothing until we know the session state on protected pages
    if (status === "loading") return;

    // handle timeouts for authorised users on protected pages
    if (status === "authenticated") {
      if (isTimedOut) {
        dialogRef.current?.close();
        userLogout(true);
      } else if (isIdle) {
        dialogRef.current?.showModal();
      }
    }

    // logout unauthorised users on protected pages
    if (status === "unauthenticated") {
      dialogRef.current?.close();
      userLogout(true);
    }
  }, [dialogRef, isIdle, isTimedOut, pathname, status]);

  return (
    <dialog ref={dialogRef} className={styles.warningDialog}>
      <p>For security reasons, you&#39;ll be logged out in 1 minute.</p>
      <div className={"nhsapp-button-group nhsuk-u-margin-bottom-0"}>
        <button
          autoFocus={true}
          className={"nhsuk-button nhsapp-button"}
          onClick={() => {
            dialogRef.current?.close();
          }}
        >
          Stay logged in
        </button>
        <button
          className={"nhsuk-button nhsapp-button nhsapp-button--secondary"}
          onClick={() => {
            dialogRef.current?.close();
            userLogout();
          }}
        >
          Log out
        </button>
      </div>
    </dialog>
  );
};

export { InactivityDialog };
