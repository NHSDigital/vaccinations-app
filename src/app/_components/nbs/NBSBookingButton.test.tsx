import { NBSBookingButton } from "@src/app/_components/nbs/NBSBookingButton";
import { render, screen } from "@testing-library/react";
import { redirectToNBSBookingPageForVaccine } from "@src/services/nbs/nbs-service";
import { VaccineTypes } from "@src/models/vaccine";

jest.mock("@src/services/nbs/nbs-service", () => ({
  redirectToNBSBookingPageForVaccine: jest.fn(),
}));

describe("NBSBookingButton", () => {
  it("should redirect to NBS when booking link button for RSV is clicked", async () => {
    render(<NBSBookingButton vaccineType={VaccineTypes.RSV} />);

    const bookingButton = screen.getByRole("button", {
      name: "Continue to booking",
    });
    bookingButton.click();

    expect(redirectToNBSBookingPageForVaccine).toHaveBeenCalledWith(
      VaccineTypes.RSV,
    );
  });
});
