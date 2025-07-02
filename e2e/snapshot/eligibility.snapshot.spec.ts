import { expect, Locator, Page, test } from "@playwright/test";
import { RSV_PAGE_URL } from "@project/e2e/constants";
import { login } from "@project/e2e/auth";
import users from "@test-data/test-users.json" assert { type: "json" };

test.describe.configure({ mode: "serial" });

test.describe("E2E", () => {
  let page: Page;

  test.describe("Not Eligible", () => {
    test.beforeAll(async ({ browser }) => {
      page = await login(browser, users.NotEligible.email);
    });

    test("Not eligible - age and catchup bullet points", async () => {
      await page.goto(RSV_PAGE_URL);
      const eligibility: Locator = page.getByTestId("Eligibility");
      const heading: Locator = eligibility.getByRole("heading", {
        level: 3,
        name: "We do not believe you can have it",
      });

      await expect(heading).toBeVisible();
      await expect(eligibility).toHaveScreenshot("eligibility-not-eligible.png");
    });
  });

  test.describe("Actionable", () => {
    test.beforeAll(async ({ browser }) => {
      page = await login(browser, users.Actionable.email);
    });

    test("Actionable - catchup bullet points", async () => {
      await page.goto(RSV_PAGE_URL);
      const eligibility: Locator = page.getByTestId("Eligibility");
      const heading: Locator = eligibility.getByRole("heading", { level: 3, name: "You should have the RSV vaccine" });

      await expect(heading).toBeVisible();
      await expect(eligibility).toHaveScreenshot("eligibility-actionable.png");
    });
  });
});
