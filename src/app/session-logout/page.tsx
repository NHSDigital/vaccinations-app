"use client";

import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";

const SessionLogout = () => {
  return (
    <>
      {/*TODO: This should go back to NHS app, requires app integration */}
      <BackLink />
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
      </MainContent>
    </>
  );
};

export default SessionLogout;
