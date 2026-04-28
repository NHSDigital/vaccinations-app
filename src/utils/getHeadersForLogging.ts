import { NextRequest } from "next/server";

const SAFE_HEADERS = [
  "cache-control",
  "cloudfront-is-desktop-viewer",
  "cloudfront-is-mobile-viewer",
  "cloudfront-is-tablet-viewer",
  "content-length",
  "content-type",
  "referer",
  "user-agent",
];

export const getHeadersForLogging = (request: NextRequest): Record<string, string> => {
  const headersObj: Record<string, string> = {};
  SAFE_HEADERS.forEach((header) => {
    headersObj[header] = request.headers.get(header) ?? "-";
  });
  return headersObj;
};
