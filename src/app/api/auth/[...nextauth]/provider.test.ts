import NHSLoginAuthProvider from "@src/app/api/auth/[...nextauth]/provider";
import config from "@src/utils/config";
import { ConfigMock, configBuilder } from "@test-data/config/builders";

jest.mock("@src/utils/auth/pem-to-crypto-key");
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("provider", () => {
  const mockedConfig = config as ConfigMock;

  describe("not using fake NHS login", () => {
    beforeEach(() => {
      const defaultConfig = configBuilder().withNhsLoginUrl(new URL("https://abc")).build();
      Object.assign(mockedConfig, defaultConfig);
    });

    it("should be configured correctly", async () => {
      const provider = await NHSLoginAuthProvider();
      expect(provider.type).toEqual("oidc");
      expect(provider.authorization.params.prompt).toBe("none");
      expect(provider.client?.token_endpoint_auth_method).toEqual("private_key_jwt");
      expect(provider.checks).toEqual(["state", "nonce"]);
    });
  });

  describe("using fake NHS login", () => {
    beforeEach(() => {
      const defaultConfig = configBuilder().withNhsLoginUrl(new URL("https://abc:9123")).build();
      Object.assign(mockedConfig, defaultConfig);
    });

    it("should not use NONCE check", async () => {
      const provider = await NHSLoginAuthProvider();
      expect(provider.checks).toEqual(["state"]);
    });
  });
});
