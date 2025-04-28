"use client";

import BackLink from "@src/app/_components/nhs-frontend/BackLink";

const SSOFailure = () => {
  return (
    <div>
      <title>There is a problem</title>
      <BackLink link="http://localhost:4000/auth/login" />
      <h1>There is a problem</h1>
      <p>There was an issue with NHS login. This maybe a temporary problem.</p>
      <p>
        Go back and try logging in again. If you cannot login, try again later.
      </p>
    </div>
  );
};

export default SSOFailure;
