import { expect, test } from "@playwright/test";
import pa11y from "pa11y";
import { HUB_PAGE_TITLE, SCHEDULE_PAGE_TITLE } from "@project/e2e/constants";
import { clickLinkAndExpectPageTitle } from "@project/e2e/e2e-helpers";

test.afterEach("Accessibility check", async ({ page }) => {
  if (test.info().status === test.info().expectedStatus) {
    const results = await pa11y(page.url(), { standard: "WCAG2AA" });
    expect(results.issues).toHaveLength(0);
  }
});

test.describe("E2E", () => {

  test("go to Vaccinations Schedule page", async ({ page }) => {
    await page.goto("/");

    await clickLinkAndExpectPageTitle(page, "View All Vaccinations", SCHEDULE_PAGE_TITLE);
  });

  test("Back link navigation", async ({ page }) => {
    await page.goto("/");

    await clickLinkAndExpectPageTitle(page, "View All Vaccinations", SCHEDULE_PAGE_TITLE);
    await clickLinkAndExpectPageTitle(page, "RSV", "RSV Vaccine - NHS App");
    await clickLinkAndExpectPageTitle(page, "Back", SCHEDULE_PAGE_TITLE);
    await clickLinkAndExpectPageTitle(page, "COVID-19", "COVID-19 Vaccine - NHS App");
    await clickLinkAndExpectPageTitle(page, "Back", SCHEDULE_PAGE_TITLE);
    await clickLinkAndExpectPageTitle(page, "Back", HUB_PAGE_TITLE);
  });

  test("Skip link", async ({ page }) => {
    await page.goto("/");

    await page.getByTestId("skip-link").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { level: 1 })).toBeFocused();

    // Test skip link still works after navigation
    await clickLinkAndExpectPageTitle(page, "View All Vaccinations", SCHEDULE_PAGE_TITLE);
    await page.getByTestId("skip-link").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  });

  test("RSV page", async ({ page }) => {
    await page.goto("/vaccines/rsv");

    await expect(page).toHaveTitle("RSV Vaccine - NHS App");
  });

  test("Flu page", async ({ page }) => {
    await page.goto("/vaccines/flu");

    await expect(page).toHaveTitle("Flu Vaccine - NHS App");
  });

  test("Pneumococcal page", async ({ page }) => {
    await page.goto("/vaccines/pneumococcal");

    await expect(page).toHaveTitle("Pneumococcal Vaccine - NHS App");
  });

  test("Shingles page", async ({ page }) => {
    await page.goto("/vaccines/shingles");

    await expect(page).toHaveTitle("Shingles Vaccine - NHS App");
  });

  test("6-in-1 page", async ({ page }) => {
    await page.goto("/vaccines/6-in-1");

    await expect(page).toHaveTitle("6-in-1 Vaccine - NHS App");
  });

  test("COVID-19 page", async ({ page }) => {
    await page.goto("/vaccines/covid-19");

    await expect(page).toHaveTitle("COVID-19 Vaccine - NHS App");
  });

  test("MenACWY page", async ({ page }) => {
    await page.goto("/vaccines/menacwy");

    await expect(page).toHaveTitle("MenACWY Vaccine - NHS App");
  });
});

