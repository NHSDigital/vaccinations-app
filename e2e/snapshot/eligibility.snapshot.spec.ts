import { Page, expect, test } from "@playwright/test";
import { RSV_PAGE_URL } from "@project/e2e/constants";
import { pathForCustomScreenshots } from "@project/e2e/helpers";
import users from "@test-data/test-users.json" with { type: "json" };

const openExpanders = async (page: Page) => {
  const expanderTitles = [
    "What this vaccine is for",
    "Who should have this vaccine",
    "How to get the vaccine",
  ];

  for (const title of expanderTitles) {
    await page.getByText(title).click();
  }

  await page.mouse.click(0, 0);
};

test.describe("Snapshot Testing - Eligibility", () => {
  for (const key of Object.keys(users)) {
    test.describe(key, () => {
      const authContextFile = `./e2e/.auth/${key}.json`;
      const screenshotFileName = `${key}.png`;

      test.use({ storageState: authContextFile });

      test(key, async ({ page }, testInfo) => {
        const fileName = testInfo.file.split("/").pop()!;
        const projectName = testInfo.project.name;

        const customScreenshotPath = pathForCustomScreenshots(
          fileName,
          screenshotFileName,
          projectName
        );

        await page.goto(RSV_PAGE_URL);
        await openExpanders(page);

        await page.screenshot({
          path: customScreenshotPath,
          fullPage: true,
        });

        await expect.soft(page).toHaveScreenshot(screenshotFileName, {
          fullPage: true,
        });
      });
    });
  }
});
