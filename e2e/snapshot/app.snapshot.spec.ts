import { Page, TestInfo, expect, test } from "@playwright/test";
import { AppPageDetails, type PageDetails } from "@project/e2e/constants";
import { getEnv, openExpandersIfPresent, pathForCustomScreenshots } from "@project/e2e/helpers";

const currentDatetime = getEnv("CURRENT_DATETIME");
const checkoutRef = getEnv("CHECKOUT_REF");

const testPageSnapshot = async (page: Page, pageDetails: PageDetails, testFileName: string, projectName: string) => {
  const screenshotPath: string = pathForCustomScreenshots(testFileName, pageDetails.snapshotFilename, projectName);

  if (pageDetails.datetimeOverride)
    await page.setExtraHTTPHeaders({ "x-e2e-datetime": pageDetails.datetimeOverride.toISOString() });

  await page.goto(pageDetails.url);

  // wait for specific elements on the page, as they may take longer to load
  if (pageDetails.url !== AppPageDetails["service-failure-static"].url) {
    await page.getByRole("link", { name: "Log out" }).waitFor();
  }

  await openExpandersIfPresent(page);

  // This screenshot is NOT used for comparison; used to upload to S3 on failure
  await page.screenshot({ path: screenshotPath, fullPage: true, scale: "device" });

  // This screenshot IS used for comparison with the snapshot from S3
  await expect.soft(page).toHaveScreenshot(pageDetails.snapshotFilename, { fullPage: true, scale: "device" });
};

test.describe(`Snapshot Testing - ${currentDatetime}-${checkoutRef}`, () => {
  test.use({ storageState: "./e2e/.auth/default.json" });

  Object.entries(AppPageDetails).forEach(([pageName, pageDetails]: [string, PageDetails]) => {
    test(`Testing snapshot for ${pageName} page`, async ({ page }, testInfo: TestInfo) => {
      const projectName = testInfo.project.name;
      const testFileName = testInfo.file.split("/").pop()!;

      await testPageSnapshot(page, pageDetails, testFileName, projectName);
    });
  });
});
