## One time setup (per environment)
- In the dev AWS account, create a bucket with name "vaccinations-app-tfstate" and following settings:
  - Object Ownership: ACLs disabled (all objects owned by account)
  - Block all public access: checked
  - Bucket Versioning: enable
  - Tags:
    - ManagedBy: vita-devs
    - Project: vaccinations-app
    - Environment: dev
  - Encryption type: SSE-S3
  - Bucket Key: Enable
- In your local environment, create aws credentials file containing profile called "vita-dev"
  - Add the following section in your `~/.aws/config` file
    ```
    [profile vita-dev]
    sso_session = vita-dev
    sso_account_id = <dev aws account id from console>
    sso_role_name = Admin
    region = eu-west-2
    output = json
    ```
  - Add the following section in your `~/.aws/credentials` file
    ```
    [vita-dev]
    aws_access_key_id=<from aws console access keys link>
    aws_secret_access_key=<from aws console access keys link>
    aws_session_token=<from aws console access keys link>
    ```

## Terraform commands to deploy from local
  ```
  export AWS_PROFILE=vita-dev
  export STACK=infrastructure/environments/dev
  make terraform-init
  make terraform-plan
  make terraform-apply opts="-auto-approve"
  make terraform-destroy opts="-auto-approve"
  ```
