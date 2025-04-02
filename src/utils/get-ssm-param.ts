import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import type { GetParameterCommandOutput } from "@aws-sdk/client-ssm";

export const AWS_PRIMARY_REGION = "eu-west-2";

const getSSMParam = (name: string): string | undefined => {
  const client = new SSMClient({
    region: AWS_PRIMARY_REGION,
  });

  const command = new GetParameterCommand({
    Name: name,
    WithDecryption: true,
  });

  let value: string | undefined = undefined;
  client
    .send(command)
    .then((result: GetParameterCommandOutput) => {
      if (result && result.Parameter) {
        value = result.Parameter.Value;
      } else {
        console.error(`Could not find SSM parameter ${name}`);
      }
    })
    .catch((err) => {
      console.error(err.message);
    });

  return value;
};

export default getSSMParam;
