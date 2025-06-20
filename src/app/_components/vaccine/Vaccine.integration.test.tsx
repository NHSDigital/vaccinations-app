import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { VaccineTypes } from "@src/models/vaccine";
import { configProvider } from "@src/utils/config";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";
import { render, screen } from "@testing-library/react";
import { fetchEligibilityContent } from "@src/services/eligibility-api/gateway/fetch-eligibility-content";
import { auth } from "@project/auth";
import { eligibilityApiResponseBuilder } from "@test-data/eligibility-api/builders";

jest.mock("@src/utils/auth/generate-auth-payload", () => jest.fn());
jest.mock("@src/utils/config", () => ({
  configProvider: jest.fn(),
}));
jest.mock(
  "@src/services/eligibility-api/gateway/fetch-eligibility-content",
  () => ({
    fetchEligibilityContent: jest.fn(),
  }),
);
jest.mock("@project/auth", () => ({
  auth: jest.fn(),
}));

describe("Vaccine", () => {
  beforeAll(() => {
    (configProvider as jest.Mock).mockImplementation(() => ({
      CONTENT_CACHE_PATH: "wiremock/__files/",
      PINO_LOG_LEVEL: "info",
    }));
    (fetchEligibilityContent as jest.Mock).mockResolvedValue(
      eligibilityApiResponseBuilder().build(),
    );
    (auth as jest.Mock).mockResolvedValue({
      user: {
        nhs_number: "test_nhs_number",
        birthdate: new Date(),
      },
    });
    mockNHSAppJSFunctions(jest.fn(), jest.fn());
  });

  it.each([VaccineTypes.RSV, VaccineTypes.RSV_PREGNANCY])(
    "has right content from cache for %s",
    async (vaccine: VaccineTypes) => {
      render(await Vaccine({ vaccineType: vaccine }));

      expect(screen.getByTestId("overview-inset-text")).toBeVisible();

      expect(
        screen.getByRole("heading", {
          level: 2,
          name: "More information about the RSV vaccine",
        }),
      ).toBeVisible();

      // details expandable section for RSV but not for RSV in pregnancy
      if (vaccine === VaccineTypes.RSV) {
        expect(
          screen.getByText("How to get the vaccine").parentElement
            ?.parentElement?.parentElement,
        ).toHaveClass("nhsuk-details nhsuk-expander");
      } else {
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
