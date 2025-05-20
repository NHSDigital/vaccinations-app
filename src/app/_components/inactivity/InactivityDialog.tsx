"use client";
import styles from "./styles.module.css";

interface InactivityDialogProps {
  open: boolean;
  onClose: () => void;
}

const handleLogout = async () => {
  console.log("Logging out");
};

const handleExtendSession = () => {
  console.log("Extending session");
};

const InactivityDialog = (props: InactivityDialogProps) => {
  if (!props.open) return null;

  return (
    <div
      className={styles.modalContainer}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <div className={styles.modalWrapper} style={{ maxWidth: "400px" }}>
        <div className={styles.modalContent}>
          <p>For security reasons, you&#39;ll be logged out in 1 minute.</p>
          <button
            className="nhsuk-button nhsuk-button-full-width"
            onClick={() => {
              props.onClose();
              handleExtendSession();
            }}
          >
            Stay logged in
          </button>
          <button
            className="nhsuk-button nhsuk-button-full-width"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default InactivityDialog;
