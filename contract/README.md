# Contract Testing

## EliD API

In the MyVaccines codebase there are 2 files for contract testing with EliD:

### 1. eligibility-api.contract.ts

- Run against a real EliD environment, set by the environment variable "ELIGIBILITY_API_ENDPOINT" as follows:
  - Github Actions: the value is defined in the workflow/action .yaml file, passed in as a env var to the contract-test action
  - Local: ELIGIBILITY_API_ENDPOINT is set in env.local
- Assertions verify that in the EliD response:
  - Success cases: For a given NHS number
    - the eligibilityStatus has the expected value (hardcoded in the test assertion as an expectation)
    - CohortElement is present
  - Failure cases:
    - that for each NHS number expected to fail, a 'LOADING_ERROR' response gets returned


### 2. fetch-eligibility-content.contract.ts

- **This does not call a real environment**
- EliD mock responses are stored in `/wiremock/__files/eligibility` (specifically, this test uses test user 13, 9450114080)
- A Pact server runs in memory on localhost:1234, configured to serve this mock EliD file as an interaction (see `fetch-eligibility-content.contract.ts` line 60: interaction element, returning 200 )
- MyVaccines is configured to call this local server for EliD.
- When `fetchEligibilityContent` is called, it asserts that the response that comes back from the `fetchEligibilityContent` method is identical to the mock wiremock file returned by Pact.
