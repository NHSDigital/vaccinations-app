/**
 * @jest-environment node
 */

import pemToCryptoKey from "@src/utils/auth/pem-to-crypto-key";
import { configProvider } from "@src/utils/config";
import { generateKeyPairSync } from "crypto";

jest.mock("@src/utils/config");

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
    (configProvider as jest.Mock).mockImplementation(() => ({
      VACCINATION_APP_PRIVATE_KEY: "invalid-key",
    }));

    expect(pemToCryptoKey()).rejects.toThrow("Import key error");
  });

  it("return CryptoKey for valid key", () => {
    const testPEMString: string = generatePrivateKeyStub();
    (configProvider as jest.Mock).mockImplementation(() => ({
      VACCINATION_APP_PRIVATE_KEY: testPEMString,
    }));

    expect(pemToCryptoKey()).resolves.toBeDefined();
  });
});
