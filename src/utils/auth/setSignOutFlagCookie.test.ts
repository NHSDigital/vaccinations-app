import setSignOutFlagCookie from "@src/utils/auth/setSignOutFlagCookie";
import { SESSION_ID_COOKIE_NAME, SIGNOUT_FLAG_COOKIE_NAME } from "@src/utils/constants";

const mockSessionId = "session-id-123";
const setCookie = jest.fn();

jest.mock("@src/utils/requestScopedStorageWrapper", () => ({
  requestScopedStorageWrapper: jest.fn((fn) => fn()),
}));
jest.mock("@src/utils/config", () => ({
  __esModule: true,
  default: {
    MAX_SESSION_AGE_MINUTES: Promise.resolve(2),
  },
}));
jest.mock("@src/utils/logger", () => ({
  mockWarn: jest.fn(),
  logger: {
    child: jest.fn(() => {
      const mockedLoggerModule = jest.requireMock("@src/utils/logger") as { mockWarn: jest.Mock };
      return { warn: mockedLoggerModule.mockWarn };
    }),
  },
}));

let mockGetCookie = (name: string) => {
  if (name === SESSION_ID_COOKIE_NAME) {
    return { value: mockSessionId };
  }
  return undefined;
};

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    get: jest.fn((name) => mockGetCookie(name)),
    set: setCookie,
  })),
  headers: jest.fn(),
}));

describe("setSignOutFlagCookie", () => {
  const getLoggerWarnMock = (): jest.Mock => {
    const mockedLoggerModule = jest.requireMock("@src/utils/logger") as { mockWarn: jest.Mock };
    return mockedLoggerModule.mockWarn;
  };

  it("should set signout cookie with the current session id", async () => {
    mockGetCookie = (name: string) => {
      if (name === SESSION_ID_COOKIE_NAME) {
        return { value: mockSessionId };
      }
      return undefined;
    };
    setCookie.mockClear();
    await setSignOutFlagCookie();
    const expectedCookieTimeoutSeconds = 30;
    expect(setCookie).toHaveBeenCalledWith(SIGNOUT_FLAG_COOKIE_NAME, mockSessionId, {
      maxAge: expectedCookieTimeoutSeconds,
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  });

  it("should not set signout cookie if session id is missing", async () => {
    mockGetCookie = () => {
      return undefined;
    };
    setCookie.mockClear();
    const warnMock = getLoggerWarnMock();
    warnMock.mockClear();

    await setSignOutFlagCookie();

    expect(setCookie).not.toHaveBeenCalled();
    expect(warnMock).toHaveBeenCalledWith("Session ID missing, skipping signout cookie");
  });
});
