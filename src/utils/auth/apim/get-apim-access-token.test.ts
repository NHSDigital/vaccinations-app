import { fetchAPIMAccessToken } from "@src/utils/auth/apim/fetch-apim-access-token";
import { getApimAccessToken, retrieveApimCredentials } from "@src/utils/auth/apim/get-apim-access-token";
import { getJwtToken } from "@src/utils/auth/get-jwt-token";
import { AccessToken, IdToken } from "@src/utils/auth/types";

jest.mock("@src/utils/auth/get-jwt-token", () => ({
  getJwtToken: jest.fn(),
}));

jest.mock("@src/utils/auth/apim/fetch-apim-access-token", () => ({
  fetchAPIMAccessToken: jest.fn(),
}));

describe("getApimAccessToken", () => {
  it("should use access token from JWT token when APIM access token populated", async () => {
    (getJwtToken as jest.Mock).mockResolvedValue({
      apim: {
        access_token: "test-access-token" as AccessToken,
        expires_in: "600000",
        refresh_token_expires_at: "700000",
      },
    });

    const apimAccessToken = await getApimAccessToken();

    expect(apimAccessToken).toEqual("test-access-token" as AccessToken);
  });

  it("should throw error if APIM access token not available in JWT token", async () => {
    (getJwtToken as jest.Mock).mockResolvedValue({ apim: {} });

    await expect(getApimAccessToken()).rejects.toThrow("No APIM access token available");
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
