import AxeBuilder from "@axe-core/playwright";
import { Locator, Page, TestInfo, expect } from "@playwright/test";
import { snapshotPathTemplate } from "@project/playwright.config";

declare global {
  interface Window {
    __lcp: number;
  }
}

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

export const benchmark = async (page: Page, target: string) => {
  const isLcpSupported = await page.evaluate(() => {
    return (
      typeof PerformanceObserver === "function" &&
      PerformanceObserver.supportedEntryTypes?.includes("largest-contentful-paint")
    );
  });

  if (!isLcpSupported) {
    console.warn("⚠️ LCP is not supported in this browser — skipping LCP measurement.");
    return 0;
  }

  // Inject LCP observer once — before page load
  await page.addInitScript(() => {
    window.__lcp = -1;

    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        window.__lcp = lastEntry.startTime;
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
  });

  const pageLoadTimes: number[] = [];

  for (let i = 0; i < 3; i++) {
    await page.goto(target, { waitUntil: "load" });

    // Let LCP settle
    await page.waitForTimeout(1000);

    const lcp = await page.evaluate(() => window.__lcp);
    if (typeof lcp !== "number" || lcp < 0) {
      throw new Error(`⚠️ LCP not collected for iteration ${i}`);
    }

    pageLoadTimes.push(lcp);
  }

  const averageLCP = pageLoadTimes.reduce((sum, cur) => sum + cur, 0) / pageLoadTimes.length;
  return averageLCP;
};

export const accessibilityCheck = async (page: Page) => {
  const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag22aa"]).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
};

export const pathForCustomScreenshots = (testFileName: string, screenshotFileName: string, projectName: string) => {
  const baseFile: string = screenshotFileName.substring(0, screenshotFileName.lastIndexOf("."));

  return snapshotPathTemplate
    .replace("{testDir}", "./e2e")
    .replace("__snapshots__", "snapshot_review")
    .replace("{testFileName}", testFileName)
    .replace("{arg}", baseFile)
    .replace("{projectName}", projectName)
    .replace("{platform}", process.platform)
    .replace("{ext}", ".png");
};

export const openExpandersIfPresent = async (page: Page) => {
  const expanderTitles = [
    "What the vaccine is for",
    "Who should have the vaccine",
    "How to get the vaccine",
    "Side effects of the vaccine",
  ];

  for (const title of expanderTitles) {
    const expander: Locator = page.getByText(title);
    if ((await expander.count()) > 0) {
      await expander.click();
    }
  }

  await page.mouse.click(0, 0);
};

export const benchmarkIfChromium = async (page: Page, url: string, maxDuration: number, testInfo: TestInfo) => {
  if (testInfo.project.name === "chromium") {
    expect.soft(await benchmark(page, url)).toBeLessThanOrEqual(maxDuration);
  }
};
