"use client";

import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";

const SSOFailure = () => {
  return (
    <>
      {/*TODO: This should go back to NHS app, requires app integration */}
      <BackLink />
      <MainContent>
        <title>There is a problem</title>
        <h1>There is a problem</h1>
        <p>
          There was an issue with NHS login. This maybe a temporary problem.
        </p>
        <p>
          Go back and try logging in again. If you cannot login, try again
          later.
        </p>
      </MainContent>
    </>
  );
};

export default SSOFailure;
