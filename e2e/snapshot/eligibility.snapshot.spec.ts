import { Page, expect, test } from "@playwright/test";
import { login } from "@project/e2e/auth";
import { RSV_PAGE_URL } from "@project/e2e/constants";
import { pathForCustomScreenshots } from "@project/e2e/helpers";
import users from "@test-data/test-users.json" with { type: "json" };

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

  test.describe("Error", () => {
    test.beforeAll(async ({ browser }, testInfo) => {
      testInfo.setTimeout(60000);
      page = await login(browser, users.Eligibility_Error_400.email);

      await page.mouse.move(0, 0);
    });

    test("Eligibility Error 400 Only", async () => {
      const screenshotFileName = "eligibility-error-400.png";
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
