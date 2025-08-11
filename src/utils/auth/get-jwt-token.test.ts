import { getJwtToken } from "@src/utils/auth/get-jwt-token";
import { AccessToken } from "@src/utils/auth/types";
import { configProvider } from "@src/utils/config";
import { appConfigBuilder } from "@test-data/config/builders";
import { getToken } from "next-auth/jwt";
import { cookies, headers } from "next/headers";

jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(),
}));

jest.mock("next/headers", () => ({
  headers: jest.fn(),
  cookies: jest.fn(),
}));

jest.mock("@src/utils/config", () => ({
  configProvider: jest.fn(),
}));

describe("getJwtToken", () => {
  beforeEach(() => {
    const mockConfig = appConfigBuilder().withAUTH_SECRET("test-auth-secret");
    (configProvider as jest.Mock).mockResolvedValue(mockConfig);
  });

  const mockGetTokenResult = {
    access_token: "test-access-token" as AccessToken,
    expires_in: "600000",
  };

  it("should return access token returned by nextauth getToken method", async () => {
    (headers as jest.Mock).mockResolvedValue([{}]);
    const mockCookieStore = { getAll: jest.fn().mockReturnValue([{}]) };
    (cookies as jest.Mock).mockReturnValue(mockCookieStore);

    (getToken as jest.Mock).mockResolvedValue(mockGetTokenResult);

    const jwtToken = await getJwtToken();

    expect(getToken).toHaveBeenCalled();
    expect(jwtToken).toEqual(mockGetTokenResult);
  });
});
