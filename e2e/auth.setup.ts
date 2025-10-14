import { TestInfo, test as setup } from "@playwright/test";
import { login } from "@project/e2e/auth";
import { getEnv } from "@project/e2e/helpers";
import users from "@test-data/test-users.json" with { type: "json" };

setup.describe.configure({ mode: "parallel" });

const testUserPattern = process.env.VITA_TEST_USER_PATTERN;
if (!testUserPattern) {
  throw new Error("VITA_TEST_USER_PATTERN environment variable is not defined.");
}

for (const scenario in users) {
  const key = scenario as keyof typeof users;

  setup(`authenticate ${key}`, async ({ browser }, testInfo: TestInfo) => {
    testInfo.setTimeout(60000);

    const user = users[key];
    const suite = getEnv("SUITE") as keyof typeof user;

    if (user[suite]) {
      const userEmail = testUserPattern.replace("{id}", user.emailSuffix);
      const authFile = `./e2e/.auth/${key}.json`;

      const page = await login(browser, userEmail);
      await page.context().storageState({ path: authFile });
    }
  });
}
