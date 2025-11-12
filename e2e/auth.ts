import { Browser, Page } from "@playwright/test";
import { getEnv } from "@project/e2e/helpers";

interface User {
  nhsAppLoginUrl: string;
  nhsLoginUsername: string;
  nhsLoginPassword: string;
  nhsLoginOTP: string;
  vaccinationsHubUrl: string;
}

const loadFakeAuthEnvironmentVariables = () => {
  return {
    fakeAppUsername: getEnv("TEST_NHS_APP_USERNAME"),
    fakeAppPassword: getEnv("TEST_NHS_APP_PASSWORD"),
    fakeAppLoginUrl: getEnv("TEST_NHS_APP_URL"),
  };
};

const loadUserFromEnvironment = (_nhsLoginUsername: string): User => {
  return {
    nhsAppLoginUrl: getEnv("TEST_NHS_APP_URL"),
    nhsLoginUsername: _nhsLoginUsername,
    nhsLoginPassword: getEnv("TEST_NHS_LOGIN_PASSWORD"),
    nhsLoginOTP: getEnv("TEST_NHS_LOGIN_OTP"),
    vaccinationsHubUrl: getEnv("TEST_APP_URL"),
  };
};

export const login = async (browser: Browser, nhsLoginUsername: string): Promise<Page> => {
  const user = loadUserFromEnvironment(nhsLoginUsername);
  let page;

  const useFakeAuth = user.nhsAppLoginUrl.endsWith("localhost:3000");
  if (useFakeAuth) {
    const fakeAuthConfig = loadFakeAuthEnvironmentVariables();
    const context = await browser.newContext({
      httpCredentials: {
        username: fakeAuthConfig.fakeAppUsername,
        password: fakeAuthConfig.fakeAppPassword,
      },
    });
    page = await context.newPage();
    await page.goto(fakeAuthConfig.fakeAppLoginUrl);
  } else {
    page = await browser.newPage();
    await page.goto(user.nhsAppLoginUrl);
    await page.waitForURL("**/login?redirect_to=index", { timeout: 30000 });
    await page.getByRole("button", { name: "Continue" }).click();
  }

  await page.waitForURL("**/login", { timeout: 30000 });
  await page.getByLabel("Email address").evaluate((input: HTMLInputElement, fillText) => {
    input.value = fillText;
    input.dispatchEvent(new Event("input"));
  }, user.nhsLoginUsername);
  await page.getByRole("textbox", { name: "Password" }).evaluate((input: HTMLInputElement, fillText) => {
    input.value = fillText;
    input.dispatchEvent(new Event("input"));
  }, user.nhsLoginPassword);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.waitForURL(/\/(enter-mobile-code|choose-authentication-method)$/, { timeout: 30000 });
  if (new URL(page.url()).pathname === "/choose-authentication-method") {
    await page.getByLabel("Use my mobile phone to recieve a security code by text message").click();
    await page.getByRole("button", { name: "Continue" }).click();
  }

  await page.waitForURL("**/enter-mobile-code", { waitUntil: "networkidle", timeout: 30000 });
  await page.getByRole("textbox", { name: "Security code" }).evaluate((input: HTMLInputElement, fillText) => {
    input.value = fillText;
    input.dispatchEvent(new Event("input"));
  }, user.nhsLoginOTP);
  await page.getByRole("button", { name: "Continue" }).click();

  if (useFakeAuth) {
    await page.waitForURL(user.vaccinationsHubUrl, { timeout: 60000, waitUntil: "domcontentloaded" });
    return page;
  } else {
    await page.waitForURL(/\/(terms-and-conditions\?redirect_to=index|patient\/)$/, { timeout: 30000 });
    if (new URL(page.url()).pathname === "/terms-and-conditions") {
      await page.locator("#termsAndConditions-agree_checkbox").setChecked(true);
      await page.getByRole("button", { name: "Continue" }).click();
    }

    await page.waitForURL("**/patient/", { timeout: 30000 });
    await page.getByRole("heading", { name: "Services" }).locator("..").getByRole("link", { name: "View all" }).click();
    await page.waitForURL("**/patient/services", { timeout: 30000 });

    const newTabPromise = page.context().waitForEvent("page");
    await page.getByRole("link", { name: "Check and book an RSV vaccination" }).click();
    const newTabPage = await newTabPromise;

    await newTabPage.waitForURL(user.vaccinationsHubUrl, { timeout: 60000, waitUntil: "networkidle" });

    return newTabPage;
  }
};
