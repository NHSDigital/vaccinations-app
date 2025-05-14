import { expect, Page } from "@playwright/test";

export const clickLinkAndExpectPageTitle = async (page: Page,  linkText: string, expectedPageTitle: string) => {
  await page.getByRole("link", { name: linkText }).click();
  await expect(page).toHaveTitle(expectedPageTitle);
}
