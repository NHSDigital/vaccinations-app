import { Locator, TestInfo, expect, test } from "@playwright/test";
import { AppPageDetails, MAX_AVG_LCP_DURATION_MS } from "@project/e2e/constants";
import { UserCopy, elidCopyThatDiffersByEnvironment } from "@project/e2e/elid-copy-helper";
import { accessibilityCheck, benchmarkIfChromium, getEnv } from "@project/e2e/helpers";

const environment = getEnv("DEPLOY_ENVIRONMENT");
const elidCopyForEnvironment: UserCopy =
  environment === "preprod"
    ? elidCopyThatDiffersByEnvironment["integration"]
    : elidCopyThatDiffersByEnvironment["sandpit"];
const RSV_PAGE_URL = AppPageDetails["rsv-older-adults"].url;

test.describe.configure({ mode: "parallel", retries: 1 });

test.describe("Eligibility", () => {
  test.afterEach(async ({ page }, testInfo: TestInfo) => {
    await accessibilityCheck(page);
    await benchmarkIfChromium(page, RSV_PAGE_URL, MAX_AVG_LCP_DURATION_MS, testInfo);
  });

  test.describe("Not Eligible", () => {
    test.use({ storageState: `./e2e/.auth/not-eligible-with-infotext-action.json` });

    test("Not eligible - age and catchup bullet points", async ({ page }) => {
      await page.goto(RSV_PAGE_URL);

      const eligibility: Locator = page.getByTestId("Eligibility");
      const heading: Locator = eligibility.getByRole("heading", {
        level: 2,
        name: "We do not believe you can have it",
      });

      const bulletPoint1RegEx = new RegExp(`(are not aged 75 to 79|are not aged 75 or over)`);
      const bulletPoint2RegEx = new RegExp(
        `(${elidCopyForEnvironment.user15.bulletPoint2v1}|${elidCopyForEnvironment.user15.bulletPoint2v2})`,
      );
      const bulletPoint1: Locator = eligibility.getByText(bulletPoint1RegEx, { exact: true }).first();
      const bulletPoint2: Locator = eligibility.getByText(bulletPoint2RegEx, { exact: true }).first();

      await expect(heading).toBeVisible();
      await expect(bulletPoint1).toBeVisible();
      await expect(bulletPoint2).toBeVisible();
    });

    test("Not Eligible - InfoText action content", async ({ page }) => {
      await page.goto(RSV_PAGE_URL);

      let infoTextHeading, infoTextParagraph;

      if (environment === "preprod") {
        infoTextHeading = page.getByRole("heading", {
          level: 3,
          name: elidCopyForEnvironment.user15.infoTextHeading,
        });
        infoTextParagraph = page.locator(`h3:has-text("${elidCopyForEnvironment.user15.infoTextHeading}") + p`).first();
      } else {
        infoTextHeading = page.getByRole("heading", {
          level: 2,
          name: elidCopyForEnvironment.user15.infoTextHeading,
        });
        infoTextParagraph = page.locator(`h2:has-text("${elidCopyForEnvironment.user15.infoTextHeading}") + p`).first();
      }
      const tagName = await infoTextParagraph.evaluate((element) => element.tagName);

      await expect(infoTextHeading).toBeVisible();
      await expect(infoTextParagraph).toBeVisible();
      await expect(infoTextParagraph).toHaveText(elidCopyForEnvironment.user15.infoTextParagraph);
      expect(tagName).toBe("P");
    });
  });

  test.describe("Actionable", () => {
    test.use({ storageState: `./e2e/.auth/actionable-with-infotext-action.json` });

    test("Actionable - catchup bullet points", async ({ page }) => {
      await page.goto(RSV_PAGE_URL);

      const eligibility: Locator = page.getByTestId("Eligibility");
      const heading: Locator = eligibility.getByRole("heading", { level: 2, name: "You should have the RSV vaccine" });

      const bulletPoint1RegEx = new RegExp(
        `(${elidCopyForEnvironment.user01.bulletPoint1v1}|${elidCopyForEnvironment.user01.bulletPoint1v2})`,
      );
      const bulletPoint: Locator = eligibility.getByText(bulletPoint1RegEx, { exact: true }).first();

      await expect(heading).toBeVisible();
      await expect(bulletPoint).toBeVisible();
    });

    test("Actionable - InfoText action content", async ({ page }) => {
      await page.goto(RSV_PAGE_URL);

      let infoTextHeading, infoTextParagraph;
      if (environment === "preprod") {
        infoTextHeading = page.getByRole("heading", { level: 3, name: "Getting the vaccine" });
        infoTextParagraph = page.locator('h3:has-text("Getting the vaccine") + p').first();
      } else {
        infoTextHeading = page.getByRole("heading", { level: 2, name: "Getting the vaccine" });
        infoTextParagraph = page.locator('h2:has-text("Getting the vaccine") + p').first();
      }
      const tagName = await infoTextParagraph.evaluate((element) => element.tagName);

      await expect(infoTextHeading).toBeVisible();
      await expect(infoTextParagraph).toBeVisible();
      await expect(infoTextParagraph).toHaveText("You can get an RSV vaccination at your GP surgery.");
      expect(tagName).toBe("P");
    });
  });

  test.describe("Actionable - No InfoText action content ", async () => {
    test.use({ storageState: `./e2e/.auth/actionable-with-buttonwithauthlink-action.json` });

    test("Actionable - No InfoText action content", async ({ page }) => {
      await page.goto(RSV_PAGE_URL);

      const infoText = page.getByTestId("action-paragraph");

      await expect(infoText).toHaveCount(0);
    });
  });

  test.describe("Actionable with CardWithText", () => {
    test.use({ storageState: `./e2e/.auth/actionable-with-cardwithtext-action.json` });

    test("Actionable - CardWithText action content", async ({ page }) => {
      await page.goto(RSV_PAGE_URL);

      const cardHeading = page.getByRole("heading", {
        level: 2,
        name: "You have an RSV vaccination appointment booked",
      });
      const cardParagraph = page.locator('h2:has-text("You have an RSV vaccination appointment booked") + p').first();

      await expect(cardHeading).toBeVisible();
      await expect(cardHeading).toHaveClass("nhsuk-heading-m nhsuk-card__heading");
      await expect(cardParagraph).toBeVisible();
      await expect(cardParagraph).toHaveText(
        "To change or cancel your appointment, contact the provider you booked with.",
      );
      await expect(cardParagraph).toHaveClass("nhsuk-card__description");
    });
  });

  test.describe("Actionable - No CardWithText action content ", async () => {
    test.use({ storageState: `./e2e/.auth/actionable-with-infotext-action.json` });

    test("Actionable - No InfoText action content", async ({ page }) => {
      await page.goto(RSV_PAGE_URL);

      const card = page.getByTestId("action-card");

      await expect(card).toHaveCount(0);
    });
  });

  test.describe("Actionable with AlreadyVaccinated content", () => {
    test.use({ storageState: `./e2e/.auth/actionable-with-already-vaccinated-suitability-rule.json` });

    test("Actionable with AlreadyVaccinated content", async ({ page }) => {
      await page.goto(RSV_PAGE_URL);

      const cardHeading = page.getByRole("heading", { level: 2, name: "You've had your RSV vaccination" });
      const cardParagraph = page.locator('h2:has-text("You\'ve had your RSV vaccination") + p').first();

      await expect(cardHeading).toBeVisible();
      await expect(cardHeading).toHaveClass("nhsuk-heading-m nhsuk-card__heading");
      await expect(cardParagraph).toBeVisible();
      await expect(cardParagraph).toHaveText(elidCopyForEnvironment.user13.cardParagraphText);
      await expect(cardParagraph).toHaveClass("nhsuk-card__description");
    });
  });
});
