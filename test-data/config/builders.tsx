import { AppConfig, ConfigValue } from "@src/utils/config";
import { randomBoolean, randomInteger, randomString, randomURL } from "@test-data/meta-builder";

export type ConfigMock = { [K in keyof AppConfig]: Promise<AppConfig[K]> };

class ConfigBuilder {
  private _configValues: Partial<AppConfig> & Record<string, ConfigValue> = {};

  constructor() {
    this._configValues = {
      CONTENT_API_ENDPOINT: randomURL(),
      ELIGIBILITY_API_ENDPOINT: randomURL(),
      CONTENT_API_KEY: randomString(10),
      ELIGIBILITY_API_KEY: randomString(10),
      CONTENT_CACHE_PATH: randomString(10),
      NHS_LOGIN_URL: randomURL(),
      NHS_LOGIN_CLIENT_ID: randomString(10),
      NHS_LOGIN_SCOPE: randomString(10),
      NHS_LOGIN_PRIVATE_KEY: randomString(10),
      NBS_URL: randomURL(),
      NBS_BOOKING_PATH: randomString(10),
      NHS_APP_REDIRECT_LOGIN_URL: randomURL(),
      MAX_SESSION_AGE_MINUTES: randomInteger(1, 999),
      IS_APIM_AUTH_ENABLED: randomBoolean(),
      AUTH_SECRET: randomString(10),
    };
  }

  public withSsmPrefix(value: string): this {
    this._configValues.SSM_PREFIX = value;
    return this;
  }

  public withNhsAppRedirectLoginUrl(value: URL): this {
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

  public withNhsLoginScope(value: string): this {
    this._configValues.NHS_LOGIN_SCOPE = value;
    return this;
  }

  public andNhsLoginScope(value: string): this {
    return this.withNhsLoginScope(value);
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

  public andIsApimAuthEnabled(value: boolean): this {
    return this.withIsApimAuthEnabled(value);
  }

  public withApimKeyId(value: string): this {
    this._configValues.APIM_KEY_ID = value;
    return this;
  }

  public andApimKeyId(value: string): this {
    return this.withApimKeyId(value);
  }

  public withApimPrivateKey(value: string): this {
    this._configValues.APIM_PRIVATE_KEY = value;
    return this;
  }

  public andApimPrivateKey(value: string): this {
    return this.withApimPrivateKey(value);
  }

  public withApimAuthUrl(value: URL): this {
    this._configValues.APIM_AUTH_URL = value;
    return this;
  }

  public andApimAuthUrl(value: URL): this {
    return this.withApimAuthUrl(value);
  }

  public withContentCachePath(value: string): this {
    this._configValues.CONTENT_CACHE_PATH = value;
    return this;
  }

  public withContentApiKey(value: string): this {
    this._configValues.CONTENT_API_KEY = value;
    return this;
  }

  public andContentApiKey(value: string): this {
    return this.withContentApiKey(value);
  }

  public withContentApiEndpoint(value: URL): this {
    this._configValues.CONTENT_API_ENDPOINT = value;
    return this;
  }

  public andContentApiEndpoint(value: URL): this {
    return this.withContentApiEndpoint(value);
  }

  public withContentCacheIsChangeApprovalEnabled(value: boolean): this {
    this._configValues.CONTENT_CACHE_IS_CHANGE_APPROVAL_ENABLED = value;
    return this;
  }

  public andContentCacheIsChangeApprovalEnabled(value: boolean): this {
    return this.withContentCacheIsChangeApprovalEnabled(value);
  }

  public withEligibilityApiEndpoint(value: URL): this {
    this._configValues.ELIGIBILITY_API_ENDPOINT = value;
    return this;
  }

  public withEligibilityApiKey(value: string): this {
    this._configValues.ELIGIBILITY_API_KEY = value;
    return this;
  }

  public andEligibilityApiKey(value: string): this {
    return this.withEligibilityApiKey(value);
  }

  public withAuthSecret(value: string): this {
    this._configValues.AUTH_SECRET = value;
    return this;
  }

  public andAuthSecret(value: string): this {
    return this.withAuthSecret(value);
  }

  public withNbsUrl(value: URL): this {
    this._configValues.NBS_URL = value;
    return this;
  }

  public andNbsUrl(value: URL): this {
    return this.withNbsUrl(value);
  }

  public withNbsBookingPath(value: string): this {
    this._configValues.NBS_BOOKING_PATH = value;
    return this;
  }

  public andNbsBookingPath(value: string): this {
    return this.withNbsBookingPath(value);
  }

  public withPinoLogLevel(value: string): this {
    this._configValues.PINO_LOG_LEVEL = value;
    return this;
  }

  public andPinoLogLevel(value: string): this {
    return this.withPinoLogLevel(value);
  }

  public build(): ConfigMock {
    const asyncMock: Record<string, Promise<ConfigValue>> = {};
    for (const key in this._configValues) {
      if (Object.prototype.hasOwnProperty.call(this._configValues, key)) {
        asyncMock[key] = Promise.resolve(this._configValues[key]);
      }
    }
    return asyncMock as ConfigMock;
  }
}

export function configBuilder() {
  return new ConfigBuilder();
}
