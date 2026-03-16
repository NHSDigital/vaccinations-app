"use client";

import logClientSideError, {
  ClientSideErrorContext,
} from "@src/utils/client-side-logger-server-actions/client-side-error-logger";
import { ClientSideErrorTypes } from "@src/utils/constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

let router;

const reportClientSideUnhandledError = (errorEvent: ErrorEvent) => {
  errorEvent.preventDefault();

  //
  const errorContext: ClientSideErrorContext = {
    message: String(errorEvent.message ?? ""),
    filename: String(errorEvent.filename ?? ""),
    lineno: String(errorEvent.lineno ?? ""),
    colno: String(errorEvent.colno ?? ""),
  };

  logClientSideError(ClientSideErrorTypes.UNHANDLED_ERROR, errorContext)
    .then((logOnClientConsole: boolean) => {
      if (logOnClientConsole) {
        console.log("Unhandled error event", errorEvent);
      }
    })
    .catch(() => {
      // do not show anything to the user; catching prevents an infinite loop if the logger itself throws an error which is unhandled
    });

  router.push("/service-failure");
};

const reportClientSideUnhandledPromiseRejectionError = (promiseRejectionEvent: PromiseRejectionEvent) => {
  promiseRejectionEvent.preventDefault();

  const errorContext: ClientSideErrorContext = {
    message: String(promiseRejectionEvent.reason ?? ""),
    stack: String(promiseRejectionEvent.reason?.stack ?? ""),
  };

  logClientSideError(ClientSideErrorTypes.UNHANDLED_PROMISE_REJECT_ERROR, errorContext)
    .then((logOnClientConsole: boolean) => {
      if (logOnClientConsole) {
        console.log("Unhandled promise rejection event", promiseRejectionEvent);
      }
    })
    .catch(() => {
      // do not show anything to the user; catching prevents an infinite loop if the logger itself throws an error which is unhandled
    });

  router.push("/service-failure");
};

const ClientUnhandledErrorLogger = (): null => {
  router = useRouter();

  useEffect(() => {
    window.addEventListener("unhandledrejection", (event) => reportClientSideUnhandledPromiseRejectionError(event));
    window.addEventListener("error", (event) => reportClientSideUnhandledError(event));

    // on component unmount
    return () => {
      window.removeEventListener("unhandledrejection", (event) =>
        reportClientSideUnhandledPromiseRejectionError(event),
      );
      window.removeEventListener("error", (event) => reportClientSideUnhandledError(event));
    };
  }, []);

  return null;
};

export { ClientUnhandledErrorLogger };
