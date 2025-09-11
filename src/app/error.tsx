"use client";

import "@public/css/nhsapp-3.1.0.min.css";
import "@public/css/nhsuk-9.6.1.min.css";
import ServiceFailure from "@src/app/service-failure/page";
import logClientSideError from "@src/utils/client-side-error-logger/client-side-error-logger";
import { ClientSideErrorTypes } from "@src/utils/constants";
import React, { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
}

const UncaughtError = (props: GlobalErrorProps) => {
  useEffect(() => {
    logClientSideError(ClientSideErrorTypes.UNHANDLED_ERROR);
  }, [props.error]);

  return <ServiceFailure />;
};

export default UncaughtError;
