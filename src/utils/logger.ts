import { asyncLocalStorage } from "@src/utils/requestContext";
import pino, { LogDescriptor, Logger } from "pino";
import { SanitizerMode, sanitize } from "sanitize-data";

const isEdgeRuntime = process?.env?.NEXT_RUNTIME === "edge";
const currentLevel = process.env.PINO_LOG_LEVEL ?? "info";

const REDACT_PATHS: string[] = ["", "*.", "*.*.", "*.*.*."];
const REDACT_KEYS: string[] = [
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
  "nhsNumber",
  "nhs_number",
  "birthdate",
];
// No redaction if at trace level.
const REDACT =
  currentLevel === "trace" ? [] : REDACT_PATHS.flatMap((prefix) => REDACT_KEYS.map((word) => prefix + word));
const REDACTION_RULES =
  currentLevel === "trace"
    ? {}
    : REDACT_KEYS.reduce(
        (rules, key) => {
          rules[key] = "redact" as SanitizerMode;
          return rules;
        },
        {} as { [key: string]: SanitizerMode },
      );

const formatterWithLevelAsText = {
  level: (label: string) => {
    return { level: label.toUpperCase() };
  },
};

export const extractRootTraceIdFromAmznTraceId = (amznTraceId: string) => {
  const amznTraceIdRootExtractionRegex = /Root=([^;]*).*/;
  return amznTraceIdRootExtractionRegex.exec(amznTraceId)?.[1];
};

const applicationContextFields = {
  lambdaVersion: process.env.AWS_LAMBDA_FUNCTION_VERSION,
  appVersion: process.env.APP_VERSION,
  runtime: process?.env?.NEXT_RUNTIME,
};

const pinoLoggerForNode = () => {
  return pino({
    level: currentLevel,
    formatters: formatterWithLevelAsText,
    mixin() {
      return {
        traceId: asyncLocalStorage?.getStore()?.traceId,
        ...applicationContextFields,
      };
    },
    redact: REDACT,
  });
};

const pinoLoggerForEdge = () => {
  return pino({
    level: currentLevel,
    browser: {
      formatters: formatterWithLevelAsText,
      write: (logEvent: LogDescriptor) => {
        logEvent = {
          ...logEvent,
          traceId: asyncLocalStorage?.getStore()?.traceId,
          ...applicationContextFields,
        };
        console.log(sanitize(logEvent, { rules: REDACTION_RULES }));
      },
    },
  });
};

export const logger: Logger = isEdgeRuntime ? pinoLoggerForEdge() : pinoLoggerForNode();
