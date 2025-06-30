import { expect, Locator, Page, test } from "@playwright/test";
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

  test.describe("Not Eligible", () => {
    test.beforeAll(async ({ browser }) => {
      page = await login(browser, users.NotEligible.email);
    });

    test("Not eligible - age and catchup bullet points", async () => {
      await page.goto(RSV_PAGE_URL);
      const eligibility: Locator = page.getByTestId("Eligibility");
      const heading: Locator = eligibility.getByRole("heading", { level: 3, name: "We do not believe you should have this vaccine" });
      const bulletPoint1: Locator = eligibility.getByText("You are not aged 75 to 79 years old.");
      const bulletPoint2: Locator = eligibility.getByText("You did not turn 80 between 2nd September 2024 and 31st August 2025");
      await expect(heading).toBeVisible();
      await expect(bulletPoint1).toBeVisible();
      await expect(bulletPoint2).toBeVisible();
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
      const bulletPoint: Locator = eligibility.getByText("You are aged 75 to 79 years old.");
      await expect(heading).toBeVisible();
      await expect(bulletPoint).toBeVisible();
    });

    // TODO: VIA-325 26/06/25 - Check for h2 and paragraph after getting valid markdown from Eligibility API
    test("Actionable - InfoText action content", async () => {
      await page.goto(RSV_PAGE_URL);
      const infoText = page.getByText("##Getting the vaccine You can get an RSV vaccination at your GP surgery.");
      await expect(infoText).toBeVisible();
    });
  });

  test.describe("Actionable - No InfoText action content ", async () => {
    test.beforeAll(async ({ browser }) => {
      page = await login(browser, users.Actionable_No_InfoText_Action.email);
    });

    test("Actionable - No InfoText action content", async () => {
      await page.goto(RSV_PAGE_URL);
      const infoText = page.getByTestId("action-paragraph");
      await expect(infoText).toHaveCount(0);
    })
  })
});
