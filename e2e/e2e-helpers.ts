import { expect, Page } from "@playwright/test";

export const clickLinkAndExpectPageTitle = async (page: Page,  linkText: string, expectedPageTitle: string) => {
  await page.getByRole("link", { name: linkText }).click();
  await expect(page).toHaveTitle(expectedPageTitle);
}

export const benchmark = async (page: Page, target: string) => {
  const pageLoadTimes = [];
  let start;
  for (let i = 0; i < 3; i++) {
    start = performance.now();
    await page.goto(target);
    await page.waitForLoadState('load');
    pageLoadTimes.push(performance.now() - start);
  }
  const sumPageLoadTimes = pageLoadTimes.reduce((sum, cur) => sum + cur, 0);
  console.log(sumPageLoadTimes);
  return sumPageLoadTimes / pageLoadTimes.length;
}
