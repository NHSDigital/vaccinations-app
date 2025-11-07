import { RSVPregnancyInfo } from "@src/app/_components/vaccine-custom/RSVPregnancyInfo";
import { VaccineTypes } from "@src/models/vaccine";
import { render, screen } from "@testing-library/react";
import React from "react";

const howToGetContentMock = <div data-testid="how-to-get-content-mock">How to get content mock</div>;

jest.mock("@src/app/_components/nbs/PharmacyBookingInfo", () => ({
  PharmacyBookingInfo: jest
    .fn()
    .mockImplementation(() => <div data-testid="pharmacy-booking-link-mock">Pharmacy Booking</div>),
}));

describe("RSV Pregnancy Information", () => {
  it("should display inset text for rsv in pregnancy", async () => {
    await render(
      <RSVPregnancyInfo vaccineType={VaccineTypes.RSV_PREGNANCY} howToGetVaccineOrFallback={howToGetContentMock} />,
    );

    const recommendedBlock: HTMLElement | undefined = screen.getAllByRole("heading", { level: 2 }).at(0);
    expect(recommendedBlock).toHaveClass("nhsuk-card--care__heading");
    expect(recommendedBlock?.innerHTML).toContain("The RSV vaccine is recommended if you:");
  });

  it("should display how to get text outside of expander in rsv pregnancy page", async () => {
    await render(
      <RSVPregnancyInfo vaccineType={VaccineTypes.RSV_PREGNANCY} howToGetVaccineOrFallback={howToGetContentMock} />,
    );

    const heading: HTMLElement = screen.getByText("How to get the vaccine");
    const content: HTMLElement = screen.getByText("How to get content mock");

    expect(heading).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it("should contain pharmacy booking link in how to get section", async () => {
    await render(
      <RSVPregnancyInfo vaccineType={VaccineTypes.RSV_PREGNANCY} howToGetVaccineOrFallback={howToGetContentMock} />,
    );

    const pharmacyBookingLink = screen.getByTestId("pharmacy-booking-link-mock");

    expect(pharmacyBookingLink).toBeVisible();
  });
});
