type PoliciesPageName = "cookies-policy" | "accessibility-statement";
type VaccinePageName = "rsv-older-adults" | "rsv-pregnancy" | "td-ipv";
type FailurePageName = "sso-failure" | "service-failure" | "not-found";
type SessionPageName = "session-timeout" | "session-logout";
type IndexPageName = "vaccines-hub" | "vaccines-for-all-ages";

export type PageName = IndexPageName | VaccinePageName | FailurePageName | SessionPageName | PoliciesPageName;
export type PageDetails = {
  url: string;
  heading: string;
  title: string;
};

const SERVICE_HEADING = "Check and book an RSV vaccination";
const NHS_TITLE_SUFFIX = "NHS";

export const AppPageDetails: Record<PageName, PageDetails> = {
  // index pages
  "vaccines-hub": {
    url: "/check-and-book-rsv",
    heading: `${SERVICE_HEADING}`,
    title: `${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
  },
  "vaccines-for-all-ages": {
    url: "/vaccines-for-all-ages",
    heading: "Vaccines for all ages",
    title: `Vaccines for all ages - ${NHS_TITLE_SUFFIX}`,
  },

  // vaccine pages
  "rsv-older-adults": {
    url: "/vaccines/rsv",
    heading: "RSV vaccine for older adults",
    title: `RSV vaccine for older adults - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
  },
  "rsv-pregnancy": {
    url: "/vaccines/rsv-pregnancy",
    heading: "RSV vaccine in pregnancy",
    title: `RSV vaccine in pregnancy - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
  },
  "td-ipv": {
    url: "/vaccines/td-ipv-vaccine-3-in-1-teenage-booster",
    heading: "Td/IPV vaccine (3-in-1 teenage booster)",
    title: `Td/IPV vaccine (3-in-1 teenage booster) - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
  },

  // failure pages
  "sso-failure": {
    url: "/sso-failure",
    heading: "There is a problem",
    title: `There is a problem - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
  },
  "service-failure": {
    url: "/service-failure",
    heading: "There is a problem with the service",
    title: `There is a problem with the service - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
  },
  "not-found": {
    url: "/page-does-not-exist",
    heading: "Page not found",
    title: `Page not found - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
  },

  // session pages
  "session-timeout": {
    url: "/session-timeout",
    heading: "You have been logged out",
    title: `You have been logged out - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
  },
  "session-logout": {
    url: "/session-logout",
    heading: "You have logged out",
    title: `You have logged out - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
  },

  // policy pages
  "cookies-policy": {
    url: "/our-policies/cookies-policy",
    heading: "Cookies",
    title: `Cookies policy - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
  },
  "accessibility-statement": {
    url: "/our-policies/accessibility",
    heading: `Accessibility statement for ${SERVICE_HEADING}`,
    title: `Accessibility statement - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
  },
};

export const BOOKING_PAGE_URL_REGEX =
  /^https:\/\/.+nhs\.uk\/book-an-rsv-vaccination\/app-start-page\?wt\.mc_id=vita-RSV-booking$/;
export const BOOKING_PAGE_TITLE_REGEX = /Book an RSV vaccination - NHS$/;

export const MAX_AVG_LCP_DURATION_MS = 3000;
