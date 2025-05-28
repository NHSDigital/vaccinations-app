import { Browser, Page } from "@playwright/test";

interface User {
  fakeAppUsername: string
  fakeAppPassword: string
  fakeAppLoginUrl: string
  nhsLoginUsername: string
  nhsLoginPassword: string
  nhsLoginOTP: string
  sutBaseUrl: string
}

const getEnv = (name: string) => {
  const value = process.env[name];
  if ((value === undefined) || (value === null)) {
    throw {"Missing environment variable: ": name};
  }
  return value;
}

const loadUserFromEnvironment = (): User => {
  return {
    fakeAppUsername: getEnv("TEST_NHS_APP_USERNAME"),
    fakeAppPassword: getEnv("TEST_NHS_APP_PASSWORD"),
    fakeAppLoginUrl: getEnv("TEST_NHS_APP_URL"),
    nhsLoginUsername: getEnv("TEST_NHS_LOGIN_USERNAME"),
    nhsLoginPassword: getEnv("TEST_NHS_LOGIN_PASSWORD"),
    nhsLoginOTP: getEnv("TEST_NHS_LOGIN_OTP"),
    sutBaseUrl: getEnv("TEST_APP_URL")
  }
}

export const login = async (browser: Browser): Promise<Page> => {
  const user = loadUserFromEnvironment();
  const context = await browser.newContext({
    httpCredentials: {
      username: user.fakeAppUsername,
      password: user.fakeAppPassword
    }
  });
  const page = await context.newPage();
  await page.goto(user.fakeAppLoginUrl);

  await page.waitForURL('**/enter-email', {timeout: 30000})
  await page.getByLabel("Email address").fill(user.nhsLoginUsername);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.waitForURL('**/log-in-password', {timeout: 30000})
  await page.getByRole("textbox", { name: "Password" }).fill(user.nhsLoginPassword);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.waitForURL(/\/(enter-mobile-code|choose-authentication-method)$/, {timeout: 30000});
  if ((new URL(page.url())).pathname === "/choose-authentication-method") {
    await page.getByLabel("Use my mobile phone to recieve a security code by text message").click();
    await page.getByRole("button", { name: "Continue" }).click();
  }

  await page.waitForURL('**/enter-mobile-code', {timeout: 30000})
  await page.getByRole("textbox", { name: "Security code" }).fill(user.nhsLoginOTP);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.waitForURL(user.sutBaseUrl, { timeout: 30000 });

  return page;
}
