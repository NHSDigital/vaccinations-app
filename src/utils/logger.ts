import pino, { LogDescriptor, Logger } from "pino";
import { asyncLocalStorage } from "@src/utils/requestContext";

const isEdgeRuntime = process?.env?.NEXT_RUNTIME === "edge";

const pinoLoggerForNode = () => {
  return pino({
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
};

const pinoLoggerForEdge = () => {
  return pino({
    browser: {
      write: (logEvent: LogDescriptor) => {
        logEvent.traceId = process.env._X_AMZN_TRACE_ID;
        logEvent.lambdaVersion = process.env.AWS_LAMBDA_FUNCTION_VERSION;
        logEvent.appVersion = process.env.APP_VERSION;
        console.log(JSON.stringify(logEvent));
      },
      formatters: {
        level: (label) => {
          return { level: label.toUpperCase() };
        },
      },
    },
  });
};

export const logger: Logger = isEdgeRuntime
  ? pinoLoggerForEdge()
  : pinoLoggerForNode();
