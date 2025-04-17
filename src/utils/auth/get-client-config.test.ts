/**
 * @jest-environment node
 */

import { getAuthConfig } from "@src/utils/auth/get-auth-config";
import { pemToPrivateKey } from "@src/utils/auth/pem-to-private-key";
import { getClientConfig } from "@src/utils/auth/get-client-config";
import * as client from "openid-client";

const mockPrivateKeyJWT = {};
const mockDiscoveryClientConfig = {};

jest.mock("@src/utils/auth/pem-to-private-key");
jest.mock("@src/utils/auth/get-auth-config");
jest.mock("openid-client", () => {
  return {
    discovery: jest.fn(),
    PrivateKeyJwt: jest.fn(() => mockPrivateKeyJWT),
  };
});

const mockAuthConfig = {
  url: "https://url-value",
  client_id: "client-id-value",
};
const mockCryptoKey = {};
const mockAuthConfigUrl = new URL(mockAuthConfig.url);

(getAuthConfig as jest.Mock).mockImplementation(() => mockAuthConfig);
(pemToPrivateKey as jest.Mock).mockImplementation(() => mockCryptoKey);

describe("getClientConfig", () => {
  let mockDiscovery: jest.Mock;

  beforeEach(() => {
    mockDiscovery = client.discovery as jest.Mock;
  });

  it("calls client discovery with expected args and returns result", async () => {
    mockDiscovery.mockResolvedValue(mockDiscoveryClientConfig);

    const clientConfig = await getClientConfig();

    expect(client.PrivateKeyJwt).toHaveBeenCalledWith(mockCryptoKey);
    expect(client.discovery).toHaveBeenCalledWith(
      mockAuthConfigUrl,
      mockAuthConfig.client_id,
      "",
      mockPrivateKeyJWT,
    );
    expect(clientConfig).toBe(mockDiscoveryClientConfig);
  });

  it("throws if error thrown by discovery method", async () => {
    const errorThrownByDiscovery = new Error("error-thrown-by-discovery");
    mockDiscovery.mockRejectedValue(errorThrownByDiscovery);

    await expect(getClientConfig()).rejects.toThrow(errorThrownByDiscovery);
  });
});
