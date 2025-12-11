import { Eligibility } from "@src/app/_components/eligibility/Eligibility";
import { VaccineType } from "@src/models/vaccine";
import { Cohort, Heading, Introduction } from "@src/services/eligibility-api/types";
import { eligibilityContentBuilder, summaryContentBuilder } from "@test-data/eligibility-api/builders";
import { render, screen } from "@testing-library/react";
import React from "react";

jest.mock("@src/app/_components/eligibility/EligibilityActions", () => ({
  EligibilityActions: () => <div>Test Eligibility Actions Component</div>,
}));
jest.mock("@src/app/_components/eligibility/SuitabilityRules", () => ({
  SuitabilityRules: () => <div>Test Eligibility SuitabilityRules Component</div>,
}));

describe("Eligibility", () => {
  describe("when eligible", () => {
    it("should show the care card if content summary is present", async () => {
      render(
        Eligibility({
          vaccineType: VaccineType.RSV,
          eligibilityContent: eligibilityContentBuilder().build(),
        }),
      );

      const careCard: HTMLElement = screen.getByTestId("non-urgent-care-card");
      expect(careCard).toBeInTheDocument();
    });

    it("should not show the care card if content summary is undefined", async () => {
      render(
        Eligibility({
          vaccineType: VaccineType.RSV,
          eligibilityContent: eligibilityContentBuilder().withSummary(undefined).build(),
        }),
      );

      const careCard: HTMLElement | null = screen.queryByTestId("non-urgent-care-card");
      expect(careCard).not.toBeInTheDocument();
    });
  });

  describe("when not eligible", () => {
    it("should show the care card", async () => {
      render(
        Eligibility({
          vaccineType: VaccineType.RSV,
          eligibilityContent: eligibilityContentBuilder().build(),
        }),
      );

      const careCard: HTMLElement = screen.getByTestId("non-urgent-care-card");
      expect(careCard).toBeInTheDocument();
    });

    it("should show heading text in the care card heading", async () => {
      const testHeading = "test" as Heading;
      const eligibilityContent = eligibilityContentBuilder()
        .withSummary(summaryContentBuilder().withHeading(testHeading).build())
        .build();

      render(
        Eligibility({
          vaccineType: VaccineType.RSV,
          eligibilityContent: eligibilityContent,
        }),
      );

      const heading: HTMLElement = screen.getByText(testHeading);
      expect(heading).toBeInTheDocument();
    });

    it("should show introduction in the care card body", async () => {
      const testIntroduction = "test-introduction" as Introduction;
      const eligibilityContent = eligibilityContentBuilder()
        .withSummary(summaryContentBuilder().withIntroduction(testIntroduction).build())
        .build();

      render(
        Eligibility({
          vaccineType: VaccineType.RSV,
          eligibilityContent: eligibilityContent,
        }),
      );

      const introduction: HTMLElement = screen.getByText(testIntroduction);
      expect(introduction).toBeInTheDocument();
    });

    it("should show cohorts as bullet points in the care card body", async () => {
      const cohorts = ["test-cohort", "test-cohort-2"] as Cohort[];
      const eligibilityContent = eligibilityContentBuilder()
        .withSummary(summaryContentBuilder().withCohorts(cohorts).build())
        .build();

      render(
        Eligibility({
          vaccineType: VaccineType.RSV,
          eligibilityContent: eligibilityContent,
        }),
      );

      cohorts.forEach((cohort) => {
        const bulletPoint: HTMLElement = screen.getByText(cohort);
        expect(bulletPoint).toBeInTheDocument();
        expect(bulletPoint.tagName).toBe("LI");
      });
    });

    it("should not show the care card if summary is undefined", async () => {
      render(
        Eligibility({
          vaccineType: VaccineType.RSV,
          eligibilityContent: eligibilityContentBuilder().withSummary(undefined).build(),
        }),
      );

      const careCard: HTMLElement | null = screen.queryByTestId("non-urgent-care-card");
      expect(careCard).not.toBeInTheDocument();
    });

    it("should display EligibilityActions component", () => {
      render(
        Eligibility({
          vaccineType: VaccineType.RSV,
          eligibilityContent: eligibilityContentBuilder().build(),
        }),
      );
      const actions: HTMLElement = screen.getByText("Test Eligibility Actions Component");

      expect(actions).toBeVisible();
    });

    it("should display SuitabilityRules component", () => {
      render(
        Eligibility({
          vaccineType: VaccineType.RSV,
          eligibilityContent: eligibilityContentBuilder().build(),
        }),
      );
      const actions = screen.getByText("Test Eligibility SuitabilityRules Component");

      expect(actions).toBeVisible();
    });
  });
});
