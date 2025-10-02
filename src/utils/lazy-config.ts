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
  private ttl: number = 0;
  static readonly CACHE_TTL_MILLIS: number = 300 * 1000;

  /**
   * Make sure that the config items are returned as the correct types - booleans, numbers, strings, what have you.
   */
  private _coerceType(value: string | undefined): ConfigValue {
    if (value === undefined || value.trim() === "") {
      return undefined;
    }

    const trimmedValue = value.trim();
    const lowercasedValue = trimmedValue.toLowerCase();

    if (lowercasedValue === "true") return true;
    if (lowercasedValue === "false") return false;

    const num = Number(trimmedValue);
    if (!Number.isNaN(num)) return num;

    try {
      return new URL(trimmedValue);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      // Not a URL
      return trimmedValue;
    }
  }

  public async getAttribute(key: string): Promise<ConfigValue> {
    if (this.ttl < Date.now()) {
      this.resetCache();
      this.ttl = Date.now() + LazyConfig.CACHE_TTL_MILLIS;
    }

    if (this._cache.has(key)) {
      log.debug({ context: { key } }, "cache hit");
      return this._cache.get(key);
    }

    log.debug({ context: { key } }, "cache miss");
    const value = await this.getFromEnvironmentOrSSM(key);

    const coercedValue = this._coerceType(value);

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
      throw new Error(`Unable to get config item ${key}`);
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
    throw new Error("SSM_PREFIX is not configured correctly in the environment.");
  }

  public resetCache() {
    this._cache = new Map();
  }
}

const lazyConfigInstance = new LazyConfig();

const lazyConfig = createReadOnlyDynamic(lazyConfigInstance);

export default lazyConfig;
