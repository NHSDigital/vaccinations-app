import { logger } from "@src/utils/logger";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "utils-performance" });
const isPerformanceProfilingEnabled = process.env.PROFILE_PERFORMANCE === "true";
const isInfoLogLevel = process.env.PINO_LOG_LEVEL === "info";

const profilePerformanceStart = (markerName: string) => {
  if (isPerformanceProfilingEnabled) {
    performance.mark(`${markerName}`);
  }
};

const profilePerformanceEnd = (markerName: string) => {
  console.log("Debugging pino", process.env.PINO_LOG_LEVEL, markerName, process.env.NEXT_RUNTIME);
  if (isPerformanceProfilingEnabled) {
    const measurement = performance.measure(`${markerName}-latency`, markerName);
    const message = {
      marker: measurement.name,
      startTimestamp: measurement.startTime,
      latencyMillis: measurement.duration,
    };
    if (isInfoLogLevel) {
      log.info(message, "performance profile");
    } else {
      log.warn(message, "performance profile");
    }
  }
};

export { profilePerformanceStart, profilePerformanceEnd };
