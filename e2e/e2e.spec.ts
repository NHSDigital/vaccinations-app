import { expect, test } from "@playwright/test";
import pa11y from "pa11y";
import { HUB_PAGE_TITLE, SCHEDULE_PAGE_TITLE } from "@project/e2e/constants";
import { clickLinkAndExpectPageTitle } from "@project/e2e/e2e-helpers";

test.afterEach('Accessibility check', async ({ page }) => {
  if (test.info().status === test.info().expectedStatus) {
    const results = await pa11y(page.url(), { standard: "WCAG2AA" });
    expect(results.issues).toHaveLength(0);
  }
});

test.describe("E2E", () => {
  test('go to Vaccination Hub', async ({ page }) => {
    await page.goto('http://localhost:4000/auth/login');

    //TODO: Store creds somewhere, don't push to remote
    await page.getByLabel("Email address").fill("<user email>");
    await page.getByRole('button', { name: "Continue" }).click();

    await page.getByRole('textbox', { name: "Password" }).fill("<user password>");
    await page.getByRole('button', { name: "Continue" }).click();

    await page.getByRole('textbox', { name: 'Security code' }).fill("<OTP>");
    await page.getByRole('button', { name: "Continue" }).click();

    await expect(page).toHaveTitle(HUB_PAGE_TITLE, { timeout: 60000 });
  });

  test('go to Vaccinations Schedule page', async ({ page }) => {
    await page.goto('/');

    await clickLinkAndExpectPageTitle(page, "View All Vaccinations", SCHEDULE_PAGE_TITLE);
  });

  test('Back link navigation', async ({ page }) => {
    await page.goto('/');

    await clickLinkAndExpectPageTitle(page, "View All Vaccinations", SCHEDULE_PAGE_TITLE);
    await clickLinkAndExpectPageTitle(page, "RSV", "RSV Vaccine - NHS App");
    await clickLinkAndExpectPageTitle(page,"Back", SCHEDULE_PAGE_TITLE);
    await clickLinkAndExpectPageTitle(page, "COVID-19", "COVID-19 Vaccine - NHS App");
    await clickLinkAndExpectPageTitle(page,"Back", SCHEDULE_PAGE_TITLE);
    await clickLinkAndExpectPageTitle(page,"Back", HUB_PAGE_TITLE);
  });

  test('Skip link', async ({ page }) => {
    await page.goto('/');

    // test skip link works
    await page.getByRole("link", { name: "Skip to main content" }).click();
    const isFocusedHubPage = await page.evaluate(() => {
      return document.activeElement === document.getElementsByTagName("h1").item(0);
    });
    expect(isFocusedHubPage).toBe(true);

    // test skip link still works after navigation
    await clickLinkAndExpectPageTitle(page, "View All Vaccinations", SCHEDULE_PAGE_TITLE);
    await page.getByRole("link", { name: "Skip to main content" }).click();
    const isFocusedSchedulePage = await page.evaluate(() => {
      return document.activeElement === document.getElementsByTagName("h1").item(0);
    });
    expect(isFocusedSchedulePage).toBe(true);
  });

  test('RSV page', async ({ page }) => {
    await page.goto('/vaccines/rsv');

    await expect(page).toHaveTitle("RSV Vaccine - NHS App");
  });

  test('Flu page', async ({ page }) => {
    await page.goto('/vaccines/flu');

    await expect(page).toHaveTitle("Flu Vaccine - NHS App");
  });

  test('go to Pneumococcal page', async ({ page }) => {
    await page.goto('/vaccines/pneumococcal');

    await expect(page).toHaveTitle("Pneumococcal Vaccine - NHS App");
  });

  test('go to Shingles page', async ({ page }) => {
    await page.goto('/vaccines/shingles');

    await expect(page).toHaveTitle("Shingles Vaccine - NHS App");
  });

  test('6-in-1 page', async ({ page }) => {
    await page.goto('/vaccines/6-in-1');

    await expect(page).toHaveTitle("6-in-1 Vaccine - NHS App");
  });

  test('COVID-19 page', async ({ page }) => {
    await page.goto('/vaccines/covid-19');

    await expect(page).toHaveTitle("COVID-19 Vaccine - NHS App");
  });

  test('MenACWY page', async ({ page }) => {
    await page.goto('/vaccines/menacwy');

    await expect(page).toHaveTitle("MenACWY Vaccine - NHS App");
  });
});

