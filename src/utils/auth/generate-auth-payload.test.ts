/**
 * @jest-environment node
 */

import { generateRefreshClientAssertionJwt } from "@src/utils/auth/generate-auth-payload";
import { generateSignedJwt } from "@src/utils/auth/generate-signed-jwt";
import { AppConfig } from "@src/utils/config";

jest.mock("@src/utils/auth/generate-signed-jwt");

const mockConfig = {
  NHS_LOGIN_CLIENT_ID: "mock-client-id",
  NHS_LOGIN_URL: "https://mock.nhs.login",
} as AppConfig;

const mockSignedJwt = "mock-signed-jwt";
const mockRandomUUID = "mock-jti";
const mockNowInSeconds = 1749052001;

describe("generate-auth-payload", () => {
  let randomUUIDSpy: jest.SpyInstance;

  beforeAll(() => {
    randomUUIDSpy = jest
      .spyOn(global.crypto, "randomUUID")
      .mockReturnValue(mockRandomUUID);
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
      expect(generateSignedJwt).toHaveBeenCalledWith(
        mockConfig,
        expectedPayload,
      );
      expect(token).toEqual(mockSignedJwt);
    });

    it("should propagate errors thrown by generateSignedJwt", async () => {
      (generateSignedJwt as jest.Mock).mockRejectedValue(
        new Error("Invalid key"),
      );

      await expect(
        generateRefreshClientAssertionJwt(mockConfig),
      ).rejects.toThrow("Invalid key");
    });
  });
});
