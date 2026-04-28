import { AgeGroup } from "@src/models/ageBasedHub";
import { ApimHttpError } from "@src/utils/auth/apim/exceptions";
import { getOrRefreshApimCredentials } from "@src/utils/auth/apim/get-or-refresh-apim-credentials";
import { getToken } from "@src/utils/auth/callbacks/get-token";
import { MaxAgeInSeconds } from "@src/utils/auth/types";
import config from "@src/utils/config";
import { SESSION_ID_COOKIE_NAME, SIGNOUT_FLAG_COOKIE_NAME } from "@src/utils/constants";
import { ConfigMock, configBuilder } from "@test-data/config/builders";
import { jwtDecode } from "jwt-decode";
import { Account, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";

jest.mock("@project/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@src/utils/auth/apim/get-or-refresh-apim-credentials", () => ({
  getOrRefreshApimCredentials: jest.fn(),
}));

jest.mock("jwt-decode");
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/utils/config");
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
  headers: jest.fn(),
}));

describe("getToken", () => {
  const mockedConfig = config as ConfigMock;

  beforeAll(async () => {
    const defaultConfig = configBuilder()
      .withNhsLoginUrl(new URL("https://nhs-app-redirect-login-url"))
      .andNhsLoginClientId("mock-client-id")
      .andNhsLoginPrivateKey("mock-private-key")
      .build();
    Object.assign(mockedConfig, defaultConfig);
  });

  const oldNEXT_RUNTIME = process.env.NEXT_RUNTIME;

  const nowInSeconds = 1749052001;

  const profile: Profile = {
    nhs_number: "test_nhs_number",
    birthdate: "1994-08-04",
  };
  const expectedAgeGroupForBirthdate = AgeGroup.AGE_25_to_64;

  const account = {
    expires_at: nowInSeconds + 1000,
    access_token: "newAccess",
    refresh_token: "newRefresh",
    id_token: "newIdToken",
  } as Account;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(nowInSeconds * 1000);
    process.env.NEXT_RUNTIME = "nodejs";

    const fakeRequestCookies: ReadonlyRequestCookies = {
      get(name: string): RequestCookie {
        return {
          name: `fake-${name}-name`,
          value: `fake-${name}-value`,
        };
      },
    } as ReadonlyRequestCookies;
    (cookies as jest.Mock).mockResolvedValue(fakeRequestCookies);

    (jwtDecode as jest.Mock).mockReturnValue({
      jti: "jti_test",
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    process.env.NEXT_RUNTIME = oldNEXT_RUNTIME;
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("when AUTH APIM is available", () => {
    beforeEach(async () => {
      (getOrRefreshApimCredentials as jest.Mock).mockResolvedValue({
        accessToken: "new-apim-access-token",
        expiresAt: nowInSeconds + 1111,
      });
    });

    it("should return null and logs error if token is falsy", async () => {
      const result = await getToken(null as unknown as JWT, null, undefined, 300 as MaxAgeInSeconds);
      expect(result).toBeNull();
    });

    it("should return updated token on initial login with account profile, and APIM credentials", async () => {
      const token = { apim: {}, nhs_login: { id_token: "id-token" } } as JWT;
      const maxAgeInSeconds = 600 as MaxAgeInSeconds;

      // When
      const result = await getToken(token, account, profile, maxAgeInSeconds);

      expectResultToMatchTokenWith(
        result,
        profile.nhs_number,
        profile.birthdate,
        expectedAgeGroupForBirthdate,
        "newIdToken",
        "new-apim-access-token",
        nowInSeconds + 1111,
        maxAgeInSeconds,
      );
    });

    it("should return token with empty values on initial login if account and profile are undefined", async () => {
      const undefinedToken = {} as JWT;
      const undefinedAccount = {} as Account;
      const undefinedProfile = {} as Profile;
      const maxAgeInSeconds = 600 as MaxAgeInSeconds;
      (getOrRefreshApimCredentials as jest.Mock).mockResolvedValue(undefined);

      const result = await getToken(undefinedToken, undefinedAccount, undefinedProfile, maxAgeInSeconds);

      expectResultToMatchTokenWith(result, "", "", AgeGroup.UNKNOWN_AGE_GROUP, "", "", 0, maxAgeInSeconds);
    });

    it("should fill in missing values in token with default empty string", async () => {
      const token = {
        user: {},
        nhs_login: {},
        apim: {},
      } as JWT;

      (getOrRefreshApimCredentials as jest.Mock).mockResolvedValue(undefined);

      const result = await getToken(token, null, undefined, 300 as MaxAgeInSeconds);

      expect(result).toMatchObject({
        user: {
          nhs_number: "",
          birthdate: "",
          age_group: AgeGroup.UNKNOWN_AGE_GROUP,
        },
        nhs_login: {
          id_token: "",
        },
        apim: {
          access_token: "",
          expires_at: 0,
        },
      });
    });

    it("should return null if fixedExpiry reached", async () => {
      const token = {
        fixedExpiry: nowInSeconds - 1,
        user: {},
      } as JWT;

      const result = await getToken(token, null, undefined, 300 as MaxAgeInSeconds);

      expect(result).toBeNull();
    });

    it("should still return login token even if fetching APIM credentials fails", async () => {
      (getOrRefreshApimCredentials as jest.Mock).mockRejectedValue(new ApimHttpError("Error getting APIM token"));

      const token = { apim: {}, nhs_login: { id_token: "id-token" } } as JWT;

      const maxAgeInSeconds = 600 as MaxAgeInSeconds;

      const result = await getToken(token, account, profile, maxAgeInSeconds);

      expectResultToMatchTokenWith(
        result,
        profile.nhs_number,
        profile.birthdate,
        expectedAgeGroupForBirthdate,
        "newIdToken",
        "",
        0,
        maxAgeInSeconds,
      );
    });

    it.each<{
      signoutCookieValue: string;
      sessionIdCookieValue: string;
      shouldBeNull: boolean;
      description: string;
    }>([
      {
        signoutCookieValue: "test-session-id",
        sessionIdCookieValue: "test-session-id",
        shouldBeNull: true,
        description: "should return null when signout cookie matches current session id",
      },
      {
        signoutCookieValue: "old-session-id",
        sessionIdCookieValue: "current-session-id",
        shouldBeNull: false,
        description: "should return token when signout cookie does not match current session id",
      },
    ])("$description", async ({ signoutCookieValue, sessionIdCookieValue, shouldBeNull }) => {
      const fakeRequestCookies: ReadonlyRequestCookies = {
        get(name: string): RequestCookie | undefined {
          if (name === SIGNOUT_FLAG_COOKIE_NAME) return { name: SIGNOUT_FLAG_COOKIE_NAME, value: signoutCookieValue };
          if (name === SESSION_ID_COOKIE_NAME) return { name: SESSION_ID_COOKIE_NAME, value: sessionIdCookieValue };
          return { name: `fake-${name}-name`, value: `fake-${name}-value` };
        },
      } as ReadonlyRequestCookies;
      (cookies as jest.Mock).mockResolvedValue(fakeRequestCookies);

      const token = { apim: {}, nhs_login: { id_token: "id-token" } } as JWT;
      const maxAgeInSeconds = 600 as MaxAgeInSeconds;

      const result = await getToken(token, account, profile, maxAgeInSeconds);

      expect(result === null).toBe(shouldBeNull);
    });
  });

  describe("when AUTH APIM is not available", () => {
    beforeEach(() => {
      (getOrRefreshApimCredentials as jest.Mock).mockResolvedValue(undefined);
    });

    it("should return updated token on initial login with account profile, and default empty APIM credentials", async () => {
      const token = { apim: {}, nhs_login: { id_token: "id-token" } } as JWT;

      const maxAgeInSeconds = 600 as MaxAgeInSeconds;

      const result = await getToken(token, account, profile, maxAgeInSeconds);

      expectResultToMatchTokenWith(
        result,
        profile.nhs_number,
        profile.birthdate,
        expectedAgeGroupForBirthdate,
        "newIdToken",
        "",
        0,
        maxAgeInSeconds,
      );
    });

    it("should return null when signout cookie matches current session id", async () => {
      const mockSessionId = "test-session-id";
      const fakeRequestCookies: ReadonlyRequestCookies = {
        get(name: string): RequestCookie | undefined {
          if (name === SIGNOUT_FLAG_COOKIE_NAME) return { name: SIGNOUT_FLAG_COOKIE_NAME, value: mockSessionId };
          if (name === SESSION_ID_COOKIE_NAME) return { name: SESSION_ID_COOKIE_NAME, value: mockSessionId };
          return { name: `fake-${name}-name`, value: `fake-${name}-value` };
        },
      } as ReadonlyRequestCookies;
      (cookies as jest.Mock).mockResolvedValue(fakeRequestCookies);

      const token = { apim: {}, nhs_login: { id_token: "id-token" } } as JWT;
      const maxAgeInSeconds = 600 as MaxAgeInSeconds;

      const result = await getToken(token, account, profile, maxAgeInSeconds);

      expect(result).toBeNull();
    });
  });

  const expectResultToMatchTokenWith = (
    result: JWT | null,
    nhsNumber: string,
    birthdate: string | null | undefined,
    ageGroup: AgeGroup,
    idToken: string,
    apimToken: string,
    apimExpiresAt: number,
    maxAgeInSeconds: number,
  ) => {
    expect(result).not.toBeNull();
    expect(result).toMatchObject({
      user: {
        nhs_number: nhsNumber,
        birthdate: birthdate,
        age_group: ageGroup,
      },
      nhs_login: {
        id_token: idToken,
      },
      apim: {
        access_token: apimToken,
        expires_at: apimExpiresAt,
      },
      fixedExpiry: nowInSeconds + maxAgeInSeconds,
    });
  };
});
