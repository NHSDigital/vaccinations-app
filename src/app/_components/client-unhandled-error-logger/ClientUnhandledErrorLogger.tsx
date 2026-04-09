"use client";

import logClientSideError from "@src/utils/client-side-logger-server-actions/client-side-error-logger";
import { ClientSideErrorTypes } from "@src/utils/constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ClientUnhandledErrorLogger = (): null => {
  const router = useRouter();

  useEffect(() => {
    const reportClientSideUnhandledError = (errorEvent: ErrorEvent) => {
      errorEvent.preventDefault();

      logClientSideError(ClientSideErrorTypes.UNHANDLED_ERROR)
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

      logClientSideError(ClientSideErrorTypes.UNHANDLED_PROMISE_REJECT_ERROR)
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

    window.addEventListener("unhandledrejection", reportClientSideUnhandledPromiseRejectionError);
    window.addEventListener("error", reportClientSideUnhandledError);

    // on component unmount
    return () => {
      window.removeEventListener("unhandledrejection", reportClientSideUnhandledPromiseRejectionError);
      window.removeEventListener("error", reportClientSideUnhandledError);
    };
  }, [router]);

  return null;
};

export { ClientUnhandledErrorLogger };
