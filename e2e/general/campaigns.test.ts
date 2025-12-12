import { expect, test } from "@playwright/test";
import { AppPageDetails } from "@project/e2e/constants";

test.describe.configure({ mode: "parallel", retries: 1 });

test.describe("Vaccination campaigns", () => {
  test.use({ storageState: `./e2e/.auth/default.json` });

  test.describe("COVID-19", () => {
    test("while campaign active", async ({ page }) => {
      const pageDetails = AppPageDetails["covid-19-vaccine-active-campaign"];

      if (pageDetails.datetimeOverride)
        await page.setExtraHTTPHeaders({ "x-e2e-datetime": pageDetails.datetimeOverride.toISOString() });

      await page.goto(pageDetails.url);

      await expect(page.getByText("Booking service closed")).not.toBeVisible();
      await expect(page.getByText("Book an appointment online at a pharmacy")).toBeVisible();
    });

    test("while campaign inactive", async ({ page }) => {
      const pageDetails = AppPageDetails["covid-19-vaccine"];

      if (pageDetails.datetimeOverride)
        await page.setExtraHTTPHeaders({ "x-e2e-datetime": pageDetails.datetimeOverride.toISOString() });

      await page.goto(pageDetails.url);

      await expect(page.getByText("Booking service closed")).toBeVisible();
      await expect(page.getByText("Book an appointment online at a pharmacy")).not.toBeVisible();
    });
  });
});
