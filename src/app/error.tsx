"use client";

import "@public/css/nhsapp-3.1.0.min.css";
import "@public/css/nhsuk-9.6.1.min.css";
import ServiceFailure from "@src/app/service-failure/page";
import React, { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const UncaughtError = (props: GlobalErrorProps) => {
  useEffect(() => {
    // TODO: Log the error to an error reporting service
    console.error("Uncaught error occurred", props.error);
  }, [props.error]);

  return <ServiceFailure />;
};

export default UncaughtError;
