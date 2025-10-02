# Load generator for performance testing

## Deploying to Test environment

You'll need to have installed [docker](https://www.docker.com/) and the [AWS CLI tools](https://aws.amazon.com/cli/): `brew install docker colima awscli` if necessary.

### Deploying infrastructure

Tag, promote, and deploy to the test environment, as per the [usual process](https://nhsd-confluence.digital.nhs.uk/spaces/Vacc/pages/989220238/Branching+and+release+strategy). Wait for the deployment to complete.

### Build image

#### Build image for deployment

```sh
docker build --no-cache --platform linux/arm64 -t load-generator .
```

### Upload image

For the following steps, you need to have deployed the infrastructure at least once, to get the ECR repository.
Ensure you are [configured to access the test environment in AWS via the command line](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html). These instructions assume you've named your profile `vita-test`. All the info you need for that should be available via the [access portal](https://d-9c67018f89.awsapps.com/start/#/?tab=accounts).

```sh
load_generator_ecr_repository_url=$(aws ecr describe-repositories --profile vita-test | jq -r '.repositories[] | select(.repositoryName == "load-generator") | .repositoryUri')

aws ecr get-login-password --region eu-west-2 --profile vita-test | docker login --username AWS --password-stdin $(echo $load_generator_ecr_repository_url | cut -d/ -f1)

docker tag load-generator:latest "$load_generator_ecr_repository_url":latest

docker push "$load_generator_ecr_repository_url":latest
```

### Check it's working

Manually upload the [test plan](/performance/vita-user-journey.jmx) to the s3 path `s3://gh-vita-***-load-testing/plans/`.

Trigger the task from AWS console UI. For the number of desired tasks and threads, apply the formula

```text
Number of concurrent users = (Number of tasks) x (Number of threads/task)
```

- Search for `Elastic Container Service`
- Select `Task definitions` on the left menu
- Select `load-generator` task
- Click `Deploy` -> `Run task`
- Task details
  - `Task definition revision`: LATEST
  - `Desired tasks`: <based on above formula>
  - `Task group`: load-generator
- Environment
  - Existing cluster: fake-api-project-cluster
  - Compute options: Launch type=FARGATE, Platform version=LATEST
- Networking
  - VPC: fake-api-project-vpc
  - Subnets: fake-api-project-public-subnet-1, fake-api-project-public-subnet-2
  - Security group: fake-api-service-sg
  - Public IP: Turned On
- Container overrides
  - Change the default values as per need
    - `DURATION`: duration of the test in seconds
    - `RAMPUP`: seconds to ramp up concurrent threads linearly, 1 -> $THREADS
    - `THREADS`: the number of concurrent threads to use, <based on above formula>
    - `ENVIRONMENT`: the subdomain that represents the environment to run the test on, e.g. `test`
    - `S3_BUCKET`: the bucket name to use for test inputs and outputs
    - `TEST_PLAN`: the *.jmx file name to use as the JMeter test plan

## Analysing the results

Download the *.jtl files locally, as they might be big and many and use the following script (change the sample values).

```shell
# download the logs locally
AWS_PROFILE=vita-test aws s3 sync s3://gh-vita-741448960880-load-testing/results/2025/10/02/ .

# take header from one of the logs and merge all logs into one file
head -n 1 16_34_59_655_29833.jtl > combined.jtl
for file in *.jtl; do
  tail -n +2 "$file" >> combined.jtl
done

# generate an HTML report
jmeter -g combined.jtl -o report
open report/index.html
```
