"use server";

import { DeployEnvironment } from "@src/types/environments";
import config from "@src/utils/config";
import { ClientSideErrorTypes } from "@src/utils/constants";
import { logger } from "@src/utils/logger";
import { requestScopedStorageWrapper } from "@src/utils/requestScopedStorageWrapper";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "client-side-error-logger" });

const MAX_FIELD_LENGTH = 2000;
const ALLOWED_CONTEXT_KEYS: string[] = ["message", "stack", "digest", "filename", "lineno", "colno"];

export interface ClientSideErrorContext {
  message?: string;
  stack?: string;
  digest?: string;
  filename?: string;
  lineno?: string;
  colno?: string;
}

const sanitiseErrorContext = (rawContext?: unknown): Record<string, string> | undefined => {
  if (rawContext == null || typeof rawContext !== "object") return undefined;

  const sanitisedContext: Record<string, string> = {};
  const raw = rawContext as Record<string, unknown>;

  for (const key of ALLOWED_CONTEXT_KEYS) {
    if (key in raw && typeof raw[key] === "string") {
      sanitisedContext[key] = (raw[key] as string)
        .slice(0, MAX_FIELD_LENGTH)
        // Only allow 'tab', 'newline', 'return' control characters
        .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "");
    }
  }

  return Object.keys(sanitisedContext).length > 0 ? sanitisedContext : undefined;
};

const logClientSideError = async (
  clientSideErrorType: ClientSideErrorTypes,
  errorContext?: ClientSideErrorContext,
): Promise<boolean> => {
  return requestScopedStorageWrapper(logClientSideErrorAction, clientSideErrorType, errorContext);
};

const logClientSideErrorAction = async (
  clientSideErrorType: ClientSideErrorTypes,
  rawErrorContext?: unknown,
): Promise<boolean> => {
  const validClientSideErrorTypes = Object.values(ClientSideErrorTypes) as string[];
  const validatedErrorType = validClientSideErrorTypes.includes(clientSideErrorType)
    ? clientSideErrorType
    : ClientSideErrorTypes.UNKNOWN_ERROR_REASON;

  const sanitisedErrorContext = sanitiseErrorContext(rawErrorContext);

  log.error(
    {
      context: { clientSideErrorType: validatedErrorType },
      ...(sanitisedErrorContext && { error: sanitisedErrorContext }),
    },
    "Client side error occurred",
  );

  return shouldErrorsShowInClientConsole();
};

const shouldErrorsShowInClientConsole = async (): Promise<boolean> => {
  const deployEnvironment: DeployEnvironment = await config.DEPLOY_ENVIRONMENT;
  return deployEnvironment !== DeployEnvironment.unknown && deployEnvironment !== DeployEnvironment.prod;
};

export default logClientSideError;
