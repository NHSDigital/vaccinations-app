import setSignOutFlagCookie from "@src/utils/auth/setSignOutFlagCookie";
import { SIGNOUT_FLAG_COOKIE_NAME } from "@src/utils/constants";

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
    get: jest.fn(),
    set: setCookie
  })),
  headers: jest.fn()
}));

describe("setSignOutFlagCookie", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should set signout cookie with expiry duration matching the session max age", async () => {
    const expectedCookieTTL = 120;
    const expectedCookieValue = (Math.floor(Date.now() / 1000) + expectedCookieTTL).toString();
    await setSignOutFlagCookie();
    expect(setCookie).toHaveBeenCalledWith(SIGNOUT_FLAG_COOKIE_NAME, expectedCookieValue, {
      maxAge: expectedCookieTTL,
      secure: true,
      httpOnly: true,
      sameSite: "lax"
    });
  });
});
