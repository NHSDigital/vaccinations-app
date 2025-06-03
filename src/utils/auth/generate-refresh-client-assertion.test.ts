/**
 * @jest-environment node
 */

import { generateClientAssertion } from "@src/utils/auth/generate-refresh-client-assertion";
import pemToCryptoKey from "@src/utils/auth/pem-to-crypto-key";
import { AppConfig } from "@src/utils/config";

jest.mock("@src/utils/auth/pem-to-crypto-key");

const mockConfig = {
  NHS_LOGIN_PRIVATE_KEY: "mock-private-key",
  NHS_LOGIN_CLIENT_ID: "mock-client-id",
  NHS_LOGIN_URL: "https://mock.nhs.login",
} as AppConfig;

describe("generateClientAssertion", () => {
  let randomUUIDSpy: jest.SpyInstance;
  let subtleSignSpy: jest.SpyInstance;

  beforeAll(() => {
    randomUUIDSpy = jest
      .spyOn(global.crypto, "randomUUID")
      .mockReturnValue("mock-jti");
    subtleSignSpy = jest
      .spyOn(global.crypto.subtle, "sign")
      .mockResolvedValue(new Uint8Array([1, 2, 3, 4]).buffer);
  });

  beforeEach(() => {
    // Reset mocks before each test
    (pemToCryptoKey as jest.Mock).mockReset();
    randomUUIDSpy.mockClear();
    subtleSignSpy.mockClear();
  });

  afterAll(() => {
    // Restore original implementations after all tests in this describe block
    randomUUIDSpy.mockRestore();
    subtleSignSpy.mockRestore();
  });

  it("should generate a client assertion JWT string", async () => {
    (pemToCryptoKey as jest.Mock).mockResolvedValue({} as CryptoKey);

    const token = await generateClientAssertion(mockConfig);

    expect(typeof token).toBe("string");
    const parts = token.split(".");
    expect(parts.length).toBe(3);

    expect(pemToCryptoKey).toHaveBeenCalledWith(
      mockConfig.NHS_LOGIN_PRIVATE_KEY,
    );

    expect(global.crypto.randomUUID).toHaveBeenCalled();

    expect(global.crypto.subtle.sign).toHaveBeenCalledWith(
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-512" },
      expect.anything(), // privateKey
      expect.any(Uint8Array),
    );
  });

  it("should throw if pemToCryptoKey rejects", async () => {
    (pemToCryptoKey as jest.Mock).mockRejectedValue(new Error("Invalid key"));

    await expect(generateClientAssertion(mockConfig)).rejects.toThrow(
      "Invalid key",
    );

    expect(pemToCryptoKey).toHaveBeenCalledWith(
      mockConfig.NHS_LOGIN_PRIVATE_KEY,
    );
    expect(global.crypto.randomUUID).not.toHaveBeenCalled();
    expect(global.crypto.subtle.sign).not.toHaveBeenCalled();
  });
});
