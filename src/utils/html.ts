import { load as loadHtml } from "cheerio";

/**
 * Update HTML fragment to ensure that anchor tags have the target="_blank"
 * attribute, so links open in a new window.
 *  * @param {string} fragment - the original HTML fragment.
 *  * @returns {string} The HTML fragment with fixed anchor tags.
 */
export function linksOpenCorrectly(fragment: string) {
  const $ = loadHtml(fragment, null, false);
  $("a").attr("target", "_blank");
  return $.html();
}
