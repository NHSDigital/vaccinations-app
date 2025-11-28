import { logger } from "@src/utils/logger";
import { profilePerformanceEnd, profilePerformanceStart } from "@src/utils/performance";
import axios, { AxiosError, HttpStatusCode } from "axios";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "get-secret" });
const GetSecretPerformanceMarker = "get-secret";

const getSecret = async (name: string): Promise<string> => {
  try {
    profilePerformanceStart(GetSecretPerformanceMarker);

    const params = {
      secretId: name,
    };
    const headers = {
      "X-Aws-Parameters-Secrets-Token": process.env.AWS_SESSION_TOKEN,
    };
    const rawAPIResponse = await axios.get("http://localhost:2773/secretsmanager/get", {
      params,
      timeout: 10000,
      headers,
      validateStatus: (status: number) => {
        return status < HttpStatusCode.BadRequest;
      },
    });

    profilePerformanceEnd(GetSecretPerformanceMarker);

    return rawAPIResponse.data.SecretString;
  } catch (error) {
    if (error instanceof AxiosError) {
      log.error(
        {
          error: {
            code: error.code,
            message: error.message,
            status: error.status,
            response_data: error.response?.data,
          },
          context: { param: name },
        },
        "AxiosError: Error in getting secret from SecretsManager",
      );
    } else {
      log.error({ context: { param: name } }, "Error in getting secret from SecretsManager");
    }
    throw error;
  }
};

export default getSecret;
