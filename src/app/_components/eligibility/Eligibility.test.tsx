import { Eligibility } from "@src/app/_components/eligibility/Eligibility";
import { VaccineTypes } from "@src/models/vaccine";
import { ActionType, Cohort, Heading, Introduction } from "@src/services/eligibility-api/types";
import { actionBuilder, eligibilityContentBuilder, summaryContentBuilder } from "@test-data/eligibility-api/builders";
import { render, screen } from "@testing-library/react";
import React from "react";

// TODO: Remove after final solution for testing with react-markdown
jest.mock("react-markdown", () => {
  return function MockMarkdown({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
  };
});
jest.mock("@src/app/_components/nbs/NBSBookingAction", () => ({
  NBSBookingActionForVaccine: () => <a href="https://nbs-test-link">NBS Booking Link Test</a>,
}));

describe("Eligibility", () => {
  describe("when eligible", () => {
    it("should show the care card if content summary is present", async () => {
      render(
        Eligibility({
          eligibilityContent: eligibilityContentBuilder().build(),
          vaccineTypes: VaccineTypes.RSV,
        }),
      );

      const careCard: HTMLElement | null = screen.queryByTestId("non-urgent-care-card");
      expect(careCard).toBeInTheDocument();
    });

    it("should not show the care card if content summary is undefined", async () => {
      render(
        Eligibility({
          eligibilityContent: eligibilityContentBuilder().withSummary(undefined).build(),
          vaccineTypes: VaccineTypes.RSV,
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
          eligibilityContent: eligibilityContentBuilder().build(),
          vaccineTypes: VaccineTypes.RSV,
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
          eligibilityContent: eligibilityContent,
          vaccineTypes: VaccineTypes.RSV,
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
          eligibilityContent: eligibilityContent,
          vaccineTypes: VaccineTypes.RSV,
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
          eligibilityContent: eligibilityContent,
          vaccineTypes: VaccineTypes.RSV,
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
          eligibilityContent: eligibilityContentBuilder().withSummary(undefined).build(),
          vaccineTypes: VaccineTypes.RSV,
        }),
      );

      const careCard: HTMLElement | null = screen.queryByTestId("non-urgent-care-card");
      expect(careCard).not.toBeInTheDocument();
    });
  });

  describe("when actions are present", () => {
    describe("paragraph", () => {
      it("should display paragraph content successfully", () => {
        render(
          Eligibility({
            eligibilityContent: eligibilityContentBuilder()
              .withActions([actionBuilder().withType(ActionType.paragraph).andContent("Test Content").build()])
              .build(),
            vaccineTypes: VaccineTypes.RSV,
          }),
        );

        const content: HTMLElement = screen.getByText("Test Content");

        expect(content).toBeVisible();
      });

      it("should display multiple paragraphs successfully", () => {
        render(
          Eligibility({
            eligibilityContent: eligibilityContentBuilder()
              .withActions([
                actionBuilder().withType(ActionType.paragraph).andContent("Test Content 1").build(),
                actionBuilder().withType(ActionType.paragraph).andContent("Test Content 2").build(),
              ])
              .build(),
            vaccineTypes: VaccineTypes.RSV,
          }),
        );

        const content1: HTMLElement = screen.getByText("Test Content 1");
        const content2: HTMLElement = screen.getByText("Test Content 2");

        expect(content1).toBeVisible();
        expect(content2).toBeVisible();
      });
    });

    describe("card", () => {
      it("should display paragraph content successfully", () => {
        render(
          Eligibility({
            eligibilityContent: eligibilityContentBuilder()
              .withActions([actionBuilder().withType(ActionType.card).andContent("Test Content").build()])
              .build(),
            vaccineTypes: VaccineTypes.RSV,
          }),
        );

        const content: HTMLElement = screen.getByText("Test Content");

        expect(content).toBeVisible();
      });

      it("should display multiple paragraphs successfully", () => {
        render(
          Eligibility({
            eligibilityContent: eligibilityContentBuilder()
              .withActions([
                actionBuilder().withType(ActionType.card).andContent("Test Content 1").build(),
                actionBuilder().withType(ActionType.card).andContent("Test Content 2").build(),
              ])
              .build(),
            vaccineTypes: VaccineTypes.RSV,
          }),
        );

        const content1: HTMLElement = screen.getByText("Test Content 1");
        const content2: HTMLElement = screen.getByText("Test Content 2");

        expect(content1).toBeVisible();
        expect(content2).toBeVisible();
      });
    });

    describe("button", () => {
      it("should display button content successfully", () => {
        render(
          Eligibility({
            eligibilityContent: eligibilityContentBuilder()
              .withActions([actionBuilder().withType(ActionType.authButton).andContent("Test Content").build()])
              .build(),
            vaccineTypes: VaccineTypes.RSV,
          }),
        );

        const content: HTMLElement = screen.getByText("Test Content");
        const bookingButton: HTMLElement = screen.getByText("NBS Booking Link Test");

        expect(content).toBeVisible();
        expect(bookingButton).toBeInTheDocument();
      });

      it("should display multiple button content components successfully", () => {
        render(
          Eligibility({
            eligibilityContent: eligibilityContentBuilder()
              .withActions([
                actionBuilder().withType(ActionType.authButton).andContent("Test Content 1").build(),
                actionBuilder().withType(ActionType.authButton).andContent("Test Content 2").build(),
              ])
              .build(),
            vaccineTypes: VaccineTypes.RSV,
          }),
        );

        const content1: HTMLElement = screen.getByText("Test Content 1");
        const content2: HTMLElement = screen.getByText("Test Content 2");

        expect(content1).toBeVisible();
        expect(content2).toBeVisible();
      });
    });
  });
});
