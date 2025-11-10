import { Browser, BrowserContext, Locator, expect, test } from "@playwright/test";
import { AppPageDetails, BOOKING_PAGE_TITLE_REGEX, BOOKING_PAGE_URL_REGEX } from "@project/e2e/constants";
import { getEnv } from "@project/e2e/helpers";

const environment = getEnv("DEPLOY_ENVIRONMENT");

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

const testLinkToBookAppointmentForPregnantPeople = () => {
  test("link to book appointment at pharmacy on RSV page for pregnant people", async ({ browser }) => {
    test.skip(
      environment === "preprod",
      "Temporarily skip in Preprod until NBS re-deploy changes required by VIA-335, eta 2025-10-08",
    );

    const { page, context } = await loginToNBS(browser);

    await page.goto(AppPageDetails["rsv-pregnancy"].url);
    await expect(page).toHaveTitle(AppPageDetails["rsv-pregnancy"].title);

    const bookingLink = page.getByRole("link", { name: "book an RSV vaccination in a pharmacy" });
    await expect(bookingLink).toBeVisible();

    const [newPage] = await Promise.all([context.waitForEvent("page"), bookingLink.click()]);

    await newPage.waitForLoadState("domcontentloaded");
    await newPage.bringToFront();

    await expect(newPage).toHaveTitle(BOOKING_PAGE_TITLE_REGEX);
    expect(newPage.url()).toMatch(BOOKING_PAGE_URL_REGEX);
  });
};

test.describe.configure({ mode: "parallel", retries: 0 });

test.describe("NBS booking redirection - user 19", () => {
  test.skip(
    environment === "preprod",
    "Temporarily skip in Preprod until NBS re-deploy changes required by VIA-335, eta 2025-10-08",
  );

  test.use({ storageState: "./e2e/.auth/actionable-with-booking-link.json" });

  test("link to book appointment at pharmacy on RSV page for older adults", async ({ browser }) => {
    const { page, context } = await loginToNBS(browser);

    await page.goto(AppPageDetails["rsv-older-adults"].url);
    await expect(page).toHaveTitle(AppPageDetails["rsv-older-adults"].title);

    const bookingLink = page.getByRole("link", { name: "book an RSV vaccination in a pharmacy" });
    await expect(bookingLink).toBeVisible();

    const [newPage] = await Promise.all([context.waitForEvent("page"), bookingLink.click()]);

    await newPage.waitForLoadState("domcontentloaded");
    await newPage.bringToFront();

    await expect(newPage).toHaveTitle(BOOKING_PAGE_TITLE_REGEX);
    expect(newPage.url()).toMatch(BOOKING_PAGE_URL_REGEX);
  });

  testLinkToBookAppointmentForPregnantPeople();
});

test.describe("NBS booking redirection - user 21", () => {
  test.skip(
    environment === "preprod",
    "Temporarily skip in Preprod until NBS re-deploy changes required by VIA-335, eta 2025-10-08",
  );

  test.use({ storageState: "./e2e/.auth/actionable-with-booking-button.json" });

  test("button to book appointment on RSV page", async ({ browser }) => {
    const { page, context } = await loginToNBS(browser);

    await page.goto(AppPageDetails["rsv-older-adults"].url);
    await expect(page).toHaveTitle(AppPageDetails["rsv-older-adults"].title);

    const bookingButton = page.getByRole("button", { name: "Continue to booking" });
    await expect(bookingButton).toBeVisible();

    const [newPage] = await Promise.all([context.waitForEvent("page"), bookingButton.click()]);

    await newPage.waitForLoadState("domcontentloaded");
    await newPage.bringToFront();

    await expect(newPage).toHaveTitle(BOOKING_PAGE_TITLE_REGEX);
    expect(newPage.url()).toMatch(BOOKING_PAGE_URL_REGEX);
  });

  testLinkToBookAppointmentForPregnantPeople();
});

test.describe("NBS booking redirection - user 22", () => {
  test.skip(
    environment === "preprod",
    "Temporarily skip in Preprod until NBS re-deploy changes required by VIA-335, eta 2025-10-08",
  );

  test.use({ storageState: "./e2e/.auth/actionable-with-managing-button.json" });

  test("button to manage the appointment on RSV page", async ({ browser }) => {
    const { page, context } = await loginToNBS(browser);

    await page.goto(AppPageDetails["rsv-older-adults"].url);
    await expect(page).toHaveTitle(AppPageDetails["rsv-older-adults"].title);

    const manageButton: Locator = page.getByRole("button", {
      name: "Manage your appointment",
    });
    await expect(manageButton).toBeVisible();

    const [newPage] = await Promise.all([context.waitForEvent("page"), manageButton.click()]);

    await newPage.waitForLoadState("domcontentloaded");
    await newPage.bringToFront();

    await expect(newPage).toHaveTitle(BOOKING_PAGE_TITLE_REGEX);
    expect(newPage.url()).toMatch(BOOKING_PAGE_URL_REGEX);
  });

  testLinkToBookAppointmentForPregnantPeople();
});
