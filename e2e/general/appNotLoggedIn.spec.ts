import { getEnv } from "@project/e2e/helpers";
import { expect, test } from "@playwright/test";
import { HUB_PAGE_URL } from "@project/e2e/constants";

test.describe.configure({ mode: "serial" });

test.describe("E2E", () => {

  test.beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(60_000);
  });

  test("Not logged in user is directed", async ({page}) => {
    const expectedUrl = getEnv("NHS_APP_REDIRECT_LOGIN_URL")

    await page.goto(HUB_PAGE_URL)

    await expect(page.url()).toBe(expectedUrl)
  });
});
