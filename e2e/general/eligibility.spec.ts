import { Locator, expect, test } from "@playwright/test";
import { MAX_AVG_LCP_DURATION_MS, RSV_PAGE_URL } from "@project/e2e/constants";
import { accessibilityCheck, benchmark } from "@project/e2e/helpers";

test.describe.configure({ mode: "serial" });

test.describe("E2E", () => {
  test.afterEach(async ({ page }) => {
    await accessibilityCheck(page);
    expect.soft(await benchmark(page, RSV_PAGE_URL)).toBeLessThanOrEqual(MAX_AVG_LCP_DURATION_MS);
  });

  test.describe("Not Eligible", () => {
    test.use({ storageState: `./e2e/.auth/NotEligible_With_InfoText_Action.json` });

    test("Not eligible - age and catchup bullet points", async ({ page }) => {
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

    test("Not Eligible - InfoText action content", async ({ page }) => {
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
    test.use({ storageState: `./e2e/.auth/Actionable_With_InfoText_Action.json` });

    test("Actionable - catchup bullet points", async ({ page }) => {
      await page.goto(RSV_PAGE_URL);

      const eligibility: Locator = page.getByTestId("Eligibility");
      const heading: Locator = eligibility.getByRole("heading", { level: 3, name: "You should have the RSV vaccine" });
      const bulletPoint: Locator = eligibility.getByText("are aged 75 to 79");

      await expect(heading).toBeVisible();
      await expect(bulletPoint).toBeVisible();
    });

    test("Actionable - InfoText action content", async ({ page }) => {
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
    test.use({ storageState: `./e2e/.auth/Actionable_With_ButtonWithAuthLink_Action.json` });

    test("Actionable - No InfoText action content", async ({ page }) => {
      await page.goto(RSV_PAGE_URL);

      const infoText = page.getByTestId("action-paragraph");

      await expect(infoText).toHaveCount(0);
    });
  });

  test.describe("Actionable with CardWithText", () => {
    test.use({ storageState: `./e2e/.auth/Actionable_With_CardWithText_Action.json` });

    test("Actionable - CardWithText action content", async ({ page }) => {
      await page.goto(RSV_PAGE_URL);

      const cardHeading = page.getByRole("heading", {
        level: 2,
        name: "You have an RSV vaccination appointment booked",
      });
      const cardParagraph = page.getByText(
        "To change or cancel your appointment, contact the provider you booked with.",
      );

      await expect(cardHeading).toBeVisible();
      await expect(cardHeading).toHaveClass("nhsuk-heading-m nhsuk-card__heading");
      await expect(cardParagraph).toBeVisible();
      await expect(cardParagraph).toHaveClass("nhsuk-card__description");
    });
  });

  test.describe("Actionable - No CardWithText action content ", async () => {
    test.use({ storageState: `./e2e/.auth/Actionable_With_InfoText_Action.json` });

    test("Actionable - No InfoText action content", async ({ page }) => {
      await page.goto(RSV_PAGE_URL);

      const card = page.getByTestId("action-card");

      await expect(card).toHaveCount(0);
    });
  });
});
