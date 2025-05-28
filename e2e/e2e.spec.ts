import { expect, Page, test } from "@playwright/test";
import pa11y from "pa11y";
import {
  COVID_PAGE_TITLE, FLU_PAGE_TITLE, HUB_PAGE_TITLE, MENACWY_PAGE_TITLE, PNEUMO_PAGE_TITLE, RSV_PAGE_TITLE,
  SCHEDULE_PAGE_TITLE, SHINGLES_PAGE_TITLE, SIX_IN_ONE_PAGE_TITLE
} from "./constants";
import { clickLinkAndExpectPageTitle } from "./e2e-helpers";
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

  test("Back link navigation", async () => {
    await page.goto("/");

    await clickLinkAndExpectPageTitle(page, "View All Vaccinations", SCHEDULE_PAGE_TITLE);
    await clickLinkAndExpectPageTitle(page, "RSV", RSV_PAGE_TITLE);
    await clickLinkAndExpectPageTitle(page, "Back", SCHEDULE_PAGE_TITLE);
    await clickLinkAndExpectPageTitle(page, "COVID-19", COVID_PAGE_TITLE);
    await clickLinkAndExpectPageTitle(page, "Back", SCHEDULE_PAGE_TITLE);
    await clickLinkAndExpectPageTitle(page, "Back", HUB_PAGE_TITLE);
  });

  test("Skip link navigation", async () => {
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

  test("Schedule page", async () => {
    await page.goto("/");

    await clickLinkAndExpectPageTitle(page, "View All Vaccinations", SCHEDULE_PAGE_TITLE);
  });

  test("RSV page", async () => {
    await page.goto("/vaccines/rsv");

    await expect(page).toHaveTitle(RSV_PAGE_TITLE);
  });

  test("Flu page", async () => {
    await page.goto("/vaccines/flu");

    await expect(page).toHaveTitle(FLU_PAGE_TITLE);
  });

  test("Pneumococcal page", async () => {
    await page.goto("/vaccines/pneumococcal");

    await expect(page).toHaveTitle(PNEUMO_PAGE_TITLE);
  });

  test("Shingles page", async () => {
    await page.goto("/vaccines/shingles");

    await expect(page).toHaveTitle(SHINGLES_PAGE_TITLE);
  });

  test("6-in-1 page", async () => {
    await page.goto("/vaccines/6-in-1");

    await expect(page).toHaveTitle(SIX_IN_ONE_PAGE_TITLE);
  });

  test("COVID-19 page", async () => {
    await page.goto("/vaccines/covid-19");

    await expect(page).toHaveTitle(COVID_PAGE_TITLE);
  });

  test("MenACWY page", async () => {
    await page.goto("/vaccines/menacwy");

    await expect(page).toHaveTitle(MENACWY_PAGE_TITLE);
  });
});

