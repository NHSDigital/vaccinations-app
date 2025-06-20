"use client";

import ServiceFailure from "@src/app/service-failure/page";
import React, { useEffect } from "react";
import "@public/css/nhsuk-9.6.1.min.css";
import "@public/css/nhsapp-3.1.0.min.css";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const Error = (props: GlobalErrorProps) => {
  useEffect(() => {
    // TODO: Log the error to an error reporting service
    console.error("Uncaught error occurred", props.error);
  }, [props.error]);

  return <ServiceFailure />;
};

export default Error;
