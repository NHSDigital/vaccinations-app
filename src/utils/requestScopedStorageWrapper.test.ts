import { asyncLocalStorage } from "@src/utils/requestContext";
import { requestScopedStorageWrapper } from "@src/utils/requestScopedStorageWrapper";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies, headers } from "next/headers";

jest.mock("next/headers", () => ({
  headers: jest.fn(),
  cookies: jest.fn(),
}));
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("requestScopedStorageWrapper", () => {
  beforeEach(async () => {
    const fakeHeaders: ReadonlyHeaders = {
      get(name: string): string | null {
        return `Root=fake-${name}-header`;
      },
    } as ReadonlyHeaders;
    (headers as jest.Mock).mockResolvedValue(fakeHeaders);

    const fakeRequestCookies: ReadonlyRequestCookies = {
      get(name: string): RequestCookie | undefined {
        return {
          name: `fake-${name}-name`,
          value: `fake-${name}-value`,
        };
      },
    } as ReadonlyRequestCookies;
    (cookies as jest.Mock).mockResolvedValue(fakeRequestCookies);
  });

  it("should invoke wrapped function", async () => {
    const wrappedFunction = jest.fn();

    await requestScopedStorageWrapper(wrappedFunction);

    expect(wrappedFunction).toHaveBeenCalled();
  });

  it("should store X-Amzn-Trace-Id header without Root prefix in asynclocalstorage available to the wrapped function", async () => {
    const wrappedFunction = jest.fn().mockImplementation(() => {
      return asyncLocalStorage?.getStore()?.traceId;
    });

    const traceIdFromWrappedLocalStorage = await requestScopedStorageWrapper(wrappedFunction);
    expect(traceIdFromWrappedLocalStorage).toEqual("fake-X-Amzn-Trace-Id-header");
  });

  it("should store sessionId header from session-id cookie in asynclocalstorage available to the wrapped function", async () => {
    const wrappedFunction = jest.fn().mockImplementation(() => {
      return asyncLocalStorage?.getStore()?.sessionId;
    });

    const sessionIdFromWrappedLocalStorage = await requestScopedStorageWrapper(wrappedFunction);
    expect(sessionIdFromWrappedLocalStorage).toEqual("fake-__Host-Http-session-id-value");
  });
});
