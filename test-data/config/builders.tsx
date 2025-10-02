import { ApimConfig } from "@src/utils/apimConfig";
import { AppConfig } from "@src/utils/config";
import { ConfigValue } from "@src/utils/lazy-config";
import { createTypeBuilder, randomBoolean, randomInteger, randomString, randomURL } from "@test-data/meta-builder";

export function appConfigBuilder() {
  return createTypeBuilder<AppConfig>({
    CONTENT_API_ENDPOINT: randomURL(),
    ELIGIBILITY_API_ENDPOINT: randomURL(),
    CONTENT_API_KEY: randomString(10),
    ELIGIBILITY_API_KEY: randomString(10),
    CONTENT_CACHE_PATH: randomString(10),
    NHS_LOGIN_URL: randomString(10),
    NHS_LOGIN_CLIENT_ID: randomString(10),
    NHS_LOGIN_SCOPE: randomString(10),
    NHS_LOGIN_PRIVATE_KEY: randomString(10),
    NBS_URL: randomString(10),
    NBS_BOOKING_PATH: randomString(10),
    NHS_APP_REDIRECT_LOGIN_URL: randomString(10),
    MAX_SESSION_AGE_MINUTES: randomInteger(1, 999),
    IS_APIM_AUTH_ENABLED: randomBoolean(),
    AUTH_SECRET: randomString(10),
  });
}

export function apimConfigBuilder() {
  return createTypeBuilder<ApimConfig>({
    ELIGIBILITY_API_KEY: randomString(10),
    APIM_PRIVATE_KEY: randomString(10),
    APIM_AUTH_URL: randomURL(),
    APIM_KEY_ID: randomString(10),
  });
}

export type AsyncConfigMock = {
  [key: string]: Promise<ConfigValue>;
};

class LazyConfigBuilder {
  private _configValues: Record<string, ConfigValue> = {};

  constructor() {
    this._configValues = {
      CONTENT_API_ENDPOINT: randomURL(),
      ELIGIBILITY_API_ENDPOINT: randomURL(),
      CONTENT_API_KEY: randomString(10),
      ELIGIBILITY_API_KEY: randomString(10),
      CONTENT_CACHE_PATH: randomString(10),
      NHS_LOGIN_URL: randomString(10),
      NHS_LOGIN_CLIENT_ID: randomString(10),
      NHS_LOGIN_SCOPE: randomString(10),
      NHS_LOGIN_PRIVATE_KEY: randomString(10),
      NBS_URL: randomString(10),
      NBS_BOOKING_PATH: randomString(10),
      NHS_APP_REDIRECT_LOGIN_URL: randomString(10),
      MAX_SESSION_AGE_MINUTES: randomInteger(1, 999),
      IS_APIM_AUTH_ENABLED: randomBoolean(),
      AUTH_SECRET: randomString(10),
    };
  }

  public withSsmPrefix(value: string): this {
    this._configValues.SSM_PREFIX = value;
    return this;
  }

  public withNhsAppRedirectLoginUrl(value: string | URL): this {
    this._configValues.NHS_APP_REDIRECT_LOGIN_URL = value;
    return this;
  }

  public withMaxSessionAgeMinutes(value: number): this {
    this._configValues.MAX_SESSION_AGE_MINUTES = value;
    return this;
  }

  public withNhsLoginUrl(value: URL): this {
    this._configValues.NHS_LOGIN_URL = value;
    return this;
  }

  public withNhsLoginClientId(value: string): this {
    this._configValues.NHS_LOGIN_CLIENT_ID = value;
    return this;
  }

  public andNhsLoginClientId(value: string): this {
    return this.withNhsLoginClientId(value);
  }

  public withNhsLoginPrivateKey(value: string): this {
    this._configValues.NHS_LOGIN_PRIVATE_KEY = value;
    return this;
  }

  public andNhsLoginPrivateKey(value: string): this {
    return this.withNhsLoginPrivateKey(value);
  }

  public withIsApimAuthEnabled(value: boolean): this {
    this._configValues.IS_APIM_AUTH_ENABLED = value;
    return this;
  }

  public build(): AsyncConfigMock {
    const asyncMock: AsyncConfigMock = {};
    for (const key in this._configValues) {
      if (Object.prototype.hasOwnProperty.call(this._configValues, key)) {
        asyncMock[key] = Promise.resolve(this._configValues[key]);
      }
    }
    return asyncMock;
  }
}

export function lazyConfigBuilder() {
  return new LazyConfigBuilder();
}
