import { isValidSignIn } from "@src/utils/auth/callbacks/is-valid-signin";
import { AppConfig } from "@src/utils/config";
import { appConfigBuilder } from "@test-data/config/builders";
import { jwtDecode } from "jwt-decode";
import { Account } from "next-auth";

jest.mock("jwt-decode");
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("isValidSignIn", () => {
  const mockConfig: AppConfig = appConfigBuilder()
    .withNHS_LOGIN_URL("https://mock.nhs.login/")
    .andNHS_LOGIN_CLIENT_ID("mock-client-id")
    .build();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return false and logs if account is null", () => {
    expect(isValidSignIn(null, mockConfig)).toBe(false);
  });

  it("should return false and logs if account is undefined", () => {
    expect(isValidSignIn(undefined, mockConfig)).toBe(false);
  });

  it("should return false and logs if id_token is not a string", () => {
    expect(isValidSignIn({ id_token: 123 } as unknown as Account, mockConfig)).toBe(false);
  });

  it("should return true if token is valid", () => {
    const mockAccount = { id_token: "valid-token" } as Account;

    (jwtDecode as jest.Mock).mockReturnValue({
      iss: mockConfig.NHS_LOGIN_URL,
      aud: mockConfig.NHS_LOGIN_CLIENT_ID,
      identity_proofing_level: "P9",
      vot: "P9.Cp.Ck",
    });

    const result = isValidSignIn(mockAccount, mockConfig);
    expect(result).toBe(true);
  });

  it("should return false and logs if iss is invalid", () => {
    const mockAccount = { id_token: "invalid-token" } as Account;

    (jwtDecode as jest.Mock).mockReturnValue({
      iss: "incorrect-issuer",
      aud: mockConfig.NHS_LOGIN_CLIENT_ID,
      identity_proofing_level: "P9",
      vot: "P9.Cp.Ck",
    });

    const result = isValidSignIn(mockAccount, mockConfig);
    expect(result).toBe(false);
  });

  it("should return false and logs if aud is invalid", () => {
    const mockAccount = { id_token: "invalid-token" } as Account;

    (jwtDecode as jest.Mock).mockReturnValue({
      iss: mockConfig.NHS_LOGIN_URL,
      aud: "incorrect-audience",
      identity_proofing_level: "P9",
      vot: "P9.Cp.Ck",
    });

    const result = isValidSignIn(mockAccount, mockConfig);
    expect(result).toBe(false);
  });

  it("should return false and logs if identity_proofing_level is invalid", () => {
    const mockAccount = { id_token: "invalid-token" } as Account;

    (jwtDecode as jest.Mock).mockReturnValue({
      iss: mockConfig.NHS_LOGIN_URL,
      aud: mockConfig.NHS_LOGIN_CLIENT_ID,
      identity_proofing_level: "P0",
      vot: "P9.Cp.Ck",
    });

    const result = isValidSignIn(mockAccount, mockConfig);
    expect(result).toBe(false);
  });

  it("should return false and logs if vot is invalid", () => {
    const mockAccount = { id_token: "invalid-token" } as Account;

    (jwtDecode as jest.Mock).mockReturnValue({
      iss: mockConfig.NHS_LOGIN_URL,
      aud: mockConfig.NHS_LOGIN_CLIENT_ID,
      identity_proofing_level: "P9",
      vot: "P9.Sausages",
    });

    const result = isValidSignIn(mockAccount, mockConfig);
    expect(result).toBe(false);
  });
});
