/**
 * @jest-environment node
 */
import { ApimConfig } from "@src/utils/apimConfig";
import { generateAPIMTokenPayload } from "@src/utils/auth/apim/fetch-apim-access-token";
import { APIMNewTokenPayload, APIMRefreshTokenPayload, IdToken, RefreshToken } from "@src/utils/auth/types";
import { apimConfigBuilder } from "@test-data/config/builders";
import { randomString } from "@test-data/meta-builder";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

const mockRandomUUID = "mock-jti";
const mockSignedJwt = "mock-signed-jwt";
const mockIdToken = "id-token" as IdToken;
const mockNowInSeconds = 1749052001;

const apimApiKey = "apim-api-key";
const apimKeyId = "apim-key-id";
const apimPrivateKey = "apim-private-key";
const mockApimConfig: ApimConfig = apimConfigBuilder()
  .withELIGIBILITY_API_KEY(apimApiKey)
  .andAPIM_AUTH_URL(new URL("https://apim-test-auth-url.com/test"))
  .andAPIM_KEY_ID(apimKeyId)
  .andAPIM_PRIVATE_KEY(apimPrivateKey)
  .build();

describe("generateAPIMTokenPayload", () => {
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
    jest.clearAllMocks();
  });

  describe("new access token requested", () => {
    const withoutRefreshToken = undefined;

    it("should include signed client_assertion with expected iss sub and aud values", () => {
      (jwt.sign as jest.Mock).mockReturnValue(mockSignedJwt);

      const expectedClientAssertionPayloadContent = {
        iss: mockApimConfig.ELIGIBILITY_API_KEY,
        sub: mockApimConfig.ELIGIBILITY_API_KEY,
        aud: mockApimConfig.APIM_AUTH_URL.href,
        jti: mockRandomUUID,
        exp: mockNowInSeconds + 300,
      };

      const apimTokenPayload = generateAPIMTokenPayload(
        mockApimConfig,
        mockIdToken,
        withoutRefreshToken,
      ) as APIMNewTokenPayload;
      const clientAssertionJWT = apimTokenPayload.client_assertion;

      expect(jwt.sign).toHaveBeenCalledWith(expectedClientAssertionPayloadContent, mockApimConfig.APIM_PRIVATE_KEY, {
        algorithm: "RS512",
        keyid: mockApimConfig.APIM_KEY_ID,
      });
      expect(clientAssertionJWT).toEqual(mockSignedJwt);
    });

    it("should use token-exchange grant type & id_token as subject_token field", () => {
      // Given
      (jwt.sign as jest.Mock).mockReturnValue(mockSignedJwt);

      const expectedTokenPayload: APIMNewTokenPayload = {
        grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
        subject_token_type: "urn:ietf:params:oauth:token-type:id_token",
        client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        subject_token: mockIdToken,
        client_assertion: mockSignedJwt,
      };

      // When
      const apimTokenPayload = generateAPIMTokenPayload(mockApimConfig, mockIdToken, withoutRefreshToken);

      // Then
      expect(apimTokenPayload).toEqual(expectedTokenPayload);
    });

    it("should propagate errors thrown by jwt.sign", () => {
      (jwt.sign as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid key");
      });
      const refreshToken = randomString(10) as RefreshToken;

      expect(() => {
        generateAPIMTokenPayload(mockApimConfig, mockIdToken, refreshToken);
      }).toThrow("Invalid key");
    });
  });

  describe("refreshing of access token requested", () => {
    it("should use refresh_token grant type", async () => {
      // Given
      (jwt.sign as jest.Mock).mockReturnValue(mockSignedJwt);
      const refreshToken = randomString(10) as RefreshToken;
      const expectedTokenPayload: APIMRefreshTokenPayload = {
        grant_type: "refresh_token",
        client_id: apimApiKey,
        client_secret: apimPrivateKey,
        refresh_token: refreshToken,
      };

      // When
      const apimTokenPayload = generateAPIMTokenPayload(mockApimConfig, mockIdToken, refreshToken);

      // Then
      expect(apimTokenPayload).toEqual(expectedTokenPayload);
    });
  });
});
