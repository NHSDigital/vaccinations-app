import setSignOutFlagCookie from "@src/utils/auth/setSignOutFlagCookie";
import { SESSION_ID_COOKIE_NAME, SIGNOUT_FLAG_COOKIE_NAME } from "@src/utils/constants";

const mockSetCookie = jest.fn();
const mockGetCookie = jest.fn();

jest.mock("@src/utils/requestScopedStorageWrapper", () => ({
  requestScopedStorageWrapper: jest.fn((fn) => fn()),
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

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    get: mockGetCookie,
    set: mockSetCookie,
  })),
  headers: jest.fn(),
}));

describe("setSignOutFlagCookie", () => {
  const mockSessionId = "session-id-123";
  const getLoggerWarnMock = (): jest.Mock => {
    const mockedLoggerModule = jest.requireMock("@src/utils/logger") as { mockWarn: jest.Mock };
    return mockedLoggerModule.mockWarn;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCookie.mockImplementation((name: string) => {
      if (name === SESSION_ID_COOKIE_NAME) return { value: mockSessionId };
      return undefined;
    });
  });

  it("should set signout cookie with the current session id", async () => {
    await setSignOutFlagCookie();

    const expectedCookieTimeoutSeconds = 30;
    expect(mockSetCookie).toHaveBeenCalledWith(SIGNOUT_FLAG_COOKIE_NAME, mockSessionId, {
      maxAge: expectedCookieTimeoutSeconds,
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  });

  it("should not set signout cookie if session id is missing", async () => {
    mockGetCookie.mockReturnValue(undefined);

    await setSignOutFlagCookie();

    expect(mockSetCookie).not.toHaveBeenCalled();
    const warnMock = getLoggerWarnMock();
    expect(warnMock).toHaveBeenCalledWith("Session ID missing, skipping signout cookie");
  });
});
