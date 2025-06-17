import { EligibilityStatus } from "@src/services/eligibility-api/types";
import { mockEligibilityContent } from "@test-data/eligibility-api/data";
import { render, screen } from "@testing-library/react";
import { Eligibility } from "@src/app/_components/eligibility/Eligibility";

describe("Eligibility", () => {
  describe("when eligible", () => {
    it("should not show the care card", async () => {
      render(
        Eligibility({
          eligibilityStatus: EligibilityStatus.ELIGIBLE_BOOKABLE,
          eligibilityContent: mockEligibilityContent,
        }),
      );

      const careCard: HTMLElement | null = screen.queryByRole("section", {
        name: "eligibility",
      });
      expect(careCard).not.toBeInTheDocument();
    });
  });

  describe("when not eligible", () => {
    it("should show the care card", async () => {
      render(
        Eligibility({
          eligibilityStatus: EligibilityStatus.NOT_ELIGIBLE,
          eligibilityContent: mockEligibilityContent,
        }),
      );

      const careCard: HTMLElement = screen.getByTestId("non-urgent-care-card");
      expect(careCard).toBeInTheDocument();
    });

    it("should show heading text in the care card heading", async () => {
      const expectedHeading: string = mockEligibilityContent.status.heading;
      render(
        Eligibility({
          eligibilityStatus: EligibilityStatus.NOT_ELIGIBLE,
          eligibilityContent: mockEligibilityContent,
        }),
      );

      const heading: HTMLElement = screen.getByText(expectedHeading);
      expect(heading).toBeInTheDocument();
    });

    it("should show introduction in the care card body", async () => {
      const expectedIntroduction = mockEligibilityContent.status.introduction;
      render(
        Eligibility({
          eligibilityStatus: EligibilityStatus.NOT_ELIGIBLE,
          eligibilityContent: mockEligibilityContent,
        }),
      );

      const introduction: HTMLElement = screen.getByText(expectedIntroduction);
      expect(introduction).toBeInTheDocument();
    });

    it("should show bullet points in the care card body", async () => {
      const expectedPoints: string[] = mockEligibilityContent.status.points;
      render(
        Eligibility({
          eligibilityStatus: EligibilityStatus.NOT_ELIGIBLE,
          eligibilityContent: mockEligibilityContent,
        }),
      );

      expectedPoints.forEach((expectedPoint) => {
        const bulletPoint: HTMLElement = screen.getByText(expectedPoint);
        expect(bulletPoint).toBeInTheDocument();
      });
    });
  });
});
