import { Page, expect, test } from "@playwright/test";
import { type TestInfo } from "@playwright/test";
import { login } from "@project/e2e/auth";
import { pathForCustomScreenshots } from "@project/e2e/helpers";
import users from "@test-data/test-users.json" with { type: "json" };

import { HUB_PAGE_URL, RSV_PAGE_URL, RSV_PREGNANCY_PAGE_URL } from "../constants";

test.describe("E2E", () => {
  let page: Page;
  let projectName: string;
  let testFileName: string;

  test.beforeAll(async ({ browser }, testInfo: TestInfo) => {
    testInfo.setTimeout(60000);
    page = await login(browser, users.Default.email);
    projectName = testInfo.project.name;
    testFileName = testInfo.file.split("/").pop()!;

    await page.mouse.move(0, 0);
  });

  const testPageSnapshot = async (snapshotFileName: string, pageRoute: string) => {
    const screenshotPath: string = pathForCustomScreenshots(testFileName, snapshotFileName, projectName);
    await page.goto(pageRoute);
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });
    await expect.soft(page).toHaveScreenshot(snapshotFileName, {
      fullPage: true,
    });
  };

  const PathsToSnapshots = [
    { snapshotFilename: "default-hub.png", pageRoute: HUB_PAGE_URL },
    { snapshotFilename: "default-rsv.png", pageRoute: RSV_PAGE_URL },
    { snapshotFilename: "default-rsv-pregnancy.png", pageRoute: RSV_PREGNANCY_PAGE_URL },
  ];

  PathsToSnapshots.forEach(({ snapshotFilename, pageRoute }) => {
    test(`Testing snapshot for ${pageRoute}`, async () => {
      await testPageSnapshot(snapshotFilename, pageRoute);
    });
  });
});
