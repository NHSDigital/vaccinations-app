import { auth } from "@project/auth";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { VaccineTypes } from "@src/models/vaccine";
import { fetchEligibilityContent } from "@src/services/eligibility-api/gateway/fetch-eligibility-content";
import { configProvider } from "@src/utils/config";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";
import { eligibilityApiResponseBuilder } from "@test-data/eligibility-api/builders";
import { render, screen } from "@testing-library/react";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { headers } from "next/headers";

jest.mock("@src/utils/auth/generate-auth-payload", () => jest.fn());
jest.mock("@src/utils/config", () => ({
  configProvider: jest.fn(),
}));
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

const nhsNumber = "5123456789";

describe("Vaccine", () => {
  beforeAll(() => {
    (configProvider as jest.Mock).mockImplementation(() => ({
      CONTENT_CACHE_PATH: "wiremock/__files/",
      PINO_LOG_LEVEL: "info",
    }));
    (fetchEligibilityContent as jest.Mock).mockResolvedValue(eligibilityApiResponseBuilder().build());
    mockNHSAppJSFunctions(jest.fn(), jest.fn());
    (auth as jest.Mock).mockResolvedValue({
      user: {
        nhs_number: nhsNumber,
      },
    });
    const fakeHeaders: ReadonlyHeaders = {
      get(name: string): string | null {
        return `fake-${name}-header`;
      },
    } as ReadonlyHeaders;
    (headers as jest.Mock).mockResolvedValue(fakeHeaders);
  });

  it.each([VaccineTypes.RSV, VaccineTypes.RSV_PREGNANCY])(
    "has right content from cache for %s",
    async (vaccine: VaccineTypes) => {
      render(await Vaccine({ vaccineType: vaccine }));

      expect(
        screen.getByRole("heading", {
          level: 2,
          name: "More information about the RSV vaccine",
        }),
      ).toBeVisible();

      // details non expandable section for RSV in pregnancy
      if (vaccine === VaccineTypes.RSV_PREGNANCY) {
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
