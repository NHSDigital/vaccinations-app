# Vaccinations in the app

[![CI/CD Pull Request](https://github.com/NHSDigital/vaccinations-app/actions/workflows/cicd-1-pull-request.yaml/badge.svg)](https://github.com/NHSDigital/vaccinations-app/actions/workflows/cicd-1-pull-request.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=repository-template&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=repository-template) TODO

Within the NHS app, vaccinations app will increase the rate of booking by:
- Informing individuals with personalised information about which vaccinations they still need to have and how to book
- Providing information on eligibility and how to book where eligibility is not available
- Providing personalised vaccination availability and booking journeys, based on local availability

We will increase appointment attendance and reduce the number of 'did not attend' and therefore increase appointment availability by:
- Providing people with details of all their upcoming vaccination appointments, with simple, easy options to cancel or change.

## Setup
- As per NHS guidelines, make your GitHub email private by going [here](https://github.com/settings/emails). There is a checkbox named "Keep my email addresses private". Not down your private email from this setting.
- Follow these [instructions](https://nhsd-confluence.digital.nhs.uk/display/CSP/How+to+access+GitHub).
  - Remember to use your private email, noted above, in GitHub config 'user.email'.
  - When on the step to create personal access tokens, remember to also tick 'workflow'. This will allow developers to update workflows

### Prerequisites
Tools to install:
- **Volta** - version manager for Node and Yarn. Documentation can be found [here](https://docs.volta.sh/guide/getting-started)
  - ```
    brew install volta
    ```
  - ```
    echo 'export VOLTA_HOME=${HOME}/.volta' >> ~/.zshrc
    echo 'export PATH="${VOLTA_HOME}/bin:${PATH}"' >> ~/.zshrc
    source ~/.zshrc
    ```
  - ```
    volta install node
    volta install yarn
    ```
- **pre-commit** - configure hooks to run automatically before each commit
  - ```
    brew install pre-commit
    ```
- **Talisman** - security scanner preventing secrets and sensitive information from being committed
  - ```
    brew install talisman
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

### Configuration
1. Install and setup pre-commit hooks for this project
   - ```
     pre-commit install
     ```
2. Using Yarn package manager, install dependencies from package.json
   - ```
     yarn install
     ```

## Usage
### Build
```
yarn run build
```

### Run service locally
Serves web content from src folder, so make changes and refresh the browser to see changes immediately.
```
yarn run dev
```

### Run pre-commit script manually
```
yarn run pre-commit
```
(Note that this has also been configured as a pre-commit hook that will run automatically before each commit)

### Run unit tests
```
yarn run test
```

## Design
TODO

## Contacts
[Slack channel: #vaccs-in-the-app-devs](https://nhsdigitalcorporate.enterprise.slack.com/archives/C08BNCQH9FV)

## Licence

> The [LICENCE.md](./LICENCE.md) file will need to be updated with the correct year and owner

Unless stated otherwise, the codebase is released under the MIT License. This covers both the codebase and any sample code in the documentation.

Any HTML or Markdown documentation is [© Crown Copyright](https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/) and available under the terms of the [Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).
