"use client";
import { createRef, JSX, useEffect } from "react";
import styles from "./styles.module.css";
import useInactivityTimer from "@src/utils/auth/inactivity-timer";
import { useSession } from "next-auth/react";

const InactivityDialog = (): JSX.Element => {
  const { status } = useSession();
  const { isIdle } = useInactivityTimer();

  const dialogRef = createRef<HTMLDialogElement>();

  useEffect(() => {
    if (status === "authenticated" && isIdle) {
      dialogRef.current?.showModal();
    }
  }, [dialogRef, isIdle, status]);

  const handleLogout = () => {
    console.log("Logging out");
  };

  const handleExtendSession = () => {
    console.log("Extending session");
  };

  return (
    <dialog ref={dialogRef} className={styles.warningDialog}>
      <p>For security reasons, you&#39;ll be logged out in 1 minute.</p>
      <div className={"nhsapp-button-group"}>
        <button
          autoFocus={true}
          className={"nhsuk-button nhsapp-button"}
          onClick={() => {
            dialogRef.current?.close();
            handleExtendSession();
          }}
        >
          Stay logged in
        </button>
        <button
          className={"nhsuk-button nhsapp-button nhsapp-button--secondary"}
          onClick={() => {
            dialogRef.current?.close();
            handleLogout();
          }}
        >
          Log out
        </button>
      </div>
    </dialog>
  );
};

export default InactivityDialog;
