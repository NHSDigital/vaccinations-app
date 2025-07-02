/**
 * @jest-environment node
 */

import pemToCryptoKey from "@src/utils/auth/pem-to-crypto-key";
import { AppConfig } from "@src/utils/config";
import { generateSignedJwt } from "@src/utils/auth/generate-signed-jwt";

jest.mock("@src/utils/auth/pem-to-crypto-key");

const mockConfig = {
  NHS_LOGIN_PRIVATE_KEY: "mock-private-key",
} as AppConfig;

const payload = {};

describe("generateSignedJwt", () => {
  let subtleSignSpy: jest.SpyInstance;

  beforeAll(() => {
    subtleSignSpy = jest.spyOn(global.crypto.subtle, "sign").mockResolvedValue(new Uint8Array([1, 2, 3, 4]).buffer);
  });

  beforeEach(() => {
    (pemToCryptoKey as jest.Mock).mockReset();
    subtleSignSpy.mockClear();
  });

  afterAll(() => {
    subtleSignSpy.mockRestore();
  });

  it("should generate a signed JWT from payload", async () => {
    (pemToCryptoKey as jest.Mock).mockResolvedValue({} as CryptoKey);

    const token = await generateSignedJwt(mockConfig, payload);

    expect(typeof token).toBe("string");
    const parts = token.split(".");
    expect(parts.length).toBe(3);

    expect(pemToCryptoKey).toHaveBeenCalledWith(mockConfig.NHS_LOGIN_PRIVATE_KEY);

    expect(global.crypto.subtle.sign).toHaveBeenCalledWith(
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-512" },
      expect.anything(), // privateKey
      expect.any(Uint8Array),
    );
  });

  it("should throw if pemToCryptoKey rejects", async () => {
    (pemToCryptoKey as jest.Mock).mockRejectedValue(new Error("Invalid key"));

    await expect(generateSignedJwt(mockConfig, payload)).rejects.toThrow("Invalid key");

    expect(pemToCryptoKey).toHaveBeenCalledWith(mockConfig.NHS_LOGIN_PRIVATE_KEY);
    expect(global.crypto.subtle.sign).not.toHaveBeenCalled();
  });
});
