import { isValidSignIn } from "@src/utils/auth/callbacks/is-valid-signin";
import lazyConfig from "@src/utils/lazy-config";
import { AsyncConfigMock, lazyConfigBuilder } from "@test-data/config/builders";
import { jwtDecode } from "jwt-decode";
import { Account } from "next-auth";

jest.mock("jwt-decode");
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/utils/lazy-config");

describe("isValidSignIn", () => {
  const mockedConfig = lazyConfig as AsyncConfigMock;

  beforeEach(() => {
    const defaultConfig = lazyConfigBuilder()
      .withNhsLoginUrl(new URL("https://mock.nhs.login/"))
      .andNhsLoginClientId("mock-client-id")
      .build();
    Object.assign(mockedConfig, defaultConfig);

    jest.clearAllMocks();
  });

  it("should return false and logs if account is null", async () => {
    expect(await isValidSignIn(null)).toBe(false);
  });

  it("should return false and logs if account is undefined", async () => {
    expect(await isValidSignIn(undefined)).toBe(false);
  });

  it("should return false and logs if id_token is not a string", async () => {
    expect(await isValidSignIn({ id_token: 123 } as unknown as Account)).toBe(false);
  });

  it("should return true if token is valid", async () => {
    const mockAccount = { id_token: "valid-token" } as Account;

    (jwtDecode as jest.Mock).mockReturnValue({
      iss: "https://mock.nhs.login/",
      aud: "mock-client-id",
      identity_proofing_level: "P9",
    });

    const result = await isValidSignIn(mockAccount);
    expect(result).toBe(true);
  });

  it("should return false and logs if token is invalid", async () => {
    const mockAccount = { id_token: "invalid-token" } as Account;

    (jwtDecode as jest.Mock).mockReturnValue({
      iss: "https://mock.nhs.login",
      aud: "incorrect-audience",
      identity_proofing_level: "P0",
    });

    const result = await isValidSignIn(mockAccount);
    expect(result).toBe(false);
  });
});
