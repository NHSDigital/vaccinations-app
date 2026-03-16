import { DeployEnvironment } from "@src/types/environments";
import config from "@src/utils/config";
import { ClientSideErrorTypes } from "@src/utils/constants";
import { logger } from "@src/utils/logger";
import { ConfigMock, configBuilder } from "@test-data/config/builders";

import logClientSideError from "./client-side-error-logger";

jest.mock("@src/utils/logger", () => ({
  logger: {
    child: jest.fn().mockReturnValue({
      error: jest.fn(),
    }),
  },
}));

jest.mock("@src/utils/requestScopedStorageWrapper", () => ({
  requestScopedStorageWrapper: jest.fn((fn, ...args) => fn(...args)),
}));

jest.mock("@src/utils/client-side-logger-server-actions/error-utils", () => ({
  _sanitiseErrorContext: jest.fn((log) => log), // Simple passthrough for testing
}));

describe("logClientSideError Server Action", () => {
  const mockConfig = config as ConfigMock;
  const mockedLog = logger.child({ module: "" });

  beforeEach(() => {
    const defaultConfig = configBuilder().build();
    Object.assign(mockConfig, defaultConfig);

    jest.clearAllMocks();
  });

  it("logs the error with validated type and sanitised context", async () => {
    const context = { message: "Test error" };

    await logClientSideError(ClientSideErrorTypes.UNHANDLED_ERROR, context);

    expect(mockedLog.error).toHaveBeenCalledWith(
      {
        context: { clientSideErrorType: ClientSideErrorTypes.UNHANDLED_ERROR },
        error: context,
      },
      "Client side error occurred",
    );
  });

  it("returns true when NOT in production", async () => {
    Object.assign(mockConfig, { ...mockConfig, DEPLOY_ENVIRONMENT: DeployEnvironment.dev });

    const result = await logClientSideError(ClientSideErrorTypes.UNHANDLED_ERROR);
    expect(result).toBe(true);
  });

  it("returns false when in production", async () => {
    Object.assign(mockConfig, { ...mockConfig, DEPLOY_ENVIRONMENT: DeployEnvironment.prod });

    const result = await logClientSideError(ClientSideErrorTypes.UNHANDLED_ERROR);
    expect(result).toBe(false);
  });
});
