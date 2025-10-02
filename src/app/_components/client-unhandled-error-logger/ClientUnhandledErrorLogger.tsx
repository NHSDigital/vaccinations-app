"use client";

import logClientSideError from "@src/utils/client-side-error-logger/client-side-error-logger";
import { ClientSideErrorTypes } from "@src/utils/constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

let router;

const reportClientSideUnhandledError = (errorEvent: ErrorEvent) => {
  errorEvent.preventDefault();
  logClientSideError(ClientSideErrorTypes.UNHANDLED_ERROR).catch(() => {
    // do not show anything to the user; catching prevents an infinite loop if the logger itself throws an error which is unhandled
  });
  router.push("/service-failure");
};

const reportClientSideUnhandledPromiseRejectionError = () => {
  logClientSideError(ClientSideErrorTypes.UNHANDLED_PROMISE_REJECT_ERROR).catch(() => {
    // do not show anything to the user; catching prevents an infinite loop if the logger itself throws an error which is unhandled
  });
  router.push("/service-failure");
};

const ClientUnhandledErrorLogger = (): undefined => {
  router = useRouter();

  useEffect(() => {
    window.addEventListener("unhandledrejection", reportClientSideUnhandledPromiseRejectionError);
    window.addEventListener("error", (event: ErrorEvent) => reportClientSideUnhandledError(event));

    // on component unmount
    return () => {
      window.removeEventListener("unhandledrejection", reportClientSideUnhandledPromiseRejectionError);
      window.removeEventListener("error", (event: ErrorEvent) => reportClientSideUnhandledError(event));
    };
  }, []);
};

export { ClientUnhandledErrorLogger };
