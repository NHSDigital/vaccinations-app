# Runbook for solving production issues

## Manual vaccine content cache refresh

### Triggers

- When the periodic cache refresh has failed for some reason
- When nhs.uk tells us that the content needs to be refreshed asap

### Action

1. Login to the AWS environment and ensure you are in London **eu-west-2** region.
2. Navigate to **Lambda** service.
3. Click on the lambda with prefix `gh-vita` and suffix `content-cache-hydrator`
4. Select **Test** tab to create a new test event
5. Give the new event a  meaningful name
6. Keep the event sharing settings to **Private**
7. Use the following template as the event JSON (feel free to add other non-PII fields as necessary for audit)

    ```json
    {
      "who": "<name and email of the person triggering this action>",
      "why": "<reason for this manual cache refresh>"
    }
    ```
