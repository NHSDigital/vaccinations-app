import { expect, Page, test } from "@playwright/test";
import { HUB_PAGE_URL, RSV_PAGE_URL, RSV_PREGNANCY_PAGE_URL } from "../constants";
import { login } from "@project/e2e/auth";
import users from "@test-data/test-users.json" assert { type: "json" };
import { pathForCustomScreenshots } from "@project/e2e/helpers";
import { type TestInfo } from "@playwright/test";

test.describe("E2E", () => {
  let page: Page;
  let projectName: string;
  let fileName: string;

  test.beforeAll(async ({ browser }, testInfo: TestInfo) => {
    testInfo.setTimeout(60_000);
    page = await login(browser, users.Default.email);
    projectName = testInfo.project.name;
    fileName = testInfo.file.split("/").pop()!;

    await page.mouse.move(0, 0);
  });

  test("Page Snapshots", async () => {
    let screenshotFileName: string;
    let customScreenshotPath: string;

    screenshotFileName = "default-hub.png";
    customScreenshotPath = pathForCustomScreenshots(fileName, screenshotFileName, projectName);
    await page.goto(HUB_PAGE_URL);
    await page.screenshot({
      path: customScreenshotPath,
      fullPage: true,
    });
    await expect.soft(page).toHaveScreenshot(screenshotFileName, {
      fullPage: true,
    });

    screenshotFileName = "default-rsv.png";
    customScreenshotPath = pathForCustomScreenshots(fileName, screenshotFileName, projectName);
    await page.goto(RSV_PAGE_URL);
    await page.screenshot({
      path: customScreenshotPath,
      fullPage: true,
    });
    await expect.soft(page).toHaveScreenshot(screenshotFileName, {
      fullPage: true,
    });

    screenshotFileName = "default-rsv-pregnancy.png";
    customScreenshotPath = pathForCustomScreenshots(fileName, screenshotFileName, projectName);
    await page.goto(RSV_PREGNANCY_PAGE_URL);
    await page.screenshot({
      path: customScreenshotPath,
      fullPage: true,
    });
    await expect.soft(page).toHaveScreenshot(screenshotFileName, {
      fullPage: true,
    });
  });
});
