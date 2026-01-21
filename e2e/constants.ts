import { AgeGroup } from "@src/models/ageGroup";

type PoliciesPageName = "cookies-policy" | "accessibility-statement";
type VaccinePageName =
  | "rsv-older-adults"
  | "rsv-pregnancy"
  | "td-ipv"
  | "6-in-1"
  | "rotavirus"
  | "hpv"
  | "menb-children"
  | "mmr"
  | "mmrv"
  | "pneumococcal"
  | "shingles"
  | "menacwy"
  | "4-in-1"
  | "whooping-cough"
  | "flu-in-pregnancy"
  | "flu-in-pregnancy-active-campaign"
  | "flu-vaccine"
  | "flu-vaccine-active-campaign"
  | "covid-19-vaccine"
  | "covid-19-vaccine-active-campaign"
  | "flu-for-children"
  | "flu-for-children-active-campaign"
  | "flu-for-school-aged-children";
type FailurePageName = "sso-failure" | "service-failure" | "service-failure-static" | "not-found";
type SessionPageName = "session-timeout" | "session-logout";
type IndexPageName = "vaccines-for-all-ages" | "vaccine-hub" | "vaccines-during-pregnancy";

export type PageName = IndexPageName | VaccinePageName | FailurePageName | SessionPageName | PoliciesPageName;
export type PageDetails = {
  url: string;
  heading: string;
  title: string;
  snapshotFilename: string;
  datetimeOverride?: Date;
};

const SERVICE_HEADING = "Check and book vaccinations";
const NHS_TITLE_SUFFIX = "NHS";

