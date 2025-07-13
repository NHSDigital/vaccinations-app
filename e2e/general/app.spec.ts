import { expect, test } from "@playwright/test";
import { accessibilityCheck, benchmark, clickLinkAndExpectPageTitle } from "@project/e2e/helpers";

import {
  HUB_PAGE_TITLE,
  HUB_PAGE_URL,
  MAX_AVG_LCP_DURATION_MS,
  RSV_PAGE_TITLE,
  RSV_PAGE_URL,
  RSV_PREGNANCY_PAGE_TITLE,
  RSV_PREGNANCY_PAGE_URL,
} from "../constants";

test.describe.configure({ mode: "serial" });

test.describe("E2E", () => {
  test.use({ storageState: `./e2e/.auth/Default.json` });

  test("Hub page", async ({ page }) => {
    await page.goto(HUB_PAGE_URL);
    await expect(page).toHaveTitle(HUB_PAGE_TITLE);
    await accessibilityCheck(page);
    expect.soft(await benchmark(page, HUB_PAGE_URL)).toBeLessThanOrEqual(MAX_AVG_LCP_DURATION_MS);
  });

  test("RSV page", async ({ page }) => {
    await page.goto(RSV_PAGE_URL);
    await expect(page).toHaveTitle(RSV_PAGE_TITLE);
    await accessibilityCheck(page);
    expect.soft(await benchmark(page, RSV_PAGE_URL)).toBeLessThanOrEqual(MAX_AVG_LCP_DURATION_MS);
  });

  test("RSV in pregnancy page", async ({ page }) => {
    await page.goto(RSV_PREGNANCY_PAGE_URL);
    await expect(page).toHaveTitle(RSV_PREGNANCY_PAGE_TITLE);
    await accessibilityCheck(page);
    expect.soft(await benchmark(page, RSV_PREGNANCY_PAGE_URL)).toBeLessThanOrEqual(MAX_AVG_LCP_DURATION_MS);
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
});
