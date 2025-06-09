import { render, screen } from "@testing-library/react";
import Vaccine6in1 from "@src/app/vaccines/6-in-1/page";
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
jest.mock("@src/app/_components/vaccine/Vaccine", () => jest.fn(() => <div />));
jest.mock("@src/app/_components/nhs-frontend/BackLink", () =>
  jest.fn(() => <div data-testid="back-link"></div>),
);

describe("6-in-1 vaccine page", () => {
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
      render(Vaccine6in1());

      assertBackLinkIsPresent(screen);
    });

    it("should contain vaccine component", () => {
      render(Vaccine6in1());

      expect(Vaccine).toHaveBeenCalledWith(
        {
          vaccineType: VaccineTypes.SIX_IN_ONE,
        },
        undefined,
      );
    });
  });

  describe("when content fails to load with unhandled error", () => {
    beforeEach(() => {
      (Vaccine as jest.Mock).mockImplementation(() => {
        throw new Error("mocked error: content load fail");
      });
    });

    it("should display error page", () => {
      render(Vaccine6in1());

      const sixInOneHeading = screen.getByRole("heading", {
        level: 1,
        name: `6-in-1 vaccine`,
      });

      const errorHeading: HTMLElement = screen.getByRole("heading", {
        level: 2,
        name: "Vaccine content is unavailable",
      });

      expect(sixInOneHeading).toBeInTheDocument();
      expect(errorHeading).toBeInTheDocument();
    });
  });
});
