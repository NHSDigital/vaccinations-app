"use server";

import { DeployEnvironment } from "@src/types/environments";
import { _sanitiseErrorContext } from "@src/utils/client-side-logger-server-actions/error-utils";
import config from "@src/utils/config";
import { ClientSideErrorTypes } from "@src/utils/constants";
import { logger } from "@src/utils/logger";
import { requestScopedStorageWrapper } from "@src/utils/requestScopedStorageWrapper";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "client-side-error-logger" });

export interface ClientSideErrorContext {
  message?: string;
  stack?: string;
  digest?: string;
  filename?: string;
  lineno?: string;
  colno?: string;
}

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

  const sanitisedErrorContext = _sanitiseErrorContext(rawErrorContext);

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
