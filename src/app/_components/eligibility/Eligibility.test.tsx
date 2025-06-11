import { getEligibilityForPerson } from "@src/services/eligibility-api/gateway/eligibility-filter-service";
import { EligibilityStatus } from "@src/services/eligibility-api/types";
import { mockEligibilityContent } from "@test-data/eligibility-api/data";
import { render, screen } from "@testing-library/react";
import { Eligibility } from "@src/app/_components/eligibility/Eligibility";
import { VaccineTypes } from "@src/models/vaccine";

jest.mock("@src/services/eligibility-api/gateway/eligibility-filter-service");

describe("Eligibility", () => {
  describe("when eligible", () => {
    beforeEach(() => {
      (getEligibilityForPerson as jest.Mock).mockResolvedValue({
        eligibilityStatus: EligibilityStatus.ELIGIBLE_BOOKABLE,
        eligibilityContent: mockEligibilityContent,
      });
    });

    it("should not show the care card", async () => {
      render(await Eligibility({ vaccineType: VaccineTypes.RSV }));

      const careCard = screen.queryByTestId("non-urgent-care-card");
      expect(careCard).toBeNull();
    });
  });

  describe("when not eligible", () => {
    beforeEach(() => {
      (getEligibilityForPerson as jest.Mock).mockResolvedValue({
        eligibilityStatus: EligibilityStatus.NOT_ELIGIBLE,
        eligibilityContent: mockEligibilityContent,
      });
    });

    it("should show the care card", async () => {
      render(await Eligibility({ vaccineType: VaccineTypes.RSV }));

      const careCard = screen.getByTestId("non-urgent-care-card");
      expect(careCard).toBeInTheDocument();
    });
  });
});
