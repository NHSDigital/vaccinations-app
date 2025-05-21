"use client";
import { createRef, useEffect } from "react";
import styles from "./styles.module.css";

interface InactivityDialogProps {
  show: boolean;
}

const InactivityDialog = (props: InactivityDialogProps) => {
  const dialogRef = createRef<HTMLDialogElement>();
  useEffect(() => {
    if (props.show) {
      console.log("Showing dialog");
      dialogRef.current?.showModal();
    }
  }, [dialogRef, props.show]);

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
