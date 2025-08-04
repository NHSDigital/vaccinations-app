import { getNewAccessTokenFromApim } from "@src/utils/auth/apim/get-apim-access-token";
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
}));
jest.mock("jwt-decode");

describe("getToken", () => {
  const mockConfig: AppConfig = appConfigBuilder()
    .withNHS_LOGIN_URL("https://mock.nhs.login")
    .andNHS_LOGIN_CLIENT_ID("mock-client-id")
    .andNHS_LOGIN_PRIVATE_KEY("mock-private-key")
    .andIS_APIM_AVAILABLE(true) // TODO VIA-254 - Test with false
    .build();

  const nowInSeconds = 1749052001;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(nowInSeconds * 1000);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should return null and logs error if token is falsy", async () => {
    const result = await getToken(null as unknown as JWT, null, undefined, mockConfig, 300);
    expect(result).toBeNull();
  });

  it("should return updated token on initial login with account profile, and APIM creds", async () => {
    (jwtDecode as jest.Mock).mockReturnValue({
      jti: "jti_test",
    });
    const token = { apim: {}, nhs_login: { id_token: "id-token" } } as JWT;
    (getNewAccessTokenFromApim as jest.Mock).mockResolvedValue({
      accessToken: "test-apim-access-token",
      refreshToken: "test-apim-refresh-token",
      expiresIn: "test-apim-expires-in",
      refreshTokenExpiresIn: "test-apim-refresh-token-expires-in",
    });

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
        access_token: "test-apim-access-token",
        expires_in: "test-apim-expires-in",
        refresh_token: "test-apim-refresh-token",
        refresh_token_expires_in: "test-apim-refresh-token-expires-in",
      },
      fixedExpiry: nowInSeconds + maxAgeInSeconds,
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
        expires_in: "",
        refresh_token: "",
        refresh_token_expires_in: "",
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
        expires_in: "",
        refresh_token: "",
        refresh_token_expires_in: "",
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

  it("should not update apim creds if already present (and not expired)", async () => {
    // Given
    const token = { apim: { access_token: "test-apim-access-token" }, nhs_login: { id_token: "id-token" } } as JWT;

    // When
    const result = await getToken(token, null, undefined, mockConfig, 300);

    // Then
    expect(result?.apim).toMatchObject({ access_token: "test-apim-access-token" });
  });
});
