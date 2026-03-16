"use client";

import ServiceFailure from "@src/app/service-failure/page";
import logClientSideError, {
  ClientSideErrorContext,
} from "@src/utils/client-side-logger-server-actions/client-side-error-logger";
import { ClientSideErrorTypes } from "@src/utils/constants";
import "nhsapp-frontend/dist/nhsapp/all.scss";
import React, { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
}

const UncaughtError = (props: GlobalErrorProps) => {
  useEffect(() => {
    const errorContext: ClientSideErrorContext = {
      message: String(props.error.message ?? ""),
      stack: String(props.error.stack ?? ""),
      digest: String(props.error?.digest ?? ""),
    };

    logClientSideError(ClientSideErrorTypes.UNHANDLED_ERROR_DURING_RENDER, errorContext)
      .then((logOnClientConsole: boolean) => {
        if (logOnClientConsole) {
          console.log("From error component", props.error);
        }
      })
      .catch(() => {
        // do not show anything to the user; catching prevents an infinite loop if the logger itself throws an error which is unhandled
      });
  }, [props.error]);

  return <ServiceFailure />;
};

export default UncaughtError;
