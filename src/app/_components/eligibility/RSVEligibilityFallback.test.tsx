import { RSVEligibilityFallback } from "@src/app/_components/eligibility/RSVEligibilityFallback";
import { PharmacyBookingInfo } from "@src/app/_components/nbs/PharmacyBookingInfo";
import { VaccineType } from "@src/models/vaccine";
import { render, screen, within } from "@testing-library/react";

jest.mock("@src/app/_components/nbs/PharmacyBookingInfo", () => ({
  PharmacyBookingInfo: jest
    .fn()
    .mockImplementation(() => <p data-testid={"pharmacy-booking-info"}>Pharmacy booking test</p>),
}));

describe("RSVEligibilityFallback", () => {
  const vaccineType = VaccineType.RSV;
  const howToGetVaccineFallback = <div>How Section styled component</div>;

  it("should display fallback care card", async () => {
    render(<RSVEligibilityFallback howToGetVaccineFallback={howToGetVaccineFallback} vaccineType={vaccineType} />);

    const fallbackHeading: HTMLElement = screen.getByText("The RSV vaccine is recommended if you:");
    const fallbackBulletPoint1: HTMLElement = screen.getByText("are aged between 75 and 79");
    const fallbackBulletPoint2: HTMLElement = screen.getByText("turned 80 after 1 September 2024");

    expect(fallbackHeading).toBeVisible();
    expect(fallbackBulletPoint1).toBeVisible();
    expect(fallbackBulletPoint2).toBeVisible();
  });

  it("should include Pharmacy booking info for specified vaccine", () => {
    render(<RSVEligibilityFallback howToGetVaccineFallback={howToGetVaccineFallback} vaccineType={vaccineType} />);

    const pharmacyBookingInfo: HTMLElement = screen.getByTestId("pharmacy-booking-info");
    expect(pharmacyBookingInfo).toBeVisible();

    expect(PharmacyBookingInfo).toHaveBeenCalledWith(
      {
        vaccineType: vaccineType,
      },
      undefined,
    );
  });

  it("should display 'If this applies' paragraph with provided how-to-get content", async () => {
    render(<RSVEligibilityFallback howToGetVaccineFallback={howToGetVaccineFallback} vaccineType={vaccineType} />);

    const fallback = screen.getByTestId("elid-fallback");

    const fallbackHeading: HTMLElement = within(fallback).getByRole("heading", {
      name: "If this applies to you",
      level: 3,
    });
    const howToGetContent: HTMLElement = within(fallback).getByText("How Section styled component");

    expect(fallbackHeading).toBeVisible();
    expect(howToGetContent).toBeVisible();
  });
});
