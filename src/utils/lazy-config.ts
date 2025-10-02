import getSSMParam from "@src/utils/get-ssm-param";
import { logger } from "@src/utils/logger";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "lazy-config" });

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
    has(target, prop) {
      if ("hasAttribute" in target && typeof target.hasAttribute === "function") {
        return target.hasAttribute(prop) || prop in target;
      }
      return prop in target;
    },
  };

  return new Proxy(instance, handler) as T & { [key: string]: Promise<unknown> };
}

class LazyConfig {
  private _cache = new Map<string, unknown>();

  private _coerceType(value: string | undefined): unknown {
    if (value === undefined) {
      return undefined;
    }
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;

    const num = Number(value);
    if (!isNaN(num) && value.trim() !== "") return num;

    return value;
  }

  public hasAttribute(key: string): boolean {
    return this._cache.has(key) || process.env[key] !== undefined;
  }

  public async getAttribute(key: string): Promise<unknown> {
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
      throw new Error(`Unable to get param: ${key} from environment or SSM`);
    }

    return value;
  };

  public _inspectCache(): Record<string, unknown> {
    return Object.fromEntries(this._cache);
  }
}

const lazyConfigInstance = new LazyConfig();

const lazyConfig = createReadOnlyDynamic(lazyConfigInstance);

export default lazyConfig;
