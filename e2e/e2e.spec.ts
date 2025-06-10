import { expect, Page, test } from "@playwright/test";
import pa11y from "pa11y";
import { HUB_PAGE_TITLE, RSV_PAGE_TITLE, RSV_PREGNANCY_PAGE_TITLE } from "./constants";
import { benchmark, clickLinkAndExpectPageTitle } from "./e2e-helpers";
import { login } from "./User";

test.describe.configure({ mode: 'serial' });

test.describe("E2E", () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await login(browser);
  });

  test.afterEach("Accessibility check", async () => {
    if (test.info().status === test.info().expectedStatus) {
      const results = await pa11y(page.url(), { standard: "WCAG2AA" });
      expect(results.issues).toHaveLength(0);
    }
  });

  test("RSV for older adults page", async () => {
    await page.goto("/vaccines/rsv");

    await expect(page).toHaveTitle(RSV_PAGE_TITLE);
  });

  test("RSV in pregnancy page", async () => {
    await page.goto("/vaccines/rsv-pregnancy");

    await expect(page).toHaveTitle(RSV_PREGNANCY_PAGE_TITLE);
  });

  test("Back link navigation", async () => {
    await page.goto("/");

    await clickLinkAndExpectPageTitle(page, "RSV for older adults", RSV_PAGE_TITLE);
    await clickLinkAndExpectPageTitle(page, "Back", HUB_PAGE_TITLE);
  });

  test("Skip link navigation", async () => {
    await page.goto("/");

    await page.getByTestId("skip-link").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { level: 1 })).toBeFocused();

    // Test skip link still works after navigation
    await clickLinkAndExpectPageTitle(page, "RSV for older adults", RSV_PAGE_TITLE);
    await page.getByTestId("skip-link").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  });

  test("Page Load Benchmark", async () => {
    const bm = await(benchmark(page, "/vaccines/rsv"))
    expect(bm).toBeLessThanOrEqual(2500);
  });
});
