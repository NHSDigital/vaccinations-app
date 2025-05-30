"use client";

import { toNHSAppHomePage } from "@src/utils/navigation";
import styles from "./styles.module.css";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { useEffect, useState } from "react";

const SessionLogout = () => {
  const [isOpenInNHSApp, setIsOpenInNHSApp] = useState(false);

  useEffect(() => {
    setIsOpenInNHSApp(window.nhsapp.tools.isOpenInNHSApp());
  }, []);

  return isOpenInNHSApp ? (
    <>
      <MainContent>
        <title>You have been logged out</title>
        <div className={styles.logoutScreen}>
          <div className={styles.logoutHeading}>
            <h4>For your security, you need to login again.</h4>
          </div>
          <div className={styles.logoutContent}>
            <h1>You have logged out</h1>
          </div>
          <div className={styles.logBackInButton}>
            <button
              className="nhsuk-button nhsuk-button--reverse nhsapp-button"
              onClick={toNHSAppHomePage}
            >
              Log back in
            </button>
          </div>
        </div>
      </MainContent>
    </>
  ) : (
    <>
      <MainContent>
        <title>You have been logged out</title>
        <h1>You have been logged out</h1>
        <p>
          For security, you&#39;re automatically logged out if you have not used
          the service for 10 minutes.
        </p>
        <p>
          If you were entering information, it has not been saved and you will
          need to re-enter it.
        </p>
        <div className={styles.continueButton}>
          <button
            className="nhsuk-button nhsapp-button"
            onClick={toNHSAppHomePage}
          >
            Continue
          </button>
        </div>
      </MainContent>
    </>
  );
};

export default SessionLogout;
