import { logger } from "@src/utils/logger";
import { profilePerformanceEnd, profilePerformanceStart } from "@src/utils/performance";
import axios, { HttpStatusCode } from "axios";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "get-ssm-param" });
const GetSSMPerformanceMarker = "get-ssm";

const getSSMParam = async (name: string): Promise<string> => {
  try {
    profilePerformanceStart(GetSSMPerformanceMarker);

    const params = {
      name: name,
      withDecryption: "true",
    };
    const headers = {
      "X-Aws-Parameters-Secrets-Token": process.env.AWS_SESSION_TOKEN,
    };
    const rawAPIResponse = await axios.get("http://localhost:2773/systemsmanager/parameters/get", {
      params,
      timeout: 5000,
      headers,
      validateStatus: (status: number) => {
        return status < HttpStatusCode.BadRequest;
      },
    });

    profilePerformanceEnd(GetSSMPerformanceMarker);

    return rawAPIResponse.data.Parameter.Value;
  } catch (error) {
    log.error({ error });
    throw error;
  }
};

export default getSSMParam;
