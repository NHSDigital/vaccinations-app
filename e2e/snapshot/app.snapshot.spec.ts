import { Page, TestInfo, expect, test } from "@playwright/test";
import { AppPageDetails, type PageDetails } from "@project/e2e/constants";
import { getEnv, openExpandersIfPresent, pathForCustomScreenshots } from "@project/e2e/helpers";

const currentDatetime = getEnv("CURRENT_DATETIME");
const checkoutRef = getEnv("CHECKOUT_REF");

const testPageSnapshot = async (
  page: Page,
  snapshotFileName: string,
  pageRoute: string,
  testFileName: string,
  projectName: string,
) => {
  const screenshotPath: string = pathForCustomScreenshots(testFileName, snapshotFileName, projectName);
  await page.goto(pageRoute);
  await page.getByRole("link", { name: "Log out" }).waitFor();

  await openExpandersIfPresent(page);

  // This screenshot is NOT used for comparison; used to upload to S3 on failure
  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
    scale: "device",
  });

  // This screenshot IS used for comparison with the snapshot from S3
  await expect.soft(page).toHaveScreenshot(snapshotFileName, {
    fullPage: true,
    scale: "device",
  });
};

test.describe(`Snapshot Testing - ${currentDatetime}-${checkoutRef}`, () => {
  test.use({ storageState: "./e2e/.auth/default.json" });

  Object.entries(AppPageDetails).forEach(([pageName, pageDetails]: [string, PageDetails]) => {
    test(`Testing snapshot for ${pageName} page`, async ({ page }, testInfo: TestInfo) => {
      const projectName = testInfo.project.name;
      const testFileName = testInfo.file.split("/").pop()!;

      await testPageSnapshot(page, pageDetails.snapshotFilename, pageDetails.url, testFileName, projectName);
    });
  });
});
