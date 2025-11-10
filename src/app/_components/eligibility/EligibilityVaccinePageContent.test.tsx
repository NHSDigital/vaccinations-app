import { HowToGetVaccineFallback } from "@src/app/_components/content/HowToGetVaccineFallback";
import { EligibilityVaccinePageContent } from "@src/app/_components/eligibility/EligibilityVaccinePageContent";
import { RSVEligibilityFallback } from "@src/app/_components/eligibility/RSVEligibilityFallback";
import { VaccineTypes } from "@src/models/vaccine";
import { EligibilityErrorTypes, EligibilityStatus } from "@src/services/eligibility-api/types";
import { mockStyledContent } from "@test-data/content-api/data";
import { eligibilityContentBuilder } from "@test-data/eligibility-api/builders";
import { render, screen } from "@testing-library/react";
import React from "react";

jest.mock("@src/app/_components/eligibility/Eligibility", () => ({
  Eligibility: () => <div>Test Eligibility Component</div>,
}));
jest.mock("@src/app/_components/eligibility/RSVEligibilityFallback", () => ({
  RSVEligibilityFallback: jest.fn().mockImplementation(() => <div data-testid="elid-fallback-mock">EliD fallback</div>),
}));

const eligibilityForPerson = {
  eligibility: {
    status: EligibilityStatus.NOT_ELIGIBLE,
    content: eligibilityContentBuilder().build(),
  },
  eligibilityError: undefined,
};

const eligibilityUnavailable = {
  eligibility: undefined,
  eligibilityError: EligibilityErrorTypes.ELIGIBILITY_LOADING_ERROR,
};
const howToGetContent = <div>How Section styled component</div>;
const howToGetContentFallback = <HowToGetVaccineFallback vaccineType={VaccineTypes.RSV} />;

describe("EligibilityVaccinePageContent", () => {
  describe("when eligibility data available", () => {
    it("should display the eligibility on RSV vaccine page", async () => {
      render(
        <EligibilityVaccinePageContent
          vaccineType={VaccineTypes.RSV}
          eligibilityForPerson={eligibilityForPerson}
          howToGetVaccineOrFallback={howToGetContent}
        />,
      );

      const eligibilitySection: HTMLElement = screen.getByText("Test Eligibility Component");
      expect(eligibilitySection).toBeInTheDocument();
    });
  });

  describe("when eligibility data not available", () => {
    it("should display fallback RSV eligibility component using howToGet text from content-api when eligibility API has failed", async () => {
      const vaccineType = VaccineTypes.RSV;

      render(
        <EligibilityVaccinePageContent
          vaccineType={VaccineTypes.RSV}
          eligibilityForPerson={eligibilityUnavailable}
          howToGetVaccineOrFallback={howToGetContent}
        />,
      );

      const rsvEligibilityFallback: HTMLElement = screen.getByTestId("elid-fallback-mock");
      expect(rsvEligibilityFallback).toBeVisible();

      expect(RSVEligibilityFallback).toHaveBeenCalledWith(
        {
          howToGetVaccineFallback: mockStyledContent.howToGetVaccine.component,
          vaccineType,
        },
        undefined,
      );
    });
  });

  describe("when eligibility data available but content service fallback", () => {
    it("should still render eligibility section of vaccine page", async () => {
      render(
        <EligibilityVaccinePageContent
          vaccineType={VaccineTypes.RSV}
          eligibilityForPerson={eligibilityForPerson}
          howToGetVaccineOrFallback={howToGetContentFallback}
        />,
      );

      const eligibilitySection: HTMLElement = screen.getByText("Test Eligibility Component");
      expect(eligibilitySection).toBeInTheDocument();
    });
  });

  describe("when eligibility AND content not available", () => {
    it("should use fallback how-to-get text when rendering eligibility fallback component", async () => {
      const vaccineType = VaccineTypes.RSV;

      render(
        <EligibilityVaccinePageContent
          vaccineType={VaccineTypes.RSV}
          eligibilityForPerson={eligibilityUnavailable}
          howToGetVaccineOrFallback={howToGetContentFallback}
        />,
      );

      const rsvEligibilityFallback: HTMLElement = screen.getByTestId("elid-fallback-mock");
      expect(rsvEligibilityFallback).toBeVisible();

      expect(RSVEligibilityFallback).toHaveBeenCalledWith(
        {
          howToGetVaccineFallback: <HowToGetVaccineFallback vaccineType={vaccineType} />,
          vaccineType,
        },
        undefined,
      );
    });
  });
});
