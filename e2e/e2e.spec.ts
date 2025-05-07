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

  test('go to RSV page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'RSV vaccine' }).click();

    await expect(page).toHaveTitle("RSV Vaccine - NHS App");
  });
});

