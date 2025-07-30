import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import type { GetParameterCommandOutput } from "@aws-sdk/client-ssm";
import { AWS_PRIMARY_REGION } from "@src/utils/constants";
import { logger } from "@src/utils/logger";
import { profilePerformanceEnd, profilePerformanceStart } from "@src/utils/performance";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "get-ssm-param" });
const GetSSMPerformanceMarker = "get-ssm";

const getSSMParam = async (name: string): Promise<string | undefined> => {
  try {
    if (!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_SESSION_TOKEN)) {
      throw Error(`Unable to fetch param: ${name} from SSM. SSM configuration not set`);
    }

    profilePerformanceStart(GetSSMPerformanceMarker);

    const client: SSMClient = new SSMClient({
      region: AWS_PRIMARY_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
      },
    });

    const command: GetParameterCommand = new GetParameterCommand({
      Name: name,
      WithDecryption: true,
    });

    const response: GetParameterCommandOutput = await client.send(command);
    if (response.$metadata.httpStatusCode === 200) {
      profilePerformanceEnd(GetSSMPerformanceMarker);
      return response.Parameter?.Value;
    } else {
      throw Error(
        `Unable to fetch param: ${name} from SSM. Error GetParameterCommand response code: ${response.$metadata.httpStatusCode}`,
      );
    }
  } catch (error) {
    log.error(error);
    throw error;
  }
};

export default getSSMParam;
