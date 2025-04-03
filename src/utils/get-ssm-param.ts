import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import type { GetParameterCommandOutput } from "@aws-sdk/client-ssm";

export const AWS_PRIMARY_REGION = "eu-west-2";

const getSSMParam = async (name: string): Promise<string | undefined> => {
  console.log(`in getSSMParam(${name})`);

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
    console.error(response.$metadata);
  }

  return undefined;
};

export default getSSMParam;
