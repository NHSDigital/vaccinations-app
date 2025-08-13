import { asyncLocalStorage } from "@src/utils/requestContext";
import pino, { LogDescriptor, Logger } from "pino";

const isEdgeRuntime = process?.env?.NEXT_RUNTIME === "edge";
const currentLevel = process.env.PINO_LOG_LEVEL ?? "info";

const REDACTED_PATHS: string[] = ["*.", "*.*.", "*.*.*."];
const REDACTED_KEY_NAMES: string[] = [
  "APIM_PRIVATE_KEY",
  "CONTENT_API_KEY",
  "ELIGIBILITY_API_KEY",
  "accessToken",
  "access_token",
  "apiKey",
  "api_key",
  "idToken",
  "id_token",
  "role",
  "userIdentity",
  "user_identity",
];
const REDACTED_KEYS =
  currentLevel === "debug" ? [] : REDACTED_PATHS.flatMap((prefix) => REDACTED_KEY_NAMES.map((word) => prefix + word));

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
    level: currentLevel,
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
    level: currentLevel,
    browser: {
      formatters: formatterWithLevelAsText,
      write: (logEvent: LogDescriptor) => {
        logEvent = { ...logEvent, ...applicationContextFields };
        console.log(logEvent);
      },
    },
  });
};

export const logger: Logger = isEdgeRuntime ? pinoLoggerForEdge() : pinoLoggerForNode();
