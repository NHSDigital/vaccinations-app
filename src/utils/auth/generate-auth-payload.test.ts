/**
 * @jest-environment node
 */
import { generateAssertedLoginIdentityJwt } from "@src/utils/auth/generate-auth-payload";
import { getJwtToken } from "@src/utils/auth/get-jwt-token";
import { AppConfig } from "@src/utils/config";
import { appConfigBuilder } from "@test-data/config/builders";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));
jest.mock("jwt-decode");

jest.mock("@src/utils/auth/get-jwt-token", () => ({
  getJwtToken: jest.fn(),
}));

const mockConfig: AppConfig = appConfigBuilder()
  .withNHS_LOGIN_URL("https://mock.nhs.login")
  .andNHS_LOGIN_CLIENT_ID("mock-client-id")
  .andNHS_LOGIN_PRIVATE_KEY("private-key")
  .build();

const mockSignedJwt = "mock-signed-jwt";
const mockRandomUUID = "mock-jti";
const mockNowInSeconds = 1749052001;
const mockJtiFromSessionIdToken = "jti-from-session-id-token";
const mockJwtToken = {
  nhs_login: {
    id_token: "test-token",
  },
};

describe("generate-auth-payload", () => {
  let randomUUIDSpy: jest.SpyInstance;

  beforeAll(() => {
    randomUUIDSpy = jest.spyOn(global.crypto, "randomUUID").mockReturnValue(mockRandomUUID);
  });

  beforeEach(() => {
    randomUUIDSpy.mockClear();
    jest.useFakeTimers();
    jest.setSystemTime(mockNowInSeconds * 1000);
    (jwtDecode as jest.Mock).mockReturnValue({
      jti: mockJtiFromSessionIdToken,
    });
  });

  afterAll(() => {
    randomUUIDSpy.mockRestore();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe("generateAssertedLoginIdentityJwt", () => {
    it("should construct payload with code attribute set as jti from id-token, and other expected attributes", async () => {
      (getJwtToken as jest.Mock).mockResolvedValue(mockJwtToken);
      (jwt.sign as jest.Mock).mockResolvedValue(mockSignedJwt);

      const expectedAssertedLoginPayloadContent = {
        code: mockJtiFromSessionIdToken,
        iss: mockConfig.NHS_LOGIN_CLIENT_ID,
        jti: mockRandomUUID,
        iat: mockNowInSeconds,
        exp: mockNowInSeconds + 60,
      };

      const token = await generateAssertedLoginIdentityJwt(mockConfig);

      expect(jwt.sign).toHaveBeenCalledWith(expectedAssertedLoginPayloadContent, "private-key", { algorithm: "RS512" });
      expect(token).toEqual(mockSignedJwt);
    });

    it("should throw error if jti from id_token not available", async () => {
      const mockJwtTokenWithMissingJti = {
        nhs_login: {
          id_token: "",
        },
      };

      (getJwtToken as jest.Mock).mockResolvedValue(mockJwtTokenWithMissingJti);

      await expect(generateAssertedLoginIdentityJwt(mockConfig)).rejects.toThrow(
        "Missing information. hasJwtToken=true, hasNHSLogin=true, hasIDToken=false",
      );
    });

    it("should propagate errors thrown by jwt.sign", async () => {
      (getJwtToken as jest.Mock).mockResolvedValue(mockJwtToken);

      (jwt.sign as jest.Mock).mockRejectedValue(new Error("Invalid key"));

      await expect(generateAssertedLoginIdentityJwt(mockConfig)).rejects.toThrow("Invalid key");
    });
  });
});
