import { fetchAPIMAccessToken } from "@src/utils/auth/apim/fetch-apim-access-token";
import { getApimAccessToken, retrieveApimCredentials } from "@src/utils/auth/apim/get-apim-access-token";
import { _getOrRefreshApimCredentials } from "@src/utils/auth/apim/get-or-refresh-apim-credentials";
import { getJwtToken } from "@src/utils/auth/get-jwt-token";
import { AccessToken, IdToken } from "@src/utils/auth/types";
import { AppConfig } from "@src/utils/config";
import { appConfigBuilder } from "@test-data/config/builders";

jest.mock("@src/utils/auth/get-jwt-token", () => ({
  getJwtToken: jest.fn(),
}));

jest.mock("@src/utils/auth/apim/fetch-apim-access-token", () => ({
  fetchAPIMAccessToken: jest.fn(),
}));
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

jest.mock("@src/utils/auth/apim/get-or-refresh-apim-credentials", () => ({
  _getOrRefreshApimCredentials: jest.fn(),
}));

const mockConfig: AppConfig = appConfigBuilder().build();
const nowInSeconds = 1000;

const apimAccessTokenFromJwt = "test-access-token" as AccessToken;
const mockJwtToken = {
  apim: {
    access_token: apimAccessTokenFromJwt,
    expires_in: "600000",
    refresh_token_expires_at: "700000",
  },
};

describe("getApimAccessToken", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(nowInSeconds * 1000);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should pass JWT token to getOrRefresh method and return what it returns", async () => {
    const getOrRefreshedApimAccessToken = "apim-access-token";
    (_getOrRefreshApimCredentials as jest.Mock).mockResolvedValue({
      accessToken: getOrRefreshedApimAccessToken,
      expiresAt: nowInSeconds + 1111,
    });

    (getJwtToken as jest.Mock).mockResolvedValue(mockJwtToken);

    const apimAccessToken = await getApimAccessToken(mockConfig);

    expect(_getOrRefreshApimCredentials).toHaveBeenCalledWith(mockConfig, mockJwtToken, nowInSeconds);
    expect(apimAccessToken).toEqual(getOrRefreshedApimAccessToken as AccessToken);
  });

  it("should throw error if APIM access token not available in JWT token", async () => {
    (getJwtToken as jest.Mock).mockResolvedValue({ apim: {} });

    await expect(getApimAccessToken(mockConfig)).rejects.toThrow("APIM access token is not present on JWT token");
  });

  it("should throw error if _getOrRefresh APIM access token returns undefined", async () => {
    (_getOrRefreshApimCredentials as jest.Mock).mockResolvedValue(undefined);

    (getJwtToken as jest.Mock).mockResolvedValue(mockJwtToken);

    await expect(getApimAccessToken(mockConfig)).rejects.toThrow("getOrRefreshApimCredentials returned undefined");
  });
});

describe("getApimCredentials", () => {
  const idToken = "test-id-token" as IdToken;

  beforeAll(async () => {
    (fetchAPIMAccessToken as jest.Mock).mockResolvedValue({
      access_token: "new-access-token",
      expires_in: "3333",
    });

    jest.useFakeTimers().setSystemTime(new Date("2025-01-01T12:00:00.000Z"));
  });

  it("should build new APIM access credentials if there is no refresh token", async () => {
    // Given

    // When
    const actual = await retrieveApimCredentials(idToken);

    // Then
    expect(actual).toEqual({
      accessToken: "new-access-token",
      expiresAt: 1735736133,
    });
  });
});
