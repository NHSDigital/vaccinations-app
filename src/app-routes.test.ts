// This test verifies that the URL paths of incoming requests match
// the expected patterns defined in the allowlist regexes configured in WAF.
import patterns from "@project/infrastructure/modules/deploy_app/configs/uri-path-regex.json";

describe("URL regex allowlist", () => {
  const regexes = patterns.map((p) => new RegExp(p));

  // Helper that returns true if any pattern matches the given URL path.
  const isAllowed = (path: string): boolean => {
    // Normalize: ensure path starts with "/"
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return regexes.some((rx) => rx.test(normalized));
  };

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
  ])('isAllowed("%s") === %s', (url, expected) => {
    expect(isAllowed(url)).toBe(expected);
  });
});
