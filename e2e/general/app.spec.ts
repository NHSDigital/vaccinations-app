import { TestInfo, expect, test } from "@playwright/test";
import type { PageDetails } from "@project/e2e/constants";
import { AppPageDetails, MAX_AVG_LCP_DURATION_MS } from "@project/e2e/constants";
import { accessibilityCheck, benchmarkIfChromium } from "@project/e2e/helpers";

test.describe.configure({ mode: "parallel", retries: 3 });

test.describe("Application", () => {
  test.use({ storageState: `./e2e/.auth/default.json` });

  Object.entries(AppPageDetails).forEach(([pageName, pageDetails]: [string, PageDetails]) => {
    test(`Check title, heading, accessibility, LCP performance for ${pageName} page`, async ({
      page,
    }, testInfo: TestInfo) => {
      await page.goto(pageDetails.url);
      await expect(page).toHaveTitle(pageDetails.title);
      await expect(page.getByRole("heading", { level: 1, name: pageDetails.heading })).toBeVisible();
      await accessibilityCheck(page);
      await benchmarkIfChromium(page, pageDetails.url, MAX_AVG_LCP_DURATION_MS, testInfo);
    });
  });
});
