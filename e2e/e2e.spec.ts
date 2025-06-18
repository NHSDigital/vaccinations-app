import { expect, Page, test } from "@playwright/test";
import {
  HUB_PAGE_TITLE,
  HUB_PAGE_URL,
  RSV_PAGE_TITLE,
  RSV_PAGE_URL,
  RSV_PREGNANCY_PAGE_TITLE,
  RSV_PREGNANCY_PAGE_URL
} from "./constants";
import { accessibilityCheck, benchmark, clickLinkAndExpectPageTitle } from "./e2e-helpers";
import { login } from "./User";

test.describe.configure({ mode: 'serial' });

test.describe("E2E", () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await login(browser);
  });

  test.afterEach("Accessibility check", async () => {
    if (test.info().status === test.info().expectedStatus) {
      await accessibilityCheck(page);
    }
  });

  test("VitA landing page", async () => {
    await page.goto(HUB_PAGE_URL);
    await expect(page).toHaveTitle(HUB_PAGE_TITLE);
  })

  test("RSV landing page", async () => {
    await page.goto(RSV_PAGE_URL);
    await expect(page).toHaveTitle(RSV_PAGE_TITLE);
  });

  // TODO: Dynamically test eligibility content based on User and scenario
  test("Vaccine Eligibility data on RSV for older adults page", async () => {
    await page.goto("/vaccines/rsv");

    const eligibilitySection = page.getByTestId("non-urgent-care-card");
    await expect(eligibilitySection).toBeVisible();
  });

  test("RSV in pregnancy landing page", async () => {
    await page.goto(RSV_PREGNANCY_PAGE_URL);
    await expect(page).toHaveTitle(RSV_PREGNANCY_PAGE_TITLE);
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

  test("Page Load Benchmark", async () => {
    expect(await benchmark(page, RSV_PAGE_URL)).toBeLessThanOrEqual(2500);
  });
});
