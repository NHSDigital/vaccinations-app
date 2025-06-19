import { expect, Page, test } from "@playwright/test";
import { login } from "@project/e2e/User";
import { accessibilityCheck } from "@project/e2e/e2e-helpers";
import users from "@project/test-data/test-users.json" assert { type: "json" };

test.describe.configure({ mode: 'serial' });


test.describe("E2E", () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await login(browser, users.Actionable.email);
  });

  test.afterEach("Accessibility check", async () => {
    if (test.info().status === test.info().expectedStatus) {
      await accessibilityCheck(page);
    }
  });

  test("Vaccine Eligibility data on RSV for older adults page", async () => {
    await page.goto("/vaccines/rsv");

    const eligibilitySection = page.getByTestId("non-urgent-care-card");
    await expect(eligibilitySection).toHaveCount(0);
  });
});
