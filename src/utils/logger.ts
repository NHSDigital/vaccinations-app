import pino, { Logger } from "pino";

export const logger: Logger = pino({
  level: process.env.PINO_LOG_LEVEL ?? "info",
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
});
