import setSignOutFlagCookie from "@src/utils/auth/setSignOutFlagCookie";
import { SESSION_ID_COOKIE_NAME, SIGNOUT_FLAG_COOKIE_NAME } from "@src/utils/constants";

const mockSessionId = "session-id-123";
const setCookie = jest.fn();
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/utils/config", () => ({
  __esModule: true,
  default: {
    MAX_SESSION_AGE_MINUTES: Promise.resolve(2),
  },
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    get: jest.fn((name) => {
      if (name === SESSION_ID_COOKIE_NAME) {
        return { value: mockSessionId };
      }
      return undefined;
    }),
    set: setCookie,
  })),
  headers: jest.fn(),
}));

describe("setSignOutFlagCookie", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should set signout cookie with the current session id", async () => {
    await setSignOutFlagCookie();
    const expectedCookieTimeoutSeconds = 30;
    expect(setCookie).toHaveBeenCalledWith(SIGNOUT_FLAG_COOKIE_NAME, mockSessionId, {
      maxAge: expectedCookieTimeoutSeconds,
      secure: true,
      httpOnly: true,
      sameSite: "lax",
    });
  });
});
