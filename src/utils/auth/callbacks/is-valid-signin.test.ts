import { isValidSignIn } from "@src/utils/auth/callbacks/is-valid-signin";
import type { DecodedIdToken } from "@src/utils/auth/types";
import config from "@src/utils/config";
import { ConfigMock, configBuilder } from "@test-data/config/builders";
import { createTypeBuilder } from "@test-data/meta-builder";
import { jwtDecode } from "jwt-decode";
import { Account } from "next-auth";

jest.mock("jwt-decode");
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/utils/config");

describe("isValidSignIn", () => {
  const mockConfig = config as ConfigMock;

  const decodedIdTokenBuilder = () => {
    return createTypeBuilder<DecodedIdToken>({
      iss: "https://mock.nhs.login/",
      aud: "mock-client-id",
      identity_proofing_level: "P9",
      vot: "P9.Cp.Ck",
    });
  };

  beforeEach(() => {
    const defaultConfig = configBuilder()
      .withNhsLoginUrl(new URL("https://mock.nhs.login/"))
      .andNhsLoginClientId("mock-client-id")
      .build();
    Object.assign(mockConfig, defaultConfig);

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

    (jwtDecode as jest.Mock).mockReturnValue(decodedIdTokenBuilder().build());

    const result = await isValidSignIn(mockAccount);
    expect(result).toBe(true);
  });

  it("should return false and logs if iss is invalid", async () => {
    const mockAccount = { id_token: "invalid-token" } as Account;

    (jwtDecode as jest.Mock).mockReturnValue(
      decodedIdTokenBuilder().withIss("https://incorrect-issuer.example.com").build(),
    );

    const result = await isValidSignIn(mockAccount);
    expect(result).toBe(false);
  });

  it("should return false and logs if aud is invalid", async () => {
    const mockAccount = { id_token: "invalid-token" } as Account;

    (jwtDecode as jest.Mock).mockReturnValue(decodedIdTokenBuilder().withAud("incorrect-audience").build());

    const result = await isValidSignIn(mockAccount);
    expect(result).toBe(false);
  });

  it("should return false and logs if identity_proofing_level is invalid", async () => {
    const mockAccount = { id_token: "invalid-token" } as Account;

    (jwtDecode as jest.Mock).mockReturnValue(decodedIdTokenBuilder().withIdentity_proofing_level("P0").build());

    const result = await isValidSignIn(mockAccount);
    expect(result).toBe(false);
  });

  it("should return false and logs if vot is invalid", async () => {
    const mockAccount = { id_token: "invalid-token" } as Account;

    (jwtDecode as jest.Mock).mockReturnValue(decodedIdTokenBuilder().withVot("P9.Sausages").build());

    const result = await isValidSignIn(mockAccount);
    expect(result).toBe(false);
  });
});
