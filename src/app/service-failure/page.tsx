"use client";

import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { NHS_TITLE_SUFFIX, SERVICE_HEADING } from "@src/app/constants";

const ServiceFailure = () => {
  return (
    <>
      <title>{`There is a problem with the service - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`}</title>
      <MainContent>
        <h1>There is a problem with the service</h1>
        <p>This maybe a temporary problem.</p>
        <p>
          Go back and try logging in again. If you cannot login, try again
          later.
        </p>
        <p>
          For urgent medical advice, go to{" "}
          <a href={"https://111.nhs.uk/"} target={"_blank"} rel={"noopener"}>
            111.nhs.uk
          </a>{" "}
          or call 111.
        </p>
      </MainContent>
    </>
  );
};

export default ServiceFailure;
