import { expect, test } from "@playwright/test";
import { RSV_PAGE_URL } from "@project/e2e/constants";
import { getEnv, openExpanders, pathForCustomScreenshots } from "@project/e2e/helpers";
import users from "@test-data/test-users.json" with { type: "json" };

const currentDatetime = getEnv("CURRENT_DATETIME");
const checkoutRef = getEnv("CHECKOUT_REF");

test.describe(`Snapshot Testing - Eligibility - ${currentDatetime}-${checkoutRef}`, () => {
  for (const scenario in users) {
    const key = scenario as keyof typeof users;
    if (users[key].snapshot) {
      const user = users[key];
      const ref = user.elidPostmanRef ? `ref ${user.elidPostmanRef}, ` : "";

      test.describe(`Testing snapshot for user ${user.nhsNumber}, ${ref}"${user.reportLabel}"`, () => {
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

          // This screenshot is NOT used for comparison; used to upload to S3 on failure
          await page.screenshot({
            path: customScreenshotPath,
            fullPage: true,
            scale: "device",
          });

          // This screenshot IS used for comparison with the snapshot from S3
          await expect.soft(page).toHaveScreenshot(screenshotFileName, {
            fullPage: true,
            scale: "device",
          });
        });
      });
    }
  }
});
