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

const testCases = [
  {
    testName: "Not Eligible - With InfoText Action",
    user: users.NotEligible_With_InfoText_Action,
    screenshotFileName: "NotEligible-With-InfoText-Action.png",
    authContextFile: "./e2e/.auth/NotEligible_With_InfoText_Action.json"// playwright doesn't like underscore in screenshot filenames
  },
  {
    testName: "Actionable - With InfoText Action",
    user: users.Actionable_With_InfoText_Action,
    screenshotFileName: "Actionable-With-InfoText-Action.png",
    authContextFile: "./e2e/.auth/Actionable_With_InfoText_Action.json"
  },
  {
    testName: "Eligibility Error 400 Only",
    user: users.Eligibility_Error_400,
    screenshotFileName: "Eligibility-Error-400.png",
    authContextFile: "./e2e/.auth/Eligibility_Error_400.json"
  },
];

test.describe("Snapshot Testing - Eligibility", () => {
  for (const tc of testCases) {
    test.describe(tc.testName, () => {
      test.use({ storageState: tc.authContextFile });

      test(tc.testName, async ({ page }, testInfo) => {
        const fileName = testInfo.file.split("/").pop()!;
        const projectName = testInfo.project.name;

        const customScreenshotPath = pathForCustomScreenshots(
          fileName,
          tc.screenshotFileName,
          projectName
        );

        await page.goto(RSV_PAGE_URL);
        await openExpanders(page);

        await page.screenshot({
          path: customScreenshotPath,
          fullPage: true,
        });

        await expect.soft(page).toHaveScreenshot(tc.screenshotFileName, {
          fullPage: true,
        });
      });
    });
  }
});
