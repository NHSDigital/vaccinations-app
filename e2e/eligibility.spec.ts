import { expect, Page, test } from "@playwright/test";
import { MAX_AVG_LCP_DURATION_MS, RSV_PAGE_URL } from "@project/e2e/constants";
import { login } from "@project/e2e/auth";
import { accessibilityCheck, benchmark } from "@project/e2e/helpers";
import users from "@project/test-data/test-users.json" assert { type: "json" };

test.describe.configure({ mode: "serial" });

test.describe("E2E", () => {
  let page: Page;

  test.afterEach(async () => {
    await accessibilityCheck(page);
    expect(await benchmark(page, RSV_PAGE_URL)).toBeLessThanOrEqual(MAX_AVG_LCP_DURATION_MS);
  });

  test("Not eligible - age and catchup cohorts", async ({ browser }) => {
    page = await login(browser, users.NotEligible.email);
    await page.goto(RSV_PAGE_URL);
    const eligibility = page.getByTestId("Eligibility");
    const heading = eligibility.getByRole("heading", { level: 3, name: "We do not believe you should have this vaccine" });
    const cohort1 = eligibility.getByText("You are not aged 75 to 79 years old.");
    const cohort2 = eligibility.getByText("You did not turn 80 between 2nd September 2024 and 31st August 2025");
    await expect(heading).toBeVisible();
    await expect(cohort1).toBeVisible();
    await expect(cohort2).toBeVisible();
  });

  test("Actionable - catchup cohort", async ({ browser }) => {
    page = await login(browser, users.Actionable.email);
    await page.goto(RSV_PAGE_URL);
    const eligibility = page.getByTestId("Eligibility");
    const heading = eligibility.getByRole("heading", { level: 3, name: "You should have the RSV vaccine" });
    const cohort1 = eligibility.getByText("You turned 80 between 2nd September 2024 and 31st August 2025");
    await expect(heading).toBeVisible();
    await expect(cohort1).toBeVisible();
  });
});
