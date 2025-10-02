import { Browser, BrowserContext, Locator, expect, test } from "@playwright/test";
import {
  BOOKING_PAGE_TITLE,
  BOOKING_PAGE_URL,
  RSV_PAGE_TITLE,
  RSV_PAGE_URL,
  RSV_PREGNANCY_PAGE_TITLE,
  RSV_PREGNANCY_PAGE_URL,
} from "@project/e2e/constants";
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

const testLinkToBookAppointmentForPregnantPeople = () => {
  test("link to book appointment at pharmacy on RSV page for pregnant people", async ({ browser }) => {
    const { page, context } = await loginToNBS(browser);

    await page.goto(RSV_PREGNANCY_PAGE_URL);
    await expect(page).toHaveTitle(RSV_PREGNANCY_PAGE_TITLE);

    const bookingLink = page.getByRole("link", { name: "book an RSV vaccination in a pharmacy" });
    await expect(bookingLink).toBeVisible();

    const [newPage] = await Promise.all([context.waitForEvent("page"), bookingLink.click()]);

    await newPage.waitForLoadState("domcontentloaded");
    await newPage.bringToFront();

    await expect(newPage).toHaveTitle(BOOKING_PAGE_TITLE);
    expect(newPage.url()).toContain(BOOKING_PAGE_URL);
  });
};

test.describe.configure({ mode: "parallel", retries: 0 });

test.describe("NBS booking redirection - user 19", () => {
  test.use({ storageState: "./e2e/.auth/actionable-with-booking-link.json" });

  test("link to book appointment at pharmacy on RSV page for older adults", async ({ browser }) => {
    const { page, context } = await loginToNBS(browser);

    await page.goto(RSV_PAGE_URL);
    await expect(page).toHaveTitle(RSV_PAGE_TITLE);

    const bookingLink = page.getByRole("link", { name: "book an RSV vaccination in a pharmacy" });
    await expect(bookingLink).toBeVisible();

    const [newPage] = await Promise.all([context.waitForEvent("page"), bookingLink.click()]);

    await newPage.waitForLoadState("domcontentloaded");
    await newPage.bringToFront();

    await expect(newPage).toHaveTitle(BOOKING_PAGE_TITLE);
    expect(newPage.url()).toContain(BOOKING_PAGE_URL);
  });

  testLinkToBookAppointmentForPregnantPeople();
});

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

  testLinkToBookAppointmentForPregnantPeople();
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

  testLinkToBookAppointmentForPregnantPeople();
});
