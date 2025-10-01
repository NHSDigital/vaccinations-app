import { Browser, BrowserContext, Locator, expect, test } from "@playwright/test";
import { BOOKING_PAGE_TITLE, BOOKING_PAGE_URL, RSV_PAGE_TITLE, RSV_PAGE_URL } from "@project/e2e/constants";
import { getEnv } from "@project/e2e/helpers";

const loadNBSAuthEnvironmentVariables = () => {
  return {
    NBSUsername: getEnv("TEST_NBS_APP_USERNAME"),
    NBSPassword: getEnv("TEST_NBS_APP_PASSWORD"),
  };
};

export const loginToNBS = async (browser: Browser) => {
  const authConfig = loadNBSAuthEnvironmentVariables();

  const nbsContext: BrowserContext = await browser.newContext({
    httpCredentials: {
      username: authConfig.NBSUsername,
      password: authConfig.NBSPassword,
    },
  });

  return { page: await nbsContext.newPage(), context: nbsContext };
};

test.describe.configure({ mode: "parallel", retries: 3 });

test.describe("NBS booking redirection - user 21", () => {
  test.use({ storageState: "./e2e/.auth/actionable-with-booking-button.json" });

  test("button to book appointment on RSV page", async ({ browser }) => {
    const { page, context } = await loginToNBS(browser);

    await page.goto(RSV_PAGE_URL);
    await expect(page).toHaveTitle(RSV_PAGE_TITLE);

    const bookingButton = page.getByRole("button", { name: "Continue to booking" });
    await expect(bookingButton).toBeVisible();

    const [newPage] = await Promise.all([context.waitForEvent("page"), bookingButton.click()]);

    await newPage.waitForLoadState("domcontentloaded");
    await newPage.bringToFront();

    await expect(newPage).toHaveTitle(BOOKING_PAGE_TITLE);
    expect(newPage.url()).toContain(BOOKING_PAGE_URL);
  });
});

test.describe("NBS booking redirection - user 22", () => {
  test.use({ storageState: "./e2e/.auth/actionable-with-managing-button.json" });

  test("button to manage the appointment on RSV page", async ({ browser }) => {
    const { page, context } = await loginToNBS(browser);

    await page.goto(RSV_PAGE_URL);
    await expect(page).toHaveTitle(RSV_PAGE_TITLE);

    const manageButton: Locator = page.getByRole("button", {
      name: "Manage your appointment",
    });
    await expect(manageButton).toBeVisible();

    const [newPage] = await Promise.all([context.waitForEvent("page"), manageButton.click()]);

    await newPage.waitForLoadState("domcontentloaded");
    await newPage.bringToFront();

    await expect(newPage).toHaveTitle(BOOKING_PAGE_TITLE);
    expect(newPage.url()).toContain(BOOKING_PAGE_URL);
  });
});
