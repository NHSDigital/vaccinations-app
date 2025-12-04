import { load as loadHtml } from "cheerio";

export function fixupHtmlFragment(fragment: string) {
  const $ = loadHtml(fragment, null, false);
  $("a").attr("target", "_blank");
  return $.html();
}
