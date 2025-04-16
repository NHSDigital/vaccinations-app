import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import type { GetParameterCommandOutput } from "@aws-sdk/client-ssm";
import { AWS_PRIMARY_REGION } from "@src/utils/constants";
import { logger } from "@src/utils/logger";

const log = logger.child({ module: "get-ssm-param" });

const getSSMParam = async (name: string): Promise<string | undefined> => {
  try {
    const client = new SSMClient({
      region: AWS_PRIMARY_REGION,
    });

    const command = new GetParameterCommand({
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
    log.error(`Error getSSMParam: ${error}`);
  }

  return undefined;
};

export default getSSMParam;
