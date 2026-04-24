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
      subCategory4: string;
    };
  };
};

type PageCategory = {
  pageName: string;
  primaryCategory: string;
  subCategory1: string;
  subCategory2: string;
  subCategory3: string;
  subCategory4: string;
};

export const PAGE_DIGITAL_DATA: Record<string, PageCategory> = {
  "/check-and-book-vaccinations": {
    pageName: "nhs:vds:check-and-book-vaccinations", // page name
    primaryCategory: "primary-cat-vaccinations", // site section
    subCategory1: "hub", // prop1
    subCategory2: "subCategory2", // prop2
    subCategory3: "subCategory3", // prop3
    subCategory4: "subCategory4",
  },
  "/vaccines-for-all-ages": {
    pageName: "nhs:vds:vaccines-for-all-ages",
    primaryCategory: "primary-cat-vaccinations",
    subCategory1: "vaccines-for-all-ages",
    subCategory2: "1",
    subCategory3: "2",
    subCategory4: "subCategory4",
  },
  "/vaccines-during-pregnancy": {
    pageName: "nhs:vds:vaccines-during-pregnancy",
    primaryCategory: "primary-cat-vaccinations",

    subCategory1: "vaccines-during-pregnancy",
    subCategory2: "",
    subCategory3: "",
    subCategory4: "",
  },
  "/our-policies/accessibility": {
    pageName: "nhs:vds:our-policies:accessibility",
    primaryCategory: "primary-cat-policies",
    subCategory1: "accessibility",
    subCategory2: "",
    subCategory3: "",
    subCategory4: "",
  },
  "/our-policies/cookies-policy": {
    pageName: "nhs:vds:our-policies:cookies-policy",
    primaryCategory: "primary-cat-policies",
    subCategory1: "cookies-policy",
    subCategory2: "",
    subCategory3: "",
    subCategory4: "",
  },
  "/service-failure": {
    pageName: "nhs:vds:service-failure",
    primaryCategory: "primary-cat-error",
    subCategory1: "service-failure",
    subCategory2: "",
    subCategory3: "",
    subCategory4: "",
  },
  "/sso-failure": {
    pageName: "nhs:vds:sso-failure",
    primaryCategory: "primary-cat-error",
    subCategory1: "sso-failure",
    subCategory2: "",
    subCategory3: "",
    subCategory4: "",
  },
  "/session-logout": {
    pageName: "nhs:vds:session:logout",
    primaryCategory: "primary-cat-session",
    subCategory1: "logout",
    subCategory2: "",
    subCategory3: "",
    subCategory4: "",
  },
  "/session-timeout": {
    pageName: "nhs:vds:session:timeout",
    primaryCategory: "primary-cat-session",
    subCategory1: "timeout",
    subCategory2: "",
    subCategory3: "",
    subCategory4: "",
  },
};

const DEFAULT_PAGE_CATEGORY: PageCategory = {
  pageName: "nhs:vds:unknown",
  primaryCategory: "primary-cat-unknown",
  subCategory1: "",
  subCategory2: "",
  subCategory3: "",
  subCategory4: "",
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
      pageName: `nhs:vds:vaccines:${vaccine}`,
      primaryCategory: `${vaccine}`,
      subCategory1: "subCategory1-val",
      subCategory2: "subCategory2-val",
      subCategory3: "",
      subCategory4: "",
    };
  }

  return DEFAULT_PAGE_CATEGORY;
};

export const buildDigitalData = (pathname: string): DigitalData => {
  const { pageName, primaryCategory, subCategory1, subCategory2, subCategory3, subCategory4 } =
    resolvePageCategory(pathname);

  return {
    page: {
      pageInfo: { pageName },
      category: { primaryCategory, subCategory1, subCategory2, subCategory3, subCategory4 },
    },
  };
};
