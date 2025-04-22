import { pemToPrivateKey } from "@src/utils/auth/pem-to-private-key";

describe("pemToPrivateKey", () => {
  // VIA-87 2025-04-16 Review if this function is covered by other tests
  it("throws error if key file path env var not set", () => {
    process.env.NHS_LOGIN_LOCAL_PRIVATE_KEY_FILE_PATH = undefined;
    expect(pemToPrivateKey()).rejects.toThrow(
      "Unable to load key from file: NHS_LOGIN_PRIVATE_KEY_FILE_PATH env variable not set",
    );
  });
});
