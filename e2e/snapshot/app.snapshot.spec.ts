import { Page, expect, test } from "@playwright/test";
import { AppPageDetails } from "@project/e2e/constants";
import { getEnv, openExpanders, pathForCustomScreenshots } from "@project/e2e/helpers";

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

  if ([AppPageDetails["rsv-older-adults"].url, AppPageDetails["rsv-pregnancy"].url].includes(pageRoute)) {
    await openExpanders(page);
  }

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

  const PathsToSnapshots = [
    {
      snapshotFilename: "default-hub.png",
      pageRoute: AppPageDetails["vaccines-hub"].url,
      reportLabel: "Hub",
    },
    {
      snapshotFilename: "default-vaccines-for-all-ages.png",
      pageRoute: AppPageDetails["vaccines-for-all-ages"].url,
      reportLabel: "Vaccines for all ages",
    },
    {
      snapshotFilename: "default-rsv.png",
      pageRoute: AppPageDetails["rsv-older-adults"].url,
      reportLabel: "RSV",
    },
    {
      snapshotFilename: "default-rsv-pregnancy.png",
      pageRoute: AppPageDetails["rsv-pregnancy"].url,
      reportLabel: "RSV pregnancy",
    },
    {
      snapshotFilename: "default-accessibility-statement.png",
      pageRoute: AppPageDetails["accessibility-statement"].url,
      reportLabel: "Accessibility statement",
    },
    {
      snapshotFilename: "default-cookies-policy.png",
      pageRoute: AppPageDetails["cookies-policy"].url,
      reportLabel: "Cookie policy",
    },
    {
      snapshotFilename: "default-service-failure.png",
      pageRoute: AppPageDetails["service-failure"].url,
      reportLabel: "Service failure",
    },
    {
      snapshotFilename: "default-sso-failure.png",
      pageRoute: AppPageDetails["sso-failure"].url,
      reportLabel: "SSO failure",
    },
    {
      snapshotFilename: "default-session-timeout.png",
      pageRoute: AppPageDetails["session-timeout"].url,
      reportLabel: "Session timeout",
    },
    {
      snapshotFilename: "default-not-found.png",
      pageRoute: AppPageDetails["not-found"].url,
      reportLabel: "Page not found",
    },
    {
      snapshotFilename: "default-session-logout.png",
      pageRoute: AppPageDetails["session-logout"].url,
      reportLabel: "Session logout",
    },
  ];

  PathsToSnapshots.forEach(({ snapshotFilename, pageRoute, reportLabel }) => {
    test(`Testing snapshot for "${reportLabel}" page`, async ({ page }, testInfo) => {
      const projectName = testInfo.project.name;
      const testFileName = testInfo.file.split("/").pop()!;

      await testPageSnapshot(page, snapshotFilename, pageRoute, testFileName, projectName);
    });
  });
});
