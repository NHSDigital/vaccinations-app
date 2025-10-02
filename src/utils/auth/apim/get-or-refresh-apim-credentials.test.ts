import { retrieveApimCredentials } from "@src/utils/auth/apim/get-apim-access-token";
import { getOrRefreshApimCredentials } from "@src/utils/auth/apim/get-or-refresh-apim-credentials";
import lazyConfig from "@src/utils/lazy-config";
import { AsyncConfigMock, lazyConfigBuilder } from "@test-data/config/builders";
import { JWT } from "next-auth/jwt";

jest.mock("@src/utils/auth/apim/get-apim-access-token", () => ({
  retrieveApimCredentials: jest.fn(),
}));
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/utils/lazy-config");

describe("getOrRefreshApimCredentials", () => {
  const mockedConfig = lazyConfig as AsyncConfigMock;

  beforeEach(() => {
    const defaultConfig = lazyConfigBuilder().withIsApimAuthEnabled(true).build();
    Object.assign(mockedConfig, defaultConfig);
  });

  describe("when AUTH APIM is available", () => {
    const oldNEXT_RUNTIME = process.env.NEXT_RUNTIME;

    mockedConfig.IS_APIM_AUTH_ENABLED = Promise.resolve(true);

    const nowInSeconds = 1749052001;

    beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers().setSystemTime(nowInSeconds * 1000);
      process.env.NEXT_RUNTIME = "nodejs";
    });

    beforeEach(async () => {
      (retrieveApimCredentials as jest.Mock).mockResolvedValue({
        accessToken: "new-apim-access-token",
        expiresAt: nowInSeconds + 1111,
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
      process.env.NEXT_RUNTIME = oldNEXT_RUNTIME;
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
        expiresAt: nowInSeconds + 1111,
      });
    });

    it("should return stored APIM creds if fresh", async () => {
      const token = {
        apim: {
          access_token: "old-access-token",
          expires_at: nowInSeconds + 60,
        },
        nhs_login: { id_token: "old-id-token" },
      } as JWT;

      const result = await getOrRefreshApimCredentials(token, nowInSeconds);

      expect(result).toEqual({
        accessToken: "old-access-token",
        expiresAt: nowInSeconds + 60,
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
        expiresAt: nowInSeconds + 1111,
      });
    });

    describe("when invoked from Edge runtime", () => {
      it("should return stored APIM creds without checking expiry", async () => {
        process.env.NEXT_RUNTIME = "edge";
        const token = {
          apim: { access_token: "stored-access-token", expires_at: 88 },
          nhs_login: { id_token: "id-token" },
        } as JWT;

        const result = await getOrRefreshApimCredentials(token, nowInSeconds);

        expect(result).toEqual({
          accessToken: "stored-access-token",
          expiresAt: 88,
        });
      });

      it("should return undefined if APIM creds empty", async () => {
        process.env.NEXT_RUNTIME = "edge";
        const token = { apim: {}, nhs_login: { id_token: "id-token" } } as JWT;

        const result = await getOrRefreshApimCredentials(token, nowInSeconds);
        expect(result).toBeUndefined();
      });
    });
  });

  describe("when AUTH APIM is not available", () => {
    mockedConfig.IS_APIM_AUTH_ENABLED = Promise.resolve(true);

    const nowInSeconds = 1749052001;

    beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers().setSystemTime(nowInSeconds * 1000);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should return undefined if APIM auth is not enabled", async () => {
      const token = { apim: {}, nhs_login: { id_token: "id-token" } } as JWT;

      const result = await getOrRefreshApimCredentials(token, nowInSeconds);

      expect(result).toBeUndefined();
    });
  });
});
