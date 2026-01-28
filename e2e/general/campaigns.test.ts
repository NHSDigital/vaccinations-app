import { expect, test } from "@playwright/test";
import { AppPageDetails, PageName } from "@project/e2e/constants";

test.describe.configure({ mode: "parallel", retries: 1 });

test.describe("Vaccination campaigns", () => {
  test.describe("Pre-Open campaigns", () => {
    test.use({ storageState: `./e2e/.auth/default.json` });
    test("should render covid-19-vaccine page with pre-open campaign", async ({ page }) => {
      const pageDetails = AppPageDetails["covid-19-vaccine-pre-open-campaign"];

      if (pageDetails.datetimeOverride)
        await page.setExtraHTTPHeaders({ "x-e2e-datetime": pageDetails.datetimeOverride.toISOString() });

      await page.goto(pageDetails.url);

      await expect(page.getByText("You can book a COVID-19 vaccination appointment online now.")).toBeVisible();
      await expect(page.getByRole("heading", { name: "Get vaccinated at your GP surgery" })).not.toBeVisible();
    });
  });

  test.describe("Open campaigns", () => {
    test.use({ storageState: `./e2e/.auth/default.json` });
    const testDetails: Array<{ vaccineName: string; pageName: PageName }> = [
      { vaccineName: "covid-19-vaccine", pageName: "covid-19-vaccine-open-campaign" },
      { vaccineName: "flu-vaccine", pageName: "flu-vaccine-open-campaign" },
      { vaccineName: "flu-for-children-aged-2-to-3", pageName: "flu-for-children-aged-2-to-3-open-campaign" },
      { vaccineName: "flu-in-pregnancy", pageName: "flu-in-pregnancy-open-campaign" },
    ];

    testDetails.forEach(({ vaccineName, pageName }) => {
      test(`should render ${vaccineName} page with open campaign`, async ({ page }) => {
        const pageDetails = AppPageDetails[pageName];

        if (pageDetails.datetimeOverride)
          await page.setExtraHTTPHeaders({ "x-e2e-datetime": pageDetails.datetimeOverride.toISOString() });

        await page.goto(pageDetails.url);

        await expect(page.getByRole("heading", { name: "Important:   Booking service" })).not.toBeVisible();
        await expect(page.getByRole("heading", { name: "Book an appointment online" })).toBeVisible();
      });
    });
  });

  test.describe("Closed campaigns", () => {
    test.use({ storageState: `./e2e/.auth/default.json` });
    const testDetails: Array<{ vaccineName: string; pageName: PageName }> = [
      { vaccineName: "covid-19-vaccine", pageName: "covid-19-vaccine" },
      { vaccineName: "flu-vaccine", pageName: "flu-vaccine" },
      { vaccineName: "flu-for-children-aged-2-to-3", pageName: "flu-for-children-aged-2-to-3" },
      { vaccineName: "flu-in-pregnancy", pageName: "flu-in-pregnancy" },
    ];

    testDetails.forEach(({ vaccineName, pageName }) => {
      test(`should render ${vaccineName} page with closed campaign`, async ({ page }) => {
        const pageDetails = AppPageDetails[pageName];

        if (pageDetails.datetimeOverride)
          await page.setExtraHTTPHeaders({ "x-e2e-datetime": pageDetails.datetimeOverride.toISOString() });

        await page.goto(pageDetails.url);

        await expect(page.getByRole("heading", { name: "Important:   Service closed" })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Book an appointment online" })).not.toBeVisible();
      });
    });
  });
});
