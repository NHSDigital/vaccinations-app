import { ApimHttpError } from "@src/utils/auth/apim/exceptions";
import { getOrRefreshApimCredentials } from "@src/utils/auth/apim/get-or-refresh-apim-credentials";
import { getToken } from "@src/utils/auth/callbacks/get-token";
import { MaxAgeInSeconds } from "@src/utils/auth/types";
import { AppConfig } from "@src/utils/config";
import { appConfigBuilder } from "@test-data/config/builders";
import { jwtDecode } from "jwt-decode";
import { Account, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { headers } from "next/headers";

jest.mock("@project/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@src/utils/auth/apim/get-or-refresh-apim-credentials", () => ({
  getOrRefreshApimCredentials: jest.fn(),
}));

jest.mock("next/headers", () => ({
  headers: jest.fn(),
}));
jest.mock("jwt-decode");
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("getToken", () => {
  const mockRandomUUID = "mock-random-uuid";
  let randomUUIDSpy: jest.SpyInstance;

  beforeAll(async () => {
    const fakeHeaders: ReadonlyHeaders = {
      get(name: string): string | null {
        return `fake-${name}-header`;
      },
    } as ReadonlyHeaders;
    (headers as jest.Mock).mockResolvedValue(fakeHeaders);
  });

  const oldNEXT_RUNTIME = process.env.NEXT_RUNTIME;

  const mockConfig: AppConfig = appConfigBuilder()
    .withNHS_LOGIN_URL("https://mock.nhs.login")
    .andNHS_LOGIN_CLIENT_ID("mock-client-id")
    .andNHS_LOGIN_PRIVATE_KEY("mock-private-key")
    .build();

  const nowInSeconds = 1749052001;

  beforeEach(() => {
    randomUUIDSpy = jest.spyOn(global.crypto, "randomUUID").mockReturnValue(mockRandomUUID);

    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(nowInSeconds * 1000);
    process.env.NEXT_RUNTIME = "nodejs";
  });

  afterEach(() => {
    jest.resetAllMocks();
    process.env.NEXT_RUNTIME = oldNEXT_RUNTIME;
  });

  afterAll(() => {
    randomUUIDSpy.mockRestore();
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
      const result = await getToken(null as unknown as JWT, null, undefined, mockConfig, 300 as MaxAgeInSeconds);
      expect(result).toBeNull();
    });

    it("should return updated token on initial login with account profile, and APIM credentials", async () => {
      // Given
      (jwtDecode as jest.Mock).mockReturnValue({
        jti: "jti_test",
      });
      const token = { apim: {}, nhs_login: { id_token: "id-token" } } as JWT;
      const account = {
        expires_at: nowInSeconds + 1000,
        access_token: "newAccess",
        refresh_token: "newRefresh",
        id_token: "newIdToken",
      } as Account;
      const profile = {
        nhs_number: "test_nhs_number",
      };
      const maxAgeInSeconds = 600 as MaxAgeInSeconds;

      // When
      const result = await getToken(token, account, profile, mockConfig, maxAgeInSeconds);

      // Then
      expect(result).toMatchObject({
        user: {
          nhs_number: profile.nhs_number,
        },
        nhs_login: {
          id_token: "newIdToken",
        },
        apim: {
          access_token: "new-apim-access-token",
          expires_at: nowInSeconds + 1111,
        },
        sessionId: mockRandomUUID,
        fixedExpiry: nowInSeconds + maxAgeInSeconds,
      });
    });

    // todo: check the apim assertion still holds
    it("should return token with empty values on initial login if account and profile are undefined", async () => {
      const token = {} as JWT;

      const account = {} as Account;

      const profile = {} as Profile;

      const maxAgeInSeconds = 600 as MaxAgeInSeconds;

      (getOrRefreshApimCredentials as jest.Mock).mockResolvedValue(undefined);

      const result = await getToken(token, account, profile, mockConfig, maxAgeInSeconds);

      expect(result).toMatchObject({
        user: {
          nhs_number: "",
        },
        nhs_login: {
          id_token: "",
        },
        apim: {
          access_token: "",
          expires_at: 0,
        },
        sessionId: mockRandomUUID,
        fixedExpiry: nowInSeconds + maxAgeInSeconds,
      });
    });

    it("should fill in missing values in token with default empty string", async () => {
      const token = {
        user: {},
        nhs_login: {},
        apim: {},
      } as JWT;

      (getOrRefreshApimCredentials as jest.Mock).mockResolvedValue(undefined);

      const result = await getToken(token, null, undefined, mockConfig, 300 as MaxAgeInSeconds);

      expect(result).toMatchObject({
        user: {
          nhs_number: "",
        },
        nhs_login: {
          id_token: "",
        },
        apim: {
          access_token: "",
          expires_at: 0,
        },
        sessionId: "",
      });
    });

    it("should return null if fixedExpiry reached", async () => {
      const token = {
        fixedExpiry: nowInSeconds - 1,
        user: {},
      } as JWT;

      const result = await getToken(token, null, undefined, mockConfig, 300 as MaxAgeInSeconds);

      expect(result).toBeNull();
    });

    it("should still return login token even if fetching APIM credentials fails", async () => {
      (getOrRefreshApimCredentials as jest.Mock).mockRejectedValue(new ApimHttpError("Error getting APIM token"));

      (jwtDecode as jest.Mock).mockReturnValue({
        jti: "jti_test",
      });
      const token = { apim: {}, nhs_login: { id_token: "id-token" } } as JWT;

      const account = {
        expires_at: nowInSeconds + 1000,
        access_token: "newAccess",
        refresh_token: "newRefresh",
        id_token: "newIdToken",
      } as Account;

      const profile = {
        nhs_number: "test_nhs_number",
      };

      const maxAgeInSeconds = 600 as MaxAgeInSeconds;

      const result = await getToken(token, account, profile, mockConfig, maxAgeInSeconds);

      expect(result).toMatchObject({
        user: {
          nhs_number: profile.nhs_number,
        },
        nhs_login: {
          id_token: "newIdToken",
        },
        apim: {
          access_token: "",
          expires_at: 0,
        },
        sessionId: mockRandomUUID,
        fixedExpiry: nowInSeconds + maxAgeInSeconds,
      });
    });
  });

  describe("when AUTH APIM is not available", () => {
    beforeEach(() => {
      (getOrRefreshApimCredentials as jest.Mock).mockResolvedValue(undefined);
    });

    it("should return updated token on initial login with account profile, and default empty APIM credentials", async () => {
      (jwtDecode as jest.Mock).mockReturnValue({
        jti: "jti_test",
      });
      const token = { apim: {}, nhs_login: { id_token: "id-token" } } as JWT;

      const account = {
        expires_at: nowInSeconds + 1000,
        access_token: "newAccess",
        refresh_token: "newRefresh",
        id_token: "newIdToken",
      } as Account;

      const profile = {
        nhs_number: "test_nhs_number",
      };

      const maxAgeInSeconds = 600 as MaxAgeInSeconds;

      const result = await getToken(token, account, profile, mockConfig, maxAgeInSeconds);

      expect(result).toMatchObject({
        user: {
          nhs_number: profile.nhs_number,
        },
        nhs_login: {
          id_token: "newIdToken",
        },
        apim: {
          access_token: "",
          expires_at: 0,
        },
        sessionId: mockRandomUUID,
        fixedExpiry: nowInSeconds + maxAgeInSeconds,
      });
    });
  });
});
