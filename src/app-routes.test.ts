// This test verifies that the URL paths of incoming requests match
// the expected patterns defined in the allowlist regexes configured in WAF.
import patterns from "@project/infrastructure/modules/deploy_app/configs/uri-path-regex.json";
import fs from "node:fs";
import path from "path";

const getAppRoutesManifest = (): Record<string, string> => {
  const manifestPath = path.join(process.cwd(), ".next/app-path-routes-manifest.json");

  if (!fs.existsSync(manifestPath)) {
    throw new Error(
      "app-path-routes-manifest.json not found.\n" +
        "Run 'npm run build' to generate the Next.js routes before running this test.",
    );
  }

  const fileContents = fs.readFileSync(manifestPath, "utf-8");
  return JSON.parse(fileContents);
};

const appPathRoutes = getAppRoutesManifest();

describe("URI path allowlist", () => {
  const regexes: RegExp[] = patterns.map((p) => new RegExp(p));

  // Helper that returns true if any pattern matches the given URL path.
  const isAllowed = (path: string): boolean => {
    // Normalize: ensure the path starts with "/"
    const normalized: string = path.startsWith("/") ? path : `/${path}`;
    return regexes.some((rx) => rx.test(normalized));
  };

  describe("URI path regex", () => {
    // Table of test cases: [url, expected]
    // Adjust expected=true/false to your policy (allowlist or blocklist).
    // Here we assume "true" means "matches at least one regex".
    test.each([
      // _next assets
      ["/_next/static/chunks/app.js", true],
      ["/_next/image?url=%2Flogo.png&w=256&q=75", true],

      // static assets
      ["/assets/main.css", true],
      ["/css/site.css", true],
      ["/js/app.bundle.js", true],

      // favicon
      ["/favicon.ico", true],
      ["/favicon.png", false],

      // policies
      ["/our-policies/accessibility", true],
      ["/our-policies/cookies-policy", true],
      ["/our-policies/privacy", false],

      // session endpoints
      ["/session-logout", true],
      ["/session-timeout", true],
      ["/sso-failure", true],
      ["/service-failure", true],
      ["/session-extend", false],

      // vaccine hub pages
      ["/check-and-book-vaccinations", true],
      ["/vaccines-for-all-ages", true],
      ["/vaccines-during-pregnancy", true],
      ["/vaccines-during-travel", false],

      // vaccines slug (one segment after /vaccines/)
      ["/vaccines/flu", true],
      ["/vaccines/flu/uk", true], // WAF allows it, but the application will throw 404
      ["/vaccines/", false],

      // api endpoints
      ["/api/auth/callback", true],
      ["/api/auth/login", true],
      ["/api/sso", true],
      ["/api/sso-to-nbs", true],
      ["/api/version", true],
      ["/api/health", false],

      // root
      ["/", true],
      ["", true],
      ["/does-not-exist", false],
    ])('"%s" is allowed = %s', (url, expected) => {
      expect(isAllowed(url)).toBe(expected);
    });
  });

  // Filtering out internal Next.js routes that are never directly navigated to by users
  const manifestRoutes: string[] = Object.values(appPathRoutes).filter(
    (route) => route !== "/_not-found" && route !== "/_global-error",
  );

  // Test suite to ensure that generated app routes satisfy at least one of the RegExes in the WAF allowlist
  describe("Next.js app routes", () => {
    test.each(manifestRoutes)('App route "%s" is allowed in uri-path-regex.json', (route) => {
      expect(isAllowed(route as string)).toBe(true);
    });
  });

  // Test suite to ensure that WAF rules aren't overly permissive,
  // E.g., if we delete a route, we want to also delete it from the RegExes in the WAF allowlist.
  describe("URI path regex is in sync with app routes", () => {
    // Static paths we know exist but not present in the app-path-routes-manifest.json
    // Will have to be maintained
    const knownStaticPaths: string[] = ["/_next/mock", "/assets/mock", "/css/mock", "/js/mock", "/", ""];

    const allValidPaths: string[] = [...manifestRoutes, ...knownStaticPaths];

    test.each(patterns)('WAF regex allowlist rule "%s" is actively used', (pattern) => {
      const rx = new RegExp(pattern);

      // Check if regex matches at least one valid path
      const ruleIsUsed: boolean = allValidPaths.some((path) => {
        const normalized: string = path.startsWith("/") ? path : `/${path}`;
        return rx.test(normalized);
      });

      // Failure indicates a WAF regex rule is not used
      expect(ruleIsUsed).toBe(true);
    });
  });
});
