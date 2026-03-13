import { retrieveApimCredentials } from "@src/utils/auth/apim/get-apim-access-token";
import { getOrRefreshApimCredentials } from "@src/utils/auth/apim/get-or-refresh-apim-credentials";
import config from "@src/utils/config";
import { ConfigMock, configBuilder } from "@test-data/config/builders";
import { JWT } from "next-auth/jwt";

jest.mock("@src/utils/auth/apim/get-apim-access-token", () => ({
  retrieveApimCredentials: jest.fn(),
}));
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/utils/config");

describe("getOrRefreshApimCredentials", () => {
  const mockedConfig = config as ConfigMock;

  beforeEach(() => {
    const defaultConfig = configBuilder().withIsApimAuthEnabled(true).build();
    Object.assign(mockedConfig, defaultConfig);
  });

  describe("when AUTH APIM is available", () => {
    const nowInSeconds = 1749052001;

    beforeEach(() => {
      mockedConfig.IS_APIM_AUTH_ENABLED = Promise.resolve(true);

      jest.clearAllMocks();
      jest.useFakeTimers().setSystemTime(nowInSeconds * 1000);
    });

    beforeEach(async () => {
      (retrieveApimCredentials as jest.Mock).mockResolvedValue({
        accessToken: "new-apim-access-token",
        expiresAt: nowInSeconds + 600,
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should return undefined and logs error if token does not contain id_token", async () => {
      const token = { apim: {}, nhs_login: {} } as JWT;

      const result = await getOrRefreshApimCredentials(token, nowInSeconds);

      expect(result).toBeUndefined();
    });

    it("should return new APIM creds if stored creds are empty", async () => {
      const token = { apim: {}, nhs_login: { id_token: "id-token" } } as JWT;

      const result = await getOrRefreshApimCredentials(token, nowInSeconds);

      expect(result).toMatchObject({
        accessToken: "new-apim-access-token",
        expiresAt: nowInSeconds + 600,
      });
    });

    it("should return stored APIM creds if fresh", async () => {
      const token = {
        apim: {
          access_token: "old-access-token",
          expires_at: nowInSeconds + 120,
        },
        nhs_login: { id_token: "old-id-token" },
      } as JWT;

      const result = await getOrRefreshApimCredentials(token, nowInSeconds);

      expect(result).toEqual({
        accessToken: "old-access-token",
        expiresAt: nowInSeconds + 120,
      });
    });

    it("should return new APIM creds if expired", async () => {
      const token = {
        apim: { access_token: "old-access-token", expires_at: nowInSeconds - 60 },
        nhs_login: { id_token: "id-token" },
      } as JWT;

      const result = await getOrRefreshApimCredentials(token, nowInSeconds);

      expect(result).toEqual({
        accessToken: "new-apim-access-token",
        expiresAt: nowInSeconds + 600,
      });
    });

    it("should return new APIM creds if near expiry", async () => {
      const token = {
        apim: { access_token: "old-access-token", expires_at: nowInSeconds + 119 },
        nhs_login: { id_token: "id-token" },
      } as JWT;

      const result = await getOrRefreshApimCredentials(token, nowInSeconds);

      expect(result).toEqual({
        accessToken: "new-apim-access-token",
        expiresAt: nowInSeconds + 600,
      });
    });
  });

  describe("when AUTH APIM is not enabled", () => {
    const nowInSeconds = 1749052001;

    beforeEach(() => {
      mockedConfig.IS_APIM_AUTH_ENABLED = Promise.resolve(false);

      jest.clearAllMocks();
      jest.useFakeTimers().setSystemTime(nowInSeconds * 1000);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should return undefined", async () => {
      const token = { apim: {}, nhs_login: { id_token: "id-token" } } as JWT;

      const result = await getOrRefreshApimCredentials(token, nowInSeconds);

      expect(result).toBeUndefined();
    });
  });
});
