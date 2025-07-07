import { expect, Page, test } from "@playwright/test";
import { RSV_PAGE_URL } from "@project/e2e/constants";
import { login } from "@project/e2e/auth";
import users from "@test-data/test-users.json" assert { type: "json" };
import { pathForCustomScreenshots } from "@project/e2e/helpers";

test.describe("E2E", () => {
  let page: Page;
  let projectName: string;
  let fileName: string;

  test.beforeAll(async ({}, testInfo) => {
    projectName = testInfo.project.name;
    fileName = testInfo.file.split("/").pop()!;
  });

  test.describe("Not Eligible", () => {
    test.beforeAll(async ({ browser }, testInfo) => {
      testInfo.setTimeout(60000);
      page = await login(browser, users.NotEligible.email);

      await page.mouse.move(0, 0);
    });

    test("Not eligible - age and catchup bullet points", async () => {
      const screenshotFileName = "eligibility-not-eligible.png";
      const customScreenshotPath = pathForCustomScreenshots(fileName, screenshotFileName, projectName);
      await page.goto(RSV_PAGE_URL);
      await page.screenshot({
        path: customScreenshotPath,
        fullPage: true,
      });
      await expect.soft(page).toHaveScreenshot(screenshotFileName, {
        fullPage: true,
      });
    });
  });

  test.describe("Actionable", () => {
    test.beforeAll(async ({ browser }, testInfo) => {
      testInfo.setTimeout(60000);
      page = await login(browser, users.Actionable.email);

      await page.mouse.move(0, 0);
    });

    test("Actionable - catchup bullet points", async () => {
      const screenshotFileName = "eligibility-actionable.png";
      const customScreenshotPath = pathForCustomScreenshots(fileName, screenshotFileName, projectName);
      await page.goto(RSV_PAGE_URL);
      await page.screenshot({
        path: customScreenshotPath,
        fullPage: true,
      });
      await expect.soft(page).toHaveScreenshot(screenshotFileName, {
        fullPage: true,
      });
    });
  });
});
