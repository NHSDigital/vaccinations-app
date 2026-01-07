import { TestInfo, expect, test } from "@playwright/test";
import { AgeBasedHubTestUsers, AppPageDetails, MAX_AVG_LCP_DURATION_MS } from "@project/e2e/constants";
import { accessibilityCheck, benchmarkIfChromium } from "@project/e2e/helpers";

test.describe.configure({ mode: "parallel", retries: 1 });

test.describe("Age-Based Hub", () => {
  AgeBasedHubTestUsers.forEach(({ ageGroup, userSession, ageBasedHeading }) => {
    test.describe(`for ${ageGroup}`, () => {
      test.use({ storageState: `./e2e/.auth/${userSession}.json` });

      test(`should render hub page for ${ageGroup}`, async ({ page }, testInfo: TestInfo) => {
        const hubPageDetails = AppPageDetails["vaccine-hub"];

        await page.goto(hubPageDetails.url);
        await expect(page).toHaveTitle(hubPageDetails.title);
        await expect(page.getByRole("heading", { level: 1, name: hubPageDetails.heading })).toBeVisible();
        await expect(page.getByRole("heading", { level: 2, name: ageBasedHeading })).toBeVisible();

        await accessibilityCheck(page);
        await benchmarkIfChromium(page, hubPageDetails.url, MAX_AVG_LCP_DURATION_MS, testInfo);
      });
    });
  });
});
