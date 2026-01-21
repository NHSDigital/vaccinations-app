import NHSLoginAuthProvider from "@src/app/api/auth/[...nextauth]/provider";
import { DeployEnvironment } from "@src/types/environments";
import config from "@src/utils/config";
import { ConfigMock, configBuilder } from "@test-data/config/builders";

jest.mock("@src/utils/auth/pem-to-crypto-key");
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("provider", () => {
  const mockedConfig = config as ConfigMock;

  describe("not using fake NHS login", () => {
    beforeEach(() => {
      const defaultConfig = configBuilder()
        .withNhsLoginUrl(new URL("https://abc"))
        .andDeployEnvironment(DeployEnvironment.preprod)
        .build();
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
    it("should not use NONCE check when using fake login port", async () => {
      const defaultConfig = configBuilder().withNhsLoginUrl(new URL("https://abc:9123")).build();
      Object.assign(mockedConfig, defaultConfig);
      const provider = await NHSLoginAuthProvider();
      expect(provider.checks).toEqual(["state"]);
    });

    it("should not use NONCE check when in test environment", async () => {
      const defaultConfig = configBuilder().withDeployEnvironment(DeployEnvironment.test).build();
      Object.assign(mockedConfig, defaultConfig);
      const provider = await NHSLoginAuthProvider();
      expect(provider.checks).toEqual(["state"]);
    });
  });
});
