import { expect, test } from "@playwright/test";
import pa11y from "pa11y";

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

    await expect(page).toHaveTitle("Vaccinations - NHS App", { timeout: 60000 });
  });

  test('go to Vaccinations Schedule page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'View all vaccinations' }).click();

    await expect(page).toHaveTitle("Vaccination schedule - NHS App");
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

