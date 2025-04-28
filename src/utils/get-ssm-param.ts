import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import type { GetParameterCommandOutput } from "@aws-sdk/client-ssm";
import { AWS_PRIMARY_REGION } from "@src/utils/constants";
import { logger } from "@src/utils/logger";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "get-ssm-param" });

const getSSMParam = async (name: string): Promise<string | undefined> => {
  try {
    const client: SSMClient = new SSMClient({
      region: AWS_PRIMARY_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "not-set",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "not-set",
        sessionToken: process.env.AWS_SESSION_TOKEN ?? "not-set"
      }
    });

    const command: GetParameterCommand = new GetParameterCommand({
      Name: name,
      WithDecryption: true,
    });

    const response: GetParameterCommandOutput = await client.send(command);
    if (response.$metadata.httpStatusCode === 200) {
      return response.Parameter?.Value;
    } else {
      log.error(`Error GetParameterCommand response: ${response.$metadata}`);
    }
  } catch (error) {
    log.error(error);
  }

  return undefined;
};

export default getSSMParam;
