/**
 * @jest-environment node
 */
import { auth } from "@project/auth";
import { generateAssertedLoginIdentityJwt } from "@src/utils/auth/generate-auth-payload";
import { AppConfig } from "@src/utils/config";
import { appConfigBuilder } from "@test-data/config/builders";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));
jest.mock("@project/auth", () => ({
  auth: jest.fn(),
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
const mockSession = {
  user: {
    id_token: {
      jti: mockJtiFromSessionIdToken,
    },
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
  });

  afterAll(() => {
    randomUUIDSpy.mockRestore();
    jest.useRealTimers();
  });

  describe("generateAssertedLoginIdentityJwt", () => {
    it("should construct payload with code attribute set as jti from id-token, and other expected attributes", async () => {
      (auth as jest.Mock).mockResolvedValue(mockSession);

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
      const mockSessionWithMissingJti = {
        user: {
          id_token: {
            jti: "",
          },
        },
      };

      (auth as jest.Mock).mockResolvedValue(mockSessionWithMissingJti);

      await expect(generateAssertedLoginIdentityJwt(mockConfig)).rejects.toThrow(
        "Error creating SSO assertedLoginIdentity: id_token.jti attribute missing from session",
      );
    });

    it("should propagate errors thrown by generateSignedJwt", async () => {
      (auth as jest.Mock).mockResolvedValue(mockSession);

      (jwt.sign as jest.Mock).mockRejectedValue(new Error("Invalid key"));

      await expect(generateAssertedLoginIdentityJwt(mockConfig)).rejects.toThrow("Invalid key");
    });
  });
});
