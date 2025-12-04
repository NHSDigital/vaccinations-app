"use client";

import logClientSideError from "@src/utils/client-side-error-logger/client-side-error-logger";
import { ClientSideErrorTypes } from "@src/utils/constants";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

const ClientUnhandledErrorLogger = (): null => {
  const router = useRouter();

  const reportUnhandledError = useCallback((errorEvent: ErrorEvent) => {
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
  }, [router]);

  const reportPromiseRejectionError = useCallback((promiseRejectionEvent: PromiseRejectionEvent) => {
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
  }, [router]);

  useEffect(() => {
    console.log("mounted");
    window.addEventListener("unhandledrejection", reportPromiseRejectionError);
    window.addEventListener("error", reportUnhandledError);

    // on component unmount
    return () => {
      console.log("unmounted");
      window.removeEventListener("unhandledrejection", reportPromiseRejectionError);
      window.removeEventListener("error", reportUnhandledError);
    };
  }, [reportUnhandledError, reportPromiseRejectionError]);

  return null;
};

export { ClientUnhandledErrorLogger };
