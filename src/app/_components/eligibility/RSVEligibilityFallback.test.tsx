import { HowToGetVaccineFallback } from "@src/app/_components/content/HowToGetVaccineFallback";
import { RSVEligibilityFallback } from "@src/app/_components/eligibility/RSVEligibilityFallback";
import { PharmacyBookingInfo } from "@src/app/_components/nbs/PharmacyBookingInfo";
import { VaccineType } from "@src/models/vaccine";
import { mockStyledContent } from "@test-data/content-api/data";
import { render, screen, within } from "@testing-library/react";

jest.mock("@src/app/_components/nbs/PharmacyBookingInfo", () => ({
  PharmacyBookingInfo: jest
    .fn()
    .mockImplementation(() => <p data-testid={"pharmacy-booking-info"}>Pharmacy booking test</p>),
}));

jest.mock("@src/app/_components/content/HowToGetVaccineFallback", () => ({
  HowToGetVaccineFallback: jest
    .fn()
    .mockImplementation(() => <div data-testid="how-to-get-fallback-mock">How to get fallback</div>),
}));

describe("RSVEligibilityFallback", () => {
  const vaccineType = VaccineType.RSV;

  it("should display fallback care card", async () => {
    render(<RSVEligibilityFallback styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

    const fallbackHeading: HTMLElement = screen.getByText("The RSV vaccine is recommended if you:");
    const fallbackBulletPoint1: HTMLElement = screen.getByText("are aged between 75 and 79");
    const fallbackBulletPoint2: HTMLElement = screen.getByText("turned 80 after 1 September 2024");

    expect(fallbackHeading).toBeVisible();
    expect(fallbackBulletPoint1).toBeVisible();
    expect(fallbackBulletPoint2).toBeVisible();
  });

  it("should include Pharmacy booking info for specified vaccine", () => {
    render(<RSVEligibilityFallback styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

    const pharmacyBookingInfo: HTMLElement = screen.getByTestId("pharmacy-booking-info");
    expect(pharmacyBookingInfo).toBeVisible();

    expect(PharmacyBookingInfo).toHaveBeenCalledWith(
      {
        vaccineType: vaccineType,
      },
      undefined,
    );
  });

  it("should display 'If this applies' paragraph with styled how-to-get from content API", async () => {
    render(<RSVEligibilityFallback styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

    const fallback = screen.getByTestId("elid-fallback");

    const fallbackHeading: HTMLElement = within(fallback).getByRole("heading", {
      name: "If this applies to you",
      level: 3,
    });
    const howToGetFromContentAPI: HTMLElement = within(fallback).getByText("How Section styled component");

    expect(fallbackHeading).toBeVisible();
    expect(howToGetFromContentAPI).toBeVisible();

    const howToGetFallback: HTMLElement | null = within(fallback).queryByText("How to get fallback");
    expect(howToGetFallback).not.toBeInTheDocument();
  });

  it("should display fallback how-to-get if content API styled response not available", async () => {
    render(<RSVEligibilityFallback styledVaccineContent={undefined} vaccineType={vaccineType} />);

    const fallback = screen.getByTestId("elid-fallback");

    const fallbackHeading: HTMLElement = within(fallback).getByRole("heading", {
      name: "If this applies to you",
      level: 3,
    });
    const howToGetFallback: HTMLElement = within(fallback).getByText("How to get fallback");

    expect(fallbackHeading).toBeVisible();
    expect(howToGetFallback).toBeVisible();

    expect(HowToGetVaccineFallback).toHaveBeenCalledWith(
      {
        vaccineType: vaccineType,
      },
      undefined,
    );
  });
});
