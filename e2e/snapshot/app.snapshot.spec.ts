import { Page, expect, test } from "@playwright/test";
import { getEnv, openExpanders, pathForCustomScreenshots } from "@project/e2e/helpers";
import { ACCESSIBILITY_STATEMENT_ROUTE } from "@src/app/our-policies/accessibility/constants";
import { COOKIES_POLICY_ROUTE } from "@src/app/our-policies/cookies-policy/constants";
import { SERVICE_FAILURE_ROUTE } from "@src/app/service-failure/constants";
import { SESSION_LOGOUT_ROUTE } from "@src/app/session-logout/constants";
import { SESSION_TIMEOUT_ROUTE } from "@src/app/session-timeout/constants";
import { SSO_FAILURE_ROUTE } from "@src/app/sso-failure/constants";

import { HUB_PAGE_URL, RSV_PAGE_URL, RSV_PREGNANCY_PAGE_URL } from "../constants";

const currentDatetime = getEnv("CURRENT_DATETIME");
const checkoutRef = getEnv("CHECKOUT_REF");

const testPageSnapshot = async (
  page: Page,
  snapshotFileName: string,
  pageRoute: string,
  testFileName: string,
  projectName: string,
) => {
  const screenshotPath: string = pathForCustomScreenshots(testFileName, snapshotFileName, projectName);
  await page.goto(pageRoute);
  await page.getByRole("link", { name: "Log out" }).waitFor();

  if ([RSV_PAGE_URL, RSV_PREGNANCY_PAGE_URL].includes(pageRoute)) {
    await openExpanders(page);
  }

  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });
  await expect.soft(page).toHaveScreenshot(snapshotFileName, {
    fullPage: true,
  });
};

test.describe(`Snapshot Testing - ${currentDatetime}-${checkoutRef}`, () => {
  test.use({ storageState: "./e2e/.auth/default.json" });

  const PathsToSnapshots = [
    { snapshotFilename: "default-hub.png", pageRoute: HUB_PAGE_URL, reportLabel: "Hub" },
    { snapshotFilename: "default-rsv.png", pageRoute: RSV_PAGE_URL, reportLabel: "RSV" },
    { snapshotFilename: "default-rsv-pregnancy.png", pageRoute: RSV_PREGNANCY_PAGE_URL, reportLabel: "RSV pregnancy" },
    {
      snapshotFilename: "default-accessibility-statement.png",
      pageRoute: ACCESSIBILITY_STATEMENT_ROUTE,
      reportLabel: "Accessibility statement",
    },
    { snapshotFilename: "default-cookies-policy.png", pageRoute: COOKIES_POLICY_ROUTE, reportLabel: "Cookie policy" },
    {
      snapshotFilename: "default-service-failure.png",
      pageRoute: SERVICE_FAILURE_ROUTE,
      reportLabel: "Service failure",
    },
    { snapshotFilename: "default-sso-failure.png", pageRoute: SSO_FAILURE_ROUTE, reportLabel: "SSO failure" },
    {
      snapshotFilename: "default-session-timeout.png",
      pageRoute: SESSION_TIMEOUT_ROUTE,
      reportLabel: "Session timeout",
    },
    { snapshotFilename: "default-not-found.png", pageRoute: "/no-such-route", reportLabel: "Page not found" },
    { snapshotFilename: "default-session-logout.png", pageRoute: SESSION_LOGOUT_ROUTE, reportLabel: "Session logout" },
  ];

  PathsToSnapshots.forEach(({ snapshotFilename, pageRoute, reportLabel }) => {
    test(`Testing snapshot for "${reportLabel}" page`, async ({ page }, testInfo) => {
      const projectName = testInfo.project.name;
      const testFileName = testInfo.file.split("/").pop()!;

      await testPageSnapshot(page, snapshotFilename, pageRoute, testFileName, projectName);
    });
  });
});
