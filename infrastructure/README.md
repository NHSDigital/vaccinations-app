# Infrastructure

Our infrastructure sits in the Europe(London) region coded 'eu-west-2' in AWS.

## Post deployment steps

### Setting up and using secrets in AWS Secrets Manager

Secrets need to be created in AWS Secrets Manager as follows:

1. Click on `Store a new secret` in Secrets Manager
2. Secret Type: `Other type of secret`
3. Select `Plaintext` option
4. Fill in the secret value in the text area
5. Encryption key: `aws/secretsmanager`, and click next
6. Add a name for the secret and description
7. Tags as [below](#tags)
8. Click next on the screens and then store.

Update the values for the following secrets after generating them: -

- /vita/apim/prod-1.pem - APIM private key used to sign JWTs to access user-restricted APIs via APIM, generated from [here](https://digital.nhs.uk/developer/guides-and-documentation/security-and-authorisation/user-restricted-restful-apis-nhs-login-separate-authentication-and-authorisation#step-3-generate-a-key-pair). 'prod-1' here is the key id used during generation.
- /vita/apim/prod-1.json - APIM public key in JWKS format generated above
- /vita/nhslogin/private_key.pem - NHS Login private key generated from [here](https://nhsconnect.github.io/nhslogin/generating-pem/)
- /vita/nhslogin/public_key.pem - NHS Login public key generated above
- /vita/splunk/hec/endpoint - HEC endpoint of Splunk
- /vita/splunk/hec/token - HEC token of Splunk endpoint to store operational logs

The following secrets need to be created and set before running the application:

- `/vita/APIM_PRIVATE_KEY`: Same value as `/vita/apim/prod-1.pem`
- `/vita/AUTH_SECRET`: A randomly generated string used to sign JWTs for authentication (NextAuth)
- `/vita/CONTENT_API_KEY`: NHS UK Content API Key
- `/vita/ELIGIBILITY_API_KEY`: EliD API Key
- `/vita/NHS_LOGIN_CLIENT_ID`: NHS Login OIDC Client ID for VitA App
- `/vita/NHS_LOGIN_PRIVATE_KEY`: Same value as `/vita/nhslogin/private_key.pem`

### Setting up Cloudfront error pages

Manually create the following error routes. The current library we use doesn't update once created due to lifecycle rules, hence manual.

- Go to AWS service "Cloudfront"
- Select the distribution that serves VitA website (vaccinations.nhs.uk)
- Select "Error pages" tab
- Click "Create custom error response" button
  - HTTP error code: 500
  - Error caching minimum TTL: 300
  - Customise error response: yes
  - Response page path: /service-failure
  - HTTP Response code: 500
- Repeat the previous step for all other 5xx codes.
- Click "Create custom error response" button
    - HTTP error code: 403
    - Error caching minimum TTL: 0
    - Customise error response: yes
    - Response page path: /assets/static/service-failure.html
    - HTTP Response code: 403

### Setting default limits and settings

- Also setup [service quotas automatic management](https://docs.aws.amazon.com/servicequotas/latest/userguide/automatic-management.html) to alert on Slack channel
- Review AWS > Service Quotas
  - AWS Lambda > Concurrent executions: Default is 1000 counts.
  - AWS Key Management Service (AWS KMS) > Cryptographic operations (symmetric) request rate: Currently 20,000 per second (used by Secrets Manager and Lambda)
- Setup important notifications
  - AWS > User Notifications > Delivery Channels > Chat channels. Select the channel
  - Turn ON all 4 AWS managed subscriptions

## One time setup (once for the team)

### Tags

Use the following tags for any resource created manually. This helps in keeping track of what was created manually.

- ManagedBy: vita-devs
- Project: vaccinations-app
- Environment: dev (or test/preprod/prod depending on the environment being provisioned)

### ACM Certificate

This is the SSL certificate that is attached to our website, which verifies the domain ownership.

- Change the region to 'us-east-1' as Cloudfront requires it to be located in global region
- Go to Certificate Manager AWS service
- Request a certificate
  - Request a public certificate
  - Fully qualified domain name: *.vaccinations.nhs.uk for all other environments except prod where it is 'vaccinations.nhs.uk'
  - Key Algorithm: RSA 2048
  - Tags: as [above](#tags), add one more "Purpose: Cloudfront"
  - Request
- The certificate is still pending verification. You should download the domain records (export to CSV).
- Email (DNSTEAM (NHS ENGLAND) <england.dnsteam@nhs.net>) to verify the domain certificate. You will need to attach the domain records.
- Wait for status to change to verified before you can run any Terraform code.

### AWS to Slack connection

This is a one time setup that authorises AWS to post messages to Slack, for the purposes of alerting the developers when alarms are raised in AWS.

- Go to AWS service - "Amazon Q Developer in chat applications" (previously called Chatbot)
- Configure new client, and choose Slack as the client type
- You might have to log in to Slack using the nhs.net account. Once in there, select the Slack workspace - "Digital Prevention Services"
- Allow Chatbot to access the Slack workspace

### S3

We need 3 buckets to be created manually, before IaC can start to provision infra for us.
First one is named `vita-<AWSaccountId>-artefacts-<env>` (* required in dev and preprod env only), second one is named `vita-<AWSaccountId>-releases-<env>` and third one is `vaccinations-app-tfstate-<env>`.
The first one is used by GitHub to store artefacts after successful builds,
the second one is used by GitHub to store tagged releases after successful publish/release,
and the third one is used by Terraform to store state and lock files.

The s3 buckets `vita-<AWSaccountId>-artefacts-<env>` and `vita-<AWSaccountId>-releases-<env>` are set up with bucket versioning and object lock,
so that we can control the rewrites and deletions better. We set the retention period of 90 days on the artefacts bucket and 100 years on the releases bucket.
After the retention period, the objects in the artefacts buckets will be deleted — this is ensured with the Lifecycle rules (under Management section of the bucket) called "Expire-After-90-Days-Lock" and "Cleanup-Delete-Markers".

Use the following settings to provision them:

#### Configuration for tfstate bucket

This bucket is used to store the Terraform state file.

- Bucket name: `vaccinations-app-tfstate-<env>`
- Object Ownership
  - ACLs disabled (recommended): bucket owner enforced.
- Block Public Access settings for this bucket
  - Block all public access
- Bucket Versioning: Enabled
- Tags: refer [above](#tags)
- Default encryption
  - Encryption type: SSE-S3
  - Bucket Key: Enable

#### Configuration for artefacts bucket

#### Dev Environment

This bucket is used to store the dev builds.

- Bucket name: `vita-<AWSaccountId>-artefacts-dev`
- Object Ownership
  - ACLs disabled (recommended): bucket owner enforced.
- Block Public Access settings for this bucket
  - Block all public access
- Bucket Versioning: Enabled
- Tags: refer [above](#tags)
- Default encryption
  - Encryption type: SSE-S3
  - Bucket Key: Enable
- Advanced Settings
  - Object Lock: Enabled
    - Confirm acknowledgement
- Properties (inside bucket)
  - Object Lock
    - Default retention: Enabled
    - Default retention mode: Governance
    - Default retention period: 90 days
- Management (inside bucket)
  - Lifecycle Configuration
    - Create two Lifecycle rules
      - Expire-After-90-Days-Lock
        - name: Expire-After-90-Days-Lock
        - rule scope: Apply to all objects in the bucket
        - Lifecycle rule actions
          - Expire current versions of object
            - Days after object creation: 90
      - Cleanup-Delete-Markers
        - name: Cleanup-Delete-Markers
        - rule scope: Apply to all objects in the bucket
        - Lifecycle rule actions
          - Delete expired object delete markers or incomplete multipart uploads
            - Delete expired object delete markers

#### Preprod Environment

This bucket is used to store snapshots created by snapshot tests.

- Bucket name: `vita-<AWSaccountId>-artefacts-preprod`
- Object Ownership
  - ACLs disabled (recommended): bucket owner enforced.
- Block Public Access settings for this bucket
  - Block all public access
- Bucket Versioning: Enabled
- Tags: refer [above](#tags)
- Default encryption
  - Encryption type: SSE-S3
  - Bucket Key: Enable

#### Configuration for releases bucket

This bucket is used to store the release builds

- Bucket name: `vita-<AWSaccountId>-releases-<env>`
- Object Ownership
  - ACLs disabled (recommended): bucket owner enforced.
- Block Public Access settings for this bucket
  - Block all public access
- Bucket Versioning: Enabled
- Tags: refer [above](#tags)
- Default encryption
  - Encryption type: SSE-S3
  - Bucket Key: Enable
- Advanced Settings
  - Object Lock: Enabled
    - Confirm acknowledgement
- Properties (inside bucket)
  - Object Lock
    - Default retention: Enabled
    - Default retention mode: Governance
    - Default retention period: 100 years

### IAM

We need an IAM role policy and identity provider for GitHub actions to provision the infrastructure.

#### Identity provider

[[Ref](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)] This creates an identity outside of AWS, which is GitHub for us. Add a provider with these details:

- Provider details
  - Provider type: OpenID Connect
  - Provider URL: `https://token.actions.githubusercontent.com`
  - Audience: sts.amazonaws.com
  - Tags: refer [above](#tags)
- Assign role
  - Upon successful addition of the provider, select it in the AWS console to open it
  - Click `Assign role` and create new role
  - Trusted entity type: Web identity
  - Identity provider: select the one created above
  - Audience: select the one created above
  - GitHub organisation: NHSDigital
  - GitHub repository: vaccinations-app
  - GitHub branch: *
  - Click `Next` button
  - Add `AdministratorAccess` permission policy
  - Give the new role a name `vaccinations-app-github-iam-role`
  - Give Tags: refer [above](#tags)
  - Save

#### Role

##### Step 1 - Initial deployment

- Update GitHub secret `IAM_ROLE` to the ARN of the role created above, for the corresponding environment
- Trigger the deployment, which should succeed
- DELETE the IAM role `vaccinations-app-github-iam-role`

##### Step 2 - Subsequent deployments

We go with the least privilege approach, giving only enough permissions to GitHub as needed to be able to create, update and destroy resources.
This is an iterative approach, so whenever a deployment fails due to missing permissions, those should be added to only specific resources in [deploy_iam](modules/deploy_iam) module

- After one successful initial deployment, copy the ARN of the IAM role matching `gh-vita-***-iam-role`
- Update GitHub secret `IAM_ROLE` to the ARN of the role copied, for the corresponding environment
- Trigger the deployment, which should succeed

##### As a developer, how to assume the restricted role

Use the steps below to deploy with restricted role instead of administrator, in order to test permissions before updating.

- Get AWS credentials for restricted role - replace "my-initial-iam-role" with your personal one already in AWS

  ```shell
  aws sts assume-role --role-arn "arn:aws:iam::050451358653:role/my-initial-iam-role" --role-session-name "my-session"
  ```

- Store the credentials obtained above in ~/.aws/credentials file

  ```text
  [my-assumed-role]
  aws_access_key_id=xyz
  aws_secret_access_key=abc
  aws_session_token=pqr
  ```

- Run terraform commands assuming the restricted role

  ```shell
  AWS_PROFILE=my-assumed-role AWS_REGION=eu-west-2 TF_ENV=dev make terraform-apply
  ```

## Terraform upgrade

To upgrade terraform itself and its module versions, it requires careful process

- go to infrastructure/environments/dev directory
- reset local environment
  - cleanup local - delete .terraform directory in the dev folder to remove previous local copies
  - initialise your workspace - terraform init and terraform workspace select <your 4-letter code>
- build and deploy to your workspace
  - npm run local-build-package (only once as the code is not changing for this process)
  - terraform apply (don't actually apply)
- repeat the following for each incremental upgrade
  - upgrade - starting with the provider and then moving to third party modules, bump the version to next major version
  - do the "reset local environment" steps above
  - terraform init -upgrade
  - terraform providers lock -platform=linux_amd64 -platform=linux_arm64q
  - do the "build and deploy to your workspace" steps above
- expect that no changes to your infrastructure are needed

Once done for dev environment, just replay the upgrade changes needed in other environments.

## OpenNext

OpenNext takes the Next.js build output and converts it into packages that can be deployed across a variety of environments.
Natively OpenNext has support for AWS Lambda, Cloudflare, and classic Node.js Server.
OpenNext allows you to deploy your Next.js apps to AWS using a growing list of frameworks, as listed on their [website](https://opennext.js.org/aws/get_started).
Since Terraform was on our TechRadar, we had two options.

- [RJPearson94/terraform-aws-open-next](https://github.com/RJPearson94/terraform-aws-open-next)
- [nhs-england-tools/terraform-aws-opennext](https://github.com/nhs-england-tools/terraform-aws-opennext)

The second one did not work for us as it lagged behind in its support for OpenNext v3.
So, we decided to go ahead with the first option.

### Terraform

We are using [single zone module](https://github.com/RJPearson94/terraform-aws-open-next/tree/main/modules/tf-aws-open-next-zone),
which allows us to deploy lambda, S3 and Cloudfront. The module configures the following resources.

![single-zone-architecture](https://raw.githubusercontent.com/RJPearson94/terraform-aws-open-next/v3.5.0/docs/diagrams/Single%20Zone.png)
