"use server";

import { ClientSideErrorTypes } from "@src/utils/constants";
import { logger } from "@src/utils/logger";
import { requestScopedStorageWrapper } from "@src/utils/requestScopedStorageWrapper";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "client-side-error-logger" });

const logClientSideError = async (clientSideErrorType: ClientSideErrorTypes): Promise<boolean> => {
  return requestScopedStorageWrapper(logClientSideErrorAction, clientSideErrorType);
};

const logClientSideErrorAction = async (clientSideErrorType: ClientSideErrorTypes): Promise<boolean> => {
  const validClientSideErrorTypes = Object.values(ClientSideErrorTypes) as string[];
  const validatedErrorType = validClientSideErrorTypes.includes(clientSideErrorType)
    ? clientSideErrorType
    : ClientSideErrorTypes.UNKNOWN_ERROR_REASON;

  log.error({ context: { clientSideErrorType: validatedErrorType } }, "Client side error occurred");

  return process.env.DEPLOY_ENVIRONMENT !== "prod" && process.env.DEPLOY_ENVIRONMENT !== "production";
};

export default logClientSideError;
