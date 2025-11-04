"use client";

import { unprotectedUrlPaths } from "@src/app/_components/inactivity/constants";
import useInactivityTimer from "@src/utils/auth/inactivity-timer";
import { userLogout } from "@src/utils/auth/user-logout";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { JSX, RefObject, useEffect, useRef } from "react";

import styles from "./styles.module.css";

const InactivityDialog = (): JSX.Element => {
  const { status } = useSession();
  const { isIdle, isTimedOut } = useInactivityTimer();
  const dialogRef: RefObject<HTMLDialogElement | null> = useRef<HTMLDialogElement>(null);
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
      {/* Ref: https://service-manual.nhs.uk/design-system/components/buttons */}
      <div className={"nhsuk-button-group nhsuk-u-margin-bottom-0"}>
        {/* Ref: https://design-system.nhsapp.service.nhs.uk/components/buttons/ */}
        <button
          autoFocus={true}
          data-module={"nhsuk-button"}
          className={"nhsuk-button nhsapp-button"}
          onClick={() => {
            dialogRef.current?.close();
          }}
        >
          Stay logged in
        </button>
        <button
          data-module={"nhsuk-button"}
          className={"nhsuk-button nhsuk-button--secondary nhsapp-button"}
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
