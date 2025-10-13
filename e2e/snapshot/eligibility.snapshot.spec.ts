import { expect, test } from "@playwright/test";
import { RSV_PAGE_URL } from "@project/e2e/constants";
import { openExpanders, pathForCustomScreenshots } from "@project/e2e/helpers";
import users from "@test-data/test-users.json" with { type: "json" };

test.describe("Snapshot Testing - Eligibility", () => {
  for (const scenario in users) {
    const key = scenario as keyof typeof users;
    const user = users[key];

    test.describe(`Testing snapshot for user ${user.nhsNumber}, ref ${user.nhsNumber}, "${user.reportLabel}"`, () => {
      const authContextFile = `./e2e/.auth/${key}.json`;
      const screenshotFileName = `${key}.png`;

      test.use({ storageState: authContextFile });

      test(key, async ({ page }, testInfo) => {
        const testFileName = testInfo.file.split("/").pop()!;
        const projectName = testInfo.project.name;

        const customScreenshotPath = pathForCustomScreenshots(testFileName, screenshotFileName, projectName);

        await page.goto(RSV_PAGE_URL);
        await page.getByRole("link", { name: "Log out" }).waitFor();
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
