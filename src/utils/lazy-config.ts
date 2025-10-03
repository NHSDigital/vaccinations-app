import { EligibilityApiError } from "@src/services/eligibility-api/gateway/exceptions";
import getSSMParam from "@src/utils/get-ssm-param";
import { logger } from "@src/utils/logger";
import { retry } from "es-toolkit";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "lazy-config" });

export type ConfigValue = string | number | boolean | URL | undefined;

/**
 * A wrapper around an object which intercepts access to properties. If the property really exists on the object,
 * that's what the caller gets, but if it doesn't, the object's getAttribute("property-name") is called instead.
 */
function createReadOnlyDynamic<T extends object>(instance: T): T & { [key: string]: Promise<unknown> } {
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

  return new Proxy(instance, handler) as T & { [key: string]: Promise<unknown> };
}

/**
 * Config object which only loads config items when, and crucially if, they are used.
 * Loads config from environment if it exists there, from SSM otherwise.
 * Caches items for CACHE_TTL_MILLIS milliseconds, so we don't get items more than once.
 */
class LazyConfig {
  private _cache = new Map<string, ConfigValue>();
  private ttl: number = Date.now() + LazyConfig.CACHE_TTL_MILLIS;
  static readonly CACHE_TTL_MILLIS: number = 300 * 1000;

  private static toUrl = (value: string): URL => new URL(value);
  private static toBoolean = (value: string): boolean | undefined => {
    const lower = value.toLowerCase();
    if (lower === "true") return true;
    if (lower === "false") return false;
    return undefined;
  };
  static readonly converters: Record<string, (value: string) => ConfigValue> = {
    APIM_AUTH_URL: LazyConfig.toUrl,
    CONTENT_API_ENDPOINT: LazyConfig.toUrl,
    ELIGIBILITY_API_ENDPOINT: LazyConfig.toUrl,
    NBS_URL: LazyConfig.toUrl,
    NHS_LOGIN_URL: LazyConfig.toUrl,
    CONTENT_CACHE_IS_CHANGE_APPROVAL_ENABLED: LazyConfig.toBoolean,
    IS_APIM_AUTH_ENABLED: LazyConfig.toBoolean,
    MAX_SESSION_AGE_MINUTES: (value: string) => {
      const num = Number(value);
      if (!isNaN(num)) return num;
      return undefined;
    },
  };

  /**
   * Make sure that the config items are returned as the correct types - booleans, numbers, strings, what have you.
   */
  private _coerceType(key: string, value: string | undefined): ConfigValue {
    let result: ConfigValue;

    if (value === undefined || value.trim() === "") {
      result = undefined;
    } else {
      const converter = LazyConfig.converters[key];
      if (!converter) {
        result = value.trim();
      } else {
        try {
          result = converter(value.trim());
        } catch (error) {
          log.warn({ context: { key, value }, error }, "Config item type coercion failed");
          result = undefined;
        }
      }
    }

    if (result === undefined) {
      log.error({ context: { key, value } }, "Unable to get config item");
      throw new ConfigError(`Unable to get config item ${key}`);
    }
    return result;
  }

  public async getAttribute(key: string): Promise<ConfigValue> {
    if (this.ttl < Date.now()) {
      this.resetCache();
    }

    if (this._cache.has(key)) {
      log.debug({ context: { key } }, "cache hit");
      return this._cache.get(key);
    }

    log.debug({ context: { key } }, "cache miss");
    const value = await this.getFromEnvironmentOrSSM(key);

    const coercedValue = this._coerceType(key, value);

    this._cache.set(key, coercedValue);

    return coercedValue;
  }

  private async getFromEnvironmentOrSSM(key: string): Promise<string> {
    let value = process.env[key];

    if (value === undefined || value === null) {
      const ssmPrefix = await this.getSsmPrefix();

      log.debug({ context: { key, ssmPrefix } }, "getting from SSM");
      value = await retry(() => getSSMParam(`${ssmPrefix}${key}`), {
        retries: 10,
        delay: (attempt) => 100 * Math.pow(2, attempt - 1),
      });
    }

    if (value === undefined || value === null) {
      log.error({ context: { key } }, "Unable to get config item.");
      throw new ConfigError(`Unable to get config item ${key}`);
    }

    return value;
  }

  private async getSsmPrefix(): Promise<string> {
    const key = "SSM_PREFIX";

    if (this._cache.has(key)) {
      return this._cache.get(key) as string;
    }

    const prefix = process.env[key];
    if (typeof prefix === "string" && prefix !== "") {
      this._cache.set(key, prefix);
      return prefix;
    }

    log.error({ context: { key } }, "SSM_PREFIX is not configured in the environment.");
    throw new ConfigError("SSM_PREFIX is not configured correctly in the environment.");
  }

  public resetCache() {
    log.info("reset cache");
    this._cache.clear();
    this.ttl = Date.now() + LazyConfig.CACHE_TTL_MILLIS;
  }
}

export class ConfigError extends EligibilityApiError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "ConfigError";
  }
}

const lazyConfigInstance = new LazyConfig();

const lazyConfig = createReadOnlyDynamic(lazyConfigInstance);

export default lazyConfig;
