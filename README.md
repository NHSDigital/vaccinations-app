# Vaccinations in the app

[![CI/CD Pull Request](https://github.com/NHSDigital/vaccinations-app/actions/workflows/cicd-1-pull-request.yaml/badge.svg)](https://github.com/NHSDigital/vaccinations-app/actions/workflows/cicd-1-pull-request.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=NHSDigital_vaccinations-app&metric=alert_status&token=34589a103a488086afb39b2bf2bbd0304e501c19)](https://sonarcloud.io/summary/new_code?id=NHSDigital_vaccinations-app)

## Project Overview

Within the NHS app, vaccinations app will increase the rate of booking by:
- Informing individuals with personalised information about which vaccinations they still need to have and how to book
- Providing information on eligibility and how to book where eligibility is not available
- Providing personalised vaccination availability and booking journeys, based on local availability

We will increase appointment attendance and reduce the number of 'did not attend' and therefore increase appointment availability by:
- Providing people with details of all their upcoming vaccination appointments, with simple, easy options to cancel or change.

## Developer Setup

### GitHub

- As per NHS guidelines, make your GitHub email private by going [here](https://github.com/settings/emails). There is a checkbox named "Keep my email addresses private". Note down your private email from this setting.
- Follow these [instructions](https://nhsd-confluence.digital.nhs.uk/display/Vacc/Developer+setup%3A+Github).
  - Remember to use your private email, noted above, in GitHub config 'user.email'.
  - When on the step to create personal access tokens, remember to also tick 'workflow'. This will allow developers to update workflows
- Get your NHS GitHub username added to the VitA team to gain access to the repository

### Prerequisites

Tools to install:

From NHS repository template:

- **Make and GNU tooling** - The version of GNU make available by default on macOS is earlier than 3.82. You will need to upgrade it or certain make tasks will fail.
  On macOS, you will need Homebrew installed, then to install make, like so:
  - ```
    brew install make gnu-sed gawk coreutils binutils
    ```
  - Add the following to .zshrc to override default OSX tools with their GNU equivalents
    - On M1 Macs:
      ```
      export HOMEBREW_PATH="/opt/homebrew"
      ```
    - For Intel Macs:
      ```
      export HOMEBREW_PATH="/usr/local"
      ```
    - Then:
      ```
      export PATH="$HOMEBREW_PATH/opt/make/libexec/gnubin:$PATH"
      export PATH="$HOMEBREW_PATH/opt/gnu-sed/libexec/gnubin:$PATH"
      export PATH="$HOMEBREW_PATH/opt/gawk/libexec/gnubin:$PATH"
      export PATH="$HOMEBREW_PATH/opt/coreutils/libexec/gnubin:$PATH"
      export PATH="$HOMEBREW_PATH/opt/binutils/bin:$PATH"
      export LDFLAGS="-L$HOMEBREW_PATH/opt/binutils/lib"
      export CPPFLAGS="-I$HOMEBREW_PATH/opt/binutils/include"
      ```
- **asdf** - version manager with support for multiple languages
  - ```
    brew install asdf
    ```
  - ```
    echo 'export PATH="${HOME}/.asdf/shims:$PATH"' >> ~/.zshrc
    source ~/.zshrc
    ```
  - Install nodejs plugin for asdf (and required dependencies)
  - ```
    brew install gpg gawk
    asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
    ```

- **Colima** - or any equivalent Docker container runtime, e.g. [Rancher Desktop](https://rancherdesktop.io/), etc.

- **Act** - tool to run GitHub actions locally. Usage guide is available [here](https://nektosact.com/usage/index.html)
    - ```
      brew install act
      ```
    - symlink `/var/run/docker.sock` file to your chosen docker container tool's `docker.sock` file location. For e.g. `sudo ln -s /Users/<username>/.colima/default/docker.sock /var/run/docker.sock`
    - after successful installation, when you run act for the first time, it will ask for the size of docker container. Choose 'medium'.
    - to list all available jobs and workflows
      ```
      act --list
      ```
    - to run a specific job ID
      ```
      act -j 'check-english-usage' --defaultbranch main
      ```
    - to run all jobs in a workflow file
      ```
      act -W .github/workflows/cicd-1-pull-request.yaml --defaultbranch main
      ```
- **Playwright** - Install browser drivers for running UI-driven acceptance tests.
  ```
  npx playwright install
  ```
- **AWS CLI** - Install aws cli for local deployments.
  - For the following commands, use the settings from your [AWS access portal](https://d-9c67018f89.awsapps.com/start/#/?tab=accounts) "Access keys". Give the name 'vita-dev' to your new profile.
    ```
    brew install awscli
    aws configure sso
    ```
  - Add the profile 'vita-dev' to your shell to avoid having to provide it repeatedly.
    ```
    echo 'export AWS_PROFILE=vita-dev' >> ~/.zshrc
    source ~/.zshrc
    ```

### Local Configuration

1. Update environment variables file .env.local to suit local development and testing
2. Install toolchain dependencies and load .tool-versions into asdf
  - ```
    make config
    ```
3. Install and setup pre-commit hooks for this project
  - ```
    make githooks-config
    make githooks-run
    ```
4. Set environment variable to disable telemetry collection in next.js: add the following to .zshrc
  - ```
    export NEXT_TELEMETRY_DISABLED=1
    ```
5. Install dependencies from package.json
  - ```
    npm install
    ```

## Usage

### Build

```
npm run build
```

### Run service locally

Serves web content from src folder, so make changes and refresh the browser to see changes immediately.
```
npm run dev
```

#### Simulating NHS Login SSO flow

Our project integrates with NHS Login. To simulate the SSO flow, clone this [repo](https://github.com/NHSDigital/vita-login-sso-client-express)
and follow the README to set it up.

RSA Private keys and Client IDs are required for this flow. Steps to enable it:

- Visit AWS Secrets Manager to get the private keys and Client IDs
  - Values prefixed with sso are used in the fake client, and those prefixed with app are used in this project
- Set the Client ID values in the env files of this project and the Fake Client project respectively
- Store the private key values in pem files in your systems, preferably somewhere outside this repository (e.g. `vita_private_key.pem`, `vita_private_key_sso.pem`)
- Before running the application, export the VitA application private key as an environment variable:
  ```
  export NHS_LOGIN_PRIVATE_KEY=`cat <path-to-keys>/vita_private_key.pem`
  ```
- Follow the steps in Fake Client repo README.md to set up the SSO private key there.

SSO flow is initiated from the Fake Client. Directly accessing the application will redirect you to an error page.


#### Mocking API Responses with Wiremock

Our project utilizes Wiremock to provide mock responses for API endpoints. To configure these responses:

- Place request-response mapping files (JSON) within the `wiremock/mappings` directory.
- Store the corresponding JSON response bodies in the `wiremock/__files` directory.

To run the Wiremock server locally:
```
npm run content-api
```

### Run unit tests

```
npm run test
```

### Run UI driven tests

- make sure to build and run the Next.js app
  ```
  npm run app
  ```
- run tests in headless mode
  ```
  npm run e2e
  ```
- or with interactive developer UI
  ```
  npm run e2e:ui
  ```

### Run pre-commit hooks manually

```
make githooks-run
```
(Note that this has also been configured as a pre-commit hook that will run automatically before each commit)

### Deploy your local changes to AWS dev environment

A detailed description of our infrastructure is outlined [here](infrastructure/README.md).

We use Terraform workspaces to distinguish each developer.
So make sure you use your own unique combination of initials, to set the workspace.
Use maximum 4 chars, otherwise you might not be able to deploy due to max limits on resource names.
Avoid 'gh' as it is reserved for GitHub.

- Make sure to build first using
  ```
  npm run build:opennext
  ```
- (optional) Log into AWS if session has expired - run the following command, ignore the browser window that automatically opens and copy the URL output in terminal into browser for HSCIC profile
  ```
  aws sso login
  ```
- In the [home]() directory
  ```
  TF_ENV=dev make terraform-init         # initialises the modules
  ```
- In the environment:[dev](infrastructure/environments/dev) directory
  ```
  terraform workspace new <unique 4 char name>
  ```
- In the [home]() directory
  ```
  TF_ENV=dev make terraform-plan          # compares local vs. remote state, and shows the plan
  TF_ENV=dev make terraform-apply         # applies the plan, asks for approval
  ```
- Once the deployment is successful, do these post-deployment steps: -
  - Update the environment: the variables are accessible in [Systems Manager / Parameter Store](https://eu-west-2.console.aws.amazon.com/systems-manager/parameters/?region=eu-west-2&tab=Table)
  - The app is accessible via the CDN URL printed after the deployment as an output.

#### Destroying and Re-deploying resources in AWS

To destroy resources in AWS, run the command:
```
 TF_ENV=dev make terraform-destroy       # deprovisions infrastructure, asks for approval
```
Note: AWS has been configured to ensure that server function log group is not deleted when destroy is run. When re-deploying from local, this means that developers will need to go into AWS and manually delete the log group before re-provisioning.

#### Accessing application logs in AWS

Logs are kept in AWS CloudWatch in a Log Group for the server

In AWS Console:

- CloudWatch > Log Groups > `/aws/lambda/{workspace}-main-vita-{accountid}-server-function`

Use the Logs Insights UI to query logs:
- CloudWatch > Log Insights
- Select the log group in the dropdown
- Sample query:
  ```
  fields @timestamp, level, module, msg, @message
  | filter level = "INFO"
  | sort @timestamp desc
  | limit 10000
  ```

To enable debug logging of OpenNext, add OPEN_NEXT_DEBUG=true to package.json build command:
```json
{
  "build:opennext": "OPEN_NEXT_DEBUG=true DEBUG=* npx --yes @opennextjs/aws@latest build"
}
```

## Creating Releases

Our release strategy is based on Semantic Versioning and utilizes tagged commits. To create a new release, please follow the steps outlined below:

1.  **Write a commit, push and Synchronize with Remote:** After merging your changes into the `main` branch, ensure your local repository is synchronized with the remote. Execute the following commands:

    ```bash
    git commit -m 'your commit message'
    git push origin main
    git pull --rebase origin main
    ```

    IMPORTANT: Wait for the continuous integration/build pipeline to complete successfully.

2.  **Determine Release Type:** Assess the nature of the changes included in this release to determine the appropriate semantic version increment:

    * **Major Change (Breaking):** Increment the major version (e.g., `v1.0.0` to `v2.0.0`).
    * **Minor Change (New Feature):** Increment the minor version (e.g., `v0.1.0` to `v0.2.0`).
    * **Patch/Fix (Bug Fixes, Minor Updates):** Increment the patch version (e.g., `v0.0.1` to `v0.0.2`).

3.  **Identify the Previous Tag (Optional):** You can view existing tags to understand the current release version. Either visit the "Releases" or "Tags" section of the repository on GitHub, or run the following command locally:

    ```bash
    git tag
    ```

4.  **Tag Your Commit:** Create a new tag on your local `main` branch using the `git tag` command, following the `vx.y.z` format (replace `x`, `y`, and `z` with the incremented version numbers):

    ```bash
    git tag vX.Y.Z
    ```

    For example, if it's a minor release, you might use:

    ```bash
    git tag v0.2.0
    ```

5.  **Push the Tag to Remote:** Push the newly created tag to the `origin` remote repository. This action will automatically trigger the publish/release workflow:

    ```bash
    git push origin tag vX.Y.Z
    ```

6.  **Verify Release and Artifact:** Upon successful execution of the publish/release workflow, you should observe:

    * A new tagged release in the "Releases" section of the GitHub repository.
    * The corresponding build artifact within the `/tags` folder of the github AWS S3 bucket.

**The branching and tagging strategy to fix broken deployed releases can be found [here](https://nhsd-confluence.digital.nhs.uk/spaces/Vacc/pages/989220238/Branching+and+release+strategy#Branchingandreleasestrategy-Fixingdeployedbrokenreleases).**

## Design

TODO

## Contacts

[Slack channel: #vaccs-in-the-app-devs](https://nhsdigitalcorporate.enterprise.slack.com/archives/C08BNCQH9FV)

## Licence

> The [LICENCE.md](./LICENCE.md) file will need to be updated with the correct year and owner

Unless stated otherwise, the codebase is released under the MIT License. This covers both the codebase and any sample code in the documentation.

Any HTML or Markdown documentation is [© Crown Copyright](https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/) and available under the terms of the [Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).
