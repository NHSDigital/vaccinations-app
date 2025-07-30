/**
 * @jest-environment node
 */
import { ApimConfig } from "@src/utils/apimConfig";
import { generateAPIMTokenPayload } from "@src/utils/auth/apim/fetch-apim-access-token";
import { apimConfigBuilder } from "@test-data/config/builders";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));
const mockRandomUUID = "mock-jti";
const mockSignedJwt = "mock-signed-jwt";
const mockIdToken = "id-token";
const mockNowInSeconds = 1749052001;

const mockApimConfig: ApimConfig = apimConfigBuilder()
  .withCONTENT_API_KEY("apim-api-key")
  .andAPIM_AUTH_URL("https://apim-test-auth-url.com/test")
  .andAPIM_KEY_ID("apim-key-id")
  .andAPIM_PRIVATE_KEY("apim-private-key")
  .build();

describe("get-apim-access-token", () => {});

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

  it("should include signed client_assertion with expected iss sub and aud values", async () => {
    (jwt.sign as jest.Mock).mockResolvedValue(mockSignedJwt);

    const expectedClientAssertionPayloadContent = {
      iss: mockApimConfig.CONTENT_API_KEY,
      sub: mockApimConfig.CONTENT_API_KEY,
      aud: mockApimConfig.APIM_AUTH_URL.href,
      jti: mockRandomUUID,
      exp: mockNowInSeconds + 300,
    };

    const apimTokenPayload = await generateAPIMTokenPayload(mockApimConfig, mockIdToken);
    const clientAssertionJWT = apimTokenPayload.client_assertion;

    expect(jwt.sign).toHaveBeenCalledWith(expectedClientAssertionPayloadContent, mockApimConfig.APIM_PRIVATE_KEY, {
      algorithm: "RS512",
      keyid: mockApimConfig.APIM_KEY_ID,
    });
    expect(clientAssertionJWT).toEqual(mockSignedJwt);
  });

  it("should use id_token as subject_token field", async () => {
    (jwt.sign as jest.Mock).mockResolvedValue(mockSignedJwt);

    const apimTokenPayload = await generateAPIMTokenPayload(mockApimConfig, mockIdToken);

    expect(apimTokenPayload.subject_token).toBe(mockIdToken);
  });

  it("should propagate errors thrown by jwt.sign", async () => {
    (jwt.sign as jest.Mock).mockRejectedValue(new Error("Invalid key"));

    await expect(generateAPIMTokenPayload(mockApimConfig, mockIdToken)).rejects.toThrow("Invalid key");
  });
});
