import { logger } from "@src/utils/logger";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "utils-performance" });
const isPerformanceProfilingEnabled = process.env.PROFILE_PERFORMANCE === "true";

const profilePerformanceStart = (markerName: string) => {
  if (isPerformanceProfilingEnabled) {
    performance.mark(`${markerName}`);
  }
};

const profilePerformanceEnd = (markerName: string) => {
  if (isPerformanceProfilingEnabled) {
    const measurement = performance.measure(`${markerName}-latency`, markerName);
    log.info(
      {
        marker: measurement.name,
        startTimestamp: measurement.startTime,
        latencyMillis: measurement.duration,
      },
      "performance profile",
    );
  }
};

export { profilePerformanceStart, profilePerformanceEnd };
