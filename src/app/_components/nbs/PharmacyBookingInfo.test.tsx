import { NBSBookingActionForVaccine } from "@src/app/_components/nbs/NBSBookingAction";
import { PharmacyBookingInfo } from "@src/app/_components/nbs/PharmacyBookingInfo";
import { VaccineTypes } from "@src/models/vaccine";
import { render, screen } from "@testing-library/react";

jest.mock("@src/app/_components/nbs/NBSBookingAction", () => ({
  NBSBookingActionForVaccine: jest
    .fn()
    .mockImplementation(() => <a href="https://nbs-test-link.example.com">NBS Booking Link Test</a>),
}));

describe("PharmacyBookingInfo", () => {
  it("should contain NBS booking with props to render as link, vaccine name and pharmacy booking text", () => {
    render(<PharmacyBookingInfo vaccineType={VaccineTypes.RSV} />);

    const nbsBookingAction = screen.getByText("NBS Booking Link Test");

    expect(nbsBookingAction).toBeVisible();
    expect(NBSBookingActionForVaccine).toHaveBeenCalledWith(
      {
        vaccineType: VaccineTypes.RSV,
        displayText: "book an RSV vaccination in a pharmacy",
        renderAs: "anchor",
        reduceBottomPadding: false,
      },
      undefined,
    );
  });

  it("should contain include correct text for older adults", () => {
    render(<PharmacyBookingInfo vaccineType={VaccineTypes.RSV} />);

    const pharmacyBookingInfo: HTMLElement | null = screen.queryByText(/In some areas you can /);

    expect(pharmacyBookingInfo).toBeInTheDocument();
  });

  it("should contain include correct text for younger adults", () => {
    render(<PharmacyBookingInfo vaccineType={VaccineTypes.RSV_PREGNANCY} />);

    const pharmacyBookingInfo: HTMLElement | null = screen.queryByText(/In some areas you can also /);

    expect(pharmacyBookingInfo).toBeInTheDocument();
  });
});
