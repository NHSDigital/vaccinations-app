import NHSLoginAuthProvider from "@src/app/api/auth/[...nextauth]/provider";
import config from "@src/utils/config";
import { AsyncConfigMock, configBuilder } from "@test-data/config/builders";

jest.mock("@src/utils/auth/pem-to-crypto-key");
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("provider", () => {
  const mockedConfig = config as AsyncConfigMock;

  beforeEach(() => {
    const defaultConfig = configBuilder().build();
    Object.assign(mockedConfig, defaultConfig);
  });

  it("should be configured correctly", async () => {
    const provider = await NHSLoginAuthProvider();
    expect(provider.type).toEqual("oidc");
    expect(provider.authorization.params.prompt).toBe("none");
    expect(provider.client?.token_endpoint_auth_method).toEqual("private_key_jwt");
    expect(provider.checks).toEqual(["state"]);
  });
});
