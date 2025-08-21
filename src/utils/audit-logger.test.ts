/**
 * @jest-environment node
 */
import { CloudWatchLogsClient, InputLogEvent, PutLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";
import { sendAuditEvent } from "@src/utils/audit-logger";
import { configProvider } from "@src/utils/config";
import { AWS_PRIMARY_REGION } from "@src/utils/constants";

jest.mock("@aws-sdk/client-cloudwatch-logs");
jest.mock("@src/utils/config");
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

const mockConfig = {
  AUDIT_CLOUDWATCH_LOG_GROUP: "test-log-group",
  AUDIT_CLOUDWATCH_LOG_STREAM: "test-log-stream",
};

describe("Audit Logger: sendAuditEvent", () => {
  const now = 0;
  const mockSend = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(now);
    process.env.DEPLOY_ENVIRONMENT = "dev";

    (CloudWatchLogsClient as jest.Mock).mockImplementation(() => ({
      send: mockSend,
    }));

    (configProvider as jest.Mock).mockResolvedValue(mockConfig);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should send an audit event to CloudWatch successfully", async () => {
    const testMessage = { event: "user_login", userId: "user-123" };
    mockSend.mockResolvedValueOnce({ $metadata: { httpStatusCode: 200 } });

    await sendAuditEvent(testMessage);

    expect(configProvider).toHaveBeenCalledTimes(1);
    expect(CloudWatchLogsClient).toHaveBeenCalledWith({ region: AWS_PRIMARY_REGION });

    const expectedLogEvents: InputLogEvent[] = [
      {
        timestamp: now,
        message: JSON.stringify(testMessage),
      },
    ];
    const expectedParams = {
      logGroupName: mockConfig.AUDIT_CLOUDWATCH_LOG_GROUP,
      logStreamName: mockConfig.AUDIT_CLOUDWATCH_LOG_STREAM,
      logEvents: expectedLogEvents,
    };

    expect(PutLogEventsCommand).toHaveBeenCalledWith(expectedParams);
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it("should throw and log an error when sending the event fails", async () => {
    const testMessage = { event: "user_login", userId: "user-456" };
    const cloudWatchError = new Error("Failed to send logs");

    mockSend.mockRejectedValueOnce(cloudWatchError);

    await expect(sendAuditEvent(testMessage)).rejects.toThrow(cloudWatchError);
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it("should not call real cloudwatch client during local development", async () => {
    process.env.DEPLOY_ENVIRONMENT = "local";
    const testMessage = { event: "user_login", userId: "user-456" };

    await sendAuditEvent(testMessage);

    expect(mockSend).not.toHaveBeenCalled();
  });
});
