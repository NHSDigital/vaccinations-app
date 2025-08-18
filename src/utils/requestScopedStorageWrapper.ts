import { extractRootTraceIdFromAmznTraceId } from "@src/utils/logger";
import { RequestContext, asyncLocalStorage } from "@src/utils/requestContext";
import { headers } from "next/headers";
import { JSX } from "react";

async function requestScopedStorageWrapper<A extends unknown[]>(
  wrappedFunction: (...args: A) => Promise<JSX.Element>,
  ...args: A
) {
  const requestHeaders = await headers();
  const traceId =
    extractRootTraceIdFromAmznTraceId(requestHeaders.get("X-Amzn-Trace-Id") ?? "") ?? "undefined-request-id";
  const requestContext: RequestContext = { traceId: traceId };

  return asyncLocalStorage.run(requestContext, () => {
    return wrappedFunction(...args);
  });
}

export { requestScopedStorageWrapper };
