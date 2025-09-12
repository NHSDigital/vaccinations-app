"use server";

import { ClientSideErrorTypes } from "@src/utils/constants";
import { logger } from "@src/utils/logger";
import { requestScopedStorageWrapper } from "@src/utils/requestScopedStorageWrapper";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "client-side-error-logger" });

const logClientSideError = async (clientSideErrorType: ClientSideErrorTypes): Promise<void> => {
  return requestScopedStorageWrapper(logClientSideErrorAction, clientSideErrorType);
};

const logClientSideErrorAction = async (clientSideErrorType: ClientSideErrorTypes): Promise<void> => {
  const validClientSideErrorTypes = Object.values(ClientSideErrorTypes) as string[];
  const validatedErrorType = validClientSideErrorTypes.includes(clientSideErrorType)
    ? clientSideErrorType
    : ClientSideErrorTypes.UNKNOWN_ERROR_REASON;

  log.error({ context: { clientSideErrorType: validatedErrorType } }, "Client side error occurred");
};

export default logClientSideError;
