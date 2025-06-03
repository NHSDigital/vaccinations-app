import { expect, Page } from "@playwright/test";

export const clickLinkAndExpectPageTitle = async (page: Page,  linkText: string, expectedPageTitle: string) => {
  await page.getByRole("link", { name: linkText }).click();
  await expect(page).toHaveTitle(expectedPageTitle);
}

export const determineLargestContentfulPaint = async () => {

}

const lcpTime = async (): Promise<number> => {
  return new Promise((resolve) => {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      resolve(lastEntry.duration);
    }).observe({type: 'largest-contentful-paint', buffered: true});
  });
}

export const benchmark = async (page: Page, target: string) => {
  const pageLoadTimes: number[] = [];
  for (let i = 0; i < 3; i++) {
    await page.goto(target, { waitUntil: 'load' });
    pageLoadTimes.push(await page.evaluate(lcpTime));
  }
  const sumPageLoadTimes = pageLoadTimes.reduce((sum, cur) => sum + cur, 0);
  console.log(sumPageLoadTimes);
  return sumPageLoadTimes / pageLoadTimes.length;
}
