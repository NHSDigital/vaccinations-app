import { TestInfo, expect, test } from "@playwright/test";
import { accessibilityCheck, benchmarkIfChromium, clickLinkAndExpectPageTitle } from "@project/e2e/helpers";

import {
  COOKIE_POLICY_PAGE_TITLE,
  COOKIE_POLICY_PAGE_URL,
  HUB_PAGE_TITLE,
  HUB_PAGE_URL,
  MAX_AVG_LCP_DURATION_MS,
  PAGE_NOT_FOUND_TITLE,
  PAGE_NOT_FOUND_URL,
  RSV_PAGE_TITLE,
  RSV_PAGE_URL,
  RSV_PREGNANCY_PAGE_TITLE,
  RSV_PREGNANCY_PAGE_URL,
  SESSION_LOGOUT_PAGE_TITLE,
} from "../constants";

test.describe.configure({ mode: "parallel", retries: 3 });

test.describe("Application", () => {
  test.use({ storageState: `./e2e/.auth/default.json` });

  test("Hub page", async ({ page }, testInfo: TestInfo) => {
    await page.goto(HUB_PAGE_URL);
    await expect(page).toHaveTitle(HUB_PAGE_TITLE);
    await accessibilityCheck(page);
    await benchmarkIfChromium(page, HUB_PAGE_URL, MAX_AVG_LCP_DURATION_MS, testInfo);
  });

  test("RSV page", async ({ page }, testInfo: TestInfo) => {
    await page.goto(RSV_PAGE_URL);
    await expect(page).toHaveTitle(RSV_PAGE_TITLE);
    await accessibilityCheck(page);
    await benchmarkIfChromium(page, RSV_PAGE_URL, MAX_AVG_LCP_DURATION_MS, testInfo);
  });

  test("RSV in pregnancy page", async ({ page }, testInfo: TestInfo) => {
    await page.goto(RSV_PREGNANCY_PAGE_URL);
    await expect(page).toHaveTitle(RSV_PREGNANCY_PAGE_TITLE);
    await accessibilityCheck(page);
    await benchmarkIfChromium(page, RSV_PREGNANCY_PAGE_URL, MAX_AVG_LCP_DURATION_MS, testInfo);
  });

  test("Cookie policy page", async ({ page }, testInfo: TestInfo) => {
    await page.goto(COOKIE_POLICY_PAGE_URL);
    await expect(page).toHaveTitle(COOKIE_POLICY_PAGE_TITLE);
    await accessibilityCheck(page);
    await benchmarkIfChromium(page, COOKIE_POLICY_PAGE_URL, MAX_AVG_LCP_DURATION_MS, testInfo);
  });

  test("Back link navigation", async ({ page }) => {
    await page.goto(HUB_PAGE_URL);
    await clickLinkAndExpectPageTitle(page, "RSV vaccine for older adults", RSV_PAGE_TITLE);
    await clickLinkAndExpectPageTitle(page, "Back", HUB_PAGE_TITLE);
  });

  test("Skip link navigation", async ({ page }) => {
    await page.goto(HUB_PAGE_URL);
    await page.getByTestId("skip-link").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { level: 1 })).toBeFocused();

    // Test skip link still works after navigation
    await clickLinkAndExpectPageTitle(page, "RSV vaccine for older adults", RSV_PAGE_TITLE);
    await page.getByTestId("skip-link").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  });

  test("Log out link navigation", async ({ page }) => {
    await page.goto(HUB_PAGE_URL);
    await expect(page).toHaveTitle(HUB_PAGE_TITLE);
    await clickLinkAndExpectPageTitle(page, "Log out", SESSION_LOGOUT_PAGE_TITLE);
  });

  test("HTTP 404 - Page not found", async ({ page }) => {
    await page.goto(PAGE_NOT_FOUND_URL);
    await expect(page).toHaveTitle(PAGE_NOT_FOUND_TITLE);
    await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
    await accessibilityCheck(page);
  });
});
