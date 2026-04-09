import setSignOutFlagCookie from "@src/utils/auth/setSignOutFlagCookie";
import { SIGNOUT_FLAG_COOKIE_NAME } from "@src/utils/constants";

const setCookie = jest.fn();
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: setCookie
  })),
  headers: jest.fn()
}));

describe("setSignOutFlagCookie", () => {
  it("should set signout cookie with expiry duration of 5 seconds", async () => {
    const expectedCookieTTL = 5;
    await setSignOutFlagCookie();
    expect(setCookie).toHaveBeenCalledWith(SIGNOUT_FLAG_COOKIE_NAME, "true", {
      maxAge: expectedCookieTTL,
      secure: true,
      httpOnly: true,
      sameSite: "lax"
    });
  });
});
