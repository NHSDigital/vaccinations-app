import { test as setup, TestInfo } from "@playwright/test";
import { login } from "@project/e2e/auth";
import users from "@test-data/test-users.json" with { type: "json" };

for (const scenario in users) {
  const key = scenario as keyof typeof users;

  setup(`authenticate ${key}`, async ({ browser }, testInfo: TestInfo) => {
    testInfo.setTimeout(60000);
    const userEmail = users[key].email;
    const authFile = `./e2e/.auth/${key}.json`;

    const page = await login(browser, userEmail);
    await page.context().storageState({ path: authFile });
  });
}
