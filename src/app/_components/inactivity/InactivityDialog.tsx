"use client";

import { SESSION_LOGOUT_ROUTE } from "@src/app/session-logout/constants";
import { createRef, JSX, useEffect } from "react";
import styles from "./styles.module.css";
import { userLogout } from "@src/utils/auth/user-logout";
import useInactivityTimer from "@src/utils/auth/inactivity-timer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const InactivityDialog = (): JSX.Element => {
  const router = useRouter();
  const { status } = useSession();
  const { isIdle, isTimedOut } = useInactivityTimer();
  const dialogRef = createRef<HTMLDialogElement>();

  useEffect(() => {
    if (status === "authenticated") {
      if (isTimedOut) {
        dialogRef.current?.close();
        userLogout();
      } else if (isIdle) {
        dialogRef.current?.showModal();
      }
    } else if (status === "unauthenticated") {
      dialogRef.current?.close();
      router.push(SESSION_LOGOUT_ROUTE);
    }
  }, [dialogRef, isIdle, isTimedOut, router, status]);

  return (
    <dialog ref={dialogRef} className={styles.warningDialog}>
      <p>For security reasons, you&#39;ll be logged out in 1 minute.</p>
      <div className={"nhsapp-button-group"}>
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
