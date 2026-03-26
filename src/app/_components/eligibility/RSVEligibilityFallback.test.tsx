import { RSVEligibilityFallback } from "@src/app/_components/eligibility/RSVEligibilityFallback";
import { VaccineType } from "@src/models/vaccine";
import { render, screen, within } from "@testing-library/react";

describe("RSVEligibilityFallback", () => {
  const vaccineType = VaccineType.RSV;
  const howToGetVaccineFallback = <div>How Section styled component</div>;

  it("should display fallback care card", async () => {
    render(<RSVEligibilityFallback howToGetVaccineFallback={howToGetVaccineFallback} vaccineType={vaccineType} />);

    const fallbackHeading: HTMLElement = screen.getByText("The RSV vaccine is recommended if you:");
    const fallbackBulletPoint1: HTMLElement = screen.getByText("are aged 75 or over");
    const fallbackBulletPoint2: HTMLElement = screen.getByText("live in a care home for older adults");

    expect(fallbackHeading).toBeVisible();
    expect(fallbackBulletPoint1).toBeVisible();
    expect(fallbackBulletPoint2).toBeVisible();
  });

  it("should display provided how-to-get content", async () => {
    render(<RSVEligibilityFallback howToGetVaccineFallback={howToGetVaccineFallback} vaccineType={vaccineType} />);

    const fallback = screen.getByTestId("elid-fallback");

    const howToGetContent: HTMLElement = within(fallback).getByText("How Section styled component");

    expect(howToGetContent).toBeVisible();
  });
});
