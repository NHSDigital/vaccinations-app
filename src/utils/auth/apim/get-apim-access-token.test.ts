import { auth } from "@project/auth";
import { ApimTokenResponse, fetchAPIMAccessTokenForIDToken } from "@src/utils/auth/apim/fetch-apim-access-token";
import { getApimAccessToken } from "@src/utils/auth/apim/get-apim-access-token";

jest.mock("@project/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@src/utils/auth/apim/fetch-apim-access-token", () => ({
  fetchAPIMAccessTokenForIDToken: jest.fn(),
}));

describe("get-apim-access-token", () => {
  it("should use id token from session when calling APIM and return access token", async () => {
    const expectedAccessToken = "test-access-token";
    const idToken = "some-id-token";
    const mockAPIMFetchTokenResponse: ApimTokenResponse = {
      access_token: expectedAccessToken,
      expires_in: "80",
      issued_token_type: "urn:ietf:params:oauth:token-type:access_token",
      refresh_count: "2",
      refresh_token: "test-refresh-token",
      refresh_token_expires_in: "389",
      token_type: "Bearer",
    };
    const mockSession = {
      nhs_login: {
        id_token: idToken,
      },
    };
    (auth as jest.Mock).mockResolvedValue(mockSession);
    (fetchAPIMAccessTokenForIDToken as jest.Mock).mockResolvedValue(mockAPIMFetchTokenResponse);

    const apimAccessToken = await getApimAccessToken();

    expect(fetchAPIMAccessTokenForIDToken).toHaveBeenCalledWith(idToken);
    expect(apimAccessToken).toEqual(expectedAccessToken);
  });

  it("should throw error if id_token not available on session", async () => {
    const mockSessionWithMissingIdToken = {
      nhs_login: {
        id_token: undefined,
      },
    };
    (auth as jest.Mock).mockResolvedValue(mockSessionWithMissingIdToken);

    await expect(getApimAccessToken()).rejects.toThrow("No idToken available on session for APIM call");
  });

  it("should propagate errors from fetch APIM token method", async () => {
    const fetchApimTokenError = new Error("fetch-apim-error");
    (fetchAPIMAccessTokenForIDToken as jest.Mock).mockRejectedValue(fetchApimTokenError);
    const mockSession = {
      nhs_login: {
        id_token: "some-id-token",
      },
    };
    (auth as jest.Mock).mockResolvedValue(mockSession);

    await expect(getApimAccessToken()).rejects.toThrow(fetchApimTokenError);
  });
});
