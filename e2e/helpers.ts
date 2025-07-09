import AxeBuilder from "@axe-core/playwright";
import { Page, expect } from "@playwright/test";
import { snapshotPathTemplate } from "@project/playwright.config";

export const getEnv = (name: string) => {
  const value = process.env[name];
  if (value === undefined || value === null) {
    throw { "Missing environment variable: ": name };
  }
  return value;
};

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

export const pathForCustomScreenshots = (testFileName: string, screenshotFileName: string, projectName: string) => {
  const baseFile: string = screenshotFileName.substring(0, screenshotFileName.lastIndexOf("."));

  const path = snapshotPathTemplate
    .replace("{testDir}", "./e2e")
    .replace("__snapshots__", "snapshot_review")
    .replace("{testFileName}", testFileName)
    .replace("{arg}", baseFile)
    .replace("{projectName}", projectName)
    .replace("{platform}", process.platform)
    .replace("{ext}", ".png");

  return path;
};
