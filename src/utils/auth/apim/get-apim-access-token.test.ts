import { getApimAccessToken } from "@src/utils/auth/apim/get-apim-access-token";
import { AccessToken } from "@src/utils/auth/types";
import { getToken } from "next-auth/jwt";
import { cookies, headers } from "next/headers";

jest.mock("next/headers", () => ({
  headers: jest.fn(),
  cookies: jest.fn(),
}));

jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(),
}));

describe("get-apim-access-token", () => {
  it("should use access token from JWT session when APIM access token populated", async () => {
    (headers as jest.Mock).mockResolvedValue([{}]);
    const mockCookieStore = { getAll: jest.fn().mockReturnValue([{}]) };
    (cookies as jest.Mock).mockReturnValue(mockCookieStore);
    (getToken as jest.Mock).mockResolvedValue({ apim: { access_token: "test-access-token" as AccessToken } });

    const apimAccessToken = await getApimAccessToken();

    expect(apimAccessToken).toEqual("test-access-token" as AccessToken);
  });

  it("should throw error if APIM access token not available on JWT session", async () => {
    (getToken as jest.Mock).mockResolvedValue({ apim: {} });

    await expect(getApimAccessToken()).rejects.toThrow("No APIM access token available");
  });
});
