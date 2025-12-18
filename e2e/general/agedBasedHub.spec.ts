import { TestInfo, expect, test } from "@playwright/test";
import { AppPageDetails, MAX_AVG_LCP_DURATION_MS } from "@project/e2e/constants";
import { accessibilityCheck, benchmarkIfChromium } from "@project/e2e/helpers";
import { AgeBasedHubInfo, AgeGroup } from "@src/models/ageBasedHub";

test.describe.configure({ mode: "parallel", retries: 1 });

type AgeBasedTestUser = {
  ageGroup: AgeGroup;
  userSession: string;
};

const AgeBasedHubTestUsers: AgeBasedTestUser[] = [
  // { ageGroup: AgeGroup.AGE_12_to_16, userSession: "12-16-age-range"}, // user 34
  // { ageGroup: AgeGroup.AGE_17_to_24, userSession: "eligibility-error-400"}, // user 16
  // { ageGroup: AgeGroup.AGE_25_to_64, userSession: "actionable-with-other-setting-suitability-rule"}, // user 12
  { ageGroup: AgeGroup.AGE_65_to_74, userSession: "actionable-with-booking-link" }, // user 19
  // { ageGroup: AgeGroup.AGE_75_to_80, userSession: "actionable-with-booking-button"}, // user 21
  // { ageGroup: AgeGroup.AGE_81_PLUS, userSession: "actionable-with-infotext-action"}, //user 01
];

test.describe("Age-Based Hub", () => {
  AgeBasedHubTestUsers.forEach(({ ageGroup, userSession }) => {
    test.use({ storageState: `./e2e/.auth/${userSession}.json` });

    test(`should render hub page for ${ageGroup}`, async ({ page }, testInfo: TestInfo) => {
      const hubPageDetails = AppPageDetails["vaccine-hub"];

      await page.goto(hubPageDetails.url);
      await expect(page).toHaveTitle(hubPageDetails.title);
      await expect(page.getByRole("heading", { level: 1, name: hubPageDetails.heading })).toBeVisible();
      await expect(page.getByRole("heading", { level: 2, name: AgeBasedHubInfo[ageGroup]?.heading })).toBeVisible();

      await accessibilityCheck(page);
      await benchmarkIfChromium(page, hubPageDetails.url, MAX_AVG_LCP_DURATION_MS, testInfo);
    });
  });
});
