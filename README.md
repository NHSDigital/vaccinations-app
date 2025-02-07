# Vaccinations in the app

TODO:
[![CI/CD Pull Request](https://github.com/nhs-england-tools/repository-template/actions/workflows/cicd-1-pull-request.yaml/badge.svg)](https://github.com/nhs-england-tools/repository-template/actions/workflows/cicd-1-pull-request.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=repository-template&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=repository-template)

Within the NHS app, vaccinations app will increase the rate of booking by:
- Informing individuals with personalised information about which vaccinations they still need to have and how to book
- Providing information on eligibility and how to book where eligibility is not available
- Providing personalised vaccination availability and booking journeys, based on local availability

We will increase appointment attendance and reduce the number of 'Did not attends and therefore increase appointment availability by:
- Providing people with details of all their upcoming vaccination appointments, with simple, easy options to cancel or change.

## Table of Contents

- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Configuration](#configuration)
- [Usage](#usage)
  - [Testing](#testing)
- [Design](#design)
- [Contacts](#contacts)
- [Licence](#licence)

## Setup
- As per NHS guidelines, make your GitHub email private by going [here](https://github.com/settings/emails). There is a checkbox named "Keep my email addresses private". Not down your private email from this setting.
- Follow these [instructions](https://nhsd-confluence.digital.nhs.uk/display/CSP/How+to+access+GitHub). Remember to use your private email, noted above, in GitHub config 'user.email'.

### Prerequisites
Tools to install:
- **Volta** - version manager for Node and Yarn
  - [Installation instructions](https://docs.volta.sh/guide/getting-started)
  - ```
    brew install volta
    volta install node
    volta install yarn
    ```
- **pre-commit** - configure hooks to run automatically before each commit
  - `brew install pre-commit`
- **Talisman** - security scanner preventing secrets and sensitive information from being committed
  - ``` brew install talisman ```

### Configuration
1. Install and setup pre-commit hooks for this project
   - `pre-commit install`
1. Using Yarn package manager, install dependencies from package.json
   - `yarn` (equivalent of yarn install)

## Usage
### Build
`yarn run build`

### Run service locally
`yarn run start`

### Run pre-commit script manually
`yarn run pre-commit`
(Note that this has also been configured as a pre-commit hook that will run automatically before each commit)

### Testing
TODO

## Design
TODO

## Contacts
TODO

## Licence

> The [LICENCE.md](./LICENCE.md) file will need to be updated with the correct year and owner

Unless stated otherwise, the codebase is released under the MIT License. This covers both the codebase and any sample code in the documentation.

Any HTML or Markdown documentation is [© Crown Copyright](https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/) and available under the terms of the [Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).
