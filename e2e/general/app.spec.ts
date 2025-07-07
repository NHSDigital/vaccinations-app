import { expect, Page, test } from "@playwright/test";
import {
  HUB_PAGE_TITLE,
  HUB_PAGE_URL,
  MAX_AVG_LCP_DURATION_MS,
  RSV_PAGE_TITLE,
  RSV_PAGE_URL,
  RSV_PREGNANCY_PAGE_TITLE,
  RSV_PREGNANCY_PAGE_URL,
} from "../constants";
import { accessibilityCheck, benchmark, clickLinkAndExpectPageTitle } from "@project/e2e/helpers";
import { login } from "@project/e2e/auth";
import users from "@test-data/test-users.json" assert { type: "json" };

test.describe.configure({ mode: "serial" });

test.describe("E2E", () => {
  let page: Page;

  test.beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(60_000);
    page = await login(browser, users.Default.email);
  });

  test("Hub page", async () => {
    await page.goto(HUB_PAGE_URL);
    await expect(page).toHaveTitle(HUB_PAGE_TITLE);
    await accessibilityCheck(page);
    expect.soft(await benchmark(page, HUB_PAGE_TITLE)).toBeLessThanOrEqual(MAX_AVG_LCP_DURATION_MS);
  });

  test("RSV page", async () => {
    await page.goto(RSV_PAGE_URL);
    await expect(page).toHaveTitle(RSV_PAGE_TITLE);
    await accessibilityCheck(page);
    expect.soft(await benchmark(page, RSV_PAGE_URL)).toBeLessThanOrEqual(MAX_AVG_LCP_DURATION_MS);
  });

  test("RSV in pregnancy page", async () => {
    await page.goto(RSV_PREGNANCY_PAGE_URL);
    await expect(page).toHaveTitle(RSV_PREGNANCY_PAGE_TITLE);
    await accessibilityCheck(page);
    expect.soft(await benchmark(page, RSV_PREGNANCY_PAGE_URL)).toBeLessThanOrEqual(MAX_AVG_LCP_DURATION_MS);
  });

  test("Back link navigation", async () => {
    await page.goto(HUB_PAGE_URL);
    await clickLinkAndExpectPageTitle(page, "RSV vaccine for older adults", RSV_PAGE_TITLE);
    await clickLinkAndExpectPageTitle(page, "Back", HUB_PAGE_TITLE);
  });

  test("Skip link navigation", async () => {
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
