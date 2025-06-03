"use client";

import { createRef, JSX, useEffect, useRef } from "react";
import styles from "./styles.module.css";
import { userLogout } from "@src/utils/auth/user-logout";
import useInactivityTimer from "@src/utils/auth/inactivity-timer";
import { useSession } from "next-auth/react";

const InactivityDialog = (): JSX.Element => {
  const { status } = useSession();
  const { isIdle, isTimedOut } = useInactivityTimer();
  const dialogRef = createRef<HTMLDialogElement>();
  const previousStatusRef = useRef<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      if (isTimedOut) {
        dialogRef.current?.close();
        userLogout(true);
      } else if (isIdle) {
        dialogRef.current?.showModal();
      }
    }
  }, [dialogRef, isIdle, isTimedOut, status]);

  useEffect(() => {
    const prevStatus = previousStatusRef.current;

    // only trigger logout if the user has been authenticated and then unauthenticated
    if (prevStatus === "authenticated" && status === "unauthenticated") {
      dialogRef.current?.close();
      userLogout(true);
    }
    previousStatusRef.current = status;
  }, [dialogRef, status]);

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
