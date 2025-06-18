"use client";

import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { NHS_TITLE_SUFFIX, SERVICE_HEADING } from "@src/app/constants";

const SSOFailure = () => {
  return (
    <>
      <title>{`There is a problem - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`}</title>
      <MainContent>
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
