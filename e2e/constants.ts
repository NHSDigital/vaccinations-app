type PoliciesPageName = "cookies-policy" | "accessibility-statement";
type VaccinePageName = "rsv-older-adults" | "rsv-pregnancy" | "td-ipv" | "6-in-1";
type FailurePageName = "sso-failure" | "service-failure" | "not-found";
type SessionPageName = "session-timeout" | "session-logout";
type IndexPageName = "vaccines-hub" | "vaccines-for-all-ages" | "multi-vaccines-hub";

export type PageName = IndexPageName | VaccinePageName | FailurePageName | SessionPageName | PoliciesPageName;
export type PageDetails = {
  url: string;
  heading: string;
  title: string;
  snapshotFilename: string;
};

const SERVICE_HEADING = "Check and book vaccinations";
const NHS_TITLE_SUFFIX = "NHS";

export const AppPageDetails: Record<PageName, PageDetails> = {
  // index pages
  "vaccines-hub": {
    url: "/check-and-book-rsv",
    heading: `${SERVICE_HEADING}`,
    title: `${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-hub.png",
  },
  "multi-vaccines-hub": {
    url: "/check-and-book-vaccinations",
    heading: `${SERVICE_HEADING}`,
    title: `${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-multi-vaccines-hub.png",
  },
  "vaccines-for-all-ages": {
    url: "/vaccines-for-all-ages",
    heading: "Vaccines for all ages",
    title: `Vaccines for all ages - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-vaccines-for-all-ages.png",
  },

  // vaccine pages
  "rsv-older-adults": {
    url: "/vaccines/rsv",
    heading: "RSV vaccine for older adults",
    title: `RSV vaccine for older adults - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-rsv.png",
  },
  "rsv-pregnancy": {
    url: "/vaccines/rsv-pregnancy",
    heading: "RSV vaccine in pregnancy",
    title: `RSV vaccine in pregnancy - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-rsv-pregnancy.png",
  },
  "td-ipv": {
    url: "/vaccines/td-ipv-vaccine-3-in-1-teenage-booster",
    heading: "Td/IPV vaccine (3-in-1 teenage booster)",
    title: `Td/IPV vaccine (3-in-1 teenage booster) - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-td-ipv-vaccine-3-in-1-teenage-booster.png",
  },
  "6-in-1": {
    url: "/vaccines/6-in-1-vaccine",
    heading: "6-in-1 vaccine",
    title: `6-in-1 vaccine - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-6-in-1.png",
  },

  // failure pages
  "sso-failure": {
    url: "/sso-failure",
    heading: "There is a problem",
    title: `There is a problem - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-sso-failure.png",
  },
  "service-failure": {
    url: "/service-failure",
    heading: "There is a problem with the service",
    title: `There is a problem with the service - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-service-failure.png",
  },
  "not-found": {
    url: "/page-does-not-exist",
    heading: "Page not found",
    title: `Page not found - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-not-found.png",
  },

  // session pages
  "session-timeout": {
    url: "/session-timeout",
    heading: "You have been logged out",
    title: `You have been logged out - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-session-timeout.png",
  },
  "session-logout": {
    url: "/session-logout",
    heading: "You have logged out",
    title: `You have logged out - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-session-logout.png",
  },

  // policy pages
  "cookies-policy": {
    url: "/our-policies/cookies-policy",
    heading: "Cookies",
    title: `Cookies policy - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-cookies-policy.png",
  },
  "accessibility-statement": {
    url: "/our-policies/accessibility",
    heading: `Accessibility statement for ${SERVICE_HEADING}`,
    title: `Accessibility statement - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-accessibility-statement.png",
  },
};

export const BOOKING_PAGE_URL_REGEX =
  /^https:\/\/.+nhs\.uk\/book-an-rsv-vaccination\/app-start-page\?wt\.mc_id=vita-RSV-booking$/;
export const BOOKING_PAGE_TITLE_REGEX = /Book an RSV vaccination - NHS$/;

export const MAX_AVG_LCP_DURATION_MS = 3000;
