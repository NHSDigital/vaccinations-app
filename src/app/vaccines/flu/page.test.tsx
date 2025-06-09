import { render, screen } from "@testing-library/react";
import VaccineFlu from "@src/app/vaccines/flu/page";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { mockStyledContent } from "@test-data/content-api/data";
import { VaccineTypes } from "@src/models/vaccine";
import { assertBackLinkIsPresent } from "@test-data/test-helpers-back-link";
import { getEligibilityForPerson } from "@src/services/eligibility-api/gateway/eligibility-reader-service";
import { EligibilityStatus } from "@src/services/eligibility-api/types";
import { mockStyledEligibility } from "@test-data/eligibility-api/data";

jest.mock("@src/services/content-api/gateway/content-reader-service");
jest.mock("@src/services/eligibility-api/gateway/eligibility-reader-service");
jest.mock("@src/app/_components/vaccine/Vaccine");
jest.mock("@src/app/_components/nhs-frontend/BackLink", () =>
  jest.fn(() => <div data-testid="back-link"></div>),
);

describe("Flu vaccine page", () => {
  describe("when content loaded successfully", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: mockStyledContent,
      });
      (getEligibilityForPerson as jest.Mock).mockResolvedValue({
        eligibilityStatus: EligibilityStatus.ELIGIBLE_BOOKABLE,
        styledEligibilityContent: mockStyledEligibility,
      });
      (Vaccine as jest.Mock).mockImplementation(() => <div />);
    });

    it("should contain back link", () => {
      render(VaccineFlu());

      assertBackLinkIsPresent(screen);
    });

    it("should contain vaccine component", () => {
      render(VaccineFlu());

      expect(Vaccine).toHaveBeenCalledWith(
        {
          vaccineType: VaccineTypes.FLU,
        },
        undefined,
      );
    });
  });

  describe("when content fails to load with unnhandled error", () => {
    beforeEach(() => {
      (Vaccine as jest.Mock).mockImplementation(
        () => new Error("mocked error: content load fail"),
      );
    });

    it("should display error page", () => {
      render(VaccineFlu());

      const fluHeading = screen.getByRole("heading", {
        level: 1,
        name: `Flu vaccine`,
      });

      const errorHeading: HTMLElement = screen.getByRole("heading", {
        level: 2,
        name: "Vaccine content is unavailable",
      });

      expect(fluHeading).toBeInTheDocument();
      expect(errorHeading).toBeInTheDocument();
    });
  });
});
