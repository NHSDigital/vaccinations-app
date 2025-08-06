import { getNewAccessTokenFromApim, getRefreshedAccessTokenFromApim } from "@src/utils/auth/apim/get-apim-access-token";
import { getToken } from "@src/utils/auth/callbacks/get-token";
import { AppConfig } from "@src/utils/config";
import { appConfigBuilder } from "@test-data/config/builders";
import { jwtDecode } from "jwt-decode";
import { Account, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";

jest.mock("@project/auth", () => ({
  auth: jest.fn(),
}));
jest.mock("@src/utils/auth/apim/get-apim-access-token", () => ({
  getNewAccessTokenFromApim: jest.fn(),
  getRefreshedAccessTokenFromApim: jest.fn(),
}));
jest.mock("jwt-decode");

describe("getToken", () => {
  describe("when AUTH APIM is available", () => {
    const oldNEXT_RUNTIME = process.env.NEXT_RUNTIME;

    const mockConfig: AppConfig = appConfigBuilder()
      .withNHS_LOGIN_URL("https://mock.nhs.login")
      .andNHS_LOGIN_CLIENT_ID("mock-client-id")
      .andNHS_LOGIN_PRIVATE_KEY("mock-private-key")
      .andIS_APIM_AUTH_ENABLED(true)
      .build();

    const nowInSeconds = 1749052001;

    beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers().setSystemTime(nowInSeconds * 1000);
      process.env.NEXT_RUNTIME = "nodejs";
    });

    beforeEach(async () => {
      (getNewAccessTokenFromApim as jest.Mock).mockResolvedValue({
        accessToken: "new-apim-access-token",
        refreshToken: "new-apim-refresh-token",
        expiresAt: nowInSeconds + 1111,
        refreshTokenExpiresAt: nowInSeconds + 2222,
      });
      (getRefreshedAccessTokenFromApim as jest.Mock).mockResolvedValue({
        accessToken: "refreshed-apim-access-token",
        refreshToken: "refreshed-apim-refresh-token",
        expiresAt: nowInSeconds + 3333,
        refreshTokenExpiresAt: nowInSeconds + 4444,
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
      process.env.NEXT_RUNTIME = oldNEXT_RUNTIME;
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should return null and logs error if token is falsy", async () => {
      const result = await getToken(null as unknown as JWT, null, undefined, mockConfig, 300);
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
        birthdate: "test_birthdate",
      };
      const maxAgeInSeconds = 600;

      // When
      const result = await getToken(token, account, profile, mockConfig, maxAgeInSeconds);

      // Then
      expect(result).toMatchObject({
        user: {
          nhs_number: profile.nhs_number,
          birthdate: profile.birthdate,
        },
        nhs_login: {
          id_token: "newIdToken",
        },
        apim: {
          access_token: "new-apim-access-token",
          expires_at: nowInSeconds + 1111,
          refresh_token: "new-apim-refresh-token",
          refresh_token_expires_at: nowInSeconds + 2222,
        },
        fixedExpiry: nowInSeconds + maxAgeInSeconds,
      });
    });

    it("should return stored APIM creds if fresh", async () => {
      // Given
      const token = {
        apim: {
          access_token: "old-access-token",
          expires_at: nowInSeconds + 60,
          refresh_token: "old-refresh-token",
          refresh_token_expires_at: nowInSeconds + 60,
        },
        nhs_login: { id_token: "old-id-token" },
      } as JWT;
      const account = {
        expires_at: nowInSeconds + 1000,
        access_token: "newAccess",
        refresh_token: "newRefresh",
        id_token: "newIdToken",
      } as Account;
      const profile = {
        nhs_number: "test_nhs_number",
        birthdate: "test_birthdate",
      };
      const maxAgeInSeconds = 600;

      // When
      const result = await getToken(token, account, profile, mockConfig, maxAgeInSeconds);

      // Then
      expect(result?.apim).toEqual({
        access_token: "old-access-token",
        expires_at: nowInSeconds + 60,
        refresh_token: "old-refresh-token",
        refresh_token_expires_at: nowInSeconds + 60,
      });
    });

    it("should return refreshed APIM creds if expired", async () => {
      // Given
      const token = {
        apim: { access_token: "old-access-token", expires_at: nowInSeconds - 60 },
        nhs_login: { id_token: "id-token" },
      } as JWT;
      const account = {
        expires_at: nowInSeconds + 1000,
        access_token: "newAccess",
        refresh_token: "newRefresh",
        id_token: "newIdToken",
      } as Account;
      const profile = {
        nhs_number: "test_nhs_number",
        birthdate: "test_birthdate",
      };
      const maxAgeInSeconds = 600;

      // When
      const result = await getToken(token, account, profile, mockConfig, maxAgeInSeconds);

      // Then
      expect(result?.apim).toEqual({
        access_token: "refreshed-apim-access-token",
        expires_at: nowInSeconds + 3333,
        refresh_token: "refreshed-apim-refresh-token",
        refresh_token_expires_at: nowInSeconds + 4444,
      });
    });

    it("should return token with empty values on initial login if account and profile are undefined", async () => {
      const token = {} as JWT;

      const account = {} as Account;

      const profile = {} as Profile;

      const maxAgeInSeconds = 600;

      const result = await getToken(token, account, profile, mockConfig, maxAgeInSeconds);

      expect(result).toMatchObject({
        user: {
          nhs_number: "",
          birthdate: "",
        },
        nhs_login: {
          id_token: "",
        },
        apim: {
          access_token: "",
          expires_at: 0,
          refresh_token: "",
          refresh_token_expires_at: 0,
        },
        fixedExpiry: nowInSeconds + maxAgeInSeconds,
      });
    });

    it("should fill in missing values in token with default empty string", async () => {
      const token = {
        user: {},
        nhs_login: {},
        apim: {},
      } as JWT;

      const result = await getToken(token, null, undefined, mockConfig, 300);

      expect(result).toMatchObject({
        user: {
          nhs_number: "",
          birthdate: "",
        },
        nhs_login: {
          id_token: "",
        },
        apim: {
          access_token: "",
          expires_at: 0,
          refresh_token: "",
          refresh_token_expires_at: 0,
        },
      });
    });

    it("should return null if fixedExpiry reached", async () => {
      const token = {
        fixedExpiry: nowInSeconds - 1,
        user: {},
      } as JWT;

      const result = await getToken(token, null, undefined, mockConfig, 300);

      expect(result).toBeNull();
    });

    it("should not update apim credentials if already present (and not expired)", async () => {
      // Given
      const token = { apim: { access_token: "test-apim-access-token" }, nhs_login: { id_token: "id-token" } } as JWT;

      // When
      const result = await getToken(token, null, undefined, mockConfig, 300);

      // Then
      expect(result?.apim).toMatchObject({ access_token: "test-apim-access-token" });
    });
  });

  describe("when AUTH APIM is not available", () => {
    const mockConfig: AppConfig = appConfigBuilder()
      .withNHS_LOGIN_URL("https://mock.nhs.login")
      .andNHS_LOGIN_CLIENT_ID("mock-client-id")
      .andNHS_LOGIN_PRIVATE_KEY("mock-private-key")
      .andIS_APIM_AUTH_ENABLED(false)
      .build();

    const nowInSeconds = 1749052001;

    beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers().setSystemTime(nowInSeconds * 1000);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should return updated token on initial login with account profile, and APIM credentials", async () => {
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
        birthdate: "test_birthdate",
      };

      const maxAgeInSeconds = 600;

      const result = await getToken(token, account, profile, mockConfig, maxAgeInSeconds);

      expect(result).toMatchObject({
        user: {
          nhs_number: profile.nhs_number,
          birthdate: profile.birthdate,
        },
        nhs_login: {
          id_token: "newIdToken",
        },
        apim: {
          access_token: "",
          expires_at: 0,
          refresh_token: "",
          refresh_token_expires_at: 0,
        },
        fixedExpiry: nowInSeconds + maxAgeInSeconds,
      });
    });
  });
});
