import { EligibilityStatus } from "@src/services/eligibility-api/types";
import { render, screen } from "@testing-library/react";
import { Eligibility } from "@src/app/_components/eligibility/Eligibility";
import { eligibilityContentBuilder } from "@test-data/eligibility-api/builders";

describe("Eligibility", () => {
  describe("when eligible", () => {
    it("should show the care card", async () => {
      render(
        Eligibility({
          eligibilityStatus: EligibilityStatus.ELIGIBLE_BOOKABLE,
          eligibilityContent: eligibilityContentBuilder().build(),
        }),
      );

      const careCard: HTMLElement | null = screen.queryByTestId(
        "non-urgent-care-card",
      );
      expect(careCard).toBeInTheDocument();
    });
  });

  describe("when not eligible", () => {
    it("should show the care card", async () => {
      render(
        Eligibility({
          eligibilityStatus: EligibilityStatus.NOT_ELIGIBLE,
          eligibilityContent: eligibilityContentBuilder().build(),
        }),
      );

      const careCard: HTMLElement = screen.getByTestId("non-urgent-care-card");
      expect(careCard).toBeInTheDocument();
    });

    it("should show heading text in the care card heading", async () => {
      const eligibilityContent = eligibilityContentBuilder().build();
      const expectedHeading: string = eligibilityContent.status.heading;
      render(
        Eligibility({
          eligibilityStatus: EligibilityStatus.NOT_ELIGIBLE,
          eligibilityContent: eligibilityContent,
        }),
      );

      const heading: HTMLElement = screen.getByText(expectedHeading);
      expect(heading).toBeInTheDocument();
    });

    it("should show introduction in the care card body", async () => {
      const eligibilityContent = eligibilityContentBuilder().build();
      const expectedIntroduction = eligibilityContent.status.introduction;
      render(
        Eligibility({
          eligibilityStatus: EligibilityStatus.NOT_ELIGIBLE,
          eligibilityContent: eligibilityContent,
        }),
      );

      const introduction: HTMLElement = screen.getByText(expectedIntroduction);
      expect(introduction).toBeInTheDocument();
    });

    it("should show bullet points in the care card body", async () => {
      const eligibilityContent = eligibilityContentBuilder().build();
      const expectedPoints: string[] = eligibilityContent.status.points;
      render(
        Eligibility({
          eligibilityStatus: EligibilityStatus.NOT_ELIGIBLE,
          eligibilityContent: eligibilityContent,
        }),
      );

      expectedPoints.forEach((expectedPoint) => {
        const bulletPoint: HTMLElement = screen.getByText(expectedPoint);
        expect(bulletPoint).toBeInTheDocument();
      });
    });
  });
});
