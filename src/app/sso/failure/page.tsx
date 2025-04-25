"use client";

import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import { useSearchParams } from "next/navigation";

const SSOFailure = () => {
  const searchParams = useSearchParams();

  return (
    <div>
      <title>Temporary SSO Failure Page</title>
      <BackLink link="http://localhost:4000/auth/login" />
      <h1>SSO Failure</h1>
      <p>{searchParams.get("message")}</p>
    </div>
  );
};

export default SSOFailure;
