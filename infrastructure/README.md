# Infrastructure

Our infrastructure sits in the Europe(London) region coded 'eu-west-2' in AWS.

## Post deployment steps

### Setting up and using secrets

Update the values for the following secrets after generating them: -

- /vita/apim/prod-1.pem - APIM private key used to sign JWTs generated from [here](https://digital.nhs.uk/developer/guides-and-documentation/security-and-authorisation/user-restricted-restful-apis-nhs-login-separate-authentication-and-authorisation#step-3-generate-a-key-pair). 'prod-1' here is the key id used during generation.
- /vita/apim/prod-1.json - APIM public key in JWKS format generated above
- /vita/nhslogin/private_key.pem - NHS Login private key generated from [here](https://nhsconnect.github.io/nhslogin/generating-pem/)
- /vita/nhslogin/public_key.pem - NHS Login public key generated above
- /vita/splunk/hec/endpoint - HEC endpoint of Splunk
- /vita/splunk/hec/token - HEC token of Splunk endpoint to store operational logs

Now fill the values used by the application below: -

- Go to AWS service "Systems Manager"
- Click on "Parameter Store" under application tools section
- Update the values as per integrations in that environment

### Setting up Cloudfront error pages

Manually create the following error routes.

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

### Setting default limits

- Increase the default throughput limit of the parameter store, instructions [here](https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-throughput.html#parameter-store-throughput-increasing)

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
  - GitHub branch: _leave empty_ and `Next`
  - Skip adding permissions
  - Give the new role a name `vaccinations-app-github-iam-role`
  - Give Tags: refer [above](#tags)
  - Save

#### Role

##### Step 1 - Initial deployment

- Open the role just created - `vaccinations-app-github-iam-role`
- Add permissions policy -> `add permissions` -> `Create inline policy` to it.
- Select JSON in the policy editor, and paste the contents of the [policy file](github-iam-role-policy.json).
- Give it a name `vaccinations-app-github-iam-role-policy`.
- Save
- Deploy locally or via GitHub

##### Step 2 - Subsequent deployments

We go with the least privilege approach, giving only enough permissions to GitHub as needed to be able to create, update and destroy resources.
This is an iterative approach, so whenever a deployment fails due to missing permissions, the same should be added, tested to ensure it works, and then
checked in to the repository.

After one successful initial deployment, there should be a role created with the application prefix containing the least set of permissions to only specific resources.

- Now point GitHub environment secret IAM_ROLE to point to that role going forward.

##### As a developer, how to assume the restricted role

Use the steps below to deploy with restricted role instead of administrator, in order to test permissions before updating.

- Get AWS credentials for restricted role - replace "my-initial-iam-role" with your personal one already in AWS

  ```shell
  aws sts assume-role --role-arn "arn:aws:iam::050451358653:role/my-initial-iam-role" --role-session-name "my-session"
  ```

- Store the credentials obtained above in ~/.aws/credentials file

  ```
  [my-assumed-role]
  aws_access_key_id=xyz
  aws_secret_access_key=abc
  aws_session_token=pqr
  ```

- Run terraform commands assuming the restricted role

  ```shell
  AWS_PROFILE=my-assumed-role AWS_REGION=eu-west-2 TF_ENV=dev make terraform-apply
  ```

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
