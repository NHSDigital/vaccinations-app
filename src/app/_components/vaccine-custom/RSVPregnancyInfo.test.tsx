import { HowToGetVaccineFallback } from "@src/app/_components/content/HowToGetVaccineFallback";
import { RSVPregnancyInfo } from "@src/app/_components/vaccine-custom/RSVPregnancyInfo";
import { VaccineType } from "@src/models/vaccine";
import { mockStyledContent } from "@test-data/content-api/data";
import { render, screen } from "@testing-library/react";
import React from "react";

jest.mock("@src/app/_components/nbs/PharmacyBookingInfo", () => ({
  PharmacyBookingInfo: jest
    .fn()
    .mockImplementation(() => <div data-testid="pharmacy-booking-link-mock">Pharmacy Booking</div>),
}));

jest.mock("@src/app/_components/content/HowToGetVaccineFallback", () => ({
  HowToGetVaccineFallback: jest
    .fn()
    .mockImplementation(() => <div data-testid="how-to-get-fallback-mock">How to get fallback</div>),
}));

describe("RSV Pregnancy Information", () => {
  it("should display inset text for rsv in pregnancy", () => {
    render(<RSVPregnancyInfo vaccineType={VaccineType.RSV_PREGNANCY} styledVaccineContent={mockStyledContent} />);

    const recommendedBlock: HTMLElement | undefined = screen.getAllByRole("heading", { level: 2 }).at(0);
    expect(recommendedBlock).toHaveClass("nhsuk-card__heading");
    expect(recommendedBlock?.innerHTML).toContain("The RSV vaccine is recommended if you:");
  });

  it("should display howToGet text outside expander in rsv pregnancy page when content API available", () => {
    render(<RSVPregnancyInfo vaccineType={VaccineType.RSV_PREGNANCY} styledVaccineContent={mockStyledContent} />);

    const heading: HTMLElement = screen.getByText("How to get the vaccine");
    const howToGetFromContentAPI: HTMLElement = screen.getByText("How Section styled component");

    expect(heading).toBeInTheDocument();
    expect(howToGetFromContentAPI).toBeInTheDocument();

    const howToGetFallback: HTMLElement | null = screen.queryByText("How to get fallback");
    expect(howToGetFallback).not.toBeInTheDocument();
  });

  it("should display fallback how to get text when styled content API unavailable", () => {
    render(<RSVPregnancyInfo vaccineType={VaccineType.RSV_PREGNANCY} styledVaccineContent={undefined} />);

    const heading: HTMLElement = screen.getByText("How to get the vaccine");
    const howToGetFallback: HTMLElement = screen.getByText("How to get fallback");

    expect(heading).toBeInTheDocument();
    expect(howToGetFallback).toBeInTheDocument();

    expect(HowToGetVaccineFallback).toHaveBeenCalledWith(
      {
        vaccineType: VaccineType.RSV_PREGNANCY,
      },
      undefined,
    );
  });

  it("should contain pharmacy booking link in how to get section", () => {
    render(<RSVPregnancyInfo vaccineType={VaccineType.RSV_PREGNANCY} styledVaccineContent={mockStyledContent} />);

    const pharmacyBookingLink = screen.getByTestId("pharmacy-booking-link-mock");

    expect(pharmacyBookingLink).toBeVisible();
  });
});
