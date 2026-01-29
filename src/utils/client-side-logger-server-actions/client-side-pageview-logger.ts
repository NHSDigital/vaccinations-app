"use server";

import { ClientSidePageviewTypes, PageviewTypeUrls } from "@src/utils/constants";
import { logger } from "@src/utils/logger";
import { requestScopedStorageWrapper } from "@src/utils/requestScopedStorageWrapper";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "client-side-pageview-logger" });

const logClientSidePageview = async (clientSidePageviewType: ClientSidePageviewTypes): Promise<void> => {
  return requestScopedStorageWrapper(logClientSidePageviewAction, clientSidePageviewType);
};

const logClientSidePageviewAction = async (clientSidePageviewType: ClientSidePageviewTypes): Promise<void> => {
  const validClientSidePageviewTypes = Object.values(ClientSidePageviewTypes) as string[];
  const validatedPageviewType = validClientSidePageviewTypes.includes(clientSidePageviewType);

  if (validatedPageviewType) {
    log.info(
      { context: { clientSidePageviewType: clientSidePageviewType, url: PageviewTypeUrls[clientSidePageviewType] } },
      "Rendering client-side page",
    );
  } else {
    log.error("client-side pageview logger called with invalid page name");
  }
};

export default logClientSidePageview;
