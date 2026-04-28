import { expect, test } from "@playwright/test";
import { AppPageDetails } from "@project/e2e/constants";
import { getEnv, openExpandersIfPresent, pathForCustomScreenshots } from "@project/e2e/helpers";
import users from "@test-data/test-users.json" with { type: "json" };

// TODO: update test-data/test-users.json to add COVID snapshot users (snapshot: true, covidSnapshot: true or similar)
// and update the filter below once the agreed COVID personalisation scenarios are available.

const currentDatetime = getEnv("CURRENT_DATETIME");
const checkoutRef = getEnv("CHECKOUT_REF");

test.describe(`Snapshot Testing - COVID Eligibility - ${currentDatetime}-${checkoutRef}`, () => {
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

          await page.goto(AppPageDetails["covid-19-vaccine"].url);
          await page.getByRole("link", { name: "Log out" }).waitFor();
          await openExpandersIfPresent(page);

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
