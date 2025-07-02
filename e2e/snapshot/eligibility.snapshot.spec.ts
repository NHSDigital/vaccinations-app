import { expect, Page, test } from "@playwright/test";
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

      await expect(page).toHaveScreenshot("eligibility-not-eligible.png", {
        fullPage: true,
      });
    });
  });

  test.describe("Actionable", () => {
    test.beforeAll(async ({ browser }) => {
      page = await login(browser, users.Actionable.email);
    });

    test("Actionable - catchup bullet points", async () => {
      await page.goto(RSV_PAGE_URL);

      await expect(page).toHaveScreenshot("eligibility-actionable.png", {
        fullPage: true,
      });
    });
  });
});
