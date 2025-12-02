import { Locator, expect, test } from "@playwright/test";
import { AppPageDetails, PageName } from "@project/e2e/constants";
import { clickLinkAndExpectPageTitle } from "@project/e2e/helpers";
import { SERVICE_HEADING } from "@src/app/constants";

enum AgeSectionTestId {
  ADULTS = "vaccine-cardlinks-adults",
  PREGNANCY = "vaccine-cardlinks-pregnancy",
  CHILDREN = "vaccine-cardlinks-children",
  BABIES = "vaccine-cardlinks-babies",
}

test.describe.configure({ mode: "parallel", retries: 1 });

test.describe("Navigation", () => {
  test.use({ storageState: `./e2e/.auth/default.json` });

  test("vaccines-for-all-ages page and back links from vaccine hub page", async ({ page }) => {
    await page.goto(AppPageDetails["vaccine-hub"].url);
    await clickLinkAndExpectPageTitle(
      page,
      "View vaccines for all ages",
      AppPageDetails["vaccines-for-all-ages"].title,
    );
    await clickLinkAndExpectPageTitle(page, "Back", AppPageDetails["vaccine-hub"].title);
  });

  const linksFromAllAges: { section: AgeSectionTestId; linkText: string; pageName: PageName }[] = [
    { section: AgeSectionTestId.ADULTS, linkText: "Flu", pageName: "flu-vaccine" },
    { section: AgeSectionTestId.ADULTS, linkText: "RSV", pageName: "rsv-older-adults" },
    { section: AgeSectionTestId.ADULTS, linkText: "Shingles", pageName: "shingles" },
    { section: AgeSectionTestId.ADULTS, linkText: "Pneumococcal", pageName: "pneumococcal" },

    {
      section: AgeSectionTestId.PREGNANCY,
      linkText: "Whooping cough (pertussis) in pregnancy",
      pageName: "whooping-cough",
    },
    { section: AgeSectionTestId.PREGNANCY, linkText: "RSV in pregnancy", pageName: "rsv-pregnancy" },
    { section: AgeSectionTestId.PREGNANCY, linkText: "Flu in pregnancy", pageName: "flu-in-pregnancy" },

    { section: AgeSectionTestId.CHILDREN, linkText: "Td/IPV (3-in-1 teenage booster)", pageName: "td-ipv" },
    { section: AgeSectionTestId.CHILDREN, linkText: "MenACWY", pageName: "menacwy" },
    { section: AgeSectionTestId.CHILDREN, linkText: "HPV", pageName: "hpv" },
    { section: AgeSectionTestId.CHILDREN, linkText: "4-in-1 pre-school booster", pageName: "4-in-1" },
    { section: AgeSectionTestId.CHILDREN, linkText: "MMR (measles, mumps and rubella)", pageName: "mmr" },
    { section: AgeSectionTestId.CHILDREN, linkText: "MenB", pageName: "menb-children" },
    { section: AgeSectionTestId.CHILDREN, linkText: "Pneumococcal", pageName: "pneumococcal" },
    { section: AgeSectionTestId.CHILDREN, linkText: "Hib/MenC", pageName: "hib-menc" },

    { section: AgeSectionTestId.BABIES, linkText: "6-in-1", pageName: "6-in-1" },
    { section: AgeSectionTestId.BABIES, linkText: "Rotavirus", pageName: "rotavirus" },
    { section: AgeSectionTestId.BABIES, linkText: "Pneumococcal", pageName: "pneumococcal" },
    { section: AgeSectionTestId.BABIES, linkText: "MenB", pageName: "menb-children" },
  ];
  for (const linkFromAllAges of linksFromAllAges) {
    test(`Link to ${linkFromAllAges.linkText} in ${linkFromAllAges.section} section, and backlink from vaccines-for-all-ages page`, async ({
      page,
    }) => {
      await page.goto(AppPageDetails["vaccines-for-all-ages"].url);

      const section: Locator = page.getByTestId(linkFromAllAges.section);
      const link = section.getByRole("link", { name: linkFromAllAges.linkText, exact: true });

      await link.click();
      await expect(page).toHaveTitle(AppPageDetails[linkFromAllAges.pageName].title);

      await clickLinkAndExpectPageTitle(page, "Back", AppPageDetails["vaccines-for-all-ages"].title);
    });
  }

  const linksFromPregnancyHub: { linkText: string; pageName: PageName }[] = [
    { linkText: "Whooping cough (pertussis) in pregnancy", pageName: "whooping-cough" },
    { linkText: "RSV in pregnancy", pageName: "rsv-pregnancy" },
    { linkText: "Flu in pregnancy", pageName: "flu-in-pregnancy" },
  ];
  for (const linkFromPregnancyHub of linksFromPregnancyHub) {
    test(`Link to ${linkFromPregnancyHub.linkText} and backlink from vaccines-during-pregnancy page`, async ({
      page,
    }) => {
      await page.goto(AppPageDetails["vaccines-during-pregnancy"].url);

      await clickLinkAndExpectPageTitle(
        page,
        linkFromPregnancyHub.linkText,
        AppPageDetails[linkFromPregnancyHub.pageName].title,
      );
      await clickLinkAndExpectPageTitle(page, "Back", AppPageDetails["vaccines-during-pregnancy"].title);
    });
  }

  test("Skip link navigation", async ({ page }) => {
    await page.goto(AppPageDetails["vaccine-hub"].url);
    await page.getByTestId("skip-link").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { level: 1 })).toBeFocused();

    // Test skip link still works after navigation
    await clickLinkAndExpectPageTitle(
      page,
      "View vaccines for all ages",
      AppPageDetails["vaccines-for-all-ages"].title,
    );
    await page.getByTestId("skip-link").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  });

  test("Service header link click navigates to hub page", async ({ page }) => {
    await page.goto(AppPageDetails["rsv-older-adults"].url);
    await page.getByRole("link", { name: "Log out" }).waitFor();

    await clickLinkAndExpectPageTitle(page, `NHS ${SERVICE_HEADING} homepage`, AppPageDetails["vaccine-hub"].title);
  });

  test("Footer links navigate to footer pages", async ({ page }) => {
    await page.goto(AppPageDetails["vaccine-hub"].url);
    await clickLinkAndExpectPageTitle(page, "Cookies", AppPageDetails["cookies-policy"].title);
    await clickLinkAndExpectPageTitle(page, "Accessibility statement", AppPageDetails["accessibility-statement"].title);
  });

  test("Log out link click navigates to session logout page", async ({ page }) => {
    await page.goto(AppPageDetails["vaccine-hub"].url);
    await expect(page).toHaveTitle(AppPageDetails["vaccine-hub"].title);
    await clickLinkAndExpectPageTitle(page, "Log out", AppPageDetails["session-logout"].title);
  });
});
