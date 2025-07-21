import { Browser, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { getEnv } from "@project/e2e/helpers";
import users from "@test-data/test-users.json" with { type: "json" };

interface User {
  nhsAppLoginUrl: string;
  nhsLoginUsername: string;
  nhsLoginPassword: string;
  nhsLoginOTP: string;
  vaccinationsHubUrl: string;
}

const loadUserFromEnvironment = (_nhsLoginUsername: string): User => {
  return {
    nhsAppLoginUrl: getEnv("NHS_APP_REDIRECT_LOGIN_URL"),
    nhsLoginUsername: _nhsLoginUsername,
    nhsLoginPassword: getEnv("TEST_NHS_LOGIN_PASSWORD"),
    nhsLoginOTP: getEnv("TEST_NHS_LOGIN_OTP"),
    vaccinationsHubUrl: getEnv("TEST_APP_URL"),
  };
};

export const nhsAppLogin = async (browser: Browser, nhsLoginUser: string): Promise<Page> => {
  const user = loadUserFromEnvironment(nhsLoginUser);
  const page = await browser.newPage();

  await page.goto(user.nhsAppLoginUrl);
  await page.waitForURL("**/login?redirect_to=index", { timeout: 30000 });
  await page.getByRole("button", { name: "Continue" }).click();

  await page.waitForURL("**/enter-email", { timeout: 30000 });
  await page.getByLabel("Email address").fill(user.nhsLoginUsername);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.waitForURL("**/log-in-password", { timeout: 30000 });
  await page.getByRole("textbox", { name: "Password" }).fill(user.nhsLoginPassword);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.waitForURL(/\/(enter-mobile-code|choose-authentication-method)$/, { timeout: 30000 });
  if (new URL(page.url()).pathname === "/choose-authentication-method") {
    await page.getByLabel("Use my mobile phone to recieve a security code by text message").click();
    await page.getByRole("button", { name: "Continue" }).click();
  }

  await page.waitForURL("**/enter-mobile-code", { timeout: 30000 });
  await page.getByRole("textbox", { name: "Security code" }).fill(user.nhsLoginOTP);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.waitForURL("**/patient/", { timeout: 30000 });
  await page.getByRole("heading", { name: "Services" }).locator("..").getByRole("link", { name: "View all" }).click();
  await page.waitForURL("**/patient/services", { timeout: 30000 });

  const newTabPromise = page.context().waitForEvent("page");
  await page.getByRole("link", { name: "Check and book your RSV vaccination" }).click();
  const newTabPage = await newTabPromise;

  await newTabPage.waitForURL(user.vaccinationsHubUrl, { timeout: 60000, waitUntil: "domcontentloaded" });

  return newTabPage;
};

test.describe("NHS App Login", () => {
  const testUserPattern = process.env.VITA_TEST_USER_PATTERN;

  test("Login via NHS App", async ({ browser }, testInfo) => {
    testInfo.setTimeout(60000);

    const email = testUserPattern!.replace("{id}", users["not-eligible-with-infotext-action"].user_identifier);
    const page = await nhsAppLogin(browser, email);

    await expect(page).toHaveURL(getEnv("TEST_APP_URL"));
  });
});
