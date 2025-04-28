/**
 * @jest-environment node
 */

import pemToCryptoKey from "@src/utils/auth/pem-to-crypto-key";
import { generateKeyPairSync } from "crypto";

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
  it("throws error for invalid key", () => {
    expect(pemToCryptoKey("invalid-key")).rejects.toThrow("Import key error");
  });

  it("return CryptoKey for valid key", () => {
    const testPEMString: string = generatePrivateKeyStub();
    expect(pemToCryptoKey(testPEMString)).resolves.toBeDefined();
  });
});