export const AppPageDetails: Record<PageName, PageDetails> = {
  // index pages
  "vaccine-hub": {
    url: "/check-and-book-vaccinations",
    heading: `${SERVICE_HEADING}`,
    title: `${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-vaccine-hub.png",
  },
  "vaccines-for-all-ages": {
    url: "/vaccines-for-all-ages",
    heading: "Vaccines for all ages",
    title: `Vaccines for all ages - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-vaccines-for-all-ages.png",
  },
  "vaccines-during-pregnancy": {
    url: "/vaccines-during-pregnancy",
    heading: "Vaccines during pregnancy",
    title: `Vaccines during pregnancy - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-vaccines-during-pregnancy.png",
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
  rotavirus: {
    url: "/vaccines/rotavirus-vaccine",
    heading: "Rotavirus vaccine",
    title: `Rotavirus vaccine - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-rotavirus.png",
  },
  hpv: {
    url: "/vaccines/hpv-vaccine",
    heading: "HPV vaccine",
    title: `HPV vaccine - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-hpv.png",
  },
  "menb-children": {
    url: "/vaccines/menb-vaccine-for-children",
    heading: "MenB vaccine for children",
    title: `MenB vaccine for children - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-menb-vaccine-for-children.png",
  },
  mmr: {
    url: "/vaccines/mmr-vaccine",
    heading: "MMR (measles, mumps and rubella) vaccine",
    title: `MMR (measles, mumps and rubella) vaccine - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-mmr.png",
  },
  mmrv: {
    url: "/vaccines/mmrv-vaccine",
    heading: "MMRV (measles, mumps, rubella and chickenpox) vaccine",
    title: `MMRV (measles, mumps, rubella and chickenpox) vaccine - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-mmrv.png",
  },
  pneumococcal: {
    url: "/vaccines/pneumococcal-vaccine",
    heading: "Pneumococcal vaccine",
    title: `Pneumococcal vaccine - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-pneumococcal.png",
  },
  shingles: {
    url: "/vaccines/shingles-vaccine",
    heading: "Shingles vaccine",
    title: `Shingles vaccine - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-shingles.png",
  },
  menacwy: {
    url: "/vaccines/menacwy-vaccine",
    heading: "MenACWY vaccine",
    title: `MenACWY vaccine - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-menacwy.png",
  },
  "4-in-1": {
    url: "/vaccines/4-in-1-preschool-booster-vaccine",
    heading: "4-in-1 pre-school booster vaccine",
    title: `4-in-1 pre-school booster vaccine - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-4-in-1.png",
  },
  "whooping-cough": {
    url: "/vaccines/whooping-cough-vaccination",
    heading: "Whooping cough vaccine in pregnancy",
    title: `Whooping cough vaccine in pregnancy - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-whooping-cough.png",
  },
  "flu-in-pregnancy": {
    url: "/vaccines/flu-vaccine-in-pregnancy",
    heading: "The flu vaccine in pregnancy",
    title: `The flu vaccine in pregnancy - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-flu-in-pregnancy.png",
    datetimeOverride: new Date("2020-03-01"),
  },
  "flu-in-pregnancy-active-campaign": {
    url: "/vaccines/flu-vaccine-in-pregnancy",
    heading: "The flu vaccine in pregnancy",
    title: `The flu vaccine in pregnancy - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-flu-in-pregnancy-active-campaign.png",
    datetimeOverride: new Date("2026-02-01"),
  },
  "flu-vaccine": {
    url: "/vaccines/flu-vaccine",
    heading: "Flu vaccine",
    title: `Flu vaccine - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-flu-vaccine.png",
    datetimeOverride: new Date("2020-03-01"),
  },
  "flu-vaccine-active-campaign": {
    url: "/vaccines/flu-vaccine",
    heading: "Flu vaccine",
    title: `Flu vaccine - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-flu-vaccine-active-campaign.png",
    datetimeOverride: new Date("2026-02-01"),
  },
  "covid-19-vaccine": {
    url: "/vaccines/covid-19-vaccine",
    heading: "COVID-19 vaccine",
    title: `COVID-19 vaccine - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-covid-19-vaccine.png",
    datetimeOverride: new Date("2026-03-01"),
  },
  "covid-19-vaccine-active-campaign": {
    url: "/vaccines/covid-19-vaccine",
    heading: "COVID-19 vaccine",
    title: `COVID-19 vaccine - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-covid-19-vaccine-active-campaign.png",
    datetimeOverride: new Date("2025-12-01"),
  },
  "flu-for-children": {
    url: "/vaccines/flu-vaccine-for-children",
    heading: "Flu vaccine for children aged 2 to 3",
    title: `Flu vaccine for children aged 2 to 3 - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-flu-vaccine-for-children.png",
    datetimeOverride: new Date("2020-03-01"),
  },
  "flu-for-children-active-campaign": {
    url: "/vaccines/flu-vaccine-for-children",
    heading: "Flu vaccine for children aged 2 to 3",
    title: `Flu vaccine for children aged 2 to 3 - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-flu-vaccine-for-children-active-campaign.png",
    datetimeOverride: new Date("2025-12-01"),
  },
  "flu-for-school-aged-children": {
    url: "/vaccines/flu-vaccine-for-school-aged-children",
    heading: "Flu vaccine for school-aged children",
    title: `Flu vaccine for school-aged children - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-flu-vaccine-for-school-aged-children.png",
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
  "service-failure-static": {
    url: "/assets/static/service-failure.html",
    heading: "There is a problem with the service",
    title: `There is a problem with the service - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`,
    snapshotFilename: "default-service-failure-static.png",
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

type AgeBasedTestUser = {
  ageGroup: AgeGroup;
  userSession: string;
  ageBasedHeading: string;
};

export const AgeBasedHubTestUsers: AgeBasedTestUser[] = [
  {
    ageGroup: AgeGroup.AGE_12_to_16,
    userSession: "12-16-age-range",
    ageBasedHeading: "Routine vaccines for children and teenagers aged 12 to 16",
  }, // user 34
  {
    ageGroup: AgeGroup.AGE_17_to_24,
    userSession: "actionable-with-already-vaccinated-suitability-rule",
    ageBasedHeading: "Routine vaccines for young people aged 17 to 24",
  }, // user 13
  {
    ageGroup: AgeGroup.AGE_25_to_64,
    userSession: "actionable-with-other-setting-suitability-rule",
    ageBasedHeading: "Routine vaccines for adults aged 25 to 64",
  }, // user 12
  {
    ageGroup: AgeGroup.AGE_65_to_74,
    userSession: "actionable-with-booking-link",
    ageBasedHeading: "Adults aged 65 to 74 should get these routine vaccines",
  }, // user 19
  {
    ageGroup: AgeGroup.AGE_75_to_80,
    userSession: "actionable-with-booking-button",
    ageBasedHeading: "Adults aged 75 to 80 should get these routine vaccines",
  }, // user 21
  {
    ageGroup: AgeGroup.AGE_81_PLUS,
    userSession: "actionable-with-infotext-action",
    ageBasedHeading: "Adults aged 81 and over should get these routine vaccines",
  }, //user 01
];

export const BOOKING_PAGE_URL_REGEX =
  /^https:\/\/.+nhs\.uk\/book-an-rsv-vaccination\/app-start-page\?wt\.mc_id=vita-RSV-booking$/;
export const BOOKING_PAGE_TITLE_REGEX = /Book an RSV vaccination - NHS$/;

export const MAX_AVG_LCP_DURATION_MS = 3000;
