import { fetchAPIMAccessTokenForIDToken } from "@src/utils/auth/apim/fetch-apim-access-token";
import { getApimAccessToken, getNewAccessTokenFromApim } from "@src/utils/auth/apim/get-apim-access-token";
import { AccessToken, IdToken } from "@src/utils/auth/types";
import { configProvider } from "@src/utils/config";
import { appConfigBuilder } from "@test-data/config/builders";
import { getToken } from "next-auth/jwt";
import { cookies, headers } from "next/headers";

jest.mock("next/headers", () => ({
  headers: jest.fn(),
  cookies: jest.fn(),
}));

jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(),
}));

jest.mock("@src/utils/config", () => ({
  configProvider: jest.fn(),
}));

jest.mock("@src/utils/auth/apim/fetch-apim-access-token", () => ({
  fetchAPIMAccessTokenForIDToken: jest.fn(),
}));

describe("getApimAccessToken", () => {
  beforeEach(() => {
    const mockConfig = appConfigBuilder().withAUTH_SECRET("test-auth-secret");
    (configProvider as jest.Mock).mockResolvedValue(mockConfig);
  });

  it("should use access token from JWT session when APIM access token populated", async () => {
    (headers as jest.Mock).mockResolvedValue([{}]);
    const mockCookieStore = { getAll: jest.fn().mockReturnValue([{}]) };
    (cookies as jest.Mock).mockReturnValue(mockCookieStore);
    (getToken as jest.Mock).mockResolvedValue({
      apim: {
        access_token: "test-access-token" as AccessToken,
        expires_in: "600000",
        refresh_token_expires_at: "700000",
      },
    });

    const apimAccessToken = await getApimAccessToken();

    expect(apimAccessToken).toEqual("test-access-token" as AccessToken);
  });

  it("should throw error if APIM access token not available on JWT session", async () => {
    (getToken as jest.Mock).mockResolvedValue({ apim: {} });

    await expect(getApimAccessToken()).rejects.toThrow("No APIM access token available");
  });
});

describe("getNewAccessTokenFromApim", () => {
  it("should build ApimAccessCredentials object", async () => {
    // Given
    const idToken = "test-id-token" as IdToken;
    (fetchAPIMAccessTokenForIDToken as jest.Mock).mockResolvedValue({
      access_token: "test-access-token",
      refresh_token: "test-refresh-token",
      expires_in: "60000",
      refresh_token_expires_in: "90000",
    });
    jest.useFakeTimers().setSystemTime(new Date("2025-01-01T12:00:00.000Z"));

    // When
    const actual = await getNewAccessTokenFromApim(idToken);

    // Then
    expect(actual).toEqual({
      accessToken: "test-access-token",
      expiresAt: 1735792800,
      refreshToken: "test-refresh-token",
      refreshTokenExpiresAt: 1735822800,
    });
  });
});
