# Infrastructure

Our infrastructure sits in the Europe(London) region coded 'eu-west-2' in AWS.

## One time setup (once for the team)

### Tags

Use the following tags for any resource created manually. This helps in keeping track of what was created manually.
- ManagedBy: vita-devs
- Project: vaccinations-app
- Environment: dev (or test/preprod/prod depending on the environment being provisioned)

### S3

We need two buckets to be created manually, before IaC can start to provision infra for us.
First one is named `vaccinations-app-github-<env>` and second one `vaccinations-app-tfstate-<env>`.
The former is used by GitHub to store artefacts after successful builds,
and the latter is used by Terraform to store state and lock files.
Use the following settings to provision them: -
- General configuration
  - Bucket name: as per the names above.
- Object Ownership
  - ACLs disabled (recommended): bucket owner enforced.
- Block Public Access settings for this bucket
  - Block all public access
- Bucket Versioning
  - Enabled (for `vaccinations-app-tfstate-<env>` bucket)
  - Disabled (for `vaccinations-app-github-<env>` bucket)
- Tags: refer [above](#tags)
- Default encryption
  - Encryption type: SSE-S3
  - Bucket Key: Enable

### IAM

We need an IAM role policy and identity provider for GitHub actions to provision the infrastructure.

#### Identity provider

[[Ref](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)] This creates an identity outside of AWS, which is GitHub for us. Add a provider with these details: -
- Provider details
  - Provider type: OpenID Connect
  - Provider url: https://token.actions.githubusercontent.com
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

We go with the least privilege approach, giving only enough permissions to GitHub as needed to be able to create, update and destroy resources.
This is an iterative approach, so whenever a deployment fails due to missing permissions, the same should be added, tested to ensure it works, and then
checked in to the repository.
- Open the role just created - `vaccinations-app-github-iam-role`
- Add permissions policy -> `add permissions` -> `Create inline policy` to it.
- Select JSON in the policy editor, and paste the contents of the [policy file](github-iam-role-policy.json).
- Give it a name `vaccinations-app-github-iam-role-policy`.
- Save

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
which allows us to deploy lambda, S3 and CloudFront. The module configures the following resources.

![single-zone-architecture](https://raw.githubusercontent.com/RJPearson94/terraform-aws-open-next/v3.5.0/docs/diagrams/Single%20Zone.png)
