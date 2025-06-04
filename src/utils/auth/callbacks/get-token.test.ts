import { getToken } from "@src/utils/auth/callbacks/get-token";
import { generateClientAssertion } from "@src/utils/auth/generate-refresh-client-assertion";
import { Account, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";
import { AppConfig } from "@src/utils/config";
import { jwtDecode } from "jwt-decode";

jest.mock("@src/utils/auth/generate-refresh-client-assertion");
jest.mock("jwt-decode");

const mockGenerateClientAssertion =
  generateClientAssertion as jest.MockedFunction<
    typeof generateClientAssertion
  >;

describe("getToken", () => {
  const mockConfig = {
    NHS_LOGIN_URL: "https://mock.nhs.login",
    NHS_LOGIN_CLIENT_ID: "mock-client-id",
    NHS_LOGIN_PRIVATE_KEY: "mock-private-key",
  } as AppConfig;

  const nowInSeconds = 1749052001;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
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
    const result = await getToken(
      null as unknown as JWT,
      null,
      undefined,
      mockConfig,
      300,
    );
    expect(result).toBeNull();
  });

  it("should return updated token on initial login with account and profile", async () => {
    (jwtDecode as jest.Mock).mockReturnValue({
      jti: "jti_test",
    });
    const token = {} as JWT;

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

    const result = await getToken(
      token,
      account,
      profile,
      mockConfig,
      maxAgeInSeconds,
    );

    expect(result).toMatchObject({
      expires_at: account.expires_at,
      access_token: account.access_token,
      refresh_token: account.refresh_token,
      id_token: {
        jti: "jti_test",
      },
      user: {
        nhs_number: profile.nhs_number,
        birthdate: profile.birthdate,
      },
      fixedExpiry: nowInSeconds + maxAgeInSeconds,
    });
  });

  it("should return token with empty values on initial login if account and profile are undefined", async () => {
    const token = {} as JWT;

    const account = {} as Account;

    const profile = {} as Profile;

    const maxAgeInSeconds = 600;

    const result = await getToken(
      token,
      account,
      profile,
      mockConfig,
      maxAgeInSeconds,
    );

    expect(result).toMatchObject({
      expires_at: 0,
      access_token: "",
      refresh_token: "",
      id_token: {
        jti: "",
      },
      user: {
        nhs_number: "",
        birthdate: "",
      },
      fixedExpiry: nowInSeconds + maxAgeInSeconds,
    });
  });

  it("should return null if fixedExpiry reached", async () => {
    const token = {
      fixedExpiry: nowInSeconds - 1,
      user: {},
      expires_at: nowInSeconds + 1000,
    } as JWT;

    const result = await getToken(token, null, undefined, mockConfig, 300);

    expect(result).toBeNull();
  });

  it("should refresh access token if expired, and refresh_token exists; new expires_in and refresh_token are received", async () => {
    const token = {
      expires_at: nowInSeconds - 10,
      refresh_token: "refresh-token",
      access_token: "oldAccess",
      id_token: {
        jti: "id-token",
      },
      user: {
        nhs_number: "test_nhs_number",
        birthdate: "test_birthdate",
      },
    } as JWT;

    mockGenerateClientAssertion.mockResolvedValue("mock-client-assertion");
    const expectedRequestBody = {
      grant_type: "refresh_token",
      refresh_token: token.refresh_token,
      client_assertion_type:
        "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      client_assertion: "mock-client-assertion",
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        access_token: "newAccess",
        expires_in: 500,
        refresh_token: "newRefresh",
      }),
    });

    const result = await getToken(token, null, undefined, mockConfig, 300);

    expect(mockGenerateClientAssertion).toHaveBeenCalledWith(mockConfig);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConfig.NHS_LOGIN_URL}/token`,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }),
    );

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
    const fetchOptions = fetchCall[1];
    const body = fetchOptions.body as URLSearchParams;

    const bodyObject = Object.fromEntries(body.entries());

    expect(bodyObject).toEqual(expectedRequestBody);

    expect(result).toMatchObject({
      access_token: "newAccess",
      refresh_token: "newRefresh",
      expires_at: nowInSeconds + 500,
    });
  });

  it("should refresh access token if expired, and refresh_token exists; expires_in and refresh_token missing", async () => {
    const token = {
      expires_at: nowInSeconds - 10,
      refresh_token: "refresh-token",
      access_token: "oldAccess",
      id_token: {
        jti: "id-token",
      },
      user: {
        nhs_number: "test_nhs_number",
        birthdate: "test_birthdate",
      },
    } as JWT;

    mockGenerateClientAssertion.mockResolvedValue("mock-client-assertion");

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        access_token: "newAccess",
      }),
    });

    const result = await getToken(token, null, undefined, mockConfig, 300);

    expect(mockGenerateClientAssertion).toHaveBeenCalledWith(mockConfig);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConfig.NHS_LOGIN_URL}/token`,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: expect.any(URLSearchParams),
      }),
    );

    expect(result).toMatchObject({
      access_token: "newAccess",
      refresh_token: "refresh-token",
      expires_at: nowInSeconds + 300,
    });
  });

  it("should return null and logs error if refresh_token missing during refresh", async () => {
    const token = {
      expires_at: nowInSeconds - 10,
      refresh_token: "",
    } as JWT;

    const result = await getToken(token, null, undefined, mockConfig, 300);

    expect(result).toBeNull();
  });

  it("should return null and logs error if fetch response not ok", async () => {
    const token = {
      expires_at: nowInSeconds - 10,
      refresh_token: "refresh-token",
    } as JWT;

    mockGenerateClientAssertion.mockResolvedValue("mock-client-assertion");

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ error: "Error" }),
    });

    const result = await getToken(token, null, undefined, mockConfig, 300);

    expect(result).toBeNull();
  });

  it("should return the token if no refresh needed", async () => {
    const token = {
      expires_at: nowInSeconds + 1000,
      access_token: "access",
      refresh_token: "refresh",
      id_token: {
        jti: "jti_test",
      },
      user: {
        nhs_number: "test_nhs_number",
        birthdate: "test_birthdate",
      },
    } as JWT;

    const result = await getToken(token, null, undefined, mockConfig, 300);

    expect(result).toEqual(token);
  });
});
