import { asyncLocalStorage } from "@src/utils/requestContext";
import { requestScopedStorageWrapper } from "@src/utils/requestScopedStorageWrapper";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { headers } from "next/headers";

jest.mock("next/headers", () => ({
  headers: jest.fn(),
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
  });

  it("should invoke wrapped function", async () => {
    const wrappedFunction = jest.fn();

    await requestScopedStorageWrapper(wrappedFunction);

    expect(wrappedFunction).toHaveBeenCalled();
  });

  it("should store X-Amzn-Trace-Id header in asynclocalstorage available to the wrapped function", async () => {
    const wrappedFunction = jest.fn().mockImplementation(() => {
      return asyncLocalStorage?.getStore()?.traceId;
    });

    const traceIdFromWrappedLocalStorage = await requestScopedStorageWrapper(wrappedFunction);
    expect(traceIdFromWrappedLocalStorage).toEqual("fake-X-Amzn-Trace-Id-header");
  });
});
