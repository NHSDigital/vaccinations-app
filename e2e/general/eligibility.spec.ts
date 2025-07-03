import { expect, Locator, Page, test } from "@playwright/test";
import { MAX_AVG_LCP_DURATION_MS, RSV_PAGE_URL } from "@project/e2e/constants";
import { login } from "@project/e2e/auth";
import { accessibilityCheck, benchmark } from "@project/e2e/helpers";
import users from "@test-data/test-users.json" assert { type: "json" };

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
      const heading: Locator = eligibility.getByRole("heading", {
        level: 3,
        name: "We do not believe you can have it",
      });
      const bulletPoint1: Locator = eligibility.getByText("are not aged 75 to 79");
      const bulletPoint2: Locator = eligibility.getByText(
        "did not turn 80 between 2nd September 2024 and 31st August 2025",
      );

      await expect(heading).toBeVisible();
      await expect(bulletPoint1).toBeVisible();
      await expect(bulletPoint2).toBeVisible();
    });

    test("Not Eligible - InfoText action content", async () => {
      await page.goto(RSV_PAGE_URL);

      const infoTextHeading = page.getByRole("heading", { level: 2, name: "If you think you need this vaccine" });
      const infoTextParagraph = page.getByText(
        "Speak to your healthcare professional if you think you should be offered this vaccination.",
      );
      const tagName = await infoTextParagraph.evaluate((element) => element.tagName);

      await expect(infoTextHeading).toBeVisible();
      await expect(infoTextParagraph).toBeVisible();
      expect(tagName).toBe("P");
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
      const bulletPoint: Locator = eligibility.getByText("are aged 75 to 79");

      await expect(heading).toBeVisible();
      await expect(bulletPoint).toBeVisible();
    });

    test("Actionable - InfoText action content", async () => {
      await page.goto(RSV_PAGE_URL);

      const infoTextHeading = page.getByRole("heading", { level: 2, name: "Getting the vaccine" });
      const infoTextParagraph = page.getByText("You can get an RSV vaccination at your GP surgery.");
      const tagName = await infoTextParagraph.evaluate((element) => element.tagName);

      await expect(infoTextHeading).toBeVisible();
      await expect(infoTextParagraph).toBeVisible();
      expect(tagName).toBe("P");
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
    });
  });
});
