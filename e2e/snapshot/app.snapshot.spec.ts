import { expect, Page, test } from "@playwright/test";
import { HUB_PAGE_URL, RSV_PAGE_URL, RSV_PREGNANCY_PAGE_URL } from "../constants";
import { login } from "@project/e2e/auth";
import users from "@test-data/test-users.json" assert { type: "json" };

test.describe.configure({ mode: "serial" });

test.describe("E2E", () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await login(browser, users.Default.email);
  });

  test("Hub page", async () => {
    await page.goto(HUB_PAGE_URL);
    await expect(page).toHaveScreenshot("default-hub.png", {
      fullPage: true,
    });
  });

  test("RSV page", async () => {
    await page.goto(RSV_PAGE_URL);
    await expect(page).toHaveScreenshot("default-rsv.png", {
      fullPage: true,
    });
  });

  test("RSV in pregnancy page", async () => {
    await page.goto(RSV_PREGNANCY_PAGE_URL);
    await expect(page).toHaveScreenshot("default-rsv-pregnancy.png", {
      fullPage: true,
    });
  });
});
