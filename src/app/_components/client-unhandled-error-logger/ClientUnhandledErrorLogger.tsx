"use client";

import logClientSideError from "@src/utils/client-side-error-logger/client-side-error-logger";
import { ClientSideErrorTypes } from "@src/utils/constants";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

let router;

const reportClientSideUnhandledError = () => {
  logClientSideError(ClientSideErrorTypes.UNHANDLED_ERROR).then(() => {
    router.push('/service-failure');
  }).catch(() => {
    // do not show anything to the user; catching prevents an infinite loop if the logger itself throws an error which is unhandled
  });
};

const reportClientSideUnhandledPromiseRejectionError = () => {
  logClientSideError(ClientSideErrorTypes.UNHANDLED_PROMISE_REJECT_ERROR).then(() => {
    router.push('/service-failure');
  }).catch(() => {
    // do not show anything to the user; catching prevents an infinite loop if the logger itself throws an error which is unhandled
  });
};

const ClientUnhandledErrorLogger = (): undefined => {
  router = useRouter();

  useEffect(() => {
    window.addEventListener("unhandledrejection", reportClientSideUnhandledPromiseRejectionError);
    window.addEventListener("error", reportClientSideUnhandledError);

    // on component unmount
    return () => {
      window.removeEventListener("unhandledrejection", reportClientSideUnhandledPromiseRejectionError);
      window.removeEventListener("error", reportClientSideUnhandledError);
    };
  }, []);
};

export { ClientUnhandledErrorLogger };
