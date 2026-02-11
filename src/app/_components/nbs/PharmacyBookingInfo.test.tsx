import { NBSBookingActionWithAuthSSOForVaccine } from "@src/app/_components/nbs/NBSBookingAction";
import { PharmacyBookingInfo } from "@src/app/_components/nbs/PharmacyBookingInfo";
import { VaccineType } from "@src/models/vaccine";
import { render, screen } from "@testing-library/react";

jest.mock("@src/app/_components/nbs/NBSBookingAction", () => ({
  NBSBookingActionWithAuthSSOForVaccine: jest
    .fn()
    .mockImplementation(() => <a href="https://nbs-test-link.example.com">NBS Booking Link Test</a>),
}));

describe("PharmacyBookingInfo", () => {
  it("should contain NBS booking with props to render as link, vaccine name and pharmacy booking text", () => {
    render(<PharmacyBookingInfo vaccineType={VaccineType.RSV} />);

    const nbsBookingAction: HTMLElement = screen.getByText("NBS Booking Link Test");

    expect(nbsBookingAction).toBeVisible();
    expect(NBSBookingActionWithAuthSSOForVaccine).toHaveBeenCalledWith(
      {
        vaccineType: VaccineType.RSV,
        displayText: "book an RSV vaccination in a pharmacy, GP surgery or vaccination centre",
        renderAs: "anchor",
        reduceBottomPadding: false,
      },
      undefined,
    );
  });

  it("should contain include correct text for older adults", () => {
    render(<PharmacyBookingInfo vaccineType={VaccineType.RSV} />);

    const pharmacyBookingInfo: HTMLElement = screen.getByText(
      /This pharmacy service is only for adults aged 75 to 79./,
    );

    expect(pharmacyBookingInfo).toBeInTheDocument();
  });

  it("should contain include correct text for younger adults", () => {
    render(<PharmacyBookingInfo vaccineType={VaccineType.RSV_PREGNANCY} />);

    const pharmacyBookingInfo: HTMLElement | null = screen.queryByText(
      /This pharmacy service is only for adults aged 75 to 79./,
    );

    expect(pharmacyBookingInfo).not.toBeInTheDocument();
  });
});
