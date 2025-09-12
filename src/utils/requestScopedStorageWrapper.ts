/* eslint @typescript-eslint/no-explicit-any: 0 */
import { extractRootTraceIdFromAmznTraceId } from "@src/utils/logger";
import { RequestContext, asyncLocalStorage } from "@src/utils/requestContext";
import { headers } from "next/headers";

async function requestScopedStorageWrapper<A extends unknown[]>(
  wrappedFunction: (...args: A) => Promise<any>,
  ...args: A
) {
  const requestHeaders = await headers();
  const requestContext = extractRequestContextFromHeaders(requestHeaders);

  return asyncLocalStorage.run(requestContext, () => {
    return wrappedFunction(...args);
  });
}

const extractRequestContextFromHeaders = (headers: Headers): RequestContext => {
  const traceId = extractRootTraceIdFromAmznTraceId(headers?.get("X-Amzn-Trace-Id") ?? "") ?? "undefined-request-id";
  const nextUrl = headers?.get("nextUrl") ?? "";
  return { traceId: traceId, nextUrl: nextUrl };
};

export { requestScopedStorageWrapper, extractRequestContextFromHeaders };
