import { getEligibilityForPerson } from "@src/services/eligibility-api/gateway/eligibility-filter-service";
import { EligibilityStatus } from "@src/services/eligibility-api/types";
import { mockEligibilityContent } from "@test-data/eligibility-api/data";
import { render, screen } from "@testing-library/react";
import { Eligibility } from "@src/app/_components/eligibility/Eligibility";
import { VaccineTypes } from "@src/models/vaccine";

jest.mock(
  "@src/services/eligibility-api/gateway/eligibility-filter-service",
  () => ({
    getEligibilityForPerson: jest.fn(),
  }),
);

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
      expect(careCard).not.toBeInTheDocument();
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

    it("should show heading text in the care card heading", async () => {
      const expectedHeading = mockEligibilityContent.status.heading;
      render(await Eligibility({ vaccineType: VaccineTypes.RSV }));

      const heading = screen.getByText(expectedHeading);
      expect(heading).toBeInTheDocument();
    });

    it("should show introduction in the care card body", async () => {
      const expectedIntroduction = mockEligibilityContent.status.introduction;
      render(await Eligibility({ vaccineType: VaccineTypes.RSV }));

      const introduction = screen.getByText(expectedIntroduction);
      expect(introduction).toBeInTheDocument();
    });

    it("should show points in the care card body", async () => {
      const expectedPoints = mockEligibilityContent.status.points;
      render(await Eligibility({ vaccineType: VaccineTypes.RSV }));

      expectedPoints.forEach((expectedPoint) => {
        const point = screen.getByText(expectedPoint);
        expect(point).toBeInTheDocument();
      });
    });
  });
});
