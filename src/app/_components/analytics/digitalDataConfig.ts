type DigitalData = {
  page: {
    pageInfo: {
      pageName: string;
    };
    category: {
      primaryCategory: string;
      subCategory1: string;
      subCategory2: string;
      subCategory3: string;
    };
  };
};

type PageCategory = {
  pageName: string;
  primaryCategory: string;
  subCategory1: string;
  subCategory2: string;
  subCategory3: string;
};

export const PAGE_DIGITAL_DATA: Record<string, PageCategory> = {
  "/check-and-book-vaccinations": {
    pageName: "nhs:vds:home",
    primaryCategory: "vaccinations",
    subCategory1: "hub",
    subCategory2: "",
    subCategory3: "",
  },
  "/vaccines-for-all-ages": {
    pageName: "nhs:vds:vaccines-for-all-ages",
    primaryCategory: "vaccinations",
    subCategory1: "vaccines-for-all-ages",
    subCategory2: "",
    subCategory3: "",
  },
  "/vaccines-during-pregnancy": {
    pageName: "nhs:vds:vaccines-during-pregnancy",
    primaryCategory: "vaccinations",
    subCategory1: "vaccines-during-pregnancy",
    subCategory2: "",
    subCategory3: "",
  },
  "/our-policies/accessibility": {
    pageName: "nhs:vds:our-policies:accessibility",
    primaryCategory: "policies",
    subCategory1: "accessibility",
    subCategory2: "",
    subCategory3: "",
  },
  "/our-policies/cookies-policy": {
    pageName: "nhs:vds:our-policies:cookies-policy",
    primaryCategory: "policies",
    subCategory1: "cookies-policy",
    subCategory2: "",
    subCategory3: "",
  },
  "/service-failure": {
    pageName: "nhs:vds:service-failure",
    primaryCategory: "error",
    subCategory1: "service-failure",
    subCategory2: "",
    subCategory3: "",
  },
  "/sso-failure": {
    pageName: "nhs:vds:sso-failure",
    primaryCategory: "error",
    subCategory1: "sso-failure",
    subCategory2: "",
    subCategory3: "",
  },
  "/session-logout": {
    pageName: "nhs:vds:session:logout",
    primaryCategory: "session",
    subCategory1: "logout",
    subCategory2: "",
    subCategory3: "",
  },
  "/session-timeout": {
    pageName: "nhs:vds:session:timeout",
    primaryCategory: "session",
    subCategory1: "timeout",
    subCategory2: "",
    subCategory3: "",
  },
};

const DEFAULT_PAGE_CATEGORY: PageCategory = {
  pageName: "nhs:vds:unknown",
  primaryCategory: "unknown",
  subCategory1: "",
  subCategory2: "",
  subCategory3: "",
};

const resolvePageCategory = (pathname: string): PageCategory => {
  if (PAGE_DIGITAL_DATA[pathname]) {
    return PAGE_DIGITAL_DATA[pathname];
  }

  // Handle dynamic routes e.g. /vaccines/flu-vaccine
  const vaccineMatch = pathname.match(/^\/vaccines\/([^/]+)$/);
  if (vaccineMatch) {
    const vaccine = vaccineMatch[1];
    return {
      pageName: `nhs:vds:vaccinations:vaccine:${vaccine}`,
      primaryCategory: "vaccinations",
      subCategory1: "vaccine",
      subCategory2: vaccine,
      subCategory3: "",
    };
  }

  return DEFAULT_PAGE_CATEGORY;
};

export const buildDigitalData = (pathname: string): DigitalData => {
  const { pageName, primaryCategory, subCategory1, subCategory2, subCategory3 } = resolvePageCategory(pathname);

  return {
    page: {
      pageInfo: { pageName },
      category: { primaryCategory, subCategory1, subCategory2, subCategory3 },
    },
  };
};
