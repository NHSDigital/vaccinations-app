/**
 * @jest-environment node
 */
import pemToCryptoKey from "@src/utils/auth/pem-to-crypto-key";
import { generateKeyPairSync } from "crypto";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

const generatePrivateKeyStub = (): string => {
  const { privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });

  return privateKey.export({
    format: "pem",
    type: "pkcs8",
  }) as string;
};

describe("pemToCryptoKey", () => {
  it("throws error for invalid key", async () => {
    await expect(pemToCryptoKey("invalid-key")).rejects.toThrow("Import key error");
  });

  it("return CryptoKey for valid key", async () => {
    const testPEMString: string = generatePrivateKeyStub();
    await expect(pemToCryptoKey(testPEMString)).resolves.toBeDefined();
  });
});
