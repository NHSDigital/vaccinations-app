/**
 * @jest-environment node
 */
import { auth } from "@project/auth";
import {
  generateAssertedLoginIdentityJwt,
  generateRefreshClientAssertionJwt,
} from "@src/utils/auth/generate-auth-payload";
import { generateSignedJwt } from "@src/utils/auth/generate-signed-jwt";
import { AppConfig } from "@src/utils/config";
import { appConfigBuilder } from "@test-data/config/builders";

jest.mock("@src/utils/auth/generate-signed-jwt");
jest.mock("@project/auth", () => ({
  auth: jest.fn(),
}));

const mockConfig: AppConfig = appConfigBuilder()
  .withNHS_LOGIN_URL("https://mock.nhs.login")
  .andNHS_LOGIN_CLIENT_ID("mock-client-id")
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

  describe("generateClientAssertion", () => {
    beforeEach(() => {
      (auth as jest.Mock).mockResolvedValue(mockSession);
    });

    it("should generate a client assertion JWT string", async () => {
      (generateSignedJwt as jest.Mock).mockResolvedValue(mockSignedJwt);
      const expectedPayload = {
        iss: mockConfig.NHS_LOGIN_CLIENT_ID,
        sub: mockConfig.NHS_LOGIN_CLIENT_ID,
        aud: `${mockConfig.NHS_LOGIN_URL}/token`,
        jti: mockRandomUUID,
        exp: mockNowInSeconds + 300,
        iat: mockNowInSeconds,
      };

      const token = await generateRefreshClientAssertionJwt(mockConfig);

      expect(global.crypto.randomUUID).toHaveBeenCalled();
      expect(generateSignedJwt).toHaveBeenCalledWith(mockConfig, expectedPayload);
      expect(token).toEqual(mockSignedJwt);
    });

    it("should propagate errors thrown by generateSignedJwt", async () => {
      (generateSignedJwt as jest.Mock).mockRejectedValue(new Error("Invalid key"));

      await expect(generateRefreshClientAssertionJwt(mockConfig)).rejects.toThrow("Invalid key");
    });
  });

  describe("generateAssertedLoginIdentityJwt", () => {
    it("should construct payload with code attribute set as jti from id-token, and other expected attributes", async () => {
      (auth as jest.Mock).mockResolvedValue(mockSession);

      (generateSignedJwt as jest.Mock).mockResolvedValue(mockSignedJwt);
      const expectedAssertedLoginPayloadContent = {
        code: mockJtiFromSessionIdToken,
        iss: mockConfig.NHS_LOGIN_CLIENT_ID,
        jti: mockRandomUUID,
        iat: mockNowInSeconds,
        exp: mockNowInSeconds + 60,
      };

      const token = await generateAssertedLoginIdentityJwt(mockConfig);

      expect(generateSignedJwt).toHaveBeenCalledWith(mockConfig, expectedAssertedLoginPayloadContent);
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

      (generateSignedJwt as jest.Mock).mockRejectedValue(new Error("Invalid key"));

      await expect(generateAssertedLoginIdentityJwt(mockConfig)).rejects.toThrow("Invalid key");
    });
  });
});
