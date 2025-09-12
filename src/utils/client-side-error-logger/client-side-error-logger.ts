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
  log.error({ context: { clientSideErrorType: clientSideErrorType } }, "Client side error occurred");
};

export default logClientSideError;
