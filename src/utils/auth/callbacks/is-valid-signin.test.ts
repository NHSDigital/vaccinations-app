import { isValidSignIn } from "@src/utils/auth/callbacks/is-valid-signin";
import { AppConfig } from "@src/utils/config";
import { Account } from "next-auth";
import { jwtDecode } from "jwt-decode";
import { Logger } from "pino";

jest.mock("jwt-decode");

describe("isValidSignIn", () => {
  const mockConfig: AppConfig = {
    NHS_LOGIN_URL: "https://mock.nhs.login",
    NHS_LOGIN_CLIENT_ID: "mock-client-id",
  } as AppConfig;

  const mockLog = {
    info: jest.fn(),
  } as unknown as Logger;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return false and logs if account is null", () => {
    expect(isValidSignIn(null, mockConfig, mockLog)).toBe(false);
    expect(mockLog.info).toHaveBeenCalledWith(
      "Access denied from signIn callback. Account or id_token missing.",
    );
  });

  it("should return false and logs if account is undefined", () => {
    expect(isValidSignIn(undefined, mockConfig, mockLog)).toBe(false);
    expect(mockLog.info).toHaveBeenCalledWith(
      "Access denied from signIn callback. Account or id_token missing.",
    );
  });

  it("should return false and logs if id_token is not a string", () => {
    expect(
      isValidSignIn(
        {
          id_token: 123,
        } as unknown as Account,
        mockConfig,
        mockLog,
      ),
    ).toBe(false);
    expect(mockLog.info).toHaveBeenCalledWith(
      "Access denied from signIn callback. Account or id_token missing.",
    );
  });

  it("should return true if token is valid", () => {
    const mockAccount = { id_token: "valid-token" } as Account;

    (jwtDecode as jest.Mock).mockReturnValue({
      iss: mockConfig.NHS_LOGIN_URL,
      aud: mockConfig.NHS_LOGIN_CLIENT_ID,
      identity_proofing_level: "P9",
    });

    const result = isValidSignIn(mockAccount, mockConfig, mockLog);
    expect(result).toBe(true);
    expect(mockLog.info).not.toHaveBeenCalled();
  });

  it("should return false and logs if token is invalid", () => {
    const mockAccount = { id_token: "invalid-token" } as Account;

    (jwtDecode as jest.Mock).mockReturnValue({
      iss: "incorrect-issuer",
      aud: "incorrect-audience",
      identity_proofing_level: "P0",
    });

    const result = isValidSignIn(mockAccount, mockConfig, mockLog);
    expect(result).toBe(false);
    expect(mockLog.info).toHaveBeenCalledWith(
      "Access denied from signIn callback. iss: incorrect-issuer, aud: incorrect-audience, identity_proofing_level: P0",
    );
  });
});
