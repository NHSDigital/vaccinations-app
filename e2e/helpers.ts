import { expect, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

export const clickLinkAndExpectPageTitle = async (page: Page, linkText: string, expectedPageTitle: string) => {
  await page.getByRole("link", { name: linkText, exact: true }).click();
  await expect(page).toHaveTitle(expectedPageTitle);
};

const lcpDuration = async (): Promise<number> => {
  return new Promise((resolve) => {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lcpDuration = entries[entries.length - 1].startTime;
      console.log("LCP: " + lcpDuration);
      resolve(lcpDuration);
    }).observe({ type: "largest-contentful-paint", buffered: true });
  });
};

export const benchmark = async (page: Page, target: string) => {
  const pageLoadTimes: number[] = [];
  for (let i = 0; i < 5; i++) {
    await page.goto(target, { waitUntil: "load" });
    pageLoadTimes.push(await page.evaluate(lcpDuration));
  }
  const sumPageLoadTimes = pageLoadTimes.reduce((sum, cur) => sum + cur, 0);
  return sumPageLoadTimes / pageLoadTimes.length;
};

export const accessibilityCheck = async (page: Page) => {
  const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag22aa"]).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
};
