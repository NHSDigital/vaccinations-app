import {
  CloudWatchLogsClient,
  InputLogEvent,
  PutLogEventsCommand,
  PutLogEventsRequest,
} from "@aws-sdk/client-cloudwatch-logs";
import { configProvider } from "@src/utils/config";
import { AWS_PRIMARY_REGION } from "@src/utils/constants";
import { logger } from "@src/utils/logger";
import { profilePerformanceEnd, profilePerformanceStart } from "@src/utils/performance";

const log = logger.child({ module: "utils-audit-logger" });

const AuditLoggerPerformanceMarker = "audit-logger";

const sendAuditEvent = async (message: AuditEvent) => {
  if (process.env.DEPLOY_ENVIRONMENT === "local") {
    // OR is it better to do the deny list
    log.info({ auditLog: message }, "Simulating audit log to Cloudwatch");
    return;
  }

  const config = await configProvider();
  const client = new CloudWatchLogsClient({
    region: AWS_PRIMARY_REGION,
  });

  const logEvents: InputLogEvent[] = [
    {
      timestamp: Date.now(),
      message: JSON.stringify(message),
    },
  ];

  const params: PutLogEventsRequest = {
    logGroupName: config.AUDIT_CLOUDWATCH_LOG_GROUP,
    logStreamName: config.AUDIT_CLOUDWATCH_LOG_STREAM,
    logEvents: logEvents,
  };

  try {
    profilePerformanceStart(AuditLoggerPerformanceMarker);
    const command = new PutLogEventsCommand(params);
    await client.send(command);
    profilePerformanceEnd(AuditLoggerPerformanceMarker);
    log.info("Audit log sent successfully."); // TODO: 21/08/2025 VIA-263 AS Remove later
  } catch (error) {
    log.error({ error }, "Error sending audit log to cloudwatch");
    throw error;
  }
};

export { sendAuditEvent };
