import getSSMParam from "@src/utils/get-ssm-param";
import { logger } from "@src/utils/logger";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "lazy-config" });

type ConfigValue = string | number | boolean | URL | undefined;

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

class LazyConfig {
  private _cache = new Map<string, ConfigValue>();
  private ttl: number = 0;
  static readonly CACHE_TTL_MILLIS: number = 300 * 1000;

  private _coerceType(value: string | undefined): ConfigValue {
    if (value === undefined || value.trim() === "") {
      return undefined;
    }

    const trimmedValue = value.trim();
    const lowercasedValue = trimmedValue.toLowerCase();

    if (lowercasedValue === "true") return true;
    if (lowercasedValue === "false") return false;

    const num = Number(trimmedValue);
    if (!isNaN(num)) return num;

    try {
      return new URL(trimmedValue);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      // Not a URL
    }

    return trimmedValue;
  }

  public async getAttribute(key: string): Promise<ConfigValue> {
    if (this.ttl < Date.now()) {
      (this.resetCache(), (this.ttl = Date.now() + LazyConfig.CACHE_TTL_MILLIS));
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

  private getFromEnvironmentOrSSM = async (key: string): Promise<string> => {
    let value = process.env[key];

    if (value === undefined || value === null) {
      const ssmPrefix = await this.getAttribute("SSM_PREFIX");

      if (typeof ssmPrefix !== "string" || ssmPrefix === "") {
        log.error(
          { context: { key, ssmPrefix } },
          "SSM_PREFIX is not configured correctly. Expected a non-empty string.",
        );
        throw new Error(`SSM_PREFIX is not configured correctly. Expected a non-empty string, but got: ${ssmPrefix}`);
      }

      log.debug({ context: { key, ssmPrefix } }, "getting from SSM");
      value = await getSSMParam(`${ssmPrefix}${key}`);
    }

    if (value === undefined || value === null) {
      log.error({ context: { key } }, "Unable to get config item.");
      throw new Error(`Unable to get config item ${key}`);
    }

    return value;
  };

  public resetCache() {
    this._cache = new Map();
  }
}

const lazyConfigInstance = new LazyConfig();

const lazyConfig = createReadOnlyDynamic(lazyConfigInstance);

export default lazyConfig;
