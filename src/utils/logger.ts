import pino, { Logger } from "pino";
import { asyncLocalStorage } from "@src/utils/requestContext";

export const logger: Logger = pino({
  level: process.env.PINO_LOG_LEVEL ?? "info",
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  mixin() {
    return {
      requestId: asyncLocalStorage?.getStore()?.requestId,
      traceId: process.env._X_AMZN_TRACE_ID,
      lambdaVersion: process.env.AWS_LAMBDA_FUNCTION_VERSION,
      appVersion: process.env.APP_VERSION,
    };
  },
});
