import { extractRootTraceIdFromAmznTraceId } from "@src/utils/logger";
import { RequestContext, asyncLocalStorage } from "@src/utils/requestContext";
import { headers } from "next/headers";
import { ReactNode } from "react";

const requestScopedStorageWrapper = async (wrappedFunction: () => Promise<ReactNode>) => {
  const requestHeaders = await headers();
  const traceId =
    extractRootTraceIdFromAmznTraceId(requestHeaders.get("X-Amzn-Trace-Id") ?? "") ?? "undefined-request-id";
  // TODO VIA-390 local testing only
  // const traceId = requestHeaders.get("x-forwarded-proto") ?? "undefined-request-id";
  const requestContext: RequestContext = { traceId: traceId };

  return asyncLocalStorage.run(requestContext, () => {
    return wrappedFunction();
  });
};

export { requestScopedStorageWrapper };
