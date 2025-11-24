/**
 * @jest-environment node
 */
import { generateAPIMTokenPayload } from "@src/utils/auth/apim/fetch-apim-access-token";
import { APIMTokenPayload, IdToken } from "@src/utils/auth/types";
import config from "@src/utils/config";
import { ConfigMock, configBuilder } from "@test-data/config/builders";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

const mockRandomUUID = "mock-jti";
const mockSignedJwt = "mock-signed-jwt";
const mockIdToken = "id-token" as IdToken;
const mockNowInSeconds = 1749052001;

const eligibilityApiKey = "eligibility-api-key";
const apimKeyId = "apim-key-id";
const apimPrivateKey = "apim-private-key";
const apimAuthUrl = new URL("https://apim-test-auth-url.com/test");

describe("generateAPIMTokenPayload", () => {
  let randomUUIDSpy: jest.SpyInstance;
  const mockedConfig = config as ConfigMock;

  beforeAll(() => {
    randomUUIDSpy = jest.spyOn(global.crypto, "randomUUID").mockReturnValue(mockRandomUUID);
  });

  beforeEach(() => {
    randomUUIDSpy.mockClear();
    jest.useFakeTimers();
    jest.setSystemTime(mockNowInSeconds * 1000);
    const defaultConfig = configBuilder()
      .withEligibilityApiKey(eligibilityApiKey)
      .andApimAuthUrl(apimAuthUrl)
      .andApimKeyId(apimKeyId)
      .andApimPrivateKey(apimPrivateKey)
      .build();
    Object.assign(mockedConfig, defaultConfig);
  });

  afterAll(() => {
    randomUUIDSpy.mockRestore();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe("new access token requested", () => {
    it("should include signed client_assertion with expected iss sub and aud values", async () => {
      (jwt.sign as jest.Mock).mockReturnValue(mockSignedJwt);

      const expectedClientAssertionPayloadContent = {
        iss: eligibilityApiKey,
        sub: eligibilityApiKey,
        aud: apimAuthUrl.href,
        jti: mockRandomUUID,
        exp: mockNowInSeconds + 300,
      };

      const apimTokenPayload: APIMTokenPayload = await generateAPIMTokenPayload(mockIdToken);
      const clientAssertionJWT = apimTokenPayload.client_assertion;

      expect(jwt.sign).toHaveBeenCalledWith(expectedClientAssertionPayloadContent, apimPrivateKey, {
        algorithm: "RS512",
        keyid: apimKeyId,
      });
      expect(clientAssertionJWT).toEqual(mockSignedJwt);
    });

    it("should use token-exchange grant type & id_token as subject_token field", async () => {
      // Given
      (jwt.sign as jest.Mock).mockReturnValue(mockSignedJwt);

      const expectedTokenPayload: APIMTokenPayload = {
        grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
        subject_token_type: "urn:ietf:params:oauth:token-type:id_token",
        client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        subject_token: mockIdToken,
        client_assertion: mockSignedJwt,
      };

      // When
      const apimTokenPayload = await generateAPIMTokenPayload(mockIdToken);

      // Then
      expect(apimTokenPayload).toEqual(expectedTokenPayload);
    });

    it("should propagate errors thrown by jwt.sign", () => {
      (jwt.sign as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid key");
      });

      expect(async () => {
        await generateAPIMTokenPayload(mockIdToken);
      }).rejects.toThrow("Invalid key");
    });
  });
});
