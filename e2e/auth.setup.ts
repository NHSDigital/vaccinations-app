import { test as setup } from "@playwright/test";

const authFile = "auth/user.json";

setup("authenticate", async ({ browser }) => {
  const context = await browser.newContext({
    httpCredentials: {
      username: process.env.TEST_NHS_APP_USERNAME!,
      password: process.env.TEST_NHS_APP_PASSWORD!
    }
  });
  const page = await context.newPage();

  await page.goto(process.env.TEST_NHS_APP_URL!);

  await page.getByLabel("Email address").fill(process.env.TEST_NHS_LOGIN_USERNAME!);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("textbox", { name: "Password" }).fill(process.env.TEST_NHS_LOGIN_PASSWORD!);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("textbox", { name: "Security code" }).fill(process.env.TEST_NHS_LOGIN_OTP!);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.waitForURL(process.env.TEST_APP_URL!, { timeout: 30000 });

  await page.context().storageState({ path: authFile });
});
