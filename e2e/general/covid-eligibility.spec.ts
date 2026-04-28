import { TestInfo, expect, test } from "@playwright/test";
import { AppPageDetails, MAX_AVG_LCP_DURATION_MS } from "@project/e2e/constants";
import { accessibilityCheck, benchmarkIfChromium } from "@project/e2e/helpers";

const COVID_PAGE_URL = AppPageDetails["covid-19-vaccine"].url;

test.describe.configure({ mode: "parallel", retries: 1 });

// TODO: flesh out test scenarios once the agreed COVID personalisation ELiD response
// structure and scenarios are available. storageState values below correspond to COVID
// test users that will be added to test-data/test-users.json in Phase 4.

test.describe("COVID Eligibility", () => {
  test.afterEach(async ({ page }, testInfo: TestInfo) => {
    await accessibilityCheck(page);
    await benchmarkIfChromium(page, COVID_PAGE_URL, MAX_AVG_LCP_DURATION_MS, testInfo);
  });

  test.describe("Not Eligible", () => {
    test.use({ storageState: `./e2e/.auth/covid-not-eligible.json` });

    test("placeholder", async ({ page }) => {
      await page.goto(COVID_PAGE_URL);

      expect(true).toBe(true);
    });
  });
});
