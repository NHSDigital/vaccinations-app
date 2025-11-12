import { expect, test } from "@playwright/test";
import { AppPageDetails } from "@project/e2e/constants";
import { getEnv } from "@project/e2e/helpers";

test.describe.configure({ mode: "parallel", retries: 3 });

test.describe("Application - User Not Logged In", () => {
  test.beforeAll(async ({}, testInfo) => {
    testInfo.setTimeout(60_000);
  });

  test("Not logged in user is directed", async ({ page }) => {
    const expectedUrl = getEnv("NHS_APP_REDIRECT_LOGIN_URL");

    await page.goto(AppPageDetails["vaccine-hub"].url);

    expect(page.url()).toBe(expectedUrl);
  });
});
