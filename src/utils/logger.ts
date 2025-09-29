import { asyncLocalStorage } from "@src/utils/requestContext";
import pino, { LogDescriptor, Logger } from "pino";
import { SanitizerMode, sanitize } from "sanitize-data";

const isEdgeRuntime = process?.env?.NEXT_RUNTIME === "edge";
const currentLevel = process.env.PINO_LOG_LEVEL ?? "info";

const REDACT_KEYS: string[] = [
  "**.validatedApiData.**",
  "APIM_KEY_ID",
  "APIM_PRIVATE_KEY",
  "CONTENT_API_KEY",
  "ELIGIBILITY_API_KEY",
  "accessToken",
  "access_token",
  "apiKey",
  "apikey",
  "api_key",
  "apimToken",
  "aud",
  "clientAssertion",
  "client_assertion",
  "elidUri",
  "error.config.data",
  "error.request",
  "error.request._requestBodyBuffers",
  "idToken",
  "id_token",
  "iss",
  "jti",
  "nhsNumber",
  "nhs_number",
  "privateKey",
  "role",
  "sub",
  "subjectToken",
  "subject_token",
  "userIdentity",
  "user_identity",
  "validatedApiData.**",
  "X-Aws-Parameters-Secrets-Token",
];
// No redaction if at trace level.
const REDACT_RULES =
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
  log(object: unknown) {
    return sanitize(object, { rules: REDACT_RULES });
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
        nextUrl: asyncLocalStorage?.getStore()?.nextUrl,
        ...applicationContextFields,
      };
    },
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
        if (logEvent.level === "error") {
          console.error(logEvent);
        } else if (logEvent.level === "warn") {
          console.warn(logEvent);
        } else {
          console.log(logEvent);
        }
      },
    },
  });
};

export const logger: Logger = isEdgeRuntime ? pinoLoggerForEdge() : pinoLoggerForNode();
