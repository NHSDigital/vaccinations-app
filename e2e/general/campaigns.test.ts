import { expect, test } from "@playwright/test";
import { AppPageDetails, PageName } from "@project/e2e/constants";

test.describe.configure({ mode: "parallel", retries: 1 });

test.describe("Vaccination campaigns", () => {
  test.describe("Active campaigns", () => {
    test.use({ storageState: `./e2e/.auth/default.json` });
    const testDetails: Array<{ vaccineName: string; pageName: PageName }> = [
      { vaccineName: "covid-19-vaccine", pageName: "covid-19-vaccine-active-campaign" },
      { vaccineName: "flu-vaccine", pageName: "flu-vaccine-active-campaign" },
      { vaccineName: "flu-for-children", pageName: "flu-for-children-active-campaign" },
      { vaccineName: "flu-in-pregnancy", pageName: "flu-in-pregnancy-active-campaign" },
    ];

    testDetails.forEach(({ vaccineName, pageName }) => {
      test(`should render ${vaccineName} page with active campaign`, async ({ page }) => {
        const pageDetails = AppPageDetails[pageName];

        if (pageDetails.datetimeOverride)
          await page.setExtraHTTPHeaders({ "x-e2e-datetime": pageDetails.datetimeOverride.toISOString() });

        await page.goto(pageDetails.url);

        await expect(page.getByRole("heading", { name: "Important:   Booking service" })).not.toBeVisible();
        await expect(page.getByRole("heading", { name: "Book an appointment online" })).toBeVisible();
      });
    });
  });

  test.describe("Inactive campaigns", () => {
    test.use({ storageState: `./e2e/.auth/default.json` });
    const testDetails: Array<{ vaccineName: string; pageName: PageName }> = [
      { vaccineName: "covid-19-vaccine", pageName: "covid-19-vaccine" },
      { vaccineName: "flu-vaccine", pageName: "flu-vaccine" },
      { vaccineName: "flu-for-children", pageName: "flu-for-children" },
      { vaccineName: "flu-in-pregnancy", pageName: "flu-in-pregnancy" },
    ];

    testDetails.forEach(({ vaccineName, pageName }) => {
      test(`should render ${vaccineName} page with inactive campaign`, async ({ page }) => {
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
