"use client";

import logClientSideError from "@src/utils/client-side-error-logger/client-side-error-logger";
import { ClientSideErrorTypes } from "@src/utils/constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const supressConsole = (process.env.NEXT_PUBLIC_SUPRESS_CONSOLE ?? "true") !== "false";
let router;

const reportClientSideUnhandledError = (errorEvent: ErrorEvent) => {
  if (supressConsole) errorEvent.preventDefault();

  logClientSideError(ClientSideErrorTypes.UNHANDLED_ERROR).catch((err: Error) => {
    if (!supressConsole) console.error(err.message);
    // do not show anything to the user; catching prevents an infinite loop if the logger itself throws an error which is unhandled
  });
  router.push("/service-failure");
};

const reportClientSideUnhandledPromiseRejectionError = () => {
  logClientSideError(ClientSideErrorTypes.UNHANDLED_PROMISE_REJECT_ERROR).catch((err: Error) => {
    if (!supressConsole) console.error(err.message);
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
