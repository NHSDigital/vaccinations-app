import { expect, test } from "@playwright/test";

test('go to Vaccination Hub', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await expect(page).toHaveTitle("Vaccinations - NHS App");
});

test('go to Vaccinations Schedule page', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByRole('link', { name: 'View all vaccinations' }).click();

  await expect(page).toHaveTitle("Vaccination schedule - NHS App");
});

test('go to RSV page', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByRole('link', { name: 'RSV vaccine' }).click();

  await expect(page).toHaveTitle("RSV Vaccine - NHS App");
});
