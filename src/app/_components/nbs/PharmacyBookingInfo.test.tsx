import { PharmacyBookingInfo } from "@src/app/_components/nbs/PharmacyBookingInfo";
import { render, screen } from "@testing-library/react";
import { VaccineTypes } from "@src/models/vaccine";
import { NBSBookingAction } from "@src/app/_components/nbs/NBSBookingAction";

jest.mock("@src/app/_components/nbs/NBSBookingAction", () => ({
  NBSBookingAction: jest
    .fn()
    .mockImplementation(() => <a href="https://nbs-test-link.example.com">NBS Booking Link Test</a>),
}));

describe("PharmacyBookingInfo", () => {
  it("should contain NBS booking with props to render as link, vaccine name and pharmacy booking text", () => {
    render(<PharmacyBookingInfo vaccineType={VaccineTypes.RSV} />);

    const nbsBookingAction = screen.getByText("NBS Booking Link Test");

    expect(nbsBookingAction).toBeVisible();
    expect(NBSBookingAction).toHaveBeenCalledWith(
      {
        vaccineType: VaccineTypes.RSV,
        displayText: "book an RSV vaccination in a pharmacy",
        renderAs: "anchor",
      },
      undefined,
    );
  });
});
