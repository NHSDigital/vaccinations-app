import { Campaigns } from "@src/services/content-api/types";
import { EligibilityApiError } from "@src/services/eligibility-api/gateway/exceptions";
import { UtcDateFromStringSchema } from "@src/utils/date";
import getSecret from "@src/utils/get-secret";
import { logger } from "@src/utils/logger";
import { retry } from "es-toolkit";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "lazy-config" });

export type ConfigValue = string | number | boolean | URL | Campaigns | undefined;

export interface AppConfig {
  // SecretsManager secrets stored as SecureStrings
  NHS_LOGIN_CLIENT_ID: string;
  CONTENT_API_KEY: string;
  ELIGIBILITY_API_KEY: string;
  NHS_LOGIN_PRIVATE_KEY: string;
  AUTH_SECRET: string;
  APIM_PRIVATE_KEY: string;

  // Environment Variables in Lambda
  CONTENT_API_ENDPOINT: URL;
  CONTENT_API_RATE_LIMIT_PER_MINUTE: number;
  ELIGIBILITY_API_ENDPOINT: URL;
  CONTENT_CACHE_PATH: string;
  CONTENT_CACHE_IS_CHANGE_APPROVAL_ENABLED: boolean;
  NHS_LOGIN_URL: URL;
  NHS_LOGIN_SCOPE: string;
  NBS_URL: URL;
  NBS_BOOKING_PATH: string;
  MAX_SESSION_AGE_MINUTES: number;
  NHS_APP_REDIRECT_LOGIN_URL: URL;
  IS_APIM_AUTH_ENABLED: boolean;
  APIM_AUTH_URL: URL;
  APIM_KEY_ID: string;
  CAMPAIGNS: Campaigns;
}

/**
 * Helper type that takes an object type T and makes all its properties return Promises
 */
type AsyncConfig<T> = {
  [K in keyof T]: Promise<T[K]>;
};

/**
 * A wrapper around an object which intercepts access to properties. If the property really exists on the object,
 * that's what the caller gets, but if it doesn't, the object's getAttribute("property-name") is called instead.
 */
function createReadOnlyDynamic<T extends object, C extends object>(instance: T): T & AsyncConfig<C> {
  const handler: ProxyHandler<T> = {
    get(target, prop, receiver) {
      if (prop in target) {
        return Reflect.get(target, prop, receiver);
      }
      if (typeof prop === "symbol") {
        return Reflect.get(target, prop, receiver);
      }
      if ("getAttribute" in target && typeof target.getAttribute === "function") {
        return target.getAttribute(prop);
      }
      return Promise.resolve(undefined);
    },
  };

  return new Proxy(instance, handler) as T & AsyncConfig<C>;
}

/**
 * Config object which only loads config items when, and crucially if, they are used.
 * Loads config from environment if it exists there, from SecretsManager otherwise.
 * Caches items for CACHE_TTL_MILLIS milliseconds, so we don't get items more than once.
 */
class Config {
  private readonly _cache = new Map<string, ConfigValue>();
  private ttlExpiresAt: number = Date.now() + Config.CACHE_TTL_MILLIS;
  static readonly CACHE_TTL_MILLIS: number = 300 * 1000;

