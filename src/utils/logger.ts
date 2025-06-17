import pino, { Logger } from "pino";
import { asyncLocalStorage } from "@src/utils/requestContext";

export const logger: Logger = pino({
  level: process.env.PINO_LOG_LEVEL ?? "info",
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  mixin() {
    return { requestId: asyncLocalStorage?.getStore()?.requestId };
  },
});
