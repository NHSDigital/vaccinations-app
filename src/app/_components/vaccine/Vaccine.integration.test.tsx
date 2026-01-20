import { auth } from "@project/auth";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { VaccineType } from "@src/models/vaccine";
import { fetchEligibilityContent } from "@src/services/eligibility-api/gateway/fetch-eligibility-content";
import config from "@src/utils/config";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";
import { ConfigMock, configBuilder } from "@test-data/config/builders";
import { eligibilityApiResponseBuilder } from "@test-data/eligibility-api/builders";
import { render, screen } from "@testing-library/react";

jest.mock("@src/utils/auth/generate-auth-payload", () => jest.fn());
jest.mock("@src/services/eligibility-api/gateway/fetch-eligibility-content", () => ({
  fetchEligibilityContent: jest.fn(),
}));
// TODO: Remove after final solution for testing with react-markdown
jest.mock("react-markdown", () => {
  return function MockMarkdown({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
  };
});
jest.mock("@project/auth", () => ({
  auth: jest.fn(),
}));
jest.mock("next/headers", () => ({
  headers: jest.fn(),
  cookies: jest.fn(),
}));
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("cheerio", () => ({
  load: jest.fn(() => {
    const selectorImpl = jest.fn(() => ({
      attr: jest.fn(),
    }));

    const $ = Object.assign(selectorImpl, {
      html: jest.fn(() => "<p>HTML fragment</p>"),
    });

    return $;
  }),
}));

const nhsNumber = "5123456789";

describe("Vaccine", () => {
  const mockedConfig = config as ConfigMock;

  beforeAll(() => {
    const defaultConfig = configBuilder().withContentCachePath("wiremock/__files/").withPinoLogLevel("info").build();
    Object.assign(mockedConfig, defaultConfig);
    (fetchEligibilityContent as jest.Mock).mockResolvedValue(eligibilityApiResponseBuilder().build());
    mockNHSAppJSFunctions(jest.fn(), jest.fn());
    (auth as jest.Mock).mockResolvedValue({
      user: {
        nhs_number: nhsNumber,
      },
    });
  });

  it.each([VaccineType.RSV, VaccineType.RSV_PREGNANCY])(
    "has right content from cache for %s",
    async (vaccine: VaccineType) => {
      render(await Vaccine({ vaccineType: vaccine }));

      expect(
        screen.getByRole("heading", {
          level: 2,
          name: "More information about the RSV vaccine",
        }),
      ).toBeVisible();

      // details non expandable section for RSV in pregnancy
      if (vaccine === VaccineType.RSV_PREGNANCY) {
        expect(
          screen.getByRole("heading", {
            level: 3,
            name: "How to get the vaccine",
          }),
        ).toBeVisible();
      }
    },
  );
});
