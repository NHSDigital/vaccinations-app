import { render, screen } from "@testing-library/react";
import VaccineRsv from "@src/app/vaccines/rsv/page";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { mockStyledContent } from "@test-data/content-api/data";
import { getEligibilityForPerson } from "@src/services/eligibility-api/gateway/eligibility-reader-service";
import { mockStyledEligibility } from "@test-data/eligibility-api/data";
import { VaccineTypes } from "@src/models/vaccine";
import { assertBackLinkIsPresent } from "@test-data/test-helpers-back-link";
import { EligibilityStatus } from "@src/services/eligibility-api/types";

jest.mock("@src/services/content-api/gateway/content-reader-service");
jest.mock("@src/services/eligibility-api/gateway/eligibility-reader-service");
jest.mock("@src/app/_components/vaccine/Vaccine", () => jest.fn(() => <div />));
jest.mock("@src/app/_components/nhs-frontend/BackLink", () =>
  jest.fn(() => <div data-testid="back-link"></div>),
);

describe("RSV vaccine page", () => {
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

    it("should contain back link to vaccination schedule page", () => {
      render(VaccineRsv());

      assertBackLinkIsPresent(screen);
    });

    it("should contain vaccine component", () => {
      render(VaccineRsv());

      expect(Vaccine).toHaveBeenCalledWith(
        {
          vaccineType: VaccineTypes.RSV,
        },
        undefined,
      );
    });
  });

  describe("when content fails to load with unhandled error", () => {
    beforeEach(() => {
      (Vaccine as jest.Mock).mockImplementation(
        () => new Error("mocked error: content load fail"),
      );
    });

    it("should display error page", () => {
      render(VaccineRsv());

      const rsvHeading = screen.getByRole("heading", {
        level: 1,
        name: `RSV vaccine`,
      });

      const errorHeading: HTMLElement = screen.getByRole("heading", {
        level: 2,
        name: "Vaccine content is unavailable",
      });

      expect(rsvHeading).toBeInTheDocument();
      expect(errorHeading).toBeInTheDocument();
    });
  });
});
