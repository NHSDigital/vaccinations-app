"use client";

import { unprotectedUrlPaths } from "@src/app/_components/inactivity/constants";
import useInactivityTimer from "@src/utils/auth/inactivity-timer";
import { userLogout } from "@src/utils/auth/user-logout";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { JSX, createRef, useEffect, useRef } from "react";

import styles from "./styles.module.css";

const InactivityDialog = (): JSX.Element => {
  const { status } = useSession();
  const { isIdle, isTimedOut } = useInactivityTimer();
  const dialogRef = createRef<HTMLDialogElement>();
  useRef<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // do nothing on unprotected pages
    if (unprotectedUrlPaths.includes(pathname)) return;

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
