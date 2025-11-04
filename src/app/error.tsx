"use client";

import ServiceFailure from "@src/app/service-failure/page";
import logClientSideError from "@src/utils/client-side-error-logger/client-side-error-logger";
import { ClientSideErrorTypes } from "@src/utils/constants";
import "nhsapp-frontend/dist/nhsapp/all.scss";
import React, { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
}

const UncaughtError = (props: GlobalErrorProps) => {
  useEffect(() => {
    logClientSideError(ClientSideErrorTypes.UNHANDLED_ERROR_DURING_RENDER)
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
