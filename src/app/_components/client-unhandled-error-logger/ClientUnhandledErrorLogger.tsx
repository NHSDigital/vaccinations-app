"use client";

import logClientSideError from "@src/utils/client-side-error-logger/client-side-error-logger";
import { ClientSideErrorTypes } from "@src/utils/constants";
import { useEffect } from "react";

const reportClientSideError = () => {
  logClientSideError(ClientSideErrorTypes.UNHANDLED_ERROR).catch(() => {
    // do not show anything to the user; catching prevents an infinite loop if the logger itself throws an error which is unhandled
  });
};

const ClientUnhandledErrorLogger = (): undefined => {
  useEffect(() => {
    window.addEventListener("unhandledrejection", reportClientSideError);

    // on component unmount
    return () => {
      window.removeEventListener("unhandledrejection", reportClientSideError);
    };
  }, []);
};

export { ClientUnhandledErrorLogger };