  private static readonly toNumber = (value: string): number | undefined => {
    const num = Number(value);
    if (!Number.isNaN(num)) return num;
    return undefined;
  };
  private static readonly toUrl = (value: string): URL => new URL(value);
  private static readonly toBoolean = (value: string): boolean | undefined => {
    const lower = value.toLowerCase();
    if (lower === "true") return true;
    if (lower === "false") return false;
    return undefined;
  };
  private static readonly toCampaigns = (rawValue: string): Campaigns | undefined => {
    try {
      interface RawCampaign {
        start: string;
        end: string;
      }

      const rawObj: Record<string, RawCampaign[]> = JSON.parse(rawValue);

      const parsedSchedule: Campaigns = {};

      for (const [vaccineName, campaigns] of Object.entries(rawObj)) {
        parsedSchedule[vaccineName] = campaigns.map((c) => ({
          start: UtcDateFromStringSchema.parse(c.start),
          end: UtcDateFromStringSchema.parse(c.end),
        }));
      }

      return parsedSchedule;
    } catch {
      return undefined;
    }
  };
  static readonly converters: Record<string, (value: string) => ConfigValue> = {
    APIM_AUTH_URL: Config.toUrl,
    CONTENT_API_ENDPOINT: Config.toUrl,
    CONTENT_API_RATE_LIMIT_PER_MINUTE: Config.toNumber,
    ELIGIBILITY_API_ENDPOINT: Config.toUrl,
    NBS_URL: Config.toUrl,
    NHS_LOGIN_URL: Config.toUrl,
    CONTENT_CACHE_IS_CHANGE_APPROVAL_ENABLED: Config.toBoolean,
    NHS_APP_REDIRECT_LOGIN_URL: Config.toUrl,
    IS_APIM_AUTH_ENABLED: Config.toBoolean,
    MAX_SESSION_AGE_MINUTES: Config.toNumber,
    CAMPAIGNS: Config.toCampaigns,
  };

  /**
   * Make sure that the config items are returned as the correct types - booleans, numbers, strings, what have you.
   */
  private _coerceType(key: string, value: string | undefined): ConfigValue {
    let result: ConfigValue;

    if (value === undefined || value.trim() === "") {
      result = undefined;
    } else {
      const converter = Config.converters[key];
      if (converter) {
        try {
          result = converter(value.trim());
        } catch (error) {
          log.warn({ context: { key }, error }, "Config item type coercion failed");
          result = undefined;
        }
      } else {
        result = value.trim();
      }
    }

    if (result === undefined) {
      log.error({ context: { key } }, "Unable to get config item");
      throw new ConfigError(`Unable to get config item ${key}`);
    }
    return result;
  }

  public async getAttribute(key: string): Promise<ConfigValue> {
    if (this.ttlExpiresAt < Date.now()) {
      this.resetCache();
    }

    if (this._cache.has(key)) {
      log.debug({ context: { key } }, "cache hit");
      return this._cache.get(key);
    }

    log.debug({ context: { key } }, "cache miss");
    const value = await this.getFromEnvironmentOrSecretsManager(key);

    const coercedValue = this._coerceType(key, value);

    this._cache.set(key, coercedValue);

    return coercedValue;
  }

  private async getFromEnvironmentOrSecretsManager(key: string): Promise<string> {
    let value = process.env[key];
    const initialDelayMillis = 100;

    if (value === undefined || value === null) {
      const ssmPrefix = await this.getSecretPrefix();

      log.debug({ context: { key, ssmPrefix } }, "getting from SecretsManager");
      // Get value from SecretsManager, on failure retry won 100ms initially, with retry delays doubling each time
      // 100ms -> 200ms -> 400ms etc
      // Total ~ 100s
      value = await retry(() => getSecret(`${ssmPrefix}${key}`), {
        retries: 10,
        delay: (attempt) => initialDelayMillis * Math.pow(2, attempt - 1),
      });
    }

    if (value === undefined || value === null) {
      log.error({ context: { key } }, "Unable to get config item.");
      throw new ConfigError(`Unable to get config item ${key}`);
    }

    return value;
  }

  private async getSecretPrefix(): Promise<string> {
    const key = "SECRET_PREFIX";

    const prefix = process.env[key];
    if (prefix) {
      return prefix;
    }

    log.error({ context: { key } }, "SECRET_PREFIX is not configured in the environment.");
    throw new ConfigError("SECRET_PREFIX is not configured correctly in the environment.");
  }

  public resetCache() {
    log.info("reset cache");
    this._cache.clear();
    this.ttlExpiresAt = Date.now() + Config.CACHE_TTL_MILLIS;
  }
}

export class ConfigError extends EligibilityApiError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "ConfigError";
  }
}

const configInstance = new Config();

const config = createReadOnlyDynamic<Config, AppConfig>(configInstance);

export default config;
