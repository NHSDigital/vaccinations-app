import { Page, expect, test } from "@playwright/test";
import { pathForCustomScreenshots } from "@project/e2e/helpers";
import { ACCESSIBILITY_STATEMENT_ROUTE } from "@src/app/our-policies/accessibility/constants";
import { COOKIES_POLICY_ROUTE } from "@src/app/our-policies/cookies-policy/constants";
import { TERMS_OF_USE_ROUTE } from "@src/app/our-policies/terms/constants";

import { HUB_PAGE_URL, RSV_PAGE_URL, RSV_PREGNANCY_PAGE_URL } from "../constants";

const testPageSnapshot = async (
  page: Page,
  snapshotFileName: string,
  pageRoute: string,
  testFileName: string,
  projectName: string,
) => {
  const screenshotPath: string = pathForCustomScreenshots(testFileName, snapshotFileName, projectName);
  await page.goto(pageRoute);

  if ([RSV_PAGE_URL, RSV_PREGNANCY_PAGE_URL].includes(pageRoute)) {
    if (pageRoute === RSV_PAGE_URL) {
      await page.getByText("How to get the vaccine").click();
    }
    await page.getByText("Who should have this vaccine").click();
    await page.getByText("What this vaccine is for").click();

    await page.mouse.click(0, 0);
  }

  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });
  await expect.soft(page).toHaveScreenshot(snapshotFileName, {
    fullPage: true,
  });
};

test.describe("Snapshot Testing", () => {
  test.use({ storageState: `./e2e/.auth/default.json` });

  const PathsToSnapshots = [
    { snapshotFilename: "default-hub.png", pageRoute: HUB_PAGE_URL },
    { snapshotFilename: "default-rsv.png", pageRoute: RSV_PAGE_URL },
    { snapshotFilename: "default-rsv-pregnancy.png", pageRoute: RSV_PREGNANCY_PAGE_URL },
    { snapshotFilename: "default-terms-of-use.png", pageRoute: TERMS_OF_USE_ROUTE },
    { snapshotFilename: "default-accessibility-statement.png", pageRoute: ACCESSIBILITY_STATEMENT_ROUTE },
    { snapshotFilename: "default-cookies-policy.png", pageRoute: COOKIES_POLICY_ROUTE },
  ];

  PathsToSnapshots.forEach(({ snapshotFilename, pageRoute }) => {
    test(`Testing snapshot for ${pageRoute}`, async ({ page }, testInfo) => {
      const projectName = testInfo.project.name;
      const testFileName = testInfo.file.split("/").pop()!;

      await testPageSnapshot(page, snapshotFilename, pageRoute, testFileName, projectName);
    });
  });
});
