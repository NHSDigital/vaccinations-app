import { asyncLocalStorage } from "@src/utils/requestContext";
import pino, { LogDescriptor, Logger } from "pino";

const REDACTED_KEYS = ["err.config.headers.apikey", "detail.responseElements.role", "detail.userIdentity"];

const isEdgeRuntime = process?.env?.NEXT_RUNTIME === "edge";

const formatterWithLevelAsText = {
  level: (label: string) => {
    return { level: label.toUpperCase() };
  },
};

export const extractRootTraceIdFromAmznTraceId = (amznTraceId: string) => {
  const amznTraceIdRootExtractionRegex = /Root=([\d\-\w]*);.*/;
  return amznTraceIdRootExtractionRegex.exec(amznTraceId)?.[1];
};

const applicationContextFields = {
  traceId: process.env._X_AMZN_TRACE_ID ? extractRootTraceIdFromAmznTraceId(process.env._X_AMZN_TRACE_ID) : undefined,
  lambdaVersion: process.env.AWS_LAMBDA_FUNCTION_VERSION,
  appVersion: process.env.APP_VERSION,
};

const pinoLoggerForNode = () => {
  return pino({
    level: process.env.PINO_LOG_LEVEL ?? "info",
    formatters: formatterWithLevelAsText,
    mixin() {
      return {
        requestId: asyncLocalStorage?.getStore()?.requestId,
        ...applicationContextFields,
      };
    },
    redact: REDACTED_KEYS,
  });
};

const pinoLoggerForEdge = () => {
  return pino({
    browser: {
      formatters: formatterWithLevelAsText,
      write: (logEvent: LogDescriptor) => {
        logEvent = { ...logEvent, ...applicationContextFields };
        console.log(JSON.stringify(logEvent));
      },
    },
  });
};

export const logger: Logger = isEdgeRuntime ? pinoLoggerForEdge() : pinoLoggerForNode();
