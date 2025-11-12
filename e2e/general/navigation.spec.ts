import { expect, test } from "@playwright/test";
import { AppPageDetails } from "@project/e2e/constants";
import { clickLinkAndExpectPageTitle } from "@project/e2e/helpers";
import { SERVICE_HEADING } from "@src/app/constants";

test.describe.configure({ mode: "parallel", retries: 3 });

test.describe("Navigation", () => {
  test.use({ storageState: `./e2e/.auth/default.json` });

  test("Vaccines and back links from hub page", async ({ page }) => {
    await page.goto(AppPageDetails["vaccines-hub"].url);
    await clickLinkAndExpectPageTitle(page, "RSV vaccine for older adults", AppPageDetails["rsv-older-adults"].title);
    await clickLinkAndExpectPageTitle(page, "Back", AppPageDetails["vaccines-hub"].title);
    await clickLinkAndExpectPageTitle(page, "RSV vaccine in pregnancy", AppPageDetails["rsv-pregnancy"].title);
    await clickLinkAndExpectPageTitle(page, "Back", AppPageDetails["vaccines-hub"].title);
  });

  test("Vaccines and back links from multi vaccine hub page", async ({ page }) => {
    await page.goto(AppPageDetails["multi-vaccines-hub"].url);
    await clickLinkAndExpectPageTitle(
      page,
      "View vaccines for all ages",
      AppPageDetails["vaccines-for-all-ages"].title,
    );
    await clickLinkAndExpectPageTitle(page, "Back", AppPageDetails["multi-vaccines-hub"].title);
  });

  test("Vaccines and back links from vaccines-for-all-ages page", async ({ page }) => {
    await page.goto(AppPageDetails["vaccines-for-all-ages"].url);
    await clickLinkAndExpectPageTitle(page, "RSV", AppPageDetails["rsv-older-adults"].title);
    await clickLinkAndExpectPageTitle(page, "Back", AppPageDetails["vaccines-for-all-ages"].title);
    await clickLinkAndExpectPageTitle(page, "RSV in pregnancy", AppPageDetails["rsv-pregnancy"].title);
    await clickLinkAndExpectPageTitle(page, "Back", AppPageDetails["vaccines-for-all-ages"].title);
    await clickLinkAndExpectPageTitle(page, "Td/IPV (3-in-1 teenage booster)", AppPageDetails["td-ipv"].title);
    await clickLinkAndExpectPageTitle(page, "Back", AppPageDetails["vaccines-for-all-ages"].title);
    await clickLinkAndExpectPageTitle(page, "6-in-1", AppPageDetails["6-in-1"].title);
    await clickLinkAndExpectPageTitle(page, "Back", AppPageDetails["vaccines-for-all-ages"].title);
  });

  test("Skip link navigation", async ({ page }) => {
    await page.goto(AppPageDetails["vaccines-hub"].url);
    await page.getByTestId("skip-link").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { level: 1 })).toBeFocused();

    // Test skip link still works after navigation
    await clickLinkAndExpectPageTitle(page, "RSV vaccine for older adults", AppPageDetails["vaccines-hub"].title);
    await page.getByTestId("skip-link").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  });

  test("Service header link click navigates to hub page", async ({ page }) => {
    await page.goto(AppPageDetails["rsv-older-adults"].url);
    await page.getByRole("link", { name: "Log out" }).waitFor();

    await clickLinkAndExpectPageTitle(page, `NHS ${SERVICE_HEADING} homepage`, AppPageDetails["vaccines-hub"].title);
  });

  test("Footer links navigate to footer pages", async ({ page }) => {
    await page.goto(AppPageDetails["vaccines-hub"].url);
    await clickLinkAndExpectPageTitle(page, "Cookies", AppPageDetails["cookies-policy"].title);
    await clickLinkAndExpectPageTitle(page, "Accessibility statement", AppPageDetails["accessibility-statement"].title);
  });

  test("Log out link click navigates to session logout page", async ({ page }) => {
    await page.goto(AppPageDetails["vaccines-hub"].url);
    await expect(page).toHaveTitle(AppPageDetails["vaccines-hub"].title);
    await clickLinkAndExpectPageTitle(page, "Log out", AppPageDetails["session-logout"].title);
  });
});
