/* eslint @typescript-eslint/no-explicit-any: 0 */
import { SESSION_ID_COOKIE_NAME } from "@src/utils/constants";
import { extractRootTraceIdFromAmznTraceId } from "@src/utils/logger";
import { RequestContext, asyncLocalStorage } from "@src/utils/requestContext";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies, headers } from "next/headers";

async function requestScopedStorageWrapper<A extends unknown[]>(
  wrappedFunction: (...args: A) => Promise<any>,
  ...args: A
) {
  const requestHeaders = await headers();
  const requestCookies = await cookies();
  const requestContext = extractRequestContextFromHeadersAndCookies(requestHeaders, requestCookies);

  return asyncLocalStorage.run(requestContext, () => {
    return wrappedFunction(...args);
  });
}

const extractRequestContextFromHeadersAndCookies = (
  requestHeaders: Headers,
  requestCookies: RequestCookies | ReadonlyRequestCookies,
): RequestContext => {
  const traceId =
    extractRootTraceIdFromAmznTraceId(requestHeaders?.get("X-Amzn-Trace-Id") ?? "") ?? "undefined-request-id";
  const nextUrl = requestHeaders?.get("nextUrl") ?? "";
  const sessionId = requestCookies?.get(SESSION_ID_COOKIE_NAME)?.value ?? "unknown-session-id";
  return { traceId: traceId, nextUrl: nextUrl, sessionId: sessionId };
};

export { requestScopedStorageWrapper, extractRequestContextFromHeadersAndCookies };
